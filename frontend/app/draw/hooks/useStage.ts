"use client";
import { useState, useEffect } from "react";

export const useStage = (initialWidth: number, initialHeight: number) => {
  const [stageDimensions, setStageDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundSize, setBackgroundSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setStageDimensions({
        width: Math.min(window.innerWidth - 40, 1200),
        height: Math.min(window.innerHeight - 140, 800)
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new window.Image();
      img.onload = () => {
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        const maxWidth = stageDimensions.width;
        const maxHeight = stageDimensions.height;
        
        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        
        const ratio = Math.min(widthRatio, heightRatio);
        
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        
        setBackgroundSize({
          width: newWidth,
          height: newHeight
        });
        
        setBackgroundImage(img);
      };
      
      img.src = loadEvent.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundSize({ width: 0, height: 0 });
  };

  return {
    stageDimensions,
    backgroundImage,
    backgroundSize,
    handleImageUpload,
    removeBackgroundImage
  };
};
