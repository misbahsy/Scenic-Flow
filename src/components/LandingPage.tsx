import { useState } from 'react';
import { generateScenes } from '../api/generate-scenes'; // Import the mock API function

interface LandingPageProps {
  onManualSelect: () => void;
  onAIGenerate: (scenes: any[]) => void;
}

export function LandingPage({ onManualSelect, onAIGenerate }: LandingPageProps) {
  const [showAIInput, setShowAIInput] = useState(false);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAISubmit = async () => {
    setIsLoading(true);
    try {
      const response = await generateScenes(topic);
      onAIGenerate(response.scenes); // Access the scenes array directly from the parsed response
    } catch (error) {
      console.error('Error generating scenes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showAIInput) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">AI Scene Generator</h2>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe your video topic..."
            className="w-full h-32 p-3 bg-gray-700 rounded-lg mb-4 text-white"
          />
          <div className="flex gap-4">
            <button
              onClick={() => setShowAIInput(false)}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleAISubmit}
              disabled={!topic.trim() || isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Video Editor</h1>
        <div className="space-y-4">
          <button
            onClick={onManualSelect}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg"
          >
            Manual Scenes
          </button>
          <button
            onClick={() => setShowAIInput(true)}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg"
          >
            AI Generate Scenes
          </button>
        </div>
      </div>
    </div>
  );
}