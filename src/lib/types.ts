export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  source: "nexus" | "obsidian" | "notion" | "file"
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: Date
  createdAt: Date
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  thumbnail?: string
  parentFolderId?: string
}

export interface DraggableWidget {
  id: string
  type:
    | "spotify"
    | "note"
    | "task"
    | "bookmark"
    | "file"
    | "file-preview"
    | "statistics"
    | "weather"
    | "calendar"
    | "calculator"
    | "timer"
    | "clock"
  position: { x: number; y: number }
  size: { width: number; height: number }
  content: any
  zIndex: number
  parentWindowId?: string
  parentFolderId?: string
}

export interface DraggableWindow {
  id: string
  title: string
  type:
    | "notes"
    | "tasks"
    | "integrations"
    | "chrome"
    | "vscode"
    | "spotify"
    | "gallery"
    | "custom"
    | "file-preview"
    | "folder"
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isSnapped: boolean
  isPinned: boolean
  isMiniMode: boolean
  snapPosition?: "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  zIndex: number
  content?: any
  parentFolderId?: string
}

export interface DesktopFolder {
  id: string
  name: string
  icon: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  isOpen: boolean
  items: (DraggableWidget | UploadedFile)[]
  zIndex: number
}

export interface DesktopProfile {
  id: string
  name: string
  icon: string
  color: string
  description: string
  windows: DraggableWindow[]
  widgets: DraggableWidget[]
  folders: DesktopFolder[]
  backgroundStyle: string
  backgroundType?: "gradient" | "image" | "video"
  backgroundMedia?: string
  uploadedFiles: UploadedFile[]
}

export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  duration: number
  isPlaying: boolean
  progress: number
}

export interface StatisticsData {
  tasksCompleted: number
  totalTasks: number
  notesCreated: number
  hoursWorked: number
  productivity: number
  activeProjects: number
}

export interface SnapZone {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
}
