import React, { useState, useRef, useCallback } from 'react';
import { Plus, Type, Image, Settings, Trash2 } from 'lucide-react';
import { Scene, SceneType } from './types';
import { VideoPreview } from './components/VideoPreview';
import { SceneEditor } from './components/SceneEditor';
import { MoviePreviewModal } from './components/MoviePreviewModal';
import { LandingPage } from './components/LandingPage';


export function App() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMoviePlaying, setIsMoviePlaying] = useState(false);
  const [currentMovieScene, setCurrentMovieScene] = useState(0);
  const [showSceneSettings, setShowSceneSettings] = useState(false);
  const [showMoviePreview, setShowMoviePreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Move useCallback outside of the conditional
  const handleMovieSceneComplete = useCallback(() => {
    setCurrentMovieScene(prev => {
      if (prev < scenes.length - 1) {
        return prev + 1;
      }
      setIsMoviePlaying(false);
      return 0;
    });
  }, [scenes.length]);

  const handleAIGenerate = (apiScenes: any[]) => {
    const convertedScenes = apiScenes.map(scene => ({
      id: crypto.randomUUID(),
      type: scene.scene_type as 'text' | 'image',
      animationIn: scene.animation_in,
      animationOut: scene.animation_out,
      durationIn: scene.duration_in,
      durationStay: scene.stay_duration,
      durationOut: scene.duration_out,
      backgroundColor: scene.background_color,
      ...(scene.scene_type === 'text' ? {
        text: scene.text,
        fontSize: scene.font_size,
        color: scene.text_color,
      } : {
        scale: 1,
        opacity: 1,
      })
    }));

    setScenes(convertedScenes);
    setShowEditor(true);
  };

  // Rest of your component logic...

  if (!showEditor) {
    return (
      <LandingPage
        onManualSelect={() => setShowEditor(true)}
        onAIGenerate={handleAIGenerate}
      />
    );
  }

  const handleAddScene = (type: SceneType) => {
    const newScene: Scene = {
      id: crypto.randomUUID(),
      type,
      animationIn: 'fade-in',
      animationOut: 'fade-out',
      durationIn: 500,
      durationStay: 1000,
      durationOut: 500,
      backgroundColor: '#000000',
      ...(type === 'text' ? {
        type: 'text' as const,
        text: 'New Text Scene',
        fontSize: 48,
        color: '#ffffff',
      } : {
        type: 'image' as const,
        scale: 1,
        opacity: 1,
      })
    };

    setScenes([...scenes, newScene]);
    setSelectedScene(scenes.length);
    setShowAddMenu(false);
  };

  const handleSceneUpdate = (updatedScene: Scene) => {
    if (selectedScene === null) return;
    const newScenes = [...scenes];
    newScenes[selectedScene] = updatedScene;
    setScenes(newScenes);
  };

  // const handleMovieSceneComplete = useCallback(() => {
  //   setCurrentMovieScene(prev => {
  //     if (prev < scenes.length - 1) {
  //       return prev + 1;
  //     }
  //     setIsMoviePlaying(false);
  //     return 0;
  //   });
  // }, [scenes.length]);

  const handleExportMovie = async () => {
    if (!canvasRef.current || scenes.length === 0) return;

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 5000000 // 5 Mbps
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie.webm';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Start recording
    setCurrentMovieScene(0);
    setIsMoviePlaying(true);
    mediaRecorder.start();

    // Calculate total duration
    const totalDuration = scenes.reduce((acc, scene) => 
      acc + scene.durationIn + scene.durationStay + scene.durationOut, 0);

    // Stop recording after all scenes complete
    setTimeout(() => {
      mediaRecorder.stop();
      setIsMoviePlaying(false);
    }, totalDuration);
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === scenes.length - 1)
    ) return;

    const newScenes = [...scenes];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
    setScenes(newScenes);
    setSelectedScene(newIndex);
  };
  const handleDeleteScene = (index: number) => {
    const newScenes = scenes.filter((_, i) => i !== index);
    setScenes(newScenes);
    if (selectedScene === index) {
      setSelectedScene(null);
    } else if (selectedScene && selectedScene > index) {
      setSelectedScene(selectedScene - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Scenes List */}
      <div className="w-72 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Scenes</h2>
          <button
            onClick={() => setShowSceneSettings(!showSceneSettings)}
            className={`p-2 rounded-lg hover:bg-gray-700 ${showSceneSettings ? 'bg-gray-700' : ''}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Scene
            </button>
            {showAddMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => handleAddScene('text')}
                  className="w-full px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  Text Scene
                </button>
                <button
                  onClick={() => handleAddScene('image')}
                  className="w-full px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  Image Scene
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {scenes.map((scene, index) => (
            <div
              key={scene.id}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedScene === index ? 'bg-gray-800' : 'hover:bg-gray-800/50'
              }`}
              onClick={() => setSelectedScene(index)}
            >
              <div className="flex items-center justify-between">
                <span>{scene.type === 'text' ? scene.text : `Scene ${index + 1}`}</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'up');
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveScene(index, 'down');
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                    disabled={index === scenes.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScene(index);
                    }}
                    className="p-1 hover:bg-gray-700 rounded text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 bg-black rounded-lg relative">
          {selectedScene !== null && scenes[selectedScene] && (
            <VideoPreview
              ref={canvasRef}
              scene={scenes[selectedScene]}
              isPlaying={isPlaying}
              isMovieMode={false}
            />
          )}
          
          {/* Playback Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-6">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                setIsMoviePlaying(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              disabled={selectedScene === null}
            >
              <span>Scene Preview</span>
            </button>
            <button
              onClick={() => {
                setShowMoviePreview(true);
                setIsMoviePlaying(true);
                setIsPlaying(false);
                setCurrentMovieScene(0);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              disabled={scenes.length === 0}
            >
              <span>Movie Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scene Settings Drawer */}
      {selectedScene !== null && showSceneSettings && (
        <div className="w-80 border-l border-gray-800 overflow-y-auto">
          <SceneEditor
            scene={scenes[selectedScene]}
            onUpdate={handleSceneUpdate}
          />
        </div>
      )}

      {/* Movie Preview Modal */}
      <MoviePreviewModal
        isOpen={showMoviePreview}
        onClose={() => {
          setShowMoviePreview(false);
          setIsMoviePlaying(false);
        }}
        scenes={scenes}
        currentScene={currentMovieScene}
        isPlaying={isMoviePlaying}
        onExport={handleExportMovie}
        onSceneComplete={handleMovieSceneComplete}
      />
    </div>
  );
}

export default App;