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

    // Load image when scene changes
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
      }
    }, [scene]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const drawScene = () => {
        // Clear canvas
        ctx.fillStyle = scene.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (scene.type === 'text') {
          ctx.font = `${scene.fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = scene.color;
          ctx.fillText(scene.text, canvas.width / 2, canvas.height / 2);
        } else if (scene.type === 'image' && imageElement) {
          const scale = Math.min(canvas.width / imageElement.width, canvas.height / imageElement.height) * (scene.scale || 1);
          const x = (canvas.width - imageElement.width * scale) / 2;
          const y = (canvas.height - imageElement.height * scale) / 2;
          ctx.drawImage(imageElement, x, y, imageElement.width * scale, imageElement.height * scale);
        }
      };

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const totalDuration = scene.durationIn + scene.durationStay + scene.durationOut;

        // Clear canvas
        ctx.fillStyle = scene.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let progress: number;
        let animation: AnimationType;
        let direction: 'in' | 'out';

        if (elapsed < scene.durationIn) {
          // Animate in
          progress = elapsed / scene.durationIn;
          animation = scene.animationIn;
          direction = 'in';
        } else if (elapsed < scene.durationIn + scene.durationStay) {
          // Stay
          progress = 1;
          animation = scene.animationIn;
          direction = 'in';
        } else if (elapsed < totalDuration) {
          // Animate out
          progress = (elapsed - (scene.durationIn + scene.durationStay)) / scene.durationOut;
          animation = scene.animationOut;
          direction = 'out';
        } else {
          // Animation complete
          if (onSceneComplete) {
            onSceneComplete();
          }
          if (!isMovieMode) {
            startTimeRef.current = null;
          }
          return;
        }

        // Apply animation
        applyAnimation(
          ctx,
          animation,
          direction,
          progress,
          () => {
            if (scene.type === 'text') {
              ctx.fillStyle = scene.color;
              ctx.font = `${scene.fontSize}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(scene.text, canvas.width / 2, canvas.height / 2);
            } else if (scene.type === 'image' && imageElement) {
              const scale = Math.min(canvas.width / imageElement.width, canvas.height / imageElement.height) * (scene.scale || 1);
              const x = (canvas.width - imageElement.width * scale) / 2;
              const y = (canvas.height - imageElement.height * scale) / 2;
              ctx.drawImage(imageElement, x, y, imageElement.width * scale, imageElement.height * scale);
            }
          },
          scene.type === 'text' ? scene.text : undefined
        );

        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      if (isPlaying) {
        startTimeRef.current = null;
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        drawScene();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [scene, isPlaying, isMovieMode, onSceneComplete, imageElement]);

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