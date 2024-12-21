import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfileFormProps {
    defaultValues?: {
        name: string;
        username: string;
        avatar: string;
        bio: string;
        location?: string;
        website?: string;
        twitter?: string;
        instagram?: string;
    };
}

export default function ProfileForm({ defaultValues }: ProfileFormProps) {
    return (
        <div className="w-full max-w-2xl space-y-8 p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-800/80">
                    <AvatarImage
                        src={defaultValues?.avatar}
                        className="rounded-full object-cover"
                    />
                    <AvatarFallback className="bg-zinc-900 text-zinc-400">
                        SC
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-zinc-400">
                        Display Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="Your full name"
                        defaultValue={defaultValues?.name}
                        autoComplete="off"
                        className="bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                 focus:ring-zinc-800 placeholder:text-zinc-600"
                    />
                </div>

                <div className="grid gap-2">
                    <Label
                        htmlFor="username"
                        className="text-zinc-700 dark:text-zinc-300"
                    >
                        Username
                    </Label>
                    <Input
                        id="username"
                        placeholder="@username"
                        defaultValue={defaultValues?.username}
                        autoComplete="off"
                        className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                </div>

                <div className="grid gap-2">
                    <Label
                        htmlFor="bio"
                        className="text-zinc-700 dark:text-zinc-300"
                    >
                        Bio
                    </Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        className="resize-none bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        rows={4}
                        defaultValue={defaultValues?.bio}
                        autoComplete="off"
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
                                    placeholder={social === "website" ? "https://your-website.com" : "@username"}
                                    defaultValue={defaultValues?.[social as keyof typeof defaultValues]}
                                    autoComplete="off"
                                    className="bg-zinc-900/50 border-zinc-800/80 focus:border-zinc-700
                                             focus:ring-zinc-800 placeholder:text-zinc-600"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    className="border-zinc-800/80 hover:bg-zinc-900/50 text-zinc-400"
                >
                    Cancel
                </Button>
                <Button className="bg-red-950/50 text-red-500 border-red-800 hover:bg-red-900/50">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
