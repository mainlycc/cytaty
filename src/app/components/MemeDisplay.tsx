import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface MemeDisplayProps {
  imageUrl: string;
  topText?: string | null;
  bottomText?: string | null;
  topPosition?: { x: number; y: number } | null;
  bottomPosition?: { x: number; y: number } | null;
  topTextSize?: number | null;
  bottomTextSize?: number | null;
  topTextColor?: string | null;
  bottomTextColor?: string | null;
  onTopPositionChange?: (position: { x: number; y: number }) => void;
  onBottomPositionChange?: (position: { x: number; y: number }) => void;
  editable?: boolean;
}

const DEFAULT_TOP_POSITION = { x: 50, y: 15 };
const DEFAULT_BOTTOM_POSITION = { x: 50, y: 85 };

const MemeDisplay: React.FC<MemeDisplayProps> = ({
  imageUrl,
  topText,
  bottomText,
  topPosition,
  bottomPosition,
  topTextSize = 3,
  bottomTextSize = 3,
  topTextColor = '#ffffff',
  bottomTextColor = '#ffffff',
  onTopPositionChange,
  onBottomPositionChange,
  editable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bardziej bezpieczne sprawdzanie i zapewnienie domyślnych wartości
  const hasValidTopPosition = topPosition && 
    typeof topPosition.x === 'number' && 
    typeof topPosition.y === 'number';
  
  const hasValidBottomPosition = bottomPosition && 
    typeof bottomPosition.x === 'number' && 
    typeof bottomPosition.y === 'number';

  const safeTopPosition = hasValidTopPosition ? topPosition : DEFAULT_TOP_POSITION;
  const safeBottomPosition = hasValidBottomPosition ? bottomPosition : DEFAULT_BOTTOM_POSITION;

  const safeTopTextSize = topTextSize || 3;
  const safeBottomTextSize = bottomTextSize || 3;
  const safeTopTextColor = topTextColor || '#ffffff';
  const safeBottomTextColor = bottomTextColor || '#ffffff';

  // Funkcja obsługująca przeciąganie tekstu
  const handleTextDrag = (
    e: React.MouseEvent,
    isTopText: boolean
  ) => {
    if (!editable) return;
    e.preventDefault();
    
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Pobierz początkową pozycję
    const initialPosition = isTopText ? safeTopPosition : safeBottomPosition;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      // Oblicz nową pozycję procentową
      const x = ((moveEvent.clientX - containerRect.left) / containerRect.width) * 100;
      const y = ((moveEvent.clientY - containerRect.top) / containerRect.height) * 100;
      
      // Ogranicz wartości do zakresu 5-95%
      const clampedX = Math.min(Math.max(x, 5), 95);
      const clampedY = Math.min(Math.max(y, 5), 95);
      
      // Aktualizuj pozycję
      const newPosition = { x: clampedX, y: clampedY };
      if (isTopText && onTopPositionChange) {
        onTopPositionChange(newPosition);
      } else if (!isTopText && onBottomPositionChange) {
        onBottomPositionChange(newPosition);
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef} className="relative bg-black/40 rounded-md overflow-hidden backdrop-blur-sm h-[500px] flex items-center justify-center">
      <Image
        src={imageUrl}
        alt="Meme"
        className="max-w-full max-h-full object-contain"
        fill
        style={{ objectFit: 'contain' }}
        unoptimized={true}
      />
      {topText && (
        <div
          className={`absolute font-bold uppercase text-center px-4 py-2 ${editable ? 'cursor-move' : ''}`}
          style={{
            color: safeTopTextColor,
            textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
            left: `${safeTopPosition.x}%`,
            top: `${safeTopPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '80%',
            fontSize: `${safeTopTextSize}rem`,
            userSelect: editable ? 'none' : 'auto',
          }}
          onMouseDown={editable ? (e) => handleTextDrag(e, true) : undefined}
        >
          {topText}
        </div>
      )}
      {bottomText && (
        <div
          className={`absolute font-bold uppercase text-center px-4 py-2 ${editable ? 'cursor-move' : ''}`}
          style={{
            color: safeBottomTextColor,
            textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
            left: `${safeBottomPosition.x}%`,
            top: `${safeBottomPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '80%',
            fontSize: `${safeBottomTextSize}rem`,
            userSelect: editable ? 'none' : 'auto',
          }}
          onMouseDown={editable ? (e) => handleTextDrag(e, false) : undefined}
        >
          {bottomText}
        </div>
      )}
    </div>
  );
};

export default MemeDisplay; 