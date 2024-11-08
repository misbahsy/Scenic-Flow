import { Scene } from '../types';
import { applyAnimation } from './animations';

const FRAME_RATE = 30;
const VIDEO_CONFIG = {
  width: 1280,
  height: 720,
  bitrate: 5_000_000,
  framerate: FRAME_RATE,
  codec: 'avc1.42001E', // H.264 codec for MP4
};

export async function exportMovie(
  canvas: HTMLCanvasElement,
  scenes: Scene[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ctx = canvas.getContext('2d')!;
  const mediaCache = new Map<string, HTMLImageElement | HTMLVideoElement>();

  // Preload all media
  for (const scene of scenes) {
    if ((scene.type === 'image' || scene.type === 'video') && 
        scene.file && 
        !mediaCache.has(scene.file.name)) {
      if (scene.type === 'image') {
        const img = new Image();
        img.src = URL.createObjectURL(scene.file);
        await new Promise(resolve => img.onload = resolve);
        mediaCache.set(scene.file.name, img);
      } else {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(scene.file);
        video.muted = false;
        await new Promise(resolve => {
          video.onloadedmetadata = resolve;
          video.load();
        });
        mediaCache.set(scene.file.name, video);
      }
    }
  }

  // Calculate total duration in milliseconds
  const totalDuration = scenes.reduce((acc, scene) => 
    acc + scene.durationIn + scene.durationStay + scene.durationOut, 0);

  // Setup encoder
  const videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => {
      encodedChunks.push(chunk);
    },
    error: (e) => {
      console.error(e);
    }
  });

  await videoEncoder.configure({
    codec: VIDEO_CONFIG.codec,
    width: VIDEO_CONFIG.width,
    height: VIDEO_CONFIG.height,
    bitrate: VIDEO_CONFIG.bitrate,
    framerate: VIDEO_CONFIG.framerate,
  });

  const encodedChunks: EncodedVideoChunk[] = [];
  let frameCount = 0;
  const totalFrames = Math.ceil((totalDuration / 1000) * FRAME_RATE);

  return new Promise(async (resolve, reject) => {
    try {
      let accumulatedTime = 0;

      for (const scene of scenes) {
        const sceneDuration = scene.durationIn + scene.durationStay + scene.durationOut;
        const sceneFrames = Math.ceil((sceneDuration / 1000) * FRAME_RATE);
        
        // Handle video preparation if needed
        let videoElement: HTMLVideoElement | null = null;
        if (scene.type === 'video' && scene.file) {
          videoElement = mediaCache.get(scene.file.name) as HTMLVideoElement;
          videoElement.currentTime = 0;
          await videoElement.play();
        }

        for (let frame = 0; frame < sceneFrames; frame++) {
          const sceneTime = (frame / FRAME_RATE) * 1000;
          
          // Determine animation phase and progress
          let progress: number;
          let animation = scene.animationIn;
          let direction: 'in' | 'out' = 'in';

          if (sceneTime < scene.durationIn) {
            progress = sceneTime / scene.durationIn;
          } else if (sceneTime < scene.durationIn + scene.durationStay) {
            progress = 1;
          } else {
            progress = (sceneTime - scene.durationIn - scene.durationStay) / scene.durationOut;
            animation = scene.animationOut;
            direction = 'out';
          }

          // Clear canvas
          ctx.fillStyle = scene.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw frame with animation
          applyAnimation(ctx, animation, direction, progress, () => {
            if (scene.type === 'text') {
              ctx.font = `${scene.fontSize}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = scene.color;
              ctx.fillText(scene.text, canvas.width / 2, canvas.height / 2);
            } else if (scene.type === 'image' && scene.file) {
              const img = mediaCache.get(scene.file.name) as HTMLImageElement;
              const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              ) * (scene.scale || 1);
              
              const x = (canvas.width - img.width * scale) / 2;
              const y = (canvas.height - img.height * scale) / 2;
              
              ctx.globalAlpha = scene.opacity || 1;
              ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
              ctx.globalAlpha = 1;
            } else if (scene.type === 'video' && videoElement) {
              const scale = Math.min(
                canvas.width / videoElement.videoWidth,
                canvas.height / videoElement.videoHeight
              ) * (scene.scale || 1);
              
              const x = (canvas.width - videoElement.videoWidth * scale) / 2;
              const y = (canvas.height - videoElement.videoHeight * scale) / 2;
              
              ctx.globalAlpha = scene.opacity || 1;
              ctx.drawImage(videoElement, x, y, videoElement.videoWidth * scale, videoElement.videoHeight * scale);
              ctx.globalAlpha = 1;
            }
          }, scene.type === 'text' ? scene.text : undefined);

          // Encode frame
          const videoFrame = new VideoFrame(canvas, {
            timestamp: Math.round((frameCount * 1000000) / FRAME_RATE)
          });
          await videoEncoder.encode(videoFrame);
          videoFrame.close();

          frameCount++;
          onProgress?.(Math.min((frameCount / totalFrames) * 100, 100));
        }

        // Cleanup video if needed
        if (videoElement) {
          videoElement.pause();
        }

        accumulatedTime += sceneDuration;
      }

      // Finish encoding
      await videoEncoder.flush();
      videoEncoder.close();

      // Create MP4 file
      const mp4File = await createMP4File(encodedChunks, VIDEO_CONFIG);
      
      // Cleanup
      mediaCache.forEach((media, key) => {
        URL.revokeObjectURL(media.src);
      });
      mediaCache.clear();

      resolve(mp4File);
    } catch (error) {
      reject(error);
    }
  });
}

async function createMP4File(chunks: EncodedVideoChunk[], config: typeof VIDEO_CONFIG): Promise<Blob> {
  // Use MP4Box.js or similar library to create MP4 container
  // This is a simplified version - you'll need to add proper MP4 muxing
  return new Blob(chunks, { type: 'video/mp4' });
}

export function isWebCodecsSupported(): boolean {
  return typeof window !== 'undefined' && 
         'VideoEncoder' in window &&
         'VideoFrame' in window &&
         'MediaRecorder' in window;
}