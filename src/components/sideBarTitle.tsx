import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, EditIcon, Grid3X3, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function SideBarTitle({
    currentProfile,
    setCurrentProfile,
}: any) {
    // API CALL <GET PROFILES>
    const [profiles, setProfiles] = useState<any[]>([
        {
            id: "personal",
            name: "Personal",
            icon: "🏠",
            color: "blue",
            description: "Personal workspace",
            windows: [],
            widgets: [],
            folders: [],
            backgroundStyle: "from-blue-100 to-purple-100",
            backgroundType: "gradient",
            uploadedFiles: [],
        },
        {
            id: "work",
            name: "Work",
            icon: "💼",
            color: "green",
            description: "Work projects and tasks",
            windows: [],
            widgets: [],
            folders: [],
            backgroundStyle: "from-green-100 to-blue-100",
            backgroundType: "gradient",
            uploadedFiles: [],
        },
        {
            id: "learning",
            name: "Learning",
            icon: "📚",
            color: "purple",
            description: "Study and research",
            windows: [],
            widgets: [],
            folders: [],
            backgroundStyle: "from-purple-100 to-pink-100",
            backgroundType: "gradient",
            uploadedFiles: [],
        },
    ])

    const current = profiles.find((p: any) => p.id === currentProfile);

    const [editingProfile, setEditingProfile] = useState<any>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isNewProfileOpen, setIsNewProfileOpen] = useState(false);


    return (
        <div className="p-4 border-b">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Grid3X3 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h1 className="font-bold text-lg">Nexus</h1>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center gap-2">
                                <span>{current?.icon}</span>
                                <span className="text-sm">{current?.name}</span>
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-white p-4 ">
                        {Array.isArray(profiles) &&
                            profiles.map((p: any) => (
                                <DropdownMenuItem className="flex items-center gap-1 p-2 w-full "
                                    key={p.id} onClick={() => setCurrentProfile(p.id)}>
                                    <span className="text-xl">{p.icon}</span>
                                    <div className="flex flex-col">
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.description}</p>
                                    </div>
                                    {p.id === currentProfile && (
                                        <Button
                                            variant="default"
                                            size="md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProfile(p);
                                                setIsEditProfileOpen(true);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4 text-gray-600" />
                                        </Button>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center" onClick={() => setIsNewProfileOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Profile
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

    );
}
