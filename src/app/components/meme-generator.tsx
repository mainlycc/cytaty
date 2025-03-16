"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { showToast } from "./toaster-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useTags } from "@/hooks/use-tags"
import { X } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import MemeDisplay from './MemeDisplay'
import Image from 'next/image'

// Definiowanie typu Tag na podstawie typów z bazy danych
type Tag = {
  id: string;
  label: string;
  color?: string;
}

// Własny interfejs kadrowania
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: '%' | 'px';
}

// Dodanie definicji typu dla memów
interface MemeData {
  id: string;
  image_url: string;
  top_text: string | null;
  bottom_text: string | null;
  top_position: { x: number; y: number } | null;
  bottom_position: { x: number; y: number } | null;
  top_text_size: number | null;
  bottom_text_size: number | null;
  top_text_color: string | null;
  bottom_text_color: string | null;
  hashtags: string | string[] | null;
  created_at: string;
  status: string;
  comments: number | string | null;
  likes: number | string | null;
  user_id: string | null;
}

export function MemeGenerator() {
  // Podstawowe stany
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  
  // Pozycje tekstu
  const [topPosition, setTopPosition] = useState<{ x: number; y: number }>({ x: 50, y: 15 });
  const [bottomPosition, setBottomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 85 });
  
  // Wielkość tekstu
  const [topTextSize, setTopTextSize] = useState<number>(3); // domyślna wielkość 3rem
  const [bottomTextSize, setBottomTextSize] = useState<number>(3); // domyślna wielkość 3rem
  
  // Kadrowanie
  const [isFullscreenCropping, setIsFullscreenCropping] = useState(false);
  const [crop, setCrop] = useState<CropArea>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    unit: '%'
  });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  
  // Referencje - poprawione typy
  const topTextRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Inicjalizacja klienta Supabase
  const supabase = createClientComponentClient();

  // Kolory tekstu
  const [topTextColor, setTopTextColor] = useState<string>("#ffffff");
  const [bottomTextColor, setBottomTextColor] = useState<string>("#ffffff");

  // Stan informujący o wysłaniu mema
  const [memSubmitted, setMemSubmitted] = useState(false);

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

  // Obsługa usuwania obrazu
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setCroppedImageUrl("");
    
    // Resetowanie kadrowania
    setCrop({
      x: 10,
      y: 10,
      width: 80,
      height: 80,
      unit: '%'
    });
  };

  // Obsługa tagów
  const { addTag, removeTag, hasReachedMax } = useTags({
    onChange: (newTags) => {
      console.log("Zaktualizowano tagi:", newTags);
      setTags(newTags);
    },
    maxTags: 5,
  });
  const [tagInput, setTagInput] = useState<string>("");
  
  const handleAddTag = () => {
    if (!tagInput.trim() || hasReachedMax) return;
    
    addTag({
      id: crypto.randomUUID(),
      label: tagInput.trim(),
    });
    
    setTagInput("");
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Obsługa kadrowania
  const handleStartCropping = () => {
    setIsFullscreenCropping(true);
  };

  const handleCancelCropping = () => {
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

  // Dodanie obsługi zmiany rozmiaru okna
  useEffect(() => {
    const handleResize = () => {
      // Upewniamy się, że tekst pozostaje widoczny po zmianie rozmiaru okna
      if (topTextRef.current && bottomTextRef.current) {
        // Aktualizacja pozycji nie jest potrzebna, jeśli używamy wartości procentowych
        // To wymusza ponowne renderowanie
        setTopPosition(prev => ({ ...prev }));
        setBottomPosition(prev => ({ ...prev }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funkcja zapisywania mema - dostosowana do nowej struktury tabeli
  const handleSaveMeme = async () => {
    try {
      if (!selectedImage) {
        showToast.error("Najpierw wybierz zdjęcie");
        return;
      }
      
      // Dodaj komunikat o rozpoczęciu procesu zapisywania
      showToast.info("Trwa zapisywanie mema...");
      
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
      
      // Przygotowanie tablicy tagów
      const formattedTags = tags.map(tag => tag.label);
      
      // Zapisz dane mema w bazie danych - zgodnie z nową strukturą tabeli
      const { error: insertError } = await supabase
        .from('memes')
        .insert({
          image_url: publicUrl,
          top_text: topText || null,
          bottom_text: bottomText || null,
          
          // Pozycje jako obiekty JSON
          top_position: topText ? { x: topPosition.x, y: topPosition.y } : null,
          bottom_position: bottomText ? { x: bottomPosition.x, y: bottomPosition.y } : null,
          
          // Rozmiar i kolor tekstu
          top_text_size: topTextSize,
          bottom_text_size: bottomTextSize,
          top_text_color: topTextColor,
          bottom_text_color: bottomTextColor,
          
          // Hashtags jako tablica
          hashtags: formattedTags.length > 0 ? formattedTags : null,
          
          // Pozostałe pola
          created_at: new Date().toISOString(),
          status: 'pending',
          comments: 0,
          likes: 0,
        });
      
      if (insertError) {
        showToast.error(`Błąd podczas zapisywania mema: ${insertError.message}`);
        return;
      }
      
      // Ustaw status wysłania mema
      setMemSubmitted(true);
      
      // Wyczyść formularz po pomyślnym zapisie
      setTopText("");
      setBottomText("");
      setTopTextSize(3);
      setBottomTextSize(3);
      setTopTextColor("#ffffff");
      setBottomTextColor("#ffffff");
      setTagInput("");
      
      showToast.success("Mem został zapisany i czeka na zatwierdzenie");
    } catch (error) {
      console.error("Błąd podczas zapisywania mema:", error);
      showToast.error("Wystąpił błąd podczas zapisywania mema");
      alert("Wystąpił błąd podczas zapisywania mema: " + (error instanceof Error ? error.message : String(error)));
    }
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
              {!selectedImage ? (
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-zinc-800/60 border-zinc-700 text-zinc-300"
                />
              ) : (
                <div className="flex gap-2 w-full">
                  <div className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-md px-3 py-2 text-zinc-300 text-sm truncate">
                    {selectedImage.name}
                  </div>
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    className="bg-red-900/80 border-red-800 text-zinc-200 hover:bg-red-800"
                    size="sm"
                  >
                    Usuń
                  </Button>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleStartCropping}
                  variant="outline"
                  className="bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700/70 hover:text-zinc-100 w-full"
                >
                  Kadruj
                </Button>
              </div>
            )}
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
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="topTextSize" className="text-zinc-300 mb-1 block text-xs">
                  Wielkość tekstu
                </Label>
                <Select
                  value={topTextSize.toString()}
                  onValueChange={(value) => setTopTextSize(parseFloat(value))}
                >
                  <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Wybierz rozmiar" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
                    <SelectItem value="1">1 rem</SelectItem>
                    <SelectItem value="1.5">1.5 rem</SelectItem>
                    <SelectItem value="2">2 rem</SelectItem>
                    <SelectItem value="2.5">2.5 rem</SelectItem>
                    <SelectItem value="3">3 rem</SelectItem>
                    <SelectItem value="3.5">3.5 rem</SelectItem>
                    <SelectItem value="4">4 rem</SelectItem>
                    <SelectItem value="4.5">4.5 rem</SelectItem>
                    <SelectItem value="5">5 rem</SelectItem>
                    <SelectItem value="5.5">5.5 rem</SelectItem>
                    <SelectItem value="6">6 rem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="topTextColor" className="text-zinc-300 mb-1 block text-xs">
                  Kolor tekstu
                </Label>
                <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-md px-3 py-2 h-10">
                  <input
                    type="color"
                    id="topTextColor"
                    value={topTextColor}
                    onChange={(e) => setTopTextColor(e.target.value)}
                    className="w-6 h-6 rounded overflow-hidden"
                  />
                  <span className="text-zinc-300 text-sm">{topTextColor}</span>
                </div>
              </div>
            </div>
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
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label htmlFor="bottomTextSize" className="text-zinc-300 mb-1 block text-xs">
                  Wielkość tekstu
                </Label>
                <Select
                  value={bottomTextSize.toString()}
                  onValueChange={(value) => setBottomTextSize(parseFloat(value))}
                >
                  <SelectTrigger className="bg-zinc-800/60 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Wybierz rozmiar" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-300">
                    <SelectItem value="1">1 rem</SelectItem>
                    <SelectItem value="1.5">1.5 rem</SelectItem>
                    <SelectItem value="2">2 rem</SelectItem>
                    <SelectItem value="2.5">2.5 rem</SelectItem>
                    <SelectItem value="3">3 rem</SelectItem>
                    <SelectItem value="3.5">3.5 rem</SelectItem>
                    <SelectItem value="4">4 rem</SelectItem>
                    <SelectItem value="4.5">4.5 rem</SelectItem>
                    <SelectItem value="5">5 rem</SelectItem>
                    <SelectItem value="5.5">5.5 rem</SelectItem>
                    <SelectItem value="6">6 rem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bottomTextColor" className="text-zinc-300 mb-1 block text-xs">
                  Kolor tekstu
                </Label>
                <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-md px-3 py-2 h-10">
                  <input
                    type="color"
                    id="bottomTextColor"
                    value={bottomTextColor}
                    onChange={(e) => setBottomTextColor(e.target.value)}
                    className="w-6 h-6 rounded overflow-hidden"
                  />
                  <span className="text-zinc-300 text-sm">{bottomTextColor}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-zinc-300 mb-2 block text-sm">
              Tagi
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="bg-zinc-800/60 border-zinc-700 text-zinc-300 flex-1"
                placeholder="Dodaj tag i naciśnij Enter"
                disabled={hasReachedMax}
                aria-label="Dodaj tag"
              />
              <Button
                onClick={handleAddTag}
                variant="outline"
                className="bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                disabled={!tagInput.trim() || hasReachedMax}
                aria-label="Dodaj tag"
              >
                Dodaj
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${tag.color}`}
                  >
                    <span>{tag.label}</span>
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="rounded-full h-4 w-4 flex items-center justify-center hover:bg-black/20"
                      aria-label={`Usuń tag ${tag.label}`}
                      tabIndex={0}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {hasReachedMax && (
              <p className="text-xs text-amber-400 mt-2">
                Maksymalna liczba tagów została osiągnięta (5)
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleSaveMeme}
            className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-zinc-100"
            disabled={memSubmitted || !previewUrl || (!topText && !bottomText)}
          >
            {memSubmitted ? "Zapisywanie..." : "Wyślij mem do zatwierdzenia"}
          </Button>
          
          {/* Komunikat o wysłanym memie */}
          {memSubmitted && (
            <Alert className="mt-4 bg-green-950/30 border-green-800 text-green-400">
              <AlertTitle className="text-green-300">Mem wysłany pomyślnie!</AlertTitle>
              <AlertDescription>
                <p>Twój mem został wysłany do zatwierdzenia. Po akceptacji przez administratora będzie widoczny dla wszystkich.</p>
                <Button 
                  variant="outline" 
                  className="mt-2 bg-green-950/50 border-green-700 text-green-400 hover:bg-green-800/30"
                  onClick={() => setMemSubmitted(false)}
                >
                  Utwórz kolejny mem
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Podgląd */}
      <div className="relative">
        {/* Alert nad podglądem, gdy mem został wysłany */}
        {memSubmitted && (
          <Alert className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-md border-green-800 text-green-300 p-8">
            <div className="text-center">
              <AlertTitle className="text-4xl font-bold mb-4">Sukces!</AlertTitle>
              <AlertDescription className="text-xl mb-6">
                Twój mem został wysłany do zatwierdzenia i wkrótce pojawi się w galerii.
              </AlertDescription>
              <Button 
                className="bg-green-800 hover:bg-green-700 text-white"
                onClick={() => {
                  setMemSubmitted(false);
                  setSelectedImage(null);
                  setPreviewUrl("");
                  setCroppedImageUrl("");
                }}
              >
                Utwórz nowy mem
              </Button>
            </div>
          </Alert>
        )}
        
        {previewUrl ? (
          <MemeDisplay
            imageUrl={croppedImageUrl || previewUrl}
            topText={topText}
            bottomText={bottomText}
            topPosition={topPosition}
            bottomPosition={bottomPosition}
            topTextSize={topTextSize}
            bottomTextSize={bottomTextSize}
            topTextColor={topTextColor}
            bottomTextColor={bottomTextColor}
            onTopPositionChange={setTopPosition}
            onBottomPositionChange={setBottomPosition}
            editable={true}
          />
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
                <Image
                  ref={imageRef as any}
                  src={previewUrl}
                  alt="Do kadrowania"
                  onLoad={onImageLoad}
                  className="max-w-full object-contain"
                  style={{ maxHeight: 'calc(85vh - 120px)' }}
                  width={800}
                  height={600}
                  unoptimized={true}
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