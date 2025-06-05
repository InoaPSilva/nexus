"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Grid3X3,
  Search,
  Monitor,
  BookOpen,
  CheckSquare,
  ImageIcon,
  Chrome,
  Code,
  Plus,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FolderPlus,
  X,
  Pin,
  Minimize,
  Magnet,
  Edit,
  FolderSyncIcon as Sync,
} from "lucide-react"
import type { DesktopProfile, DraggableWindow } from "@/lib/types"

interface DesktopSidebarProps {
  profile: DesktopProfile
  profiles: DesktopProfile[]
  windows: DraggableWindow[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  currentProfile: string
  setCurrentProfile: (profileId: string) => void
  desktopZoom: number
  setDesktopZoom: (zoom: number) => void
  resetDesktopView: () => void
  onOpenWindow: (type: DraggableWindow["type"], title: string) => void
  onCreateFolder: () => void
  onCreateWidget: () => void
  onCreateProfile: () => void
  onEditProfile: (profile: DesktopProfile) => void
  onUpdateWindow: (id: string, updates: Partial<DraggableWindow>) => void
  onCloseWindow: (id: string) => void
  onFileUpload: (files: FileList) => void
  syncStatus: "synced" | "syncing" | "offline"
}

export function DesktopSidebar({
  profile,
  profiles,
  windows,
  searchQuery,
  setSearchQuery,
  currentProfile,
  setCurrentProfile,
  desktopZoom,
  setDesktopZoom,
  resetDesktopView,
  onOpenWindow,
  onCreateFolder,
  onCreateWidget,
  onCreateProfile,
  onEditProfile,
  onUpdateWindow,
  onCloseWindow,
  onFileUpload,
  syncStatus,
}: DesktopSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg">Nexus</h1>
        </div>

        {/* Profile Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>{profile.icon}</span>
                <span className="text-sm">{profile.name}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {profiles.map((p) => (
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
                      e.stopPropagation()
                      onEditProfile(p)
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateProfile}>
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search everything..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>

          <Separator className="my-2" />

          {/* Desktop Navigation Controls */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">DESKTOP CONTROLS</p>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setDesktopZoom(Math.min(2, desktopZoom + 0.1))}
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setDesktopZoom(Math.max(0.5, desktopZoom - 0.1))}
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={resetDesktopView}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">Zoom: {Math.round(desktopZoom * 100)}%</div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">FILE UPLOAD</p>
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-3 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => document.getElementById("file-upload")?.click()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files) {
                  onFileUpload(e.dataTransfer.files)
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    onFileUpload(e.target.files)
                  }
                }}
              />
              <div className="text-xs text-muted-foreground">
                <Plus className="w-4 h-4 mx-auto mb-1" />
                <p>Drop files or click to upload</p>
                <p className="text-xs mt-1">Creates preview widgets</p>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <p className="text-xs font-medium text-muted-foreground mb-2">CREATE</p>

          <Button variant="ghost" className="w-full justify-start gap-2" onClick={onCreateFolder}>
            <FolderPlus className="w-4 h-4" />
            New Folder
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => onOpenWindow("notes", "Notes")}>
            <BookOpen className="w-4 h-4" />
            Notes
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => onOpenWindow("tasks", "Tasks")}>
            <CheckSquare className="w-4 h-4" />
            Tasks
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onOpenWindow("gallery", "File Gallery")}
          >
            <ImageIcon className="w-4 h-4" />
            Gallery
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onOpenWindow("chrome", "Chrome")}
          >
            <Chrome className="w-4 h-4" />
            Chrome
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => onOpenWindow("vscode", "VS Code")}
          >
            <Code className="w-4 h-4" />
            VS Code
            <Plus className="w-3 h-3 ml-auto" />
          </Button>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">WIDGETS</p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCreateWidget}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2">ACTIVE WINDOWS</p>
          {windows.map((window) => (
            <div
              key={window.id}
              className={`flex items-center gap-2 p-1 rounded text-xs cursor-pointer hover:bg-muted ${
                window.isMinimized ? "opacity-60" : ""
              }`}
              onClick={() => onUpdateWindow(window.id, { isMinimized: false, zIndex: Date.now() })}
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
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseWindow(window.id)
                }}
              >
                <X className="w-2 h-2" />
              </Button>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            {syncStatus === "synced" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            {syncStatus === "syncing" && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
            <span className="capitalize">{syncStatus}</span>
          </div>
          <Sync className="w-3 h-3" />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Monitor className="w-3 h-3" />
          <span>{profile.name} Desktop</span>
        </div>
      </div>
    </div>
  )
}
