"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent } from "./ui/card"
import { toast } from "sonner"

interface ContactFormProps {
  currentUser?: {
    email: string
    name?: string
  } | null
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm({ currentUser }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Tutaj logika wysyłania emaila
      console.log('Wysyłanie wiadomości:', formData)
      
      toast.success('Wiadomość została wysłana!')
      setFormData(prev => ({
        ...prev,
        subject: "",
        message: ""
      }))
    } catch (error) {
      console.error('Błąd:', error)
      toast.error('Wystąpił błąd podczas wysyłania wiadomości')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!currentUser && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-zinc-400">
                  Imię i nazwisko
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jan Kowalski"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-400">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jan@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="subject" className="text-zinc-400">
              Temat
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Temat twojej wiadomości"
              required
              value={formData.subject}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message" className="text-zinc-400">
              Wiadomość
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Treść twojej wiadomości..."
              required
              value={formData.message}
              onChange={handleChange}
              className="min-h-[150px] bg-zinc-900/50 border-zinc-800/80 text-zinc-100 placeholder:text-zinc-500 resize-none"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-950/50 text-red-500 border border-red-800 hover:bg-red-900/50 transition-colors"
            disabled={loading}
          >
            {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 