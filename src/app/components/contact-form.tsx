"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

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
    <Card>
      <CardHeader>
        <CardTitle>Formularz kontaktowy</CardTitle>
        <CardDescription>
          Wypełnij poniższy formularz, aby się z nami skontaktować
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!currentUser && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Imię i nazwisko</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jan Kowalski"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-zinc-900/50 border-zinc-800/80"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jan@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-zinc-900/50 border-zinc-800/80"
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="subject">Temat</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Temat twojej wiadomości"
              required
              value={formData.subject}
              onChange={handleChange}
              className="bg-zinc-900/50 border-zinc-800/80"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Wiadomość</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Treść twojej wiadomości..."
              required
              value={formData.message}
              onChange={handleChange}
              className="min-h-[150px] bg-zinc-900/50 border-zinc-800/80"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
            disabled={loading}
          >
            {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 