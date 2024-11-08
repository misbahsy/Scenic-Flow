// import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { Scene } from '../types';

interface ScenesListProps {
  scenes: Scene[];
  selectedScene: number | null;
  showSettings: boolean;
  onSceneSelect: (index: number) => void;
  onSettingsToggle: () => void;
  onAddScene: () => void;
}

export function ScenesList({
  scenes,
  selectedScene,
  showSettings,
  onSceneSelect,
  onSettingsToggle,
  onAddScene,
}: ScenesListProps) {
  return (
    <div className="w-1/3 border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Scenes</h2>
        <button
          onClick={onSettingsToggle}
          className={`p-2 rounded-full hover:bg-gray-800 ${showSettings ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`p-3 cursor-pointer rounded transition-colors ${
              selectedScene === index ? 'bg-gray-800' : 'hover:bg-gray-800/50'
            }`}
            onClick={() => onSceneSelect(index)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center text-xs bg-gray-700 rounded">
                {index + 1}
              </div>
              <span className="truncate">
                {scene.type === 'text' ? scene.text : `Scene ${index + 1}`}
              </span>
            </div>
          </div>
        ))}
        <button
          onClick={onAddScene}
          className="w-full mt-4 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Scene
        </button>
      </div>
    </div>
  );
}