"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { showToast } from "./toaster-provider"
import Image from 'next/image'

// Własny interfejs kadrowania
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: '%' | 'px';
}

export function MemeGenerator() {
  // Podstawowe stany
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  
  // Pozycje tekstu
  const [topPosition, setTopPosition] = useState<{ x: number; y: number }>({ x: 200, y: 50 });
  const [bottomPosition, setBottomPosition] = useState<{ x: number; y: number }>({ x: 200, y: 350 });
  
  // Kadrowanie
  const [isCropping, setIsCropping] = useState(false);
  const [isFullscreenCropping, setIsFullscreenCropping] = useState(false);
  const [crop, setCrop] = useState<CropArea>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    unit: '%'
  });
  const [completedCrop, setCompletedCrop] = useState<CropArea | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Referencje
  const supabase = createClientComponentClient();
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Obsługa zmiany obrazu
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setCrop({
        x: 10,
        y: 10,
        width: 80,
        height: 80,
        unit: '%'
      });
      setCompletedCrop(null);
      setCroppedImageUrl("");
    }
  };

  // Obsługa tagów
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Obsługa kadrowania
  const handleStartCropping = () => {
    setIsCropping(true);
    setIsFullscreenCropping(true);
  };

  const handleCancelCropping = () => {
    setIsCropping(false);
    setIsFullscreenCropping(false);
  };

  // Implementacja funkcji handleCompleteCropping
  const handleCompleteCropping = () => {
    if (!imageRef.current || !crop) {
      showToast.error("Nie można zatwierdzić kadrowania");
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      showToast.error("Nie można utworzyć kontekstu canvas");
      return;
    }
    
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Ustaw wymiary canvasu na rozmiar wykadrowanego obszaru
    canvas.width = (image.width * crop.width / 100) * scaleX;
    canvas.height = (image.height * crop.height / 100) * scaleY;
    
    // Rysuj wykadrowany obszar na canvasie
    ctx.drawImage(
      image,
      image.naturalWidth * crop.x / 100,
      image.naturalHeight * crop.y / 100,
      image.naturalWidth * crop.width / 100,
      image.naturalHeight * crop.height / 100,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    // Konwertuj canvas na URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCroppedImageUrl(url);
        setCompletedCrop(crop);
        showToast.success("Kadrowanie zakończone pomyślnie");
        setIsCropping(false);
        setIsFullscreenCropping(false);
      }
    });
  };

  // Obsługa dragowania obszaru kadrowania
  const handleCropDrag = (e: React.MouseEvent, mode: 'move' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...crop };
    
    // Funkcja do ograniczania wartości
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      // Oblicz delta ruchu myszą
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Pobierz wymiary kontenera obrazu
      const imageRect = imageRef.current?.getBoundingClientRect();
      if (!imageRect) return;
      
      // Przelicz delty na procenty względem kontenera
      const deltaXPercent = (deltaX / imageRect.width) * 100;
      const deltaYPercent = (deltaY / imageRect.height) * 100;
      
      let newCrop = { ...startCrop };
      
      switch (mode) {
        case 'move':
          newCrop.x = clamp(startCrop.x + deltaXPercent, 0, 100 - startCrop.width);
          newCrop.y = clamp(startCrop.y + deltaYPercent, 0, 100 - startCrop.height);
          break;
        case 'topLeft':
          // Zapobiegamy zbyt małemu obszarowi kadrowania
          const maxDeltaWidthLeft = Math.min(startCrop.width - 10, startCrop.x);
          const maxDeltaHeightTop = Math.min(startCrop.height - 10, startCrop.y);
          
          const deltaWidthLeft = clamp(deltaXPercent, -maxDeltaWidthLeft, startCrop.width - 10);
          const deltaHeightTop = clamp(deltaYPercent, -maxDeltaHeightTop, startCrop.height - 10);
          
          newCrop.x = startCrop.x - deltaWidthLeft;
          newCrop.y = startCrop.y - deltaHeightTop;
          newCrop.width = startCrop.width + deltaWidthLeft;
          newCrop.height = startCrop.height + deltaHeightTop;
          break;
        case 'topRight':
          const maxDeltaHeightTopRight = Math.min(startCrop.height - 10, startCrop.y);
          const maxDeltaWidthRight = 100 - (startCrop.x + startCrop.width);
          
          const deltaWidthRight = clamp(deltaXPercent, -(startCrop.width - 10), maxDeltaWidthRight);
          const deltaHeightTopRight = clamp(deltaYPercent, -maxDeltaHeightTopRight, startCrop.height - 10);
          
          newCrop.y = startCrop.y - deltaHeightTopRight;
          newCrop.width = startCrop.width + deltaWidthRight;
          newCrop.height = startCrop.height + deltaHeightTopRight;
          break;
        case 'bottomLeft':
          const maxDeltaWidthBottomLeft = Math.min(startCrop.width - 10, startCrop.x);
          const maxDeltaHeightBottom = 100 - (startCrop.y + startCrop.height);
          
          const deltaWidthBottomLeft = clamp(deltaXPercent, -maxDeltaWidthBottomLeft, startCrop.width - 10);
          const deltaHeightBottom = clamp(deltaYPercent, -(startCrop.height - 10), maxDeltaHeightBottom);
          
          newCrop.x = startCrop.x - deltaWidthBottomLeft;
          newCrop.width = startCrop.width + deltaWidthBottomLeft;
          newCrop.height = startCrop.height + deltaHeightBottom;
          break;
        case 'bottomRight':
          const maxDeltaWidthBottomRight = 100 - (startCrop.x + startCrop.width);
          const maxDeltaHeightBottomRight = 100 - (startCrop.y + startCrop.height);
          
          const deltaWidthBottomRight = clamp(deltaXPercent, -(startCrop.width - 10), maxDeltaWidthBottomRight);
          const deltaHeightBottomRight = clamp(deltaYPercent, -(startCrop.height - 10), maxDeltaHeightBottomRight);
          
          newCrop.width = startCrop.width + deltaWidthBottomRight;
          newCrop.height = startCrop.height + deltaHeightBottomRight;
          break;
      }
      
      setCrop(newCrop);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Pobierz wymiary obrazu po załadowaniu
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    
    // Ustaw crop na początku na cały obraz
    const initialCrop = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      unit: '%' as const
    };
    
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  };

  // Zamykanie modalu przy kliknięciu Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenCropping) {
        handleCancelCropping();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreenCropping]);

  // Funkcja zapisywania mema
  const handleSaveMeme = async () => {
    try {
      if (!selectedImage) {
        showToast.error("Najpierw wybierz zdjęcie");
        return;
      }
      
      // Implementacja zapisywania do Supabase może być dodana tutaj
      showToast.success("Mem został zapisany!");
    } catch (error) {
      console.error("Błąd podczas zapisywania mema:", error);
      showToast.error("Wystąpił błąd podczas zapisywania mema");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
      {/* Panel kontrolny */}
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 h-fit">
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="image-upload" className="text-zinc-300 mb-2 block">
              Zdjęcie
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-black/20 border-zinc-800 text-zinc-300 file:bg-zinc-900 file:text-zinc-400 file:border-0"
              />
              {previewUrl && (
                <Button 
                  onClick={handleStartCropping}
                  variant="outline"
                  className="bg-zinc-950/50 text-zinc-300 border-zinc-800 hover:bg-zinc-900/50"
                >
                  Kadruj
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="top-text" className="text-zinc-300 mb-2 block">
              Tekst górny
            </Label>
            <Input
              id="top-text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="bg-black/20 border-zinc-800 text-zinc-300"
              placeholder="Tekst górny..."
            />
          </div>
          
          <div>
            <Label htmlFor="bottom-text" className="text-zinc-300 mb-2 block">
              Tekst dolny
            </Label>
            <Input
              id="bottom-text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="bg-black/20 border-zinc-800 text-zinc-300"
              placeholder="Tekst dolny..."
            />
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-zinc-300 mb-2 block">
              Tagi (naciśnij Enter, aby dodać)
            </Label>
            <Input
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-black/20 border-zinc-800 text-zinc-300"
              placeholder="Dodaj tagi..."
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-red-950/50 text-red-400 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    #{tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="text-red-400/70 hover:text-red-400"
                      aria-label={`Usuń tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSaveMeme}
            className="w-full bg-red-900/30 text-red-500 border-red-900/50 hover:bg-red-900/50"
            disabled={!selectedImage || (!topText && !bottomText)}
          >
            Zapisz mem
          </Button>
        </CardContent>
      </Card>

      {/* Podgląd */}
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
        <CardContent className="p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {previewUrl ? (
              !isCropping ? (
                <div className="relative w-full h-full meme-preview-container">
                  <Image
                    src={croppedImageUrl || previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0">
                    {topText && (
                      <div
                        ref={topTextRef}
                        className="text-2xl font-bold text-white uppercase cursor-move inline-block whitespace-nowrap pointer-events-auto"
                        style={{
                          textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
                          position: 'absolute',
                          left: topPosition.x,
                          top: topPosition.y,
                          cursor: 'move',
                          userSelect: 'none',
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => {
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startPos = { ...topPosition };
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            setTopPosition({
                              x: startPos.x + (moveEvent.clientX - startX),
                              y: startPos.y + (moveEvent.clientY - startY)
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        {topText}
                      </div>
                    )}
                    
                    {bottomText && (
                      <div
                        ref={bottomTextRef}
                        className="text-2xl font-bold text-white uppercase cursor-move inline-block whitespace-nowrap pointer-events-auto"
                        style={{
                          textShadow: '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000',
                          position: 'absolute',
                          left: bottomPosition.x,
                          top: bottomPosition.y,
                          cursor: 'move',
                          userSelect: 'none',
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => {
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startPos = { ...bottomPosition };
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            setBottomPosition({
                              x: startPos.x + (moveEvent.clientX - startX),
                              y: startPos.y + (moveEvent.clientY - startY)
                            });
                          };
                          
                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        {bottomText}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <p className="text-zinc-500">
                    Trwa kadrowanie w pełnym ekranie...
                  </p>
                </div>
              )
            ) : (
              <p className="text-zinc-500 flex items-center justify-center h-full">
                Wybierz zdjęcie, aby rozpocząć
              </p>
            )}
          </div>
          {!isCropping && previewUrl && (
            <p className="text-zinc-400 text-sm mt-4 text-center">
              Przeciągnij teksty, aby zmienić ich położenie
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal pełnoekranowy dla kadrowania */}
      {isFullscreenCropping && (
        <div 
          ref={modalRef}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === modalRef.current) {
              handleCancelCropping();
            }
          }}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] overflow-hidden bg-zinc-900/90 p-4 rounded-lg">
            <div className="sticky top-0 right-0 flex justify-end mb-2">
              <button 
                onClick={handleCancelCropping}
                className="text-zinc-400 hover:text-white p-1"
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Do kadrowania"
                  onLoad={onImageLoad}
                  className="max-w-full object-contain"
                  style={{ maxHeight: 'calc(85vh - 120px)' }}
                />
                {crop && (
                  <div 
                    className="absolute border-2 border-blue-500 cursor-move"
                    style={{
                      left: `${crop.x}%`,
                      top: `${crop.y}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`
                    }}
                    onMouseDown={(e) => handleCropDrag(e, 'move')}
                  >
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 top-0 left-0 translate-x-[-50%] translate-y-[-50%] cursor-nwse-resize" 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropDrag(e, 'topLeft');
                      }}
                    />
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 top-0 right-0 translate-x-[50%] translate-y-[-50%] cursor-nesw-resize" 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropDrag(e, 'topRight');
                      }}
                    />
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 bottom-0 left-0 translate-x-[-50%] translate-y-[50%] cursor-nesw-resize" 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropDrag(e, 'bottomLeft');
                      }}
                    />
                    <div 
                      className="absolute w-4 h-4 bg-blue-500 bottom-0 right-0 translate-x-[50%] translate-y-[50%] cursor-nwse-resize" 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropDrag(e, 'bottomRight');
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={handleCompleteCropping}
                  className="bg-green-950/50 text-green-500 border-green-800 hover:bg-green-900/50"
                >
                  Zatwierdź kadrowanie
                </Button>
                <Button 
                  onClick={handleCancelCropping}
                  className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 