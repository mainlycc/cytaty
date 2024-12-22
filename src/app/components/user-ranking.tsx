import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card } from "./ui/card"
import { Trophy } from "lucide-react"

interface UserRankingProps {
  users: Array<{
    id: string
    name?: string
    username?: string
    avatar?: string
    points?: number
  }>
}

export function UserRanking({ users }: UserRankingProps) {
  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <Card key={user.id} className="bg-black/50 backdrop-blur-sm border-zinc-800/80">
          <div className="p-4 flex items-center gap-4">
            <div className="flex items-center justify-center w-8">
              {index < 3 ? (
                <Trophy className={`h-6 w-6 ${
                  index === 0 ? "text-yellow-500" :
                  index === 1 ? "text-zinc-400" :
                  "text-amber-800"
                }`} />
              ) : (
                <span className="text-zinc-400 font-medium">{index + 1}</span>
              )}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-medium text-zinc-100">{user.name}</p>
              <p className="text-sm text-zinc-400">@{user.username}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-zinc-400">Punkty</p>
              <p className="text-lg font-bold text-zinc-100">{user.points || 0}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 