import React, { useEffect } from 'react';
import { Scene, ANIMATION_CATEGORIES } from '../types';
import { Trash2 } from 'lucide-react';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (scene: Scene) => void;
}

export function SceneEditor({ scene, onUpdate }: SceneEditorProps) {

  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      if (scene.file) {
        URL.revokeObjectURL(URL.createObjectURL(scene.file));
      }
    };
  }, [scene.file]);

  const handleChange = (changes: Partial<Scene>) => {
    onUpdate({ ...scene, ...changes });
  };

  const renderMediaPreview = () => {
    if (!scene.file) return null;

    if (scene.type === 'image') {
      return (
        <div className="relative mt-2 mb-4">
          <img 
            src={URL.createObjectURL(scene.file)} 
            alt="Preview"
            className="w-full h-40 object-contain bg-gray-900 rounded"
          />
          <button
            onClick={() => handleChange({ file: undefined })}
            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (scene.type === 'video') {
      return (
        <div className="relative mt-2 mb-4">
          <video 
            src={URL.createObjectURL(scene.file)}
            className="w-full h-40 object-contain bg-gray-900 rounded"
            controls
            muted
          />
          <button
            onClick={() => handleChange({ file: undefined })}
            className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Scene Settings</h3>
      
      <div className="space-y-4">
        {/* Media Upload Section for Image and Video */}
        {(scene.type === 'image' || scene.type === 'video') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {scene.type === 'image' ? 'Image' : 'Video'}
            </label>
            {!scene.file ? (
              <input
                type="file"
                accept={scene.type === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleChange({ file });
                  }
                }}
                className="w-full bg-gray-700 rounded px-3 py-2 text-sm"
              />
            ) : (
              renderMediaPreview()
            )}
          </div>
        )}

        {/* Animation In */}
        <div>
          <label className="block text-sm font-medium mb-1">Animation In</label>
          <select
            value={scene.animationIn}
            onChange={(e) => handleChange({ animationIn: e.target.value as Scene['animationIn'] })}
            className="w-full bg-gray-700 rounded px-3 py-2"
          >
            {Object.entries(ANIMATION_CATEGORIES).map(([category, animations]) => (
              <optgroup key={category} label={category}>
                {animations.map((anim) => (
                  <option key={anim} value={anim}>
                    {anim.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Animation Out */}
        <div>
          <label className="block text-sm font-medium mb-1">Animation Out</label>
          <select
            value={scene.animationOut}
            onChange={(e) => handleChange({ animationOut: e.target.value as Scene['animationOut'] })}
            className="w-full bg-gray-700 rounded px-3 py-2"
          >
            {Object.entries(ANIMATION_CATEGORIES).map(([category, animations]) => (
              <optgroup key={category} label={category}>
                {animations.map((anim) => (
                  <option key={anim} value={anim}>
                    {anim.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Durations */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Duration In (ms)</label>
            <input
              type="number"
              value={scene.durationIn}
              onChange={(e) => handleChange({ durationIn: Number(e.target.value) })}
              className="w-full bg-gray-700 rounded px-3 py-2"
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stay Duration (ms)</label>
            <input
              type="number"
              value={scene.durationStay}
              onChange={(e) => handleChange({ durationStay: Number(e.target.value) })}
              className="w-full bg-gray-700 rounded px-3 py-2"
              min="0"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration Out (ms)</label>
            <input
              type="number"
              value={scene.durationOut}
              onChange={(e) => handleChange({ durationOut: Number(e.target.value) })}
              className="w-full bg-gray-700 rounded px-3 py-2"
              min="0"
              step="100"
            />
          </div>
        </div>

        {/* Text-specific settings */}
        {scene.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={scene.text}
                onChange={(e) => handleChange({ text: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <input
                type="number"
                value={scene.fontSize}
                onChange={(e) => handleChange({ fontSize: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded px-3 py-2"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input
                type="color"
                value={scene.color}
                onChange={(e) => handleChange({ color: e.target.value })}
                className="w-full bg-gray-700 rounded px-3 py-2 h-10"
              />
            </div>
          </>
        )}

        {/* Image/Video shared settings */}
        {(scene.type === 'image' || scene.type === 'video') && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Scale</label>
              <input
                type="number"
                value={scene.scale}
                onChange={(e) => handleChange({ scale: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded px-3 py-2"
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opacity</label>
              <input
                type="number"
                value={scene.opacity}
                onChange={(e) => handleChange({ opacity: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded px-3 py-2"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </>
        )}

        {/* Video-specific settings */}
        {scene.type === 'video' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Volume</label>
              <input
                type="number"
                value={scene.volume}
                onChange={(e) => handleChange({ volume: Number(e.target.value) })}
                className="w-full bg-gray-700 rounded px-3 py-2"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Loop</label>
              <input
                type="checkbox"
                checked={scene.loop}
                onChange={(e) => handleChange({ loop: e.target.checked })}
                className="bg-gray-700 rounded"
              />
            </div>
          </>
        )}

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={scene.backgroundColor}
            onChange={(e) => handleChange({ backgroundColor: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 h-10"
          />
        </div>
      </div>
    </div>
  );
}