import { BarChart3, BookOpen, CheckSquare, Download, Eye, FileText, Globe, Grid3X3, ImageIcon, Move, Music, Play, SkipBack, SkipForward, Trash, Video } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { FunctionComponent, ReactNode, useCallback, useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Badge } from "./ui/badge"

const DraggableCard: FunctionComponent<{
    children: ReactNode
    onDragStart?: (e: React.DragEvent) => void
    className?: string
}> = ({ children, onDragStart, className = "" }) => {
    return (
        <div draggable onDragStart={onDragStart} className={`cursor-move hover:shadow-md transition-shadow ${className}`}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Move className="w-3 h-3 text-muted-foreground" />
            </div>
            {children}
        </div>
    )
}

const PageContent = ({
    window,
    openFilePreviewWindow = () => { }
}: {
    window: any,
    currentTrack?: { name: string, isPlaying: boolean, progress: number, duration: number },
    openFilePreviewWindow?: (file: any) => void
}) => {
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
    const [currentProfile, setCurrentProfile] = useState("personal")
    const [notes, setNotes] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [showTransferZone, setShowTransferZone] = useState(false)
    const profile = useMemo(
        () => profiles.find((p) => p.id === currentProfile) || profiles[0],
        [profiles, currentProfile],
    )
    const updateFolder = useCallback(
        (id: string, updates: Partial<any>) => {
            setProfiles((prev) =>
                prev.map((p) =>
                    p.id === currentProfile
                        ? {
                            ...p,
                            folders: p.folders.map((folder: any) => (folder.id === id ? { ...folder, ...updates } : folder)),
                        }
                        : p,
                ),
            )
        },
        [currentProfile],
    )


    const handleCardDragStart = useCallback((e: React.DragEvent, item: any, type: string) => {
        try {
            const data = JSON.stringify({ item, type })
            e.dataTransfer.setData("application/json", data)
            e.dataTransfer.setData("text/plain", `${type}: ${item.title || "Item"}`)
            setShowTransferZone(true)
        } catch (error) {
            console.error("Error starting drag operation:", error)
        }
    }, [])
    const deleteFile = useCallback(
        (fileId: string) => {
            setProfiles((prev) =>
                prev.map((p) =>
                    p.id === currentProfile ? { ...p, uploadedFiles: p.uploadedFiles.filter((f: any) => f.id !== fileId) } : p,
                ),
            )
        },
        [currentProfile],
    )

    if (!window || !window.type) return <div className="p-3">Page missing or invalid</div>

    switch (window.type) {
        case "file-preview":
            const file = window.content as any
            return (
                <div className="h-full overflow-hidden">
                    {file?.type?.startsWith("image/") ? (
                        <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-contain" />
                    ) : file?.type?.startsWith("video/") ? (
                        <video
                            src={file.url}
                            controls
                            className="w-full h-full"
                            style={{ maxHeight: "100%" }}
                            preload="metadata"
                        />
                    ) : file?.type?.startsWith("audio/") ? (
                        <div className="flex items-center justify-center h-full">
                            <audio src={file.url} controls className="w-full max-w-md" />
                        </div>
                    ) : (file?.type && file.type.startsWith("text/")) ||
                        (file?.name && (file.name.endsWith(".md") || file.name.endsWith(".txt"))) ? (
                        <div className="h-full p-4 overflow-y-auto bg-white">
                            <iframe
                                src={file.url}
                                className="w-full h-full border-0"
                                title={file.name}
                                sandbox="allow-same-origin"
                            />
                        </div>
                    ) : file?.name && (file.name.endsWith(".doc") || file.name.endsWith(".docx")) ? (
                        <iframe
                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
                            className="w-full h-full border-0"
                            title={file.name}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">Preview not available for this file type</p>
                                <Button
                                    className="mt-4"
                                    onClick={() => {
                                        const link = document.createElement("a")
                                        link.href = file.url
                                        link.download = file.name
                                        link.click()
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )

        case "browser":
            return (
                <div className="p-2 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium truncate">Browser</span>
                    </div>
                    <input
                        type="text"
                        defaultValue={window.content?.url ?? "https://example.com"}
                        placeholder="Enter URL"
                        className="text-xs px-2 py-1 border rounded w-full mb-2"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const newUrl = (e.target as HTMLInputElement).value
                                if (newUrl && window.onUpdateContent) {
                                    window.onUpdateContent({ url: newUrl })
                                }
                            }
                        }}
                    />
                    <div className="flex-1 border rounded overflow-hidden">
                        <iframe
                            src={window.content?.url ?? "https://example.com"}
                            title="Webpage"
                            className="w-full h-full border-none"
                        />
                    </div>
                </div>
            )

        case "folder":
            const folder = window.content as any
            return (
                <div className="h-full overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold">{folder.name}</h3>
                        <p className="text-sm text-muted-foreground">{folder.items.length} items</p>
                    </div>
                    <div className="p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {folder.items.map((item: any) => (
                                <Card
                                    key={item.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => {
                                        if ("type" in item && item.type) {
                                            openFilePreviewWindow(item as any)
                                        } else if ("content" in item) {
                                            const widgetItem = item as any
                                            const newWidget: any = {
                                                ...widgetItem,
                                                id: Date.now().toString(),
                                                position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                                                zIndex: Date.now(),
                                                parentFolderId: undefined,
                                            }
                                            setProfiles((prev: any) =>
                                                prev.map((p: any) =>
                                                    p.id === currentProfile ? { ...p, widgets: [...p.widgets, newWidget] } : p,
                                                ),
                                            )

                                            updateFolder(folder.id, {
                                                items: folder.items.filter((i: any) => i.id !== item.id),
                                            })
                                        }
                                    }}
                                >
                                    <CardContent className="p-3">
                                        <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                                            {"type" in item && item.type ? (
                                                // File item
                                                item.type.startsWith("image/") ? (
                                                    <img
                                                        src={item.url || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : item.type.startsWith("video/") ? (
                                                    <Video className="w-8 h-8 text-purple-500" />
                                                ) : (
                                                    <FileText className="w-8 h-8 text-blue-500" />
                                                )
                                            ) : (
                                                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                                                    {"type" in item && (
                                                        <>
                                                            {item.type === "note" && <BookOpen className="w-4 h-4 text-primary-foreground" />}
                                                            {item.type === "task" && <CheckSquare className="w-4 h-4 text-primary-foreground" />}
                                                            {item.type === "spotify" && <Music className="w-4 h-4 text-primary-foreground" />}
                                                            {item.type === "statistics" && (
                                                                <BarChart3 className="w-4 h-4 text-primary-foreground" />
                                                            )}
                                                            {!["note", "task", "spotify", "statistics"].includes(item.type) && (
                                                                <Grid3X3 className="w-4 h-4 text-primary-foreground" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                        {"size" in item && (
                                            <p className="text-xs text-muted-foreground">{(item.size / 1024 / 1024).toFixed(1)} MB</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )

        case "gallery":
            return (
                <div className="h-full overflow-hidden">
                    <Tabs defaultValue="grid" className="h-full flex flex-col">
                        <TabsList className="m-4 mb-2">
                            <TabsTrigger value="grid">Grid View</TabsTrigger>
                            <TabsTrigger value="list">List View</TabsTrigger>
                        </TabsList>

                        <TabsContent value="grid" className="flex-1 overflow-y-auto p-4 pt-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {profile.uploadedFiles.map((file: any) => (
                                    <Card
                                        key={file.id}
                                        className="cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => openFilePreviewWindow(file)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                                {file.type && file.type.startsWith("image/") ? (
                                                    <img
                                                        src={file.url || "/placeholder.svg"}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : file.type && file.type.startsWith("video/") ? (
                                                    <div className="relative w-full h-full">
                                                        <video src={file.url} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <Play className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <FileText className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {file.type.split("/")[1]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="list" className="flex-1 overflow-y-auto p-4 pt-0">
                            <div className="space-y-2">
                                {profile.uploadedFiles.map((file: any) => (
                                    <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                    {file.type.startsWith("image/") ? (
                                                        <ImageIcon className="w-6 h-6 text-blue-500" />
                                                    ) : file.type.startsWith("video/") ? (
                                                        <Video className="w-6 h-6 text-purple-500" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-green-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{file.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(1)} MB • {file.uploadedAt.toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            openFilePreviewWindow(file)
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const link = document.createElement("a")
                                                            link.href = file.url
                                                            link.download = file.name
                                                            link.click()
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteFile(file.id)
                                                        }}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )

        case "notes":
            return (
                <div className="flex h-full">
                    <div className="w-80 border-r overflow-y-auto">
                        <div className="p-4 space-y-2">
                            {notes.map((note) => (
                                <DraggableCard
                                    key={note.id}
                                    onDragStart={(e) => handleCardDragStart(e, note, "note")}
                                    className="group"
                                >
                                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {note.updatedAt.toLocaleDateString()} • {note.source}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                                        </CardContent>
                                    </Card>
                                </DraggableCard>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-6">
                        <div className="text-center text-muted-foreground">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a note to view its content</p>
                            <p className="text-sm">Drag notes to create widgets or transfer</p>
                        </div>
                    </div>
                </div>
            )

        case "tasks":
            return (
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <DraggableCard
                                key={task.id}
                                onDragStart={(e) => handleCardDragStart(e, task, "task")}
                                className="group"
                            >
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox checked={task.completed} className="mt-1" />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{task.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                                <Badge
                                                    variant={
                                                        task.priority === "high"
                                                            ? "destructive"
                                                            : task.priority === "medium"
                                                                ? "default"
                                                                : "secondary"
                                                    }
                                                    className="mt-2"
                                                >
                                                    {task.priority} priority
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DraggableCard>
                        ))}
                    </div>
                </div>
            )
        case "empty":
            return (
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {/* <DraggableCard
                            className="group"
                        >

                        </DraggableCard> */}
                    </div>
                </div>
            )
        default:
            return <div className="p-6">Window content</div>
    }


}
export default PageContent
