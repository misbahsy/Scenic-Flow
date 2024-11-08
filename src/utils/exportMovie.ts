import { Scene } from '../types';
import { applyAnimation } from './animations';

const FRAME_RATE = 30;
const VIDEO_CONFIG = {
  width: 1280,
  height: 720,
  bitrate: 5_000_000,
  framerate: FRAME_RATE,
};

export async function exportMovie(
  canvas: HTMLCanvasElement,
  scenes: Scene[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ctx = canvas.getContext('2d')!;
  const imageCache = new Map<string, ImageBitmap>();

  // Preload all images
  for (const scene of scenes) {
    if (scene.type === 'image' && scene.file && !imageCache.has(scene.file.name)) {
      const bitmap = await createImageBitmap(scene.file);
      imageCache.set(scene.file.name, bitmap);
    }
  }

  // Calculate total duration
  const totalDuration = scenes.reduce((acc, scene) => 
    acc + scene.durationIn + scene.durationStay + scene.durationOut, 0);

  // Setup MediaRecorder with proper timing
  const stream = canvas.captureStream(FRAME_RATE);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp8',
    videoBitsPerSecond: VIDEO_CONFIG.bitrate
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  return new Promise((resolve, reject) => {
    try {
      let startTime: number | null = null;
      mediaRecorder.start();

      const renderFrame = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }

        const currentTime = timestamp - startTime;
        let accumulatedTime = 0;

        // Find current scene and its relative time
        for (let i = 0; i < scenes.length; i++) {
          const scene = scenes[i];
          const sceneDuration = scene.durationIn + scene.durationStay + scene.durationOut;
          
          if (currentTime >= accumulatedTime && currentTime < accumulatedTime + sceneDuration) {
            const sceneTime = currentTime - accumulatedTime;
            
            // Determine animation phase and progress
            let progress: number;
            let animation = scene.animationIn;
            let direction: 'in' | 'out' = 'in';

            if (sceneTime < scene.durationIn) {
              // Animate in
              progress = sceneTime / scene.durationIn;
            } else if (sceneTime < scene.durationIn + scene.durationStay) {
              // Stay phase
              progress = 1;
            } else {
              // Animate out
              progress = (sceneTime - scene.durationIn - scene.durationStay) / scene.durationOut;
              animation = scene.animationOut;
              direction = 'out';
            }

            // Clear canvas
            ctx.fillStyle = scene.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Apply animation and render scene
            applyAnimation(
              ctx,
              animation,
              direction,
              progress,
              () => {
                if (scene.type === 'text') {
                  ctx.font = `${scene.fontSize}px Arial`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = scene.color;
                  ctx.fillText(scene.text, canvas.width / 2, canvas.height / 2);
                } else if (scene.type === 'image' && scene.file) {
                  const img = imageCache.get(scene.file.name);
                  if (img) {
                    const scale = Math.min(
                      canvas.width / img.width,
                      canvas.height / img.height
                    ) * (scene.scale || 1);
                    
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    
                    ctx.globalAlpha = scene.opacity || 1;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    ctx.globalAlpha = 1;
                  }
                }
              },
              scene.type === 'text' ? scene.text : undefined
            );
            break;
          }
          accumulatedTime += sceneDuration;
        }

        // Update progress
        const progress = (currentTime / totalDuration) * 100;
        onProgress?.(Math.min(progress, 100));

        // Continue until all scenes are processed
        if (currentTime < totalDuration) {
          requestAnimationFrame(renderFrame);
        } else {
          // Finish recording
          mediaRecorder.stop();
        }
      };

      // Start rendering frames
      requestAnimationFrame(renderFrame);

      // Handle completion
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });
        
        // Cleanup
        imageCache.forEach(bitmap => bitmap.close());
        imageCache.clear();
        
        resolve(finalBlob);
      };

    } catch (error) {
      reject(error);
    }
  });
}

export function isWebCodecsSupported(): boolean {
  return typeof window !== 'undefined' && 
         'VideoEncoder' in window &&
         'VideoFrame' in window &&
         'MediaRecorder' in window;
}