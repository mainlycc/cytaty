"use client"

import { useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Camera } from "lucide-react"

interface ProfileFormData {
    name: string
    username: string
    avatar: string
    bio: string
    website: string
    twitter: string
    instagram: string
}

interface ProfileFormProps {
    defaultValues: ProfileFormData
    onSuccess?: () => void
}

export default function ProfileForm({ defaultValues, onSuccess }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ProfileFormData>(defaultValues)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClientComponentClient()

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            // Tworzy tymczasowy URL dla podglądu
            const objectUrl = URL.createObjectURL(file)
            setFormData(prev => ({ ...prev, avatar: objectUrl }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        console.log('Rozpoczynam zapisywanie...')

        try {
            const { data: { user } } = await supabase.auth.getUser()
            console.log('Zalogowany użytkownik:', user)
            
            if (!user) {
                throw new Error('Nie znaleziono użytkownika')
            }

            let avatarUrl = formData.avatar
            console.log('Aktualne dane formularza:', formData)

            // Jeśli wybrano nowy plik avatara, prześlij go do storage
            if (avatarFile) {
                try {
                    console.log('Przesyłanie nowego avatara...')
                    const fileExt = avatarFile.name.split('.').pop()
                    const fileName = `${user.id}-${Math.random()}.${fileExt}`
                    const filePath = `avatars/${fileName}`

                    // Usuń stary plik jeśli istnieje
                    if (formData.avatar) {
                        const oldPath = formData.avatar.split('/').pop()
                        if (oldPath) {
                            await supabase.storage
                                .from('avatars')
                                .remove([`avatars/${oldPath}`])
                        }
                    }

                    // Prześlij nowy plik
                    const { error: uploadError, data } = await supabase.storage
                        .from('avatars')
                        .upload(filePath, avatarFile, {
                            cacheControl: '3600',
                            upsert: true
                        })

                    if (uploadError) {
                        console.error('Szczegóły błędu uploadu:', uploadError)
                        throw uploadError
                    }

                    console.log('Upload success:', data)

                    // Pobierz publiczny URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(filePath)

                    avatarUrl = publicUrl
                    console.log('Nowy URL avatara:', avatarUrl)
                } catch (uploadError) {
                    console.error('Błąd podczas przesyłania pliku:', uploadError)
                    toast.error('Nie udało się przesłać zdjęcia profilowego')
                    // Kontynuuj bez zmiany avatara
                    avatarUrl = formData.avatar
                }
            }

            // Sprawdź czy użytkownik istnieje
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single()
            
            console.log('Sprawdzanie istniejącego użytkownika:', existingUser, checkError)

            const updateData = {
                name: formData.name,
                username: formData.username,
                avatar: avatarUrl,
                bio: formData.bio,
                website: formData.website,
                twitter: formData.twitter,
                instagram: formData.instagram,
                updated_at: new Date().toISOString(),
            }

            console.log('Dane do aktualizacji:', updateData)

            let error;
            if (!existingUser) {
                console.log('Tworzenie nowego profilu...')
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([{
                        id: user.id,
                        email: user.email,
                        ...updateData
                    }])
                error = insertError
                console.log('Wynik tworzenia:', error)
            } else {
                console.log('Aktualizacja istniejącego profilu...')
                const { error: updateError } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', user.id)
                error = updateError
                console.log('Wynik aktualizacji:', error)
            }

            if (error) {
                console.error('Błąd podczas zapisywania:', error)
                throw error
            }

            console.log('Zapisano pomyślnie!')
            toast.success('Profil został zaktualizowany!')
            onSuccess?.()
        } catch (error) {
            console.error('Błąd:', error)
            toast.error('Wystąpił błąd podczas aktualizacji profilu')
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
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8 p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-center">
                <div className="relative group">
                    <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-800/80 cursor-pointer">
                        <AvatarImage
                            src={formData.avatar}
                            className="rounded-full object-cover"
                        />
                        <AvatarFallback className="bg-zinc-900 text-zinc-400">
                            {formData.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                        <div 
                            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={handleAvatarClick}
                        >
                            <Camera className="h-6 w-6 text-white" />
                        </div>
                    </Avatar>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-zinc-400">
                        Display Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                 focus:ring-zinc-800 placeholder:text-zinc-600 text-zinc-100"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="username" className="text-zinc-400">
                        Username
                    </Label>
                    <Input
                        id="username"
                        name="username"
                        placeholder="@username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                 focus:ring-zinc-800 placeholder:text-zinc-600 text-zinc-100"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-zinc-400">
                        Bio
                    </Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        onChange={handleChange}
                        className="resize-none bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                 focus:ring-zinc-800 placeholder:text-zinc-600 text-zinc-100"
                        rows={4}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-400">
                        Social Links
                    </h3>
                    <div className="grid gap-4">
                        {["website", "twitter", "instagram"].map((social) => (
                            <div key={social} className="grid gap-2">
                                <Label htmlFor={social} className="capitalize text-zinc-400">
                                    {social}
                                </Label>
                                <Input
                                    id={social}
                                    name={social}
                                    placeholder={social === "website" ? "https://your-website.com" : "@username"}
                                    value={formData[social as keyof typeof formData]}
                                    onChange={handleChange}
                                    className="bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                             focus:ring-zinc-800 placeholder:text-zinc-600 text-zinc-100"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-800/80 hover:bg-zinc-900/50 text-zinc-400"
                    onClick={() => {
                        setFormData(defaultValues)
                        onSuccess?.()
                    }}
                    disabled={loading}
                >
                    Anuluj
                </Button>
                <Button 
                    type="submit"
                    className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50"
                    disabled={loading}
                >
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
            </div>
        </form>
    )
}
