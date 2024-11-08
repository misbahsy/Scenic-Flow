import { AnimationType } from '../types';

type DrawFunction = () => void;

// const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export function applyAnimation(
  ctx: CanvasRenderingContext2D,
  type: AnimationType,
  direction: 'in' | 'out',
  progress: number,
  draw: DrawFunction,
  // text?: string,
  font?: string // New parameter for font settings
) {
  ctx.save();
  
  const canvas = ctx.canvas;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const p = direction === 'in' ? progress : 1 - progress;

  // Set font if provided and animation is text-based
  if (font && ['typewriter', 'letter-by-letter', 'word-by-word'].includes(type)) {
    ctx.font = font;
  }

  switch (type) {
    // Fade Animations
    case 'fade-in':
    case 'fade-out':
      ctx.globalAlpha = p;
      break;

    case 'fade-up':
      ctx.globalAlpha = p;
      ctx.translate(0, (1 - p) * 50);
      break;

    case 'fade-down':
      ctx.globalAlpha = p;
      ctx.translate(0, (p - 1) * 50);
      break;

    case 'fade-left':
      ctx.globalAlpha = p;
      ctx.translate((1 - p) * 50, 0);
      break;

    case 'fade-right':
      ctx.globalAlpha = p;
      ctx.translate((p - 1) * 50, 0);
      break;

    // Slide Animations
    case 'slide-in':
      ctx.translate((direction === 'in' ? 1 - p : p) * canvas.width, 0);
      break;

    case 'slide-out':
      ctx.translate((direction === 'in' ? p - 1 : -p) * canvas.width, 0);
      break;

    case 'slide-up':
      ctx.translate(0, (direction === 'in' ? 1 - p : p) * canvas.height);
      break;

    case 'slide-down':
      ctx.translate(0, (direction === 'in' ? p - 1 : -p) * canvas.height);
      break;

    case 'slide-left':
      ctx.translate((direction === 'in' ? -1 + p : -p) * canvas.width, 0);
      break;

    case 'slide-right':
      ctx.translate((direction === 'in' ? 1 - p : p) * canvas.width, 0);
      break;

    // Scale Animations
    case 'grow-in':
      ctx.translate(centerX, centerY);
      ctx.scale(p, p);
      ctx.translate(-centerX, -centerY);
      break;

    case 'shrink-in':
      ctx.translate(centerX, centerY);
      ctx.scale(2 - p, 2 - p);
      ctx.translate(-centerX, -centerY);
      break;

    case 'zoom-in':
    case 'zoom-out':
      const scale = direction === 'in' ? p : 2 - p;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      ctx.globalAlpha = direction === 'in' ? p : 1 - (p - 1);
      break;

    case 'scale-up':
      ctx.translate(centerX, centerY);
      ctx.scale(1, p);
      ctx.translate(-centerX, -centerY);
      break;

    case 'scale-down':
      ctx.translate(centerX, centerY);
      ctx.scale(1, 2 - p);
      ctx.translate(-centerX, -centerY);
      break;

    // Rotate Animations
    case 'rotate':
      ctx.translate(centerX, centerY);
      ctx.rotate((direction === 'in' ? 1 - p : p) * Math.PI * 2);
      ctx.translate(-centerX, -centerY);
      break;

    case 'rotate-left':
      ctx.translate(centerX, centerY);
      ctx.rotate((direction === 'in' ? -1 + p : -p) * Math.PI);
      ctx.translate(-centerX, -centerY);
      break;

    case 'rotate-right':
      ctx.translate(centerX, centerY);
      ctx.rotate((direction === 'in' ? 1 - p : p) * Math.PI);
      ctx.translate(-centerX, -centerY);
      break;

    case 'flip':
    case 'flip-x':
      const flipScale = Math.cos(p * Math.PI);
      ctx.translate(centerX, centerY);
      ctx.scale(flipScale, 1);
      ctx.translate(-centerX, -centerY);
      break;

    case 'flip-y':
      const flipScaleY = Math.cos(p * Math.PI);
      ctx.translate(centerX, centerY);
      ctx.scale(1, flipScaleY);
      ctx.translate(-centerX, -centerY);
      break;

    // Dynamic Animations
    case 'bounce':
      const bounceY = Math.abs(Math.sin(p * Math.PI * 2)) * 50;
      ctx.translate(0, -bounceY);
      break;

    case 'swing':
      const swingAngle = Math.sin(p * Math.PI * 2) * 0.2;
      ctx.translate(centerX, centerY);
      ctx.rotate(swingAngle);
      ctx.translate(-centerX, -centerY);
      break;

    case 'shake':
      const shakeX = Math.sin(p * Math.PI * 8) * 10 * (1 - p);
      ctx.translate(shakeX, 0);
      break;

    case 'pulse':
      const pulseScale = 1 + Math.sin(p * Math.PI * 2) * 0.1;
      ctx.translate(centerX, centerY);
      ctx.scale(pulseScale, pulseScale);
      ctx.translate(-centerX, -centerY);
      break;

    case 'float':
      const floatY = Math.sin(p * Math.PI * 2) * 20;
      ctx.translate(0, floatY);
      break;

    case 'wobble':
      const wobbleAngle = Math.sin(p * Math.PI * 4) * 0.1;
      const wobbleScale = 1 + Math.sin(p * Math.PI * 2) * 0.1;
      ctx.translate(centerX, centerY);
      ctx.rotate(wobbleAngle);
      ctx.scale(wobbleScale, wobbleScale);
      ctx.translate(-centerX, -centerY);
      break;

    // // Text Animations
    // case 'typewriter':
    //   if (text) {
    //     const length = Math.floor(text.length * p);
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillStyle = ctx.fillStyle || '#ffffff'; // Ensure there's a default color
    //     const visibleText = text.slice(0, length);
    //     ctx.fillText(visibleText, centerX, centerY);
    //     return; // Important: return here to prevent double drawing
    //   }
    //   break;

    // case 'letter-by-letter':
    //   if (text) {
    //     const letters = text.split('');
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillStyle = ctx.fillStyle || '#ffffff';
        
    //     // Calculate total width for centering
    //     const totalWidth = ctx.measureText(text).width;
    //     const startX = centerX - totalWidth / 2;
        
    //     letters.forEach((letter, index) => {
    //       const letterProgress = (p * letters.length) - index;
    //       if (letterProgress > 0) {
    //         const alpha = Math.min(letterProgress, 1);
    //         const originalAlpha = ctx.globalAlpha;
    //         ctx.globalAlpha = alpha;
            
    //         // Calculate position for each letter
    //         const letterWidth = ctx.measureText(letters.slice(0, index).join('')).width;
    //         const letterX = startX + letterWidth;
    //         ctx.fillText(letter, letterX, centerY);
            
    //         ctx.globalAlpha = originalAlpha;
    //       }
    //     });
    //     return; // Important: return here to prevent double drawing
    //   }
    //   break;

    // case 'word-by-word':
    //   if (text) {
    //     const words = text.split(' ');
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.fillStyle = ctx.fillStyle || '#ffffff';
        
    //     // Calculate line height based on font size
    //     const fontSizeMatch = ctx.font.match(/(\d+)px/);
    //     const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 30; // Default to 30px if not set
    //     const lineHeight = fontSize * 1.2;
        
    //     // Center vertically based on total height
    //     const totalHeight = words.length * lineHeight;
    //     const startY = centerY - (totalHeight / 2) + (lineHeight / 2);
        
    //     words.forEach((word, index) => {
    //       const wordProgress = (p * words.length) - index;
    //       if (wordProgress > 0) {
    //         const alpha = Math.min(wordProgress, 1);
    //         const originalAlpha = ctx.globalAlpha;
    //         ctx.globalAlpha = alpha;
            
    //         // Position each word on a new line
    //         ctx.fillText(word, centerX, startY + (index * lineHeight));
            
    //         ctx.globalAlpha = originalAlpha;
    //       }
    //     });
    //     return; // Important: return here to prevent double drawing
    //   }
    //   break;


    // case 'glitch':
    //   if (Math.random() > 0.9) {
    //     ctx.translate(Math.random() * 10 - 5, Math.random() * 10 - 5);
    //     ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    //   }
    //   break;
  }

  draw();
  ctx.restore();
}