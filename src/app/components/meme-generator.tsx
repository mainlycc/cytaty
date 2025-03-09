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
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  
  // Referencje
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Inicjalizacja klienta Supabase
  const supabase = createClientComponentClient();

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
      
      if (!imageRef.current) return;
      
      const imageRect = imageRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Konwertuj piksele na procenty
      const deltaXPercent = (deltaX / imageRect.width) * 100;
      const deltaYPercent = (deltaY / imageRect.height) * 100;
      
      const newCrop = { ...startCrop };
      
      switch (mode) {
        case 'move':
          // Ograniczenie ruchu do granic obrazu
          const maxX = 100 - newCrop.width;
          const maxY = 100 - newCrop.height;
          
          newCrop.x = clamp(startCrop.x + deltaXPercent, 0, maxX);
          newCrop.y = clamp(startCrop.y + deltaYPercent, 0, maxY);
          break;
        case 'topLeft':
          const maxDeltaWidthTopLeft = Math.min(startCrop.width - 10, startCrop.x);
          const maxDeltaHeightTopLeft = Math.min(startCrop.height - 10, startCrop.y);
          
          const deltaWidthTopLeft = clamp(deltaXPercent, -maxDeltaWidthTopLeft, startCrop.width - 10);
          const deltaHeightTopLeft = clamp(deltaYPercent, -maxDeltaHeightTopLeft, startCrop.height - 10);
          
          newCrop.x = startCrop.x - deltaWidthTopLeft;
          newCrop.y = startCrop.y - deltaHeightTopLeft;
          newCrop.width = startCrop.width + deltaWidthTopLeft;
          newCrop.height = startCrop.height + deltaHeightTopLeft;
          break;
        case 'topRight':
          const maxDeltaWidthTopRight = 100 - (startCrop.x + startCrop.width);
          const maxDeltaHeightTopRight = Math.min(startCrop.height - 10, startCrop.y);
          
          const deltaWidthTopRight = clamp(deltaXPercent, -(startCrop.width - 10), maxDeltaWidthTopRight);
          const deltaHeightTopRight = clamp(deltaYPercent, -maxDeltaHeightTopRight, startCrop.height - 10);
          
          newCrop.y = startCrop.y - deltaHeightTopRight;
          newCrop.width = startCrop.width + deltaWidthTopRight;
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
  const onImageLoad = () => {
    // Ustaw crop na początku na cały obraz
    const initialCrop = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      unit: '%' as const
    };
    
    setCrop(initialCrop);
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
      
      // Konwertuj obraz do formatu base64 lub blob do przesłania
      const imageUrl = croppedImageUrl || previewUrl;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Utwórz unikalną nazwę pliku
      const fileName = `meme_${Date.now()}.${selectedImage.name.split('.').pop()}`;
      
      // Prześlij obraz do Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('memes')
        .upload(fileName, blob);
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Pobierz publiczny URL obrazu
      const { data: { publicUrl } } = supabase
        .storage
        .from('memes')
        .getPublicUrl(fileName);
      
      // Zapisz dane mema w bazie danych
      const { error: insertError } = await supabase
        .from('memes')
        .insert({
          image_url: publicUrl,
          top_text: topText,
          bottom_text: bottomText,
          tags: tags,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      showToast.success("Mem został zapisany!");
      
      // Opcjonalnie: wyczyść formularz po zapisaniu
      setTopText("");
      setBottomText("");
      setTags([]);
      setSelectedImage(null);
      setPreviewUrl("");
      setCroppedImageUrl("");
      
    } catch (error) {
      console.error("Błąd podczas zapisywania mema:", error);
      showToast.error("Wystąpił błąd podczas zapisywania mema");
    }
  };

  // Funkcja obsługi przeciągania tekstu
  const handleTextDragStart = (
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  ) => {
    return () => {
      const handleMouseMove = (moveEvent: MouseEvent) => {
        setPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
      {/* Panel kontrolny */}
      <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80 h-fit">
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="image" className="text-zinc-300 mb-2 block text-sm">
              Wybierz zdjęcie
            </Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-zinc-800/60 border-zinc-700 text-zinc-300"
              />
              {previewUrl && (
                <Button
                  onClick={handleStartCropping}
                  variant="outline"
                  className="bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700/70 hover:text-zinc-100"
                >
                  Kadruj
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="topText" className="text-zinc-300 mb-2 block text-sm">
              Tekst górny
            </Label>
            <Input
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="bg-zinc-800/60 border-zinc-700 text-zinc-300"
              placeholder="Tekst górny"
            />
          </div>
          
          <div>
            <Label htmlFor="bottomText" className="text-zinc-300 mb-2 block text-sm">
              Tekst dolny
            </Label>
            <Input
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="bg-zinc-800/60 border-zinc-700 text-zinc-300"
              placeholder="Tekst dolny"
            />
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-zinc-300 mb-2 block text-sm">
              Tagi (naciśnij Enter, aby dodać)
            </Label>
            <Input
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-zinc-800/60 border-zinc-700 text-zinc-300"
              placeholder="Dodaj tagi"
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="text-zinc-400 hover:text-zinc-200"
                      aria-label={`Usuń tag ${tag}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSaveMeme}
            className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-zinc-100"
          >
            Zapisz mem
          </Button>
        </CardContent>
      </Card>

      {/* Podgląd */}
      <div className="relative">
        {previewUrl ? (
          <div className="relative bg-black/40 rounded-md overflow-hidden backdrop-blur-sm h-[500px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={croppedImageUrl || previewUrl}
                alt="Podgląd mema"
                className="max-w-full max-h-full object-contain"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={true} // Dla dynamicznie generowanych obrazów
              />
              
              {!isCropping && (
                <>
                  <div
                    ref={topTextRef}
                    className="absolute text-white text-3xl font-bold uppercase text-center px-4 py-2 cursor-move pointer-events-auto select-none"
                    style={{
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                      left: `${topPosition.x}px`,
                      top: `${topPosition.y}px`,
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '80%'
                    }}
                    onMouseDown={handleTextDragStart(setTopPosition)}
                    tabIndex={0}
                    aria-label="Przeciągnij tekst górny"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTextDragStart(setTopPosition)();
                      }
                    }}
                  >
                    {topText}
                  </div>
                  
                  <div
                    ref={bottomTextRef}
                    className="absolute text-white text-3xl font-bold uppercase text-center px-4 py-2 cursor-move pointer-events-auto select-none"
                    style={{
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                      left: `${bottomPosition.x}px`,
                      top: `${bottomPosition.y}px`,
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '80%'
                    }}
                    onMouseDown={handleTextDragStart(setBottomPosition)}
                    tabIndex={0}
                    aria-label="Przeciągnij tekst dolny"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTextDragStart(setBottomPosition)();
                      }
                    }}
                  >
                    {bottomText}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-black/40 rounded-md h-[500px] flex items-center justify-center backdrop-blur-sm">
            <p className="text-zinc-500">Wybierz zdjęcie, aby rozpocząć</p>
          </div>
        )}
      </div>

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
                tabIndex={0}
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