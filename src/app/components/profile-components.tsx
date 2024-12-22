"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { Edit2 } from "lucide-react"
import ProfileForm from "./profile-form"

interface UserData {
  name?: string
  username?: string
  avatar?: string
  bio?: string
  website?: string
  twitter?: string
  instagram?: string
}

interface ProfileFormData {
  name: string
  username: string
  avatar: string
  bio: string
  website: string
  twitter: string
  instagram: string
}

interface ProfileViewProps {
  userData: UserData | null
  onEditAction: () => void
}

// Komponent do wyświetlania profilu
export const ProfileView = ({ userData, onEditAction }: ProfileViewProps) => {
  return (
    <div className="w-full max-w-2xl space-y-8 p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-zinc-800/80">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEditAction}
          className="text-zinc-400 hover:text-zinc-100"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edytuj profil
        </Button>
      </div>

      <div className="space-y-6">
        {/* Avatar i podstawowe informacje */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full border-2 border-zinc-800/80 overflow-hidden">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-zinc-400 text-xl">
                {userData?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-zinc-100">
              {userData?.name || "Brak nazwy"}
            </h2>
            <p className="text-sm text-zinc-400">@{userData?.username || "username"}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">Bio</h3>
          <p className="text-zinc-300">{userData?.bio || "Brak opisu"}</p>
        </div>

        {/* Linki społecznościowe */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-400">Social Links</h3>
          <div className="space-y-2">
            {userData?.website && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-400">Website:</span>
                <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100">
                  {userData.website}
                </a>
              </div>
            )}
            {userData?.twitter && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-400">Twitter:</span>
                <a href={`https://twitter.com/${userData.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100">
                  @{userData.twitter}
                </a>
              </div>
            )}
            {userData?.instagram && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-400">Instagram:</span>
                <a href={`https://instagram.com/${userData.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100">
                  @{userData.instagram}
                </a>
              </div>
            )}
            {!userData?.website && !userData?.twitter && !userData?.instagram && (
              <p className="text-zinc-400">Brak dodanych linków społecznościowych</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ClientProfileWrapperProps {
  userData: UserData | null
  defaultValues: ProfileFormData
}

// Wrapper do obsługi stanu edycji
export function ClientProfileWrapper({ 
  userData, 
  defaultValues 
}: ClientProfileWrapperProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <ProfileForm
        defaultValues={defaultValues}
        onSuccess={() => setIsEditing(false)}
      />
    )
  }

  return (
    <ProfileView 
      userData={userData} 
      onEditAction={() => setIsEditing(true)} 
    />
  )
}
