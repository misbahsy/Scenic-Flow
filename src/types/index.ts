export type SceneType = 'text' | 'image' | 'video';
export type AnimationType = 'fade-in' | 'slide-in' | 'zoom-in' | 'bounce' | 'rotate';

interface BaseScene {
  id: string;
  type: SceneType;
  duration: number;
  animation: AnimationType;
  backgroundColor: string;
}

export interface TextScene extends BaseScene {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
}

export interface ImageScene extends BaseScene {
  type: 'image';
  url: string;
  scale: number;
  opacity: number;
}

export interface VideoScene extends BaseScene {
  type: 'video';
  url: string;
  volume: number;
  playbackRate: number;
  loop: boolean;
}

export type Scene = TextScene | ImageScene | VideoScene;