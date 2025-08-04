import { Magnet, Minimize, Pin, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useMemo, useState } from "react";
import { safePosition, safeSize } from "@/utils/safeFunctions";

export function ActiveWindow() {
    const [currentProfile] = useState("personal")

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
    const profile = useMemo(
        () => profiles.find((p) => p.id === currentProfile) || profiles[0],
        [profiles, currentProfile],
    )
    const windows = useMemo(() => profile?.windows || [], [profile])


    const updateWindow = useCallback(
        (id: string, updates: Partial<any>) => {
            // Ensure size values are valid numbers
            if (updates.size) {
                updates.size = safeSize(updates.size, 300, 200)
            }

            // Ensure position values are valid numbers
            if (updates.position) {
                updates.position = safePosition(updates.position)
            }

            setProfiles((prev) =>
                prev.map((p) =>
                    p.id === currentProfile
                        ? {
                            ...p,
                            windows: p.windows.map((window: any) => (window.id === id ? { ...window, ...updates } : window)),
                        }
                        : p,
                ),
            )
        },
        [currentProfile],
    )

    return (


        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">ACTIVE WINDOWS</p>
            {windows.map((window: any) => (
                <div
                    key={window.id}
                    className={`flex items-center gap-2 p-1 rounded text-xs cursor-pointer hover:bg-muted ${window.isMinimized ? "opacity-60" : ""
                        }`}
                    onClick={() => updateWindow(window.id, { isMinimized: false, zIndex: Date.now() })}
                >
                    <div className={`w-2 h-2 rounded-full ${window.isMinimized ? "bg-yellow-500" : "bg-green-500"}`} />
                    <span className="flex-1 truncate">{window.title}</span>
                    {window.isSnapped && <Magnet className="w-2 h-2 text-blue-500" />}
                    {window.isPinned && <Pin className="w-2 h-2 text-blue-500" />}
                    {window.isMiniMode && <Minimize className="w-2 h-2 text-purple-500" />}
                    <span className="text-xs text-muted-foreground">{window.isMinimized ? "Min" : "Open"}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                            // e.stopPropagation()
                            // closeWindow(window.id)
                        }}
                    >
                        <X className="w-2 h-2" />
                    </Button>
                </div>
            ))}
        </div>
    )
}