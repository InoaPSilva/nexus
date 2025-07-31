import React, { useEffect, useState } from "react"
import {
    ImageIcon, Video, FileText, Play, Music, SkipBack, SkipForward, Pause,
    BarChart3, Target, BookOpen, Clock as ClockIcon, TrendingUp, Globe,
    Calendar as CalendarIcon, Calculator, Timer
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const IconWithLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="flex items-center gap-2 justify-center mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </div>
)

const Stat = ({ label, icon, value }: { label: string; icon: React.ReactNode; value: React.ReactNode }) => (
    <div className="bg-muted/50 p-2 rounded">
        <div className="flex items-center gap-1">{icon}<span>{label}</span></div>
        <p className="font-medium">{value}</p>
    </div>
)

const ClockWidget = () => {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    return (
        <div className="p-3 text-center">
            <IconWithLabel icon={<ClockIcon className="w-4 h-4 text-blue-500" />} label="Current Time" />
            <div className="text-lg font-mono">{now.toLocaleTimeString()}</div>
            <div className="text-xs text-muted-foreground">{now.toLocaleDateString()}</div>
        </div>
    )
}

const CalendarWidget = () => {
    const now = new Date()
    return (
        <div className="p-3 text-center">
            <IconWithLabel icon={<CalendarIcon className="w-4 h-4 text-green-500" />} label="Calendar" />
            <div className="text-2xl font-bold">{now.getDate()}</div>
            <div className="text-xs text-muted-foreground">{now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        </div>
    )
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

const WidgetContent = ({
    widget,
    currentTrack,
    openFilePreviewWindow = () => { }
}: {
    widget: any,
    currentTrack?: { name: string, isPlaying: boolean, progress: number, duration: number },
    openFilePreviewWindow?: (file: any) => void
}) => {
    if (!widget || !widget.type) return <div className="p-3">Widget missing or invalid</div>

    const content = widget.content ?? {}

    switch (widget.type) {
        case "file-preview":
            const isImg = content?.type?.startsWith("image/")
            const isVid = content?.type?.startsWith("video/")
            const FileTypeIcon = isImg ? <ImageIcon /> : isVid ? <Video /> : <FileText />
            return (
                <div className="p-3 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white">{FileTypeIcon}</div>
                        <span className="text-xs font-medium truncate">{content?.name ?? "Unknown file"}</span>
                    </div>
                    <div className="flex-1 bg-muted rounded overflow-hidden">
                        {isImg ? (
                            <img src={content.url ?? "/placeholder.svg"} alt={content.name ?? "Image"} className="w-full h-full object-cover" />
                        ) : isVid ? (
                            <div className="relative w-full h-full">
                                <video src={content.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play className="w-6 h-6 text-white" /></div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-center text-xs text-muted-foreground">
                                <FileText className="w-8 h-8 mx-auto mb-2" />
                                {content?.type?.split("/")[1]?.toUpperCase() ?? "FILE"}
                            </div>
                        )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{content?.size ? (content.size / 1024 / 1024).toFixed(1) + " MB" : "Unknown size"}</div>
                </div>
            )

        case "spotify":
            return currentTrack ? (
                <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                            <Music className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{currentTrack.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {[<SkipBack />, currentTrack.isPlaying ? <Pause /> : <Play />, <SkipForward />].map((icon, i) => (
                                    <Button key={i} variant="ghost" size="sm" className="h-6 w-6 p-0">{icon}</Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Progress value={(currentTrack.progress / currentTrack.duration) * 100} className="h-1 mb-2" />
                </div>
            ) : null

        case "statistics":
            return (
                <div className="p-3 space-y-3">
                    <IconWithLabel icon={<BarChart3 className="w-4 h-4 text-blue-500" />} label="Productivity Stats" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <Stat label="Tasks" icon={<Target className="w-3 h-3 text-green-500" />} value={`${content.tasksCompleted}/${content.totalTasks}`} />
                        <Stat label="Notes" icon={<BookOpen className="w-3 h-3 text-blue-500" />} value={content.notesCreated} />
                        <Stat label="Hours" icon={<ClockIcon className="w-3 h-3 text-orange-500" />} value={`${content.hoursWorked}h`} />
                        <Stat label="Productivity" icon={<TrendingUp className="w-3 h-3 text-purple-500" />} value={`${Math.round(content.productivity)}%`} />
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>Today's Progress</span><span>{Math.round(content.productivity)}%</span></div>
                        <Progress value={content.productivity} className="h-1" />
                    </div>
                </div>
            )

        case "weather":
            return (
                <div className="p-3 text-center">
                    <IconWithLabel icon={<Globe className="w-4 h-4 text-blue-500" />} label={content.location ?? "Unknown"} />
                    <div className="text-2xl mb-1">☀️</div>
                    <div className="text-lg font-medium">{content.temperature ?? "--"}°C</div>
                    <div className="text-xs text-muted-foreground">{content.condition ?? "N/A"}</div>
                </div>
            )

        case "clock": return <ClockWidget />
        case "calendar": return <CalendarWidget />

        case "timer":
            return (
                <div className="p-3 text-center">
                    <IconWithLabel icon={<Timer className="w-4 h-4 text-red-500" />} label="Timer" />
                    <div className="text-lg font-mono mb-2">{formatTime(content.duration ?? 0)}</div>
                    <div className="flex gap-1 justify-center">
                        <Button variant="outline" size="sm" className="h-6 text-xs">{content.isRunning ? "Pause" : "Start"}</Button>
                        <Button variant="outline" size="sm" className="h-6 text-xs">Reset</Button>
                    </div>
                </div>
            )

        case "calculator":
            return (
                <div className="p-3">
                    <IconWithLabel icon={<Calculator className="w-4 h-4 text-purple-500" />} label="Calculator" />
                    <div className="bg-muted/50 p-2 rounded text-right font-mono">{content.display ?? "0"}</div>
                    <div className="grid grid-cols-3 gap-1 mt-2">
                        {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map(num => (
                            <Button key={num} variant="outline" size="sm" className="h-6 text-xs">{num}</Button>
                        ))}
                    </div>
                </div>
            )

        case "note":
            return (
                <div className="p-3">
                    <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">{content.content}</p>
                    <Badge variant="outline" className="mt-2 text-xs">{content.source}</Badge>
                </div>
            )

        case "task":
            return (
                <div className="p-3">
                    <div className="flex items-start gap-2">
                        <Checkbox checked={content.completed} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{content.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{content.description}</p>
                            <Badge
                                variant={
                                    content.priority === "high" ? "destructive" :
                                        content.priority === "medium" ? "default" : "secondary"
                                }
                                className="mt-1 text-xs"
                            >
                                {content.priority}
                            </Badge>
                        </div>
                    </div>
                </div>
            )

        case "bookmark":
            return (
                <div className="p-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{content.favicon ?? "🔗"}</span>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{content.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{content.url}</p>
                        </div>
                    </div>
                </div>
            )

        case "file":
            return (
                <div className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            {(() => {
                                const typeMap: Record<string, string> = { image: "🖼️", video: "🎥", audio: "🎵" }
                                const key = (content.type?.split("/")[0] ?? "") as string
                                return typeMap[key] ?? "📄"
                            })()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{content.name}</h4>
                            <p className="text-xs text-muted-foreground">{(content.size / 1024 / 1024).toFixed(1)} MB</p>
                            {content.url && (
                                <Button variant="ghost" size="sm" className="h-6 text-xs mt-1" onClick={() => openFilePreviewWindow(content)}>Open</Button>
                            )}
                        </div>
                    </div>
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
                        defaultValue={content?.url ?? "https://example.com"}
                        placeholder="Enter URL"
                        className="text-xs px-2 py-1 border rounded w-full mb-2"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const newUrl = (e.target as HTMLInputElement).value
                                if (newUrl && widget.onUpdateContent) {
                                    widget.onUpdateContent({ url: newUrl })
                                }
                            }
                        }}
                    />
                    <div className="flex-1 border rounded overflow-hidden">
                        <iframe
                            src={content?.url ?? "https://example.com"}
                            title="Webpage"
                            className="w-full h-full border-none"
                        />
                    </div>
                </div>
            )


        default:
            return <div className="p-3">Widget content</div>
    }
}

export default WidgetContent
