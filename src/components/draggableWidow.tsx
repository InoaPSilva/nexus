import throttle from "lodash.throttle"
import { Badge, BookOpen, CheckSquare, Chrome, Code, FileText, Folder, ImageIcon, Magnet, Maximize, Minimize, Minimize2, Music, Pin, PinOff, Settings, Square, X } from "lucide-react";
import { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "./ui/button";
import { safeNumber, safePosition, safeSize } from "@/utils/safeFunctions";

const SnapZones: FunctionComponent<{ isVisible: boolean; zones: any[] }> = ({ isVisible, zones }) => {
    if (!isVisible) return null
    const safeNumber = (value: any, fallback = 0): number => {
        const num = Number(value)
        return isNaN(num) || !isFinite(num) ? fallback : num
    }



    const getScreenDimensions = () => {
        if (typeof window === "undefined") return { width: 1920, height: 1080 }
        return {
            width: Math.max(800, window.innerWidth),
            height: Math.max(600, window.innerHeight),
        }
    }
    return (
        <>
            {zones.map((zone) => (
                <div
                    key={zone.id}
                    className="fixed border-2 border-blue-500 bg-blue-500/20 rounded-lg pointer-events-none z-40"
                    style={{
                        left: safeNumber(zone.x),
                        top: safeNumber(zone.y),
                        width: safeNumber(zone.width, 100),
                        height: safeNumber(zone.height, 100),
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            {zone.type.replace("-", " ").toUpperCase()}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
export const DraggableWindowComponent: FunctionComponent<{
    window: any
    onUpdateWindow: (id: string, updates: Partial<any>) => void
    onCloseWindow: (id: string) => void
    onDropInWindow?: (windowId: string, item: any, itemType: string) => void
    children: ReactNode
}> = ({ window, onUpdateWindow, onCloseWindow, onDropInWindow, children }) => {
    const windowRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
    const [showSnapZones, setShowSnapZones] = useState(false)
    const [snapZones, setSnapZones] = useState<any[]>([])

    const getScreenDimensions = () => {
        if (typeof window === "undefined") return { width: 1920, height: 1080 }
        return {
            width: Math.max(800, window.innerWidth),
            height: Math.max(600, window.innerHeight),
        }
    }

    const position = useMemo(() => safePosition(window.position), [window.position])
    const size = useMemo(
        () => safeSize(window.size, window.isMiniMode ? 200 : 300, window.isMiniMode ? 100 : 200),
        [window.size, window.isMiniMode],
    )

    // Generate snap zones
    const generateSnapZones = useCallback(() => {
        const { width: screenWidth, height: screenHeight } = getScreenDimensions()

        const zones: any[] = [
            { id: "left", x: 0, y: 0, width: Math.floor(screenWidth / 2), height: screenHeight, type: "left" },
            {
                id: "right",
                x: Math.floor(screenWidth / 2),
                y: 0,
                width: Math.floor(screenWidth / 2),
                height: screenHeight,
                type: "right",
            },
            { id: "top", x: 0, y: 0, width: screenWidth, height: Math.floor(screenHeight / 2), type: "top" },
            {
                id: "bottom",
                x: 0,
                y: Math.floor(screenHeight / 2),
                width: screenWidth,
                height: Math.floor(screenHeight / 2),
                type: "bottom",
            },
            {
                id: "top-left",
                x: 0,
                y: 0,
                width: Math.floor(screenWidth / 2),
                height: Math.floor(screenHeight / 2),
                type: "top-left",
            },
            {
                id: "top-right",
                x: Math.floor(screenWidth / 2),
                y: 0,
                width: Math.floor(screenWidth / 2),
                height: Math.floor(screenHeight / 2),
                type: "top-right",
            },
            {
                id: "bottom-left",
                x: 0,
                y: Math.floor(screenHeight / 2),
                width: Math.floor(screenWidth / 2),
                height: Math.floor(screenHeight / 2),
                type: "bottom-left",
            },
            {
                id: "bottom-right",
                x: Math.floor(screenWidth / 2),
                y: Math.floor(screenHeight / 2),
                width: Math.floor(screenWidth / 2),
                height: Math.floor(screenHeight / 2),
                type: "bottom-right",
            },
        ]
        setSnapZones(zones)
    }, [])

    const checkSnap = useCallback(
        (x: number, y: number) => {
            const snapThreshold = 50
            const { width: screenWidth, height: screenHeight } = getScreenDimensions()

            if (x < snapThreshold) {
                if (y < snapThreshold) return "top-left"
                if (y > screenHeight - size.height - snapThreshold) return "bottom-left"
                return "left"
            }
            if (x > screenWidth - size.width - snapThreshold) {
                if (y < snapThreshold) return "top-right"
                if (y > screenHeight - size.height - snapThreshold) return "bottom-right"
                return "right"
            }
            if (y < snapThreshold) {
                return "top"
            }
            if (y > screenHeight - size.height - snapThreshold) {
                return "bottom"
            }

            return null
        },
        [size],
    )

    const applySnap = useCallback(
        (snapType: string) => {
            const { width: screenWidth, height: screenHeight } = getScreenDimensions()

            const updates: Partial<any> = {
                isSnapped: true,
                snapPosition: snapType as any,
            }

            switch (snapType) {
                case "left":
                    updates.position = { x: 0, y: 0 }
                    updates.size = { width: Math.floor(screenWidth / 2), height: screenHeight }
                    break
                case "right":
                    updates.position = { x: Math.floor(screenWidth / 2), y: 0 }
                    updates.size = { width: Math.floor(screenWidth / 2), height: screenHeight }
                    break
                case "top":
                    updates.position = { x: 0, y: 0 }
                    updates.size = { width: screenWidth, height: Math.floor(screenHeight / 2) }
                    break
                case "bottom":
                    updates.position = { x: 0, y: Math.floor(screenHeight / 2) }
                    updates.size = { width: screenWidth, height: Math.floor(screenHeight / 2) }
                    break
                case "top-left":
                    updates.position = { x: 0, y: 0 }
                    updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
                    break
                case "top-right":
                    updates.position = { x: Math.floor(screenWidth / 2), y: 0 }
                    updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
                    break
                case "bottom-left":
                    updates.position = { x: 0, y: Math.floor(screenHeight / 2) }
                    updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
                    break
                case "bottom-right":
                    updates.position = { x: Math.floor(screenWidth / 2), y: Math.floor(screenHeight / 2) }
                    updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
                    break
            }

            onUpdateWindow(window.id, updates)
        },
        [window.id, onUpdateWindow],
    )

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === headerRef.current || headerRef.current?.contains(e.target as Node)) {
                e.stopPropagation()
                if (!window.isPinned) {
                    setIsDragging(true)
                    setShowSnapZones(true)
                    generateSnapZones()
                    setDragStart({
                        x: e.clientX - position.x,
                        y: e.clientY - position.y,
                    })
                    onUpdateWindow(window.id, { zIndex: Date.now(), isSnapped: false })
                }
            }
        },
        [window.isPinned, window.id, position, onUpdateWindow, generateSnapZones],
    )

    const handleResizeMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            setIsResizing(true)
            setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: size.width,
                height: size.height,
            })
        },
        [size],
    )

    const handleMouseMove = useCallback(
        throttle((e: MouseEvent) => {
            if (isDragging && !window.isPinned) {
                const newPosition = {
                    x: Math.max(0, e.clientX - dragStart.x),
                    y: Math.max(0, e.clientY - dragStart.y),
                }
                onUpdateWindow(window.id, { position: newPosition })
            } else if (isResizing) {
                const deltaX = e.clientX - resizeStart.x
                const deltaY = e.clientY - resizeStart.y
                const newSize = {
                    width: Math.max(window.isMiniMode ? 200 : 300, resizeStart.width + deltaX),
                    height: Math.max(window.isMiniMode ? 100 : 200, resizeStart.height + deltaY),
                }
                onUpdateWindow(window.id, { size: newSize })
            }
        }, 16),
        [isDragging, isResizing, dragStart, resizeStart, window.id, window.isPinned, window.isMiniMode, onUpdateWindow],
    )

    const handleMouseUp = useCallback(
        (e: MouseEvent) => {
            if (isDragging && !window.isPinned) {
                const snapType = checkSnap(e.clientX - dragStart.x, e.clientY - dragStart.y)
                if (snapType) {
                    applySnap(snapType)
                }
                setShowSnapZones(false)
            }
            setIsDragging(false)
            setIsResizing(false)
        },
        [isDragging, checkSnap, applySnap, dragStart, window.isPinned],
    )

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            return () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            }
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

    if (window.isMinimized) {
        return null
    }

    const finalPosition = window.isMaximized ? { x: 0, y: 0 } : position
    const finalSize = window.isMaximized ? getScreenDimensions() : window.isMiniMode ? { width: 300, height: 100 } : size

    return (
        <>
            <SnapZones isVisible={showSnapZones && !window.isPinned} zones={snapZones} />
            <div
                ref={windowRef}
                draggable
                onDragStart={(e) => {
                    const payload = { item: window, type: "window" }
                    e.dataTransfer.setData("application/json", JSON.stringify(payload))
                }}
                className={`fixed bg-background border overflow-hidden ${window.isMiniMode ? "rounded-full shadow-xl border-2" : "rounded-lg shadow-2xl"
                    } ${window.isPinned ? "border-blue-500 border-2" : ""}`}
                style={{
                    left: finalPosition.x,
                    top: finalPosition.y,
                    width: finalSize.width,
                    height: finalSize.height,
                    zIndex: window.isPinned ? 9999 : safeNumber(window.zIndex, 1),
                }}
                onDrop={
                    onDropInWindow
                        ? (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            try {
                                const data = JSON.parse(e.dataTransfer.getData("application/json"))
                                onDropInWindow(window.id, data.item, data.type)
                            } catch (error) {
                                console.error("Error processing window drop:", error)
                            }
                        }
                        : undefined
                }
                onDragOver={
                    onDropInWindow
                        ? (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }
                        : undefined
                }
            >
                {/* Window Header */}
                <div
                    ref={headerRef}
                    className={`flex items-center justify-between p-2 border-b bg-muted/30 select-none ${window.isPinned ? "cursor-default" : "cursor-move"
                        } ${window.isMiniMode ? "h-8" : "h-12"}`}
                    onMouseDown={handleMouseDown}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`bg-primary rounded flex items-center justify-center ${window.isMiniMode ? "w-3 h-3" : "w-4 h-4"}`}
                        >
                            {window.type === "notes" && (
                                <BookOpen className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}
                            {window.type === "tasks" && (
                                <CheckSquare className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}

                            {window.type === "gallery" && (
                                <ImageIcon className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}
                            {window.type === "file-preview" && (
                                <FileText className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}
                            {window.type === "folder" && (
                                <Folder className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}
                            {window.type === "integrations" && (
                                <Settings className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
                            )}
                        </div>
                        <span className={`font-medium ${window.isMiniMode ? "text-xs" : "text-sm"} truncate max-w-32`}>
                            {window.title}
                        </span>
                        {window.isSnapped && !window.isMiniMode && (
                            <Badge className="text-xs">
                                <Magnet className="w-2 h-2 mr-1" />
                                {window.snapPosition}
                            </Badge>
                        )}
                        {window.isPinned && <Pin className={`text-blue-500 ${window.isMiniMode ? "w-2 h-2" : "w-3 h-3"}`} />}
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Pin/Unpin Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
                            onClick={() => onUpdateWindow(window.id, { isPinned: !window.isPinned })}
                            title={window.isPinned ? "Unpin window" : "Pin window on top"}
                        >
                            {window.isPinned ? (
                                <PinOff className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
                            ) : (
                                <Pin className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
                            )}
                        </Button>

                        {/* Mini Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
                            onClick={() => onUpdateWindow(window.id, { isMiniMode: !window.isMiniMode })}
                            title={window.isMiniMode ? "Exit mini mode" : "Enter mini mode"}
                        >
                            <Minimize className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
                        </Button>

                        {!window.isMiniMode && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => onUpdateWindow(window.id, { isMinimized: true })}
                                >
                                    <Minimize2 className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => onUpdateWindow(window.id, { isMaximized: !window.isMaximized, isSnapped: false })}
                                >
                                    {window.isMaximized ? <Square className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
                                </Button>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
                            onClick={() => onCloseWindow(window.id)}
                        >
                            <X className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
                        </Button>
                    </div>
                </div>

                {/* Window Content */}
                <div className="flex-1 overflow-hidden">{children}</div>

                {/* Resize Handles */}
                {!window.isMaximized && !window.isSnapped && !window.isPinned && !window.isMiniMode && (
                    <>
                        <div
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted/50 hover:bg-muted"
                            onMouseDown={handleResizeMouseDown}
                        >
                            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-gray-400" />
                        </div>
                        <div
                            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-muted/30"
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                setIsResizing(true)
                                setResizeStart({
                                    x: e.clientX,
                                    y: e.clientY,
                                    width: size.width,
                                    height: size.height,
                                })
                            }}
                        />
                        <div
                            className="absolute right-0 top-12 bottom-4 w-2 cursor-e-resize hover:bg-muted/30"
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                setIsResizing(true)
                                setResizeStart({
                                    x: e.clientX,
                                    y: e.clientY,
                                    width: size.width,
                                    height: size.height,
                                })
                            }}
                        />
                    </>
                )}
            </div>
        </>
    )
}