"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BookOpen,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Globe,
  Calendar,
  Calculator,
  Timer,
  FileText,
  ImageIcon,
  Video,
  Download,
  Eye,
  ZoomIn,
} from "lucide-react"
import type { DraggableWidget, SpotifyTrack, StatisticsData, UploadedFile } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface WidgetContentProps {
  widget: DraggableWidget
  currentTrack?: SpotifyTrack
  onOpenFilePreview?: (file: UploadedFile) => void
}

export function WidgetContent({ widget, currentTrack, onOpenFilePreview }: WidgetContentProps) {
  switch (widget.type) {
    case "file-preview":
      const fileContent = widget.content as UploadedFile
      if (!fileContent) {
        return (
          <div className="p-3 h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs">No file loaded</p>
            </div>
          </div>
        )
      }

      return (
        <div className="h-full flex flex-col">
          <div className="p-2 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                {fileContent.type?.startsWith("image/") ? (
                  <ImageIcon className="w-2 h-2 text-white" />
                ) : fileContent.type?.startsWith("video/") ? (
                  <Video className="w-2 h-2 text-white" />
                ) : fileContent.type?.startsWith("audio/") ? (
                  <Music className="w-2 h-2 text-white" />
                ) : (
                  <FileText className="w-2 h-2 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" title={fileContent.name}>
                  {fileContent.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fileContent.size ? (fileContent.size / 1024 / 1024).toFixed(1) + " MB" : "Unknown size"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {fileContent.type?.startsWith("image/") ? (
              <div className="w-full h-full relative group">
                <img
                  src={fileContent.url || "/placeholder.svg"}
                  alt={fileContent.name || "Image"}
                  className="w-full h-full object-contain bg-black/5"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onOpenFilePreview?.(fileContent)}
                    className="shadow-lg"
                  >
                    <ZoomIn className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ) : fileContent.type?.startsWith("video/") ? (
              <div className="w-full h-full relative group bg-black rounded overflow-hidden">
                <video
                  src={fileContent.url}
                  className="w-full h-full object-contain"
                  controls={false}
                  muted
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onOpenFilePreview?.(fileContent)}
                    className="shadow-lg"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Play
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-500/5">
                <div className="w-12 h-12 bg-gray-500 rounded flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-medium text-center mb-1">
                  {fileContent.type?.split("/")[1]?.toUpperCase() || "FILE"}
                </p>
                <p className="text-xs text-muted-foreground text-center mb-2">Preview not available</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onOpenFilePreview?.(fileContent)}>
                    <Eye className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = fileContent.url
                      link.download = fileContent.name
                      link.click()
                    }}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )

    case "spotify":
      if (!currentTrack) return <div className="p-3">No track loaded</div>

      return (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{currentTrack.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <SkipBack className="w-2 h-2" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {currentTrack.isPlaying ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <SkipForward className="w-2 h-2" />
                </Button>
              </div>
            </div>
          </div>
          <Progress value={(currentTrack.progress / currentTrack.duration) * 100} className="h-1 mb-2" />
          <div className="flex items-center justify-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <SkipBack className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {currentTrack.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <SkipForward className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )

    case "statistics":
      const stats = widget.content as StatisticsData
      return (
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Productivity Stats</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 p-2 rounded">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-green-500" />
                <span>Tasks</span>
              </div>
              <p className="font-medium">
                {stats.tasksCompleted}/{stats.totalTasks}
              </p>
            </div>

            <div className="bg-muted/50 p-2 rounded">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-blue-500" />
                <span>Notes</span>
              </div>
              <p className="font-medium">{stats.notesCreated}</p>
            </div>

            <div className="bg-muted/50 p-2 rounded">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span>Hours</span>
              </div>
              <p className="font-medium">{stats.hoursWorked}h</p>
            </div>

            <div className="bg-muted/50 p-2 rounded">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-purple-500" />
                <span>Productivity</span>
              </div>
              <p className="font-medium">{Math.round(stats.productivity)}%</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Today's Progress</span>
              <span>{Math.round(stats.productivity)}%</span>
            </div>
            <Progress value={stats.productivity} className="h-1" />
          </div>
        </div>
      )

    case "weather":
      return (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{widget.content.location}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">☀️</div>
            <div className="text-lg font-medium">{widget.content.temperature}°C</div>
            <div className="text-xs text-muted-foreground">{widget.content.condition}</div>
          </div>
        </div>
      )

    case "clock":
      return (
        <div className="p-3 text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Current Time</span>
          </div>
          <div className="text-lg font-mono">{new Date().toLocaleTimeString()}</div>
          <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
        </div>
      )

    case "calendar":
      return (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Calendar</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{new Date().getDate()}</div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      )

    case "calculator":
      return (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Calculator</span>
          </div>
          <div className="bg-muted/50 p-2 rounded text-right font-mono">{widget.content.display || "0"}</div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
              <Button key={num} variant="outline" size="sm" className="h-6 text-xs">
                {num}
              </Button>
            ))}
          </div>
        </div>
      )

    case "timer":
      return (
        <div className="p-3 text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Timer className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Timer</span>
          </div>
          <div className="text-lg font-mono mb-2">{formatTime(widget.content.duration)}</div>
          <div className="flex gap-1 justify-center">
            <Button variant="outline" size="sm" className="h-6 text-xs">
              {widget.content.isRunning ? "Pause" : "Start"}
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              Reset
            </Button>
          </div>
        </div>
      )

    case "note":
      return (
        <div className="p-3">
          <h4 className="font-medium text-sm mb-1">{widget.content.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3">{widget.content.content}</p>
          <Badge variant="outline" className="mt-2 text-xs">
            {widget.content.source}
          </Badge>
        </div>
      )

    case "task":
      return (
        <div className="p-3">
          <div className="flex items-start gap-2">
            <Checkbox checked={widget.content.completed} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{widget.content.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{widget.content.description}</p>
              <Badge
                variant={
                  widget.content.priority === "high"
                    ? "destructive"
                    : widget.content.priority === "medium"
                      ? "default"
                      : "secondary"
                }
                className="mt-1 text-xs"
              >
                {widget.content.priority}
              </Badge>
            </div>
          </div>
        </div>
      )

    default:
      return <div className="p-3">Widget content</div>
  }
}
