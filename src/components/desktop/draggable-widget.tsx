"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Send } from "lucide-react"
import type { DraggableWidget } from "@/lib/types"
import { safePosition, safeSize, throttle } from "@/lib/utils"

interface DraggableWidgetProps {
  widget: DraggableWidget
  onUpdateWidget: (id: string, updates: Partial<DraggableWidget>) => void
  onDeleteWidget: (id: string) => void
  onTransferWidget?: (widget: DraggableWidget) => void
  children: React.ReactNode
}

export function DraggableWidgetComponent({
  widget,
  onUpdateWidget,
  onDeleteWidget,
  onTransferWidget,
  children,
}: DraggableWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [shouldRender, setShouldRender] = useState(true)

  const position = useMemo(() => safePosition(widget.position), [widget.position])
  const size = useMemo(() => safeSize(widget.size, 200, 150), [widget.size])

  useEffect(() => {
    if (widget.parentWindowId || widget.parentFolderId) {
      setShouldRender(false)
    } else {
      setShouldRender(true)
    }
  }, [widget.parentWindowId, widget.parentFolderId])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      onUpdateWidget(widget.id, { zIndex: Date.now() })
    },
    [widget.id, position, onUpdateWidget],
  )

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData("application/json", JSON.stringify({ item: widget, type: "widget" }))
    },
    [widget],
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
      if (isDragging) {
        const newPosition = {
          x: Math.max(0, e.clientX - dragStart.x),
          y: Math.max(0, e.clientY - dragStart.y),
        }
        onUpdateWidget(widget.id, { position: newPosition })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newSize = {
          width: Math.max(200, resizeStart.width + deltaX),
          height: Math.max(150, resizeStart.height + deltaY),
        }
        onUpdateWidget(widget.id, { size: newSize })
      }
    }, 16),
    [isDragging, isResizing, dragStart, resizeStart, widget.id, onUpdateWidget],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

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

  if (!shouldRender) {
    return null
  }

  return (
    <div
      ref={widgetRef}
      className="absolute bg-background border rounded-lg shadow-lg overflow-hidden cursor-move"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: widget.zIndex || 1,
      }}
      onMouseDown={handleMouseDown}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30 select-none">
        <div className="flex items-center gap-2">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium capitalize">{widget.type}</span>
        </div>
        <div className="flex items-center gap-1">
          {onTransferWidget && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => onTransferWidget(widget)}
              title="Transfer to another workspace"
            >
              <Send className="w-2 h-2" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onDeleteWidget(widget.id)}>
            <X className="w-2 h-2" />
          </Button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Resize Handles */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-muted/50 hover:bg-muted"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-r border-b border-gray-400" />
      </div>
    </div>
  )
}
