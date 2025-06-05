"use client"

import type React from "react"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder, FolderOpen, MoreHorizontal, Trash } from "lucide-react"
import type { DesktopFolder } from "@/lib/types"
import { safePosition, safeSize } from "@/lib/utils"

interface DesktopFolderProps {
  folder: DesktopFolder
  onUpdateFolder: (id: string, updates: Partial<DesktopFolder>) => void
  onDeleteFolder: (id: string) => void
  onDropInFolder: (folderId: string, item: any, itemType: string) => void
  onOpenFolder: (folder: DesktopFolder) => void
}

export function DesktopFolderComponent({
  folder,
  onUpdateFolder,
  onDeleteFolder,
  onDropInFolder,
  onOpenFolder,
}: DesktopFolderProps) {
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
    onOpenFolder(folder)
  }, [folder, onUpdateFolder, onOpenFolder])

  return (
    <div
      className={`absolute cursor-pointer transition-all ${isHovered ? "scale-105" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: folder.zIndex || 1,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-1 -right-1 w-6 h-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDoubleClick}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
