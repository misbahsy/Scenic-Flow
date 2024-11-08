const BASE_PATH = import.meta.env.VITE_LANGFLOW_BASE_PATH;
const API_KEY = import.meta.env.VITE_ASTRA_LANGFLOW_TOKEN;


export async function generateScenes(topic: string) {
    const fullPath = `${BASE_PATH.startsWith('/') ? BASE_PATH : '/api/langflow' + BASE_PATH}`;
    try {
      const response = await fetch(`${fullPath}?stream=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          input_value: topic,
          output_type: "chat",
          input_type: "chat",
          tweaks: {}
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      
      // Extract the JSON string from the nested response
      const scenesJsonString = data.outputs[0].outputs[0].outputs.message.message.text;
      // Parse the JSON string into an object
      const parsedData = JSON.parse(scenesJsonString);
      
      return parsedData; // This will return an object with a 'scenes' property
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }