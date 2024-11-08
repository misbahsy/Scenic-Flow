const BASE_PATH = '/api/langflow/lf/0586a787-50ae-4a4e-aebe-866cf022aa5b/api/v1/run/b8a6c40f-30cb-46d2-896c-45cff852f4b2';
const API_KEY = import.meta.env.VITE_ASTRA_LANGFLOW_TOKEN;
// console.log('hi',API_KEY)

export async function generateScenes(topic: string) {
  try {
    const response = await fetch(`${BASE_PATH}?stream=false`, {
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
    
    // Extract and parse the scenes JSON from the nested response
    const scenesJson = data.outputs[0].outputs[0].outputs.message.message.text;
    const parsedScenes = JSON.parse(scenesJson);
    
    return parsedScenes;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}