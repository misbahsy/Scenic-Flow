import React from 'react';
import { Scene, ANIMATION_CATEGORIES, AnimationCategory } from '../types';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (scene: Scene) => void;
}

export function SceneEditor({ scene, onUpdate }: SceneEditorProps) {
  const handleChange = (changes: Partial<Scene>) => {
    onUpdate({ ...scene, ...changes });
  };

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Scene Settings</h3>
      
      <div className="space-y-4">
        {/* Animation In */}
        <div>
          <label className="block text-sm font-medium mb-1">Animation In</label>
          <select
            value={scene.animationIn}
            onChange={(e) => handleChange({ animationIn: e.target.value })}
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
            onChange={(e) => handleChange({ animationOut: e.target.value })}
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

        {/* Image-specific settings */}
        {scene.type === 'image' && !scene.file && (
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange({ file });
                }
              }}
              className="w-full bg-gray-700 rounded px-3 py-2"
            />
          </div>
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