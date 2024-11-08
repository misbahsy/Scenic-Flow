import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Scene } from '../types';
import { VideoPreview } from './VideoPreview';
import { exportMovie, isWebCodecsSupported } from '../utils/exportMovie';

interface MoviePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  currentScene: number;
  isPlaying: boolean;
  onExport: () => void;
  onSceneComplete: () => void;
}

export function MoviePreviewModal({
  isOpen,
  onClose,
  scenes,
  currentScene,
  isPlaying,
  onExport,
  onSceneComplete
}: MoviePreviewModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);
  const previewRef = React.useRef<HTMLCanvasElement>(null);

  const handleExport = async () => {
    if (!previewRef.current || isExporting) return;

    if (!isWebCodecsSupported()) {
      setExportError('Your browser does not support the required features for video export. Please use a modern browser like Chrome.');
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress(0);
      setExportError(null);

      const blob = await exportMovie(
        previewRef.current,
        scenes,
        (progress) => setExportProgress(progress)
      );

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to export movie:', error);
      setExportError('Failed to export video. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-[90vw] md:w-[80vw] h-[90vh] md:h-[80vh] flex flex-col max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Movie Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full"
            disabled={isExporting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 relative bg-black min-h-0">
          <VideoPreview
            ref={previewRef}
            scene={scenes[currentScene]}
            isPlaying={isPlaying}
            isMovieMode={true}
            onSceneComplete={onSceneComplete}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
          {exportError && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {exportError}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Scene {currentScene + 1} of {scenes.length}
            </div>
            
            <div className="flex items-center gap-4">
              {isExporting && (
                <div className="flex items-center gap-2">
                  <div className="h-1 w-32 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">
                    {Math.round(exportProgress)}%
                  </span>
                </div>
              )}
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  isExporting
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Save className="w-5 h-5" />
                {isExporting ? 'Exporting...' : 'Export Movie'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}