import { Folder, FolderOpen } from "lucide-react"
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react"
import { safeNumber, safePosition, safeSize } from "@/utils/safeFunctions"

export const DesktopFolderComponent: FunctionComponent<{
    folder: any
    onUpdateFolder: (id: string, updates: Partial<any>) => void
    onDropInFolder: (folderId: string, item: any, itemType: string) => void
    onOpenFolder?: (folder: any) => void
}> = ({ folder, onUpdateFolder, onDropInFolder, onOpenFolder, ...props }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const position = useMemo(() => safePosition(folder.position), [folder.position])
    const size = useMemo(() => safeSize(folder.size, 80, 80), [folder.size])

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            setIsDragging(true)
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            })
            onUpdateFolder(folder.id, { zIndex: Date.now() })
        },
        [folder.id, position, onUpdateFolder],
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                const newPosition = {
                    x: Math.max(0, e.clientX - dragStart.x),
                    y: Math.max(0, e.clientY - dragStart.y),
                }
                onUpdateFolder(folder.id, { position: newPosition })
            }
        },
        [isDragging, dragStart, folder.id, onUpdateFolder],
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            return () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const handleDoubleClick = useCallback(() => {
        onUpdateFolder(folder.id, { isOpen: true })
        if (onOpenFolder) { onOpenFolder(folder) }
    }, [folder, onUpdateFolder, onOpenFolder])

    return (
        <div
            {...props}
            className={`absolute cursor-pointer transition-all ${isHovered ? "scale-105" : ""}`}
            style={{
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex: safeNumber(folder.zIndex, 1),
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
            onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                try {
                    const data = JSON.parse(e.dataTransfer.getData("application/json"))
                    onDropInFolder(folder.id, data.item, data.type)
                } catch (error) {
                    console.error("Error processing folder drop:", error)
                }
            }}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <div className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <div className="relative">
                    <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                        {folder.isOpen ? <FolderOpen className="w-8 h-8 text-white" /> : <Folder className="w-8 h-8 text-white" />}
                    </div>
                    {folder.items.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {folder.items.length}
                        </div>
                    )}
                </div>
                <span className="text-xs font-medium text-center max-w-20 truncate">{folder.name}</span>
            </div>
        </div>
    )
}