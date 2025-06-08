import React from "react"

import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { FileUpload } from "@/components/fileUpload"
import { SideBarTitle } from "@/components/sideBarTitle"
import { DesktopControls } from "@/components/desktopControls"
import { CreateList } from "@/components/CreateList"
import { CreateWidget } from "@/components/createWidget"
import { ActiveWindow } from "@/components/activeWidow"

// Utility functions for safe number handling
const safeNumber = (value: any, fallback = 0): number => {
    const num = Number(value)
    return isNaN(num) || !isFinite(num) ? fallback : num
}

export default function Sidebar() {
    const [currentProfile, setCurrentProfile] = useState("personal")
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

    const [notes, setNotes] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced")

    const [desktopOffset, setDesktopOffset] = useState({ x: 0, y: 0 })
    const [isDraggingDesktop, setIsDraggingDesktop] = useState(false)
    const [desktopDragStart, setDesktopDragStart] = useState({ x: 0, y: 0 })

    const [currentTrack, setCurrentTrack] = useState<any>({
        id: "1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        duration: 355,
        isPlaying: true,
        progress: 120,
    })

    const [statistics, setStatistics] = useState<any>({
        tasksCompleted: 12,
        totalTasks: 18,
        notesCreated: 34,
        hoursWorked: 6.5,
        productivity: 78,
        activeProjects: 3,
    })

    useEffect(() => {
        const sampleNotes: any[] = [
            {
                id: "1",
                title: "Project Planning",
                content: "Planning the next phase of development...",
                createdAt: new Date(),
                updatedAt: new Date(),
                tags: ["planning", "development"],
                source: "nexus",
            },
            {
                id: "2",
                title: "Meeting Notes",
                content: "Weekly team meeting notes and action items...",
                createdAt: new Date(),
                updatedAt: new Date(),
                tags: ["meetings", "work"],
                source: "obsidian",
            },
        ]

        const sampleTasks: any[] = [
            {
                id: "1",
                title: "Review Nexus integrations",
                description: "Test all integration connections",
                completed: false,
                priority: "high",
                createdAt: new Date(),
            },
            {
                id: "2",
                title: "Update documentation",
                description: "Update project documentation",
                completed: true,
                priority: "medium",
                createdAt: new Date(),
            },
        ]

        setNotes(sampleNotes)
        setTasks(sampleTasks)

        const initialWidgets: any[] = [
            {
                id: "spotify-widget",
                type: "spotify",
                position: { x: 20, y: 100 },
                size: { width: 300, height: 200 },
                content: currentTrack,
                zIndex: 100,
            },
            {
                id: "stats-widget",
                type: "statistics",
                position: { x: 340, y: 100 },
                size: { width: 280, height: 220 },
                content: statistics,
                zIndex: 101,
            },
        ]

        setProfiles((prev) => prev.map((p) => (p.id === "personal" ? { ...p, widgets: initialWidgets } : p)))
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setSyncStatus((prev) => (prev === "synced" ? "syncing" : "synced"))

            if (currentTrack.isPlaying) {
                setCurrentTrack((prev: any) => ({
                    ...prev,
                    progress: Math.min(prev.progress + 1, prev.duration),
                }))
            }

            setStatistics((prev: any) => ({
                ...prev,
                hoursWorked: Math.round((prev.hoursWorked + 0.01) * 100) / 100,
                productivity: Math.min(100, prev.productivity + Math.random() * 2 - 1),
            }))
        }, 1000)
        return () => clearInterval(interval)
    }, [currentTrack.isPlaying])

    const handleDesktopMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDraggingDesktop) {
                setDesktopOffset({
                    x: e.clientX - desktopDragStart.x,
                    y: e.clientY - desktopDragStart.y,
                })
            }
        },
        [isDraggingDesktop, desktopDragStart],
    )

    const handleDesktopMouseUp = useCallback(() => {
        setIsDraggingDesktop(false)
    }, [])

    useEffect(() => {
        if (isDraggingDesktop) {
            document.addEventListener("mousemove", handleDesktopMouseMove)
            document.addEventListener("mouseup", handleDesktopMouseUp)
            return () => {
                document.removeEventListener("mousemove", handleDesktopMouseMove)
                document.removeEventListener("mouseup", handleDesktopMouseUp)
            }
        }
    }, [isDraggingDesktop, handleDesktopMouseMove, handleDesktopMouseUp])

    return (
        <div className="h-screen w-64 bg-muted/30 border-r backdrop-blur-md flex flex-col">
            <div className="w-64 border-r bg-muted/30 flex flex-col">

                <SideBarTitle
                    profiles={profiles}
                    currentProfile={currentProfile}
                    setCurrentProfile={setCurrentProfile}
                />

                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        <DesktopControls />

                        <Separator className="my-2" />

                        {/* File Upload */}
                        <FileUpload />

                        <Separator className="my-2" />

                        <CreateList />

                        <Separator className="my-2" />

                        <CreateWidget />
                    </div>

                    <Separator className="my-4" />

                    <ActiveWindow />
                </nav>
            </div>
        </div>
    )
}