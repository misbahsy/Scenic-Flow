export type SceneType = 'text' | 'image';

export type AnimationCategory = 
  | 'Fade'
  | 'Slide'
  | 'Scale'
  | 'Rotate'
  | 'Dynamic'
  | 'Text';

  export type AnimationType =
  | 'fade-in'
  | 'fade-out'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-in'
  | 'slide-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'grow-in'
  | 'shrink-in'
  | 'zoom-in'
  | 'zoom-out'
  | 'scale-up'
  | 'scale-down'
  | 'rotate'
  | 'rotate-left'
  | 'rotate-right'
  | 'flip'
  | 'flip-x'
  | 'flip-y'
  | 'bounce'
  | 'swing'
  | 'shake'
  | 'pulse'
  | 'float'
  | 'wobble'
  // | 'typewriter'          // Added
  // | 'letter-by-letter'    // Added
  // | 'word-by-word';       // Added

export const ANIMATION_CATEGORIES: Record<string, AnimationType[]> = {
  Fade: ['fade-in', 'fade-out', 'fade-up', 'fade-down', 'fade-left', 'fade-right'],
  Slide: ['slide-in', 'slide-out', 'slide-up', 'slide-down', 'slide-left', 'slide-right'],
  Scale: ['grow-in', 'shrink-in', 'zoom-in', 'zoom-out', 'scale-up', 'scale-down'],
  Rotate: ['rotate', 'rotate-left', 'rotate-right'],
  Flip: ['flip', 'flip-x', 'flip-y'],
  Dynamic: ['bounce', 'swing', 'shake', 'pulse', 'float', 'wobble'],
  // Text: ['typewriter', 'letter-by-letter', 'word-by-word'], // Added Text Animations
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

export type Scene = TextScene | ImageScene;