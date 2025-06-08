import { Button } from "@/components/ui/button"
import { ArrowLeftRight } from "lucide-react"
import { useMemo, useState } from "react";

export function WorkspaceArea() {
    const [transferItems, setTransferItems] = useState<{ windows: any[]; widgets: any[] }>()
    const [currentProfile, setCurrentProfile] = useState("personal")
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)

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

    const profile = useMemo(() => profiles.find((p) => p.id === currentProfile) || profiles[0], [profiles, currentProfile])
    const windows = useMemo(() => profile?.windows || [], [profile])
    const widgets = useMemo(() => profile?.widgets || [], [profile])
    const folders = useMemo(() => profile?.folders || [], [profile])

    return (
        <div className="flex-1 relative overflow-hidden h-screen">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                {/* Gradient or other background */}
                {profile.backgroundType === "gradient" && (
                    <div className={`w-full h-full bg-gradient-to-br ${profile.backgroundStyle}`} />
                )}
                {profile.backgroundType === "image" && profile.backgroundMedia && (
                    <img
                        src={profile.backgroundMedia || "/placeholder.svg"}
                        alt="Desktop background"
                        className="w-full h-full object-cover"
                    />
                )}
                {profile.backgroundType === "video" && profile.backgroundMedia && (
                    <video
                        src={profile.backgroundMedia}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                        mixBlendMode: "multiply",
                    }}
                />
            </div>

            {/* Foreground Content */}
            <div className="relative z-20 flex flex-col w-full h-full">
                {/* Header with Transfer Button */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{profile.icon}</span>
                            <div>
                                <h3 className="font-medium text-sm">{profile.name}</h3>
                                <p className="text-xs text-muted-foreground">{profile.description}</p>
                            </div>
                        </div>
                    </div>

                    {(windows.length > 0 || widgets.length > 0) && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/80 backdrop-blur-sm"
                            onClick={() => {
                                setTransferItems({ windows: profile.windows, widgets: profile.widgets })
                                setIsTransferDialogOpen(true)
                            }}
                        >
                            <ArrowLeftRight className="w-4 h-4 mr-2" />
                            Transfer All
                        </Button>
                    )}
                </div>

            </div>
        </div>
    )
}
