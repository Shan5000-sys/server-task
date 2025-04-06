"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerTaskStack = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const lambda = require("aws-cdk-lib/aws-lambda");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const iam = require("aws-cdk-lib/aws-iam");
const aws_cdk_lib_1 = require("aws-cdk-lib");
class ServerTaskStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // DynamoDB Table
        const tasksTable = new dynamodb.Table(this, 'TasksTable', {
            partitionKey: { name: 'taskId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        // S3 Bucket for task images with CORS
        const taskImagesBucket = new s3.Bucket(this, 'TaskImagesBucket', {
            lifecycleRules: [{ expiration: aws_cdk_lib_1.Duration.days(30) }],
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
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
        function addCorsOptions(apiResource) {
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
exports.ServerTaskStack = ServerTaskStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXRhc2stc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXItdGFzay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMseUNBQXlDO0FBQ3pDLGlEQUFpRDtBQUNqRCxxREFBcUQ7QUFDckQseURBQXlEO0FBQ3pELDJDQUEyQztBQUMzQyw2Q0FBc0Q7QUFFdEQsTUFBYSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzVDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsaUJBQWlCO1FBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3hELFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3JFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ2hFLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWU7WUFDakQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztTQUNyQyxDQUFDLENBQUM7UUFFSCxzQ0FBc0M7UUFDdEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQy9ELGNBQWMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbkQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLElBQUksRUFBRTtnQkFD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aEMsS0FBSyxFQUFFLFdBQVcsR0FBRyxDQUFDLFNBQVMsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLHFCQUFxQjtZQUMvRSxVQUFVLEVBQUUsa0JBQWtCO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXhIRCwwQ0F3SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgRHVyYXRpb24sIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJUYXNrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBEeW5hbW9EQiBUYWJsZVxuICAgIGNvbnN0IHRhc2tzVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgJ1Rhc2tzVGFibGUnLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ3Rhc2tJZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICd1c2VySWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIC8vIFMzIEJ1Y2tldCBmb3IgdGFzayBpbWFnZXMgd2l0aCBDT1JTXG4gICAgY29uc3QgdGFza0ltYWdlc0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1Rhc2tJbWFnZXNCdWNrZXQnLCB7XG4gICAgICBsaWZlY3ljbGVSdWxlczogW3sgZXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygzMCkgfV0sXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICAgIGNvcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFsbG93ZWRNZXRob2RzOiBbXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5HRVQsXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5QVVQsXG4gICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5QT1NULFxuICAgICAgICAgICAgczMuSHR0cE1ldGhvZHMuREVMRVRFLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsnaHR0cDovL2xvY2FsaG9zdDozMDAwJ10sXG4gICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnKiddLFxuICAgICAgICAgIGV4cG9zZWRIZWFkZXJzOiBbJ0VUYWcnXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBMYW1iZGEgZXhlY3V0aW9uIHJvbGUgd2l0aCBwZXJtaXNzaW9uc1xuICAgIGNvbnN0IGxhbWJkYVJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ1Rhc2tIYW5kbGVyUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScpLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGxhbWJkYVJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydyZWtvZ25pdGlvbjpEZXRlY3RMYWJlbHMnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgdGFza3NUYWJsZS5ncmFudFJlYWRXcml0ZURhdGEobGFtYmRhUm9sZSk7XG4gICAgdGFza0ltYWdlc0J1Y2tldC5ncmFudFJlYWRXcml0ZShsYW1iZGFSb2xlKTtcblxuICAgIC8vIExhbWJkYSBGdW5jdGlvblxuICAgIGNvbnN0IHRhc2tIYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnVGFza0hhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtYmRhJyksXG4gICAgICByb2xlOiBsYW1iZGFSb2xlLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFTS1NfVEFCTEU6IHRhc2tzVGFibGUudGFibGVOYW1lLFxuICAgICAgICBCVUNLRVRfTkFNRTogdGFza0ltYWdlc0J1Y2tldC5idWNrZXROYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEFQSSBHYXRld2F5XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnVGFza3NBcGknLCB7XG4gICAgICByZXN0QXBpTmFtZTogJ1Rhc2tzIFNlcnZpY2UnLFxuICAgICAgZGVzY3JpcHRpb246ICdIYW5kbGVzIHRhc2sgQ1JVRCBhbmQgaW1hZ2UgcHJvY2Vzc2luZycsXG4gICAgfSk7XG5cbiAgICAvLyBIZWxwZXIgdG8gYWRkIENPUlNcbiAgICBmdW5jdGlvbiBhZGRDb3JzT3B0aW9ucyhhcGlSZXNvdXJjZTogYXBpZ2F0ZXdheS5JUmVzb3VyY2UpIHtcbiAgICAgIGFwaVJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBhcGlnYXRld2F5Lk1vY2tJbnRlZ3JhdGlvbih7XG4gICAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5J1wiLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInaHR0cDovL2xvY2FsaG9zdDozMDAwJ1wiLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBPU1QnXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogYXBpZ2F0ZXdheS5QYXNzdGhyb3VnaEJlaGF2aW9yLk5FVkVSLFxuICAgICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAne1wic3RhdHVzQ29kZVwiOiAyMDB9JyxcbiAgICAgICAgfSxcbiAgICAgIH0pLCB7XG4gICAgICAgIG1ldGhvZFJlc3BvbnNlczogW3tcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIEFQSSByZXNvdXJjZXNcbiAgICBjb25zdCB0YXNrcyA9IGFwaS5yb290LmFkZFJlc291cmNlKCd0YXNrcycpO1xuICAgIHRhc2tzLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odGFza0hhbmRsZXIpKTtcbiAgICB0YXNrcy5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbih0YXNrSGFuZGxlcikpO1xuICAgIGFkZENvcnNPcHRpb25zKHRhc2tzKTtcbiAgICBjb25zdCB0YXNrSWRSZXNvdXJjZSA9IHRhc2tzLmFkZFJlc291cmNlKCd7dGFza0lkfScpO1xuICAgIGNvbnN0IHByb2Nlc3NJbWFnZSA9IHRhc2tJZFJlc291cmNlLmFkZFJlc291cmNlKCdwcm9jZXNzLWltYWdlJyk7XG4gICAgcHJvY2Vzc0ltYWdlLmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHRhc2tIYW5kbGVyKSk7XG4gICAgYWRkQ29yc09wdGlvbnMocHJvY2Vzc0ltYWdlKTtcblxuICAgIGNvbnN0IHVwbG9hZCA9IGFwaS5yb290LmFkZFJlc291cmNlKCd1cGxvYWQtdXJsJyk7XG4gICAgdXBsb2FkLmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHRhc2tIYW5kbGVyKSk7XG4gICAgYWRkQ29yc09wdGlvbnModXBsb2FkKTtcblxuICAgIGNvbnN0IGFuYWx5emUgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnYW5hbHl6ZScpO1xuICAgIGFuYWx5emUuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odGFza0hhbmRsZXIpKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhhbmFseXplKTtcblxuICAgIC8vIE91dHB1dCBBUEkgZW5kcG9pbnRcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQXBpVXJsJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7YXBpLnJlc3RBcGlJZH0uZXhlY3V0ZS1hcGkuJHt0aGlzLnJlZ2lvbn0uYW1hem9uYXdzLmNvbS9wcm9kYCxcbiAgICAgIGV4cG9ydE5hbWU6ICdTZXJ2ZXJUYXNrQXBpVXJsJyxcbiAgICB9KTtcbiAgfVxufVxuXG5cbiJdfQ==