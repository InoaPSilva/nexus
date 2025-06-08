import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Edit, Grid3X3, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function SideBarTitle({
    profiles,
    currentProfile,
    setCurrentProfile,
}: any) {
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

                {/* Profile Selector */}
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
                    <DropdownMenuContent className="w-56">
                        {Array.isArray(profiles) &&
                            profiles.map((p: any) => (
                                <DropdownMenuItem key={p.id} onClick={() => setCurrentProfile(p.id)}>
                                    <span className="mr-2">{p.icon}</span>
                                    <div className="flex-1">
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.description}</p>
                                    </div>
                                    {p.id === currentProfile && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProfile(p);
                                                setIsEditProfileOpen(true);
                                            }}
                                        >
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsNewProfileOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Profile
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

    );
}
