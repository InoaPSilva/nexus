import { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GripVertical, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import throttle from "lodash.throttle"

const safeNum = (v: any, f = 0) => (isFinite(v = +v) ? v : f)
const safePos = (p: any) => ({ x: safeNum(p?.x, 100), y: safeNum(p?.y, 100) })
const safeSize = (s: any) => ({
    width: Math.max(200, safeNum(s?.width, 200)),
    height: Math.max(150, safeNum(s?.height, 150)),
})

interface Widget {
    id: string
    type: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    zIndex?: number
    parentWindowId?: string | null
}

interface Props {
    widget: Widget
    onUpdateWidget: (id: string, updates: Partial<Widget>) => void
    onDeleteWidget: (id: string) => void
    onTransferWidget?: (w: Widget) => void
    onDropInWidget?: (widgetId: string, item: any, itemType: string) => void
    children: ReactNode
}

const DraggableWidget: FC<Props> = ({ widget, onUpdateWidget, onDeleteWidget, onTransferWidget, children, onDropInWidget, ...props }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState(false)
    const [resizing, setResizing] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 })

    const pos = useMemo(() => safePos(widget.position), [widget.position])
    const size = useMemo(() => safeSize(widget.size), [widget.size])
    const update = useCallback((u: Partial<Widget>) => onUpdateWidget(widget.id, u), [onUpdateWidget, widget.id])

    const handleMove = useMemo(() => throttle((e: MouseEvent) => {
        if (dragging) {
            update({ position: { x: Math.max(0, e.clientX - dragStart.current.x), y: Math.max(0, e.clientY - dragStart.current.y) } })
        } else if (resizing) {
            const dx = e.clientX - resizeStart.current.x, dy = e.clientY - resizeStart.current.y
            update({ size: { width: Math.max(200, resizeStart.current.width + dx), height: Math.max(150, resizeStart.current.height + dy) } })
        }
    }, 16), [dragging, resizing, update])

    const stop = useCallback(() => { setDragging(false); setResizing(false) }, [])

    useEffect(() => {
        if (dragging || resizing) {
            document.addEventListener("mousemove", handleMove)
            document.addEventListener("mouseup", stop)
            return () => {
                document.removeEventListener("mousemove", handleMove)
                document.removeEventListener("mouseup", stop)
                handleMove.cancel()
            }
        }
    }, [dragging, resizing, handleMove, stop])

    if (widget.parentWindowId) return null

    return (
        <div
            {...props}
            ref={ref}
            className={`absolute bg-background border rounded-lg shadow-lg select-none ${dragging || resizing ? "cursor-grabbing" : "cursor-move"}`}
            style={{ left: pos.x, top: pos.y, width: size.width, height: size.height, zIndex: safeNum(widget.zIndex, 1) }}
            onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest("[data-resize]")) return
                e.stopPropagation()
                setDragging(true)
                dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
                update({ zIndex: Date.now() })
            }}
            onDrop={
                onDropInWidget
                    ? (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        try {
                            const data = JSON.parse(e.dataTransfer.getData("application/json"))
                            onDropInWidget(widget.id, data.item, data.type)
                        } catch (error) {
                            console.error("Error processing window drop:", error)
                        }
                    }
                    : undefined
            }
            onDragOver={
                onDropInWidget
                    ? (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    : undefined
            }
        >
            <div className="flex justify-between items-center p-2 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <GripVertical className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium capitalize">{widget.type}</span>
                </div>
                <div className="flex items-center gap-1">
                    {onTransferWidget && (
                        <Button variant="ghost" size="sm" onClick={() => onTransferWidget(widget)}>
                            <Send className="w-2 h-2" />
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDeleteWidget(widget.id)}>
                        <X className="w-2 h-2" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">{children}</div>
            <div
                data-resize
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={(e) => {
                    e.stopPropagation()
                    setResizing(true)
                    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height }
                }}
            />
        </div>
    )
}

export default DraggableWidget
