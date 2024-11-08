// import React from 'react';
import { SceneType } from '../types';
import { Type, Image } from 'lucide-react';

interface AddSceneDialogProps {
  onClose: () => void;
  onAdd: (type: SceneType) => void;
}

export function AddSceneDialog({ onClose, onAdd }: AddSceneDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Scene</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              onAdd('text');
              onClose();
            }}
            className="flex flex-col items-center gap-2 p-4 rounded bg-gray-700 hover:bg-gray-600"
          >
            <Type className="w-8 h-8" />
            <span>Text</span>
          </button>
          <button
            onClick={() => {
              onAdd('image');
              onClose();
            }}
            className="flex flex-col items-center gap-2 p-4 rounded bg-gray-700 hover:bg-gray-600"
          >
            <Image className="w-8 h-8" />
            <span>Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}