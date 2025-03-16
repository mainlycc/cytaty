import React from 'react';
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
}) => {
  // Bardziej bezpieczne sprawdzanie i zapewnienie domyślnych wartości
  // Sprawdzamy, czy obiekt istnieje i czy ma właściwości x i y
  const hasValidTopPosition = topPosition && 
    typeof topPosition.x === 'number' && 
    typeof topPosition.y === 'number';
  
  const hasValidBottomPosition = bottomPosition && 
    typeof bottomPosition.x === 'number' && 
    typeof bottomPosition.y === 'number';

  // Bezpieczne pozycje z dokładnym sprawdzeniem
  const safeTopPosition = hasValidTopPosition ? topPosition : DEFAULT_TOP_POSITION;
  const safeBottomPosition = hasValidBottomPosition ? bottomPosition : DEFAULT_BOTTOM_POSITION;

  // Bezpieczne wartości dla pozostałych props
  const safeTopTextSize = topTextSize || 3;
  const safeBottomTextSize = bottomTextSize || 3;
  const safeTopTextColor = topTextColor || '#ffffff';
  const safeBottomTextColor = bottomTextColor || '#ffffff';

  return (
    <div className="relative bg-black/40 rounded-md overflow-hidden backdrop-blur-sm h-[500px] flex items-center justify-center">
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
          className="absolute font-bold uppercase text-center px-4 py-2"
          style={{
            color: safeTopTextColor,
            textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
            left: `${safeTopPosition.x}%`,
            top: `${safeTopPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '80%',
            fontSize: `${safeTopTextSize}rem`,
          }}
        >
          {topText}
        </div>
      )}
      {bottomText && (
        <div
          className="absolute font-bold uppercase text-center px-4 py-2"
          style={{
            color: safeBottomTextColor,
            textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
            left: `${safeBottomPosition.x}%`,
            top: `${safeBottomPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            maxWidth: '80%',
            fontSize: `${safeBottomTextSize}rem`,
          }}
        >
          {bottomText}
        </div>
      )}
    </div>
  );
};

export default MemeDisplay; 