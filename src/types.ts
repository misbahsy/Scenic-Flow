export type SceneType = 'text' | 'image' | 'video';

export type AnimationCategory = 
  | 'Fade'
  | 'Slide'
  | 'Scale'
  | 'Rotate'
  | 'Dynamic'
  | 'Text';

export type AnimationType = 
  // Fade Animations
  | 'fade-in'
  | 'fade-out'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  // Slide Animations
  | 'slide-in'
  | 'slide-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  // Scale Animations
  | 'grow-in'
  | 'shrink-in'
  | 'zoom-in'
  | 'zoom-out'
  | 'scale-up'
  | 'scale-down'
  // Rotate Animations
  | 'rotate'
  | 'rotate-left'
  | 'rotate-right'
  | 'flip'
  | 'flip-x'
  | 'flip-y'
  // Dynamic Animations
  | 'bounce'
  | 'swing'
  | 'shake'
  | 'pulse'
  | 'float'
  | 'wobble'
  // Text Animations
  | 'typewriter'
  | 'letter-by-letter'
  | 'word-by-word'
  | 'glitch';

export const ANIMATION_CATEGORIES: Record<AnimationCategory, AnimationType[]> = {
  'Fade': ['fade-in', 'fade-out', 'fade-up', 'fade-down', 'fade-left', 'fade-right'],
  'Slide': ['slide-in', 'slide-out', 'slide-up', 'slide-down', 'slide-left', 'slide-right'],
  'Scale': ['grow-in', 'shrink-in', 'zoom-in', 'zoom-out', 'scale-up', 'scale-down'],
  'Rotate': ['rotate', 'rotate-left', 'rotate-right', 'flip', 'flip-x', 'flip-y'],
  'Dynamic': ['bounce', 'swing', 'shake', 'pulse', 'float', 'wobble'],
  'Text': ['typewriter', 'letter-by-letter', 'word-by-word', 'glitch']
};

interface BaseScene {
  id: string;
  type: SceneType;
  animationIn: AnimationType;
  animationOut: AnimationType;
  durationIn: number;
  durationStay: number;
  durationOut: number;
  backgroundColor: string;
}

interface TextScene extends BaseScene {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
}

interface ImageScene extends BaseScene {
  type: 'image';
  file?: File;
  scale: number;
  opacity: number;
}

// Add this new interface
interface VideoScene extends BaseScene {
  type: 'video';
  file?: File;
  scale: number;
  opacity: number;
  volume: number;  // New property for video
  loop: boolean;   // New property for video
}

// Update the Scene type to include VideoScene
export type Scene = TextScene | ImageScene | VideoScene;