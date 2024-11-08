'use client';

import { useState } from 'react';
import { Settings, Search } from 'lucide-react';
import { Scene, SceneType } from '@/types';
import { SceneEditor } from '@/components/SceneEditor';
import { VideoPreview } from '@/components/VideoPreview';

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddScene = (type: SceneType) => {
    const newScene: Scene = {
      id: crypto.randomUUID(),
      type,
      duration: 2000,
      animation: 'fade-in',
      backgroundColor: '#000000',
      ...(type === 'text' && {
        text: 'New Text Scene',
        fontSize: 48,
        color: '#ffffff',
      }),
      ...(type === 'image' && {
        url: '',
        scale: 1,
        opacity: 1,
      }),
      ...(type === 'video' && {
        url: '',
        volume: 1,
        playbackRate: 1,
        loop: false,
      }),
    } as Scene;

    setScenes([...scenes, newScene]);
    setSelectedScene(scenes.length);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Panel - Script Editor */}
      <div className="w-1/3 border-r border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm focus:outline-none"
            />
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div className="p-4 space-y-4">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={`p-2 cursor-pointer ${selectedScene === index ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => setSelectedScene(index)}
            >
              {scene.type === 'text' ? scene.text : `Scene ${index + 1}`}
            </div>
          ))}
          <button
            onClick={() => handleAddScene('text')}
            className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded text-sm"
          >
            + Add Scene
          </button>
        </div>
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 flex flex-col">
        <VideoPreview
          scenes={scenes}
          currentScene={selectedScene ?? 0}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      </div>

      {/* Right Panel - Scene Settings */}
      {selectedScene !== null && (
        <div className="w-1/4 border-l border-gray-800 bg-[#1a1a1a] overflow-y-auto">
          <SceneEditor
            scene={scenes[selectedScene]}
            onUpdate={(updatedScene) => {
              const newScenes = [...scenes];
              newScenes[selectedScene] = updatedScene;
              setScenes(newScenes);
            }}
          />
        </div>
      )}
    </div>
  );
}