import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

export class ServerTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const tasksTable = new dynamodb.Table(this, 'TasksTable', {
      partitionKey: { name: 'taskId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // S3 Bucket for task images with CORS
    const taskImagesBucket = new s3.Bucket(this, 'TaskImagesBucket', {
      lifecycleRules: [{ expiration: Duration.days(30) }],
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['http://localhost:3000'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
        },
      ],
    });

    // Lambda execution role with permissions
    const lambdaRole = new iam.Role(this, 'TaskHandlerRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['rekognition:DetectLabels'],
      resources: ['*'],
    }));

    tasksTable.grantReadWriteData(lambdaRole);
    taskImagesBucket.grantReadWrite(lambdaRole);

    // Lambda Function
    const taskHandler = new lambda.Function(this, 'TaskHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: lambdaRole,
      environment: {
        TASKS_TABLE: tasksTable.tableName,
        BUCKET_NAME: taskImagesBucket.bucketName,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'TasksApi', {
      restApiName: 'Tasks Service',
      description: 'Handles task CRUD and image processing',
    });

    // Helper to add CORS
    function addCorsOptions(apiResource: apigateway.IResource) {
      apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
        integrationResponses: [{
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Origin': "'http://localhost:3000'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,POST'",
          },
          responseTemplates: {
            'application/json': '',
          },
        }],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
          'application/json': '{"statusCode": 200}',
        },
      }), {
        methodResponses: [{
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        }],
      });
    }

    // Define API resources
    const tasks = api.root.addResource('tasks');
    tasks.addMethod('GET', new apigateway.LambdaIntegration(taskHandler));
    tasks.addMethod('POST', new apigateway.LambdaIntegration(taskHandler));
    addCorsOptions(tasks);
    const taskIdResource = tasks.addResource('{taskId}');
    const processImage = taskIdResource.addResource('process-image');
    processImage.addMethod('POST', new apigateway.LambdaIntegration(taskHandler));
    addCorsOptions(processImage);

    const upload = api.root.addResource('upload-url');
    upload.addMethod('POST', new apigateway.LambdaIntegration(taskHandler));
    addCorsOptions(upload);

    const analyze = api.root.addResource('analyze');
    analyze.addMethod('POST', new apigateway.LambdaIntegration(taskHandler));
    addCorsOptions(analyze);

    // Output API endpoint
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: `https://${api.restApiId}.execute-api.${this.region}.amazonaws.com/prod`,
      exportName: 'ServerTaskApiUrl',
    });
  }
}


