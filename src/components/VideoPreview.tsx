import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { Scene, AnimationType } from '../types';
import { applyAnimation } from '../utils/animations';

interface VideoPreviewProps {
  scene: Scene;
  isPlaying: boolean;
  isMovieMode?: boolean;
  onSceneComplete?: () => void;
}

export const VideoPreview = forwardRef<HTMLCanvasElement, VideoPreviewProps>(
  ({ scene, isPlaying, isMovieMode = false, onSceneComplete }, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalCanvasRef;
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number>();
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

    // Load media when scene changes
    useEffect(() => {
      if (scene.type === 'image' && scene.file) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(scene.file);
        
        img.onload = () => {
          setImageElement(img);
          URL.revokeObjectURL(objectUrl);
        };
        
        img.src = objectUrl;
        return () => {
          URL.revokeObjectURL(objectUrl);
          setImageElement(null);
        };
      } else if (scene.type === 'video' && scene.file) {
        const video = document.createElement('video');
        const objectUrl = URL.createObjectURL(scene.file);
        
        video.onloadedmetadata = () => {
          setVideoElement(video);
        };
        
        video.src = objectUrl;
        video.loop = scene.loop;
        video.volume = scene.volume;
        
        return () => {
          URL.revokeObjectURL(objectUrl);
          video.pause();
          setVideoElement(null);
        };
      }
    }, [scene]);

    const drawContent = (ctx: CanvasRenderingContext2D) => {
      if (scene.type === 'text') {
        ctx.font = `${scene.fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = scene.color;
        ctx.fillText(scene.text, ctx.canvas.width / 2, ctx.canvas.height / 2);
      } else if (scene.type === 'image' && imageElement) {
        const scale = Math.min(
          ctx.canvas.width / imageElement.width,
          ctx.canvas.height / imageElement.height
        ) * (scene.scale || 1);

        const x = (ctx.canvas.width - imageElement.width * scale) / 2;
        const y = (ctx.canvas.height - imageElement.height * scale) / 2;

        ctx.globalAlpha = scene.opacity;
        ctx.drawImage(imageElement, x, y, imageElement.width * scale, imageElement.height * scale);
        ctx.globalAlpha = 1;
      } else if (scene.type === 'video' && videoElement) {
        const scale = Math.min(
          ctx.canvas.width / videoElement.videoWidth,
          ctx.canvas.height / videoElement.videoHeight
        ) * (scene.scale || 1);

        const x = (ctx.canvas.width - videoElement.videoWidth * scale) / 2;
        const y = (ctx.canvas.height - videoElement.videoHeight * scale) / 2;

        ctx.globalAlpha = scene.opacity;
        ctx.drawImage(videoElement, x, y, videoElement.videoWidth * scale, videoElement.videoHeight * scale);
        ctx.globalAlpha = 1;
      }
    };

    const drawScene = (elapsed?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas with background color
      ctx.fillStyle = scene.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply animations if elapsed time is provided
      if (elapsed !== undefined) {
        let progress: number;
        let animation: AnimationType;
        let direction: 'in' | 'out' = 'in';

        if (elapsed < scene.durationIn) {
          progress = elapsed / scene.durationIn;
          animation = scene.animationIn;
        } else if (elapsed < scene.durationIn + scene.durationStay) {
          progress = 1;
          animation = scene.animationIn;
        } else {
          progress = (elapsed - scene.durationIn - scene.durationStay) / scene.durationOut;
          animation = scene.animationOut;
          direction = 'out';
        }

        applyAnimation(ctx, animation, direction, progress, () => {
          drawContent(ctx);
        }, scene.type === 'text' ? scene.text : undefined);
      } else {
        drawContent(ctx);
      }
    };

    // Handle video playback
    useEffect(() => {
      if (scene.type === 'video' && videoElement) {
        videoElement.volume = scene.volume;
        videoElement.loop = scene.loop;
        
        if (isPlaying) {
          videoElement.play().catch(console.error);
        } else {
          videoElement.pause();
          if (!isMovieMode) {
            videoElement.currentTime = 0;
          }
        }
      }
    }, [scene, videoElement, isPlaying, isMovieMode]);

    // Animation frame loop
    useEffect(() => {
      if (!isPlaying) {
        startTimeRef.current = null;
        drawScene(); // Draw static frame when not playing
        return;
      }

      startTimeRef.current = performance.now();
      
      const animate = (currentTime: number) => {
        if (!startTimeRef.current) return;
        
        const elapsed = currentTime - startTimeRef.current;
        const totalDuration = scene.durationIn + scene.durationStay + scene.durationOut;
        
        if (elapsed >= totalDuration) {
          if (onSceneComplete) {
            onSceneComplete();
          }
          startTimeRef.current = null;
          return;
        }

        drawScene(elapsed);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [scene, isPlaying, onSceneComplete]);

    return (
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-contain bg-black"
      />
    );
  }
);

VideoPreview.displayName = 'VideoPreview';