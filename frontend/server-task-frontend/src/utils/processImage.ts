export const processImage = async (taskId: string) => {
    const response = await fetch(`https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId })
    });
  
    if (!response.ok) {
      throw new Error(`Image processing failed with status: ${response.status}`);
    }
  
    return await response.json();
  };