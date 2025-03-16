"use client"
import { Card } from "./ui/card"
import Image from "next/image"

interface MemeTemplatesProps {
  onSelect: (templateUrl: string) => void
}

export default function MemeTemplates({ onSelect }: MemeTemplatesProps) {
  const templates = [
    {
      id: 1,
      name: "Drake Hotline Bling",
      url: "https://i.imgflip.com/30b1gx.jpg",
    },
    {
      id: 2,
      name: "Two Buttons",
      url: "https://i.imgflip.com/1g8my4.jpg",
    },
    {
      id: 3,
      name: "Distracted Boyfriend",
      url: "https://i.imgflip.com/1ur9b0.jpg",
    },
    {
      id: 4,
      name: "Running Away Balloon",
      url: "https://i.imgflip.com/261o3j.jpg",
    },
    {
      id: 5,
      name: "Buff Doge vs. Cheems",
      url: "https://i.imgflip.com/43a45p.png",
    },
    {
      id: 6,
      name: "Change My Mind",
      url: "https://i.imgflip.com/24y43o.jpg",
    },
    {
      id: 7,
      name: "Left Exit 12 Off Ramp",
      url: "https://i.imgflip.com/22bdq6.jpg",
    },
    {
      id: 8,
      name: "UNO Draw 25 Cards",
      url: "https://i.imgflip.com/3lmzyx.jpg",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => onSelect(template.url)}
        >
          <div className="relative aspect-square">
            <Image
              src={template.url || "/placeholder.svg"}
              alt={template.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </Card>
      ))}
    </div>
  )
} 