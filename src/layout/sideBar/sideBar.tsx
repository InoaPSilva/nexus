import React, { useState, useEffect, useCallback } from "react"

import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/fileUpload"
import { SideBarTitle } from "@/components/sideBarTitle"
import { DesktopControls } from "@/components/desktopControls"
import { CreateList } from "@/components/createList"
import { Button } from "@/components/ui/button"
import { open } from "@tauri-apps/plugin-dialog";
import { isTauri } from "@tauri-apps/api/core";

// Utility functions for safe number handling
const safeNumber = (value: any, fallback = 0): number => {
    const num = Number(value)
    return isNaN(num) || !isFinite(num) ? fallback : num
}

interface SidebarProps {
    profiles: Array<{
        id: string
        name: string
        icon: string
        color: string
        description: string
        windows: any[]
        widgets: any[]
        folders: any[]
        backgroundStyle: string
        backgroundType: string
        uploadedFiles: any[]
        sources?: string[]
    }>
    setProfiles: React.Dispatch<React.SetStateAction<any[]>>
    currentProfile: string
    setCurrentProfile: React.Dispatch<React.SetStateAction<string>>
}

export default function Sidebar({
    profiles,
    setProfiles,
    currentProfile,
    setCurrentProfile,
}: SidebarProps) {
    const [notes, setNotes] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced")

    const [desktopOffset, setDesktopOffset] = useState({ x: 0, y: 0 })
    const [isDraggingDesktop, setIsDraggingDesktop] = useState(false)
    const [desktopDragStart, setDesktopDragStart] = useState({ x: 0, y: 0 })
    const [folderPath, setFolderPath] = useState("");
    const selectFolder = async () => {
        if (!(await isTauri())) {
            alert("A seleção de pastas está disponível apenas no aplicativo Tauri.");
            return;
        }

        try {
            const selected = await open({
                directory: true,
                multiple: false,
            });

            if (selected && typeof selected === "string") {
                setFolderPath(selected);

                setProfiles((prevProfiles) =>
                    prevProfiles.map((profile) =>
                        profile.id === currentProfile
                            ? {
                                ...profile,
                                sources: [...(profile.sources || []), selected],
                            }
                            : profile
                    )
                );
            }
        } catch (error) {
            console.error("Erro ao selecionar pasta:", error);
            alert("Erro ao selecionar pasta.");
        }
    };
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
        [isDraggingDesktop, desktopDragStart]
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
        <div className="h-screen w-auto bg-muted/30 border-r backdrop-blur-md flex flex-col">
            <SideBarTitle
                currentProfile={currentProfile}
                setCurrentProfile={setCurrentProfile}
                profiles={profiles}
            />

            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    <DesktopControls />

                    <Separator className="my-2" />

                    <FileUpload
                        setProfiles={setProfiles}
                        currentProfile={currentProfile}
                    />

                    <Separator className="my-2" />

                    <CreateList currentProfile={currentProfile} setProfiles={setProfiles} />

                    <Separator className="my-2" />
                    <section>
                        <p className="text-xs font-medium text-muted-foreground mb-2">SELECT SOURCE</p>
                        <div>
                            <Button
                                variant="default"
                                onClick={selectFolder}
                                className="px-4 py-2 bg-blue-600 rounded"
                            >
                                Select Folder
                            </Button>
                        </div>
                    </section>

                    {/* List current sources */}
                    <section className="w-40">
                        <p className="text-xs font-medium text-muted-foreground mb-2 justify-text-center">CURRENT SOURCES</p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground max-w-full max-h-48 overflow-auto whitespace-nowrap">
                            {profiles
                                .find((profile) => profile.id === currentProfile)
                                ?.sources?.map((source, index) => (
                                    <li key={index}>{source}</li>
                                )) || <li>No sources added</li>}
                        </ul>
                    </section>
                </div>

                {/* <Separator className="my-4" /> */}

                {/* <ActiveWindow /> */}
            </nav>
        </div>
    )
}
