"use client";

import React, { useRef, useEffect } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieAnimationProps {
  animationPath: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationPath,
  loop = true,
  autoplay = true,
  className = '',
  width = '100%',
  height = '100%'
}) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      if (animation.current) {
        animation.current.destroy();
      }

      animation.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop,
        autoplay,
        path: animationPath,
      });
    }

    return () => {
      if (animation.current) {
        animation.current.destroy();
      }
    };
  }, [animationPath, loop, autoplay]);

  return (
    <div 
      ref={animationContainer} 
      className={className}
      style={{ width, height }}
    ></div>
  );
};

export default LottieAnimation; 