// "use client"

// import React from "react"

// import type { FunctionComponent, ReactNode } from "react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { Separator } from "@/components/ui/separator"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   BookOpen,
//   CheckSquare,
//   Grid3X3,
//   Plus,
//   Search,
//   FolderSyncIcon as Sync,
//   Monitor,
//   Chrome,
//   Code,
//   Music,
//   Play,
//   Pause,
//   SkipForward,
//   SkipBack,
//   ExternalLink,
//   Folder,
//   Star,
//   Settings,
//   X,
//   Minimize2,
//   Move,
//   GripVertical,
//   Maximize,
//   Square,
//   TrendingUp,
//   BarChart3,
//   Clock,
//   Target,
//   Calendar,
//   Globe,
//   Calculator,
//   Timer,
//   ChevronDown,
//   RotateCcw,
//   ZoomIn,
//   ZoomOut,
//   Edit,
//   ImageIcon,
//   FileText,
//   Video,
//   Download,
//   Eye,
//   Trash,
//   ArrowLeftRight,
//   Send,
//   Magnet,
//   Pin,
//   PinOff,
//   Minimize,
//   FolderOpen,
//   FolderPlus,
//   MoreHorizontal,
//   Maximize2,
// } from "lucide-react"
// import { useState, useEffect, useRef, useCallback, useMemo } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"

// // Throttle utility for performance
// const throttle = (func: Function, delay: number) => {
//   let timeoutId: NodeJS.Timeout | null = null
//   let lastExecTime = 0
//   return (...args: any[]) => {
//     const currentTime = Date.now()

//     if (currentTime - lastExecTime > delay) {
//       func(...args)
//       lastExecTime = currentTime
//     } else {
//       if (timeoutId) clearTimeout(timeoutId)
//       timeoutId = setTimeout(
//         () => {
//           func(...args)
//           lastExecTime = Date.now()
//         },
//         delay - (currentTime - lastExecTime),
//       )
//     }
//   }
// }

// // Utility functions for safe number handling
// const safeNumber = (value: any, fallback = 0): number => {
//   const num = Number(value)
//   return isNaN(num) || !isFinite(num) ? fallback : num
// }

// const safePosition = (position: any): { x: number; y: number } => ({
//   x: safeNumber(position?.x, 100),
//   y: safeNumber(position?.y, 100),
// })

// const safeSize = (size: any, minWidth = 300, minHeight = 200): { width: number; height: number } => ({
//   width: Math.max(minWidth, safeNumber(size?.width, 800)),
//   height: Math.max(minHeight, safeNumber(size?.height, 600)),
// })

// const getScreenDimensions = () => {
//   if (typeof window === "undefined") return { width: 1920, height: 1080 }
//   return {
//     width: Math.max(800, window.innerWidth),
//     height: Math.max(600, window.innerHeight),
//   }
// }

// // Transfer Zone Component
// const TransferZone: FunctionComponent<{
//   isVisible: boolean
//   onDrop: (targetProfileId: string, item: any, itemType: string) => void
//   profiles: DesktopProfile[]
//   currentProfile: string
// }> = ({ isVisible, onDrop, profiles, currentProfile }) => {
//   const [draggedOver, setDraggedOver] = useState<string | null>(null)

//   if (!isVisible) return null

//   return (
//     <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-4 min-w-64">
//       <div className="flex items-center gap-2 mb-3">
//         <Send className="w-4 h-4 text-blue-500" />
//         <span className="font-medium text-sm">Transfer to Workspace</span>
//       </div>
//       <div className="space-y-2">
//         {profiles
//           .filter((p) => p.id !== currentProfile)
//           .map((profile) => (
//             <div
//               key={profile.id}
//               className={`p-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
//                 draggedOver === profile.id
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//               }`}
//               onDragOver={(e) => {
//                 e.preventDefault()
//                 setDraggedOver(profile.id)
//               }}
//               onDragLeave={() => setDraggedOver(null)}
//               onDrop={(e) => {
//                 e.preventDefault()
//                 setDraggedOver(null)
//                 try {
//                   const data = JSON.parse(e.dataTransfer.getData("application/json"))
//                   onDrop(profile.id, data.item, data.type)
//                 } catch (error) {
//                   console.error("Error processing drop:", error)
//                 }
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-lg">{profile.icon}</span>
//                 <div>
//                   <p className="font-medium text-sm">{profile.name}</p>
//                   <p className="text-xs text-muted-foreground">{profile.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//       </div>
//       <div className="mt-3 text-xs text-muted-foreground text-center">Drag items here to transfer them</div>
//     </div>
//   )
// }

// // Snap Zones Component
// const SnapZones: FunctionComponent<{ isVisible: boolean; zones: SnapZone[] }> = ({ isVisible, zones }) => {
//   if (!isVisible) return null

//   return (
//     <>
//       {zones.map((zone) => (
//         <div
//           key={zone.id}
//           className="fixed border-2 border-blue-500 bg-blue-500/20 rounded-lg pointer-events-none z-40"
//           style={{
//             left: safeNumber(zone.x),
//             top: safeNumber(zone.y),
//             width: safeNumber(zone.width, 100),
//             height: safeNumber(zone.height, 100),
//           }}
//         >
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
//               {zone.type.replace("-", " ").toUpperCase()}
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   )
// }

// // Desktop Folder Component
// const DesktopFolderComponent: FunctionComponent<{
//   folder: DesktopFolder
//   onUpdateFolder: (id: string, updates: Partial<DesktopFolder>) => void
//   onDeleteFolder: (id: string) => void
//   onDropInFolder: (folderId: string, item: any, itemType: string) => void
//   onOpenFolder: (folder: DesktopFolder) => void
// }> = ({ folder, onUpdateFolder, onDeleteFolder, onDropInFolder, onOpenFolder }) => {
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [isHovered, setIsHovered] = useState(false)

//   const position = useMemo(() => safePosition(folder.position), [folder.position])
//   const size = useMemo(() => safeSize(folder.size, 80, 80), [folder.size])

//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation()
//       setIsDragging(true)
//       setDragStart({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y,
//       })
//       onUpdateFolder(folder.id, { zIndex: Date.now() })
//     },
//     [folder.id, position, onUpdateFolder],
//   )

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (isDragging) {
//         const newPosition = {
//           x: Math.max(0, e.clientX - dragStart.x),
//           y: Math.max(0, e.clientY - dragStart.y),
//         }
//         onUpdateFolder(folder.id, { position: newPosition })
//       }
//     },
//     [isDragging, dragStart, folder.id, onUpdateFolder],
//   )

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false)
//   }, [])

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove)
//       document.addEventListener("mouseup", handleMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove)
//         document.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [isDragging, handleMouseMove, handleMouseUp])

//   const handleDoubleClick = useCallback(() => {
//     onUpdateFolder(folder.id, { isOpen: true })
//     onOpenFolder(folder)
//   }, [folder, onUpdateFolder, onOpenFolder])

//   return (
//     <div
//       className={`absolute cursor-pointer transition-all ${isHovered ? "scale-105" : ""}`}
//       style={{
//         left: position.x,
//         top: position.y,
//         width: size.width,
//         height: size.height,
//         zIndex: safeNumber(folder.zIndex, 1),
//       }}
//       onMouseDown={handleMouseDown}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onDoubleClick={handleDoubleClick}
//       onDrop={(e) => {
//         e.preventDefault()
//         e.stopPropagation()
//         try {
//           const data = JSON.parse(e.dataTransfer.getData("application/json"))
//           onDropInFolder(folder.id, data.item, data.type)
//         } catch (error) {
//           console.error("Error processing folder drop:", error)
//         }
//       }}
//       onDragOver={(e) => {
//         e.preventDefault()
//         e.stopPropagation()
//       }}
//     >
//       <div className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/20 transition-colors">
//         <div className="relative">
//           <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
//             {folder.isOpen ? <FolderOpen className="w-8 h-8 text-white" /> : <Folder className="w-8 h-8 text-white" />}
//           </div>
//           {folder.items.length > 0 && (
//             <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
//               {folder.items.length}
//             </div>
//           )}
//         </div>
//         <span className="text-xs font-medium text-center max-w-20 truncate">{folder.name}</span>
//       </div>

//       {/* Context Menu */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="absolute -top-1 -right-1 w-6 h-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <MoreHorizontal className="w-3 h-3" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem onClick={handleDoubleClick}>
//             <FolderOpen className="w-4 h-4 mr-2" />
//             Open
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)}>
//             <Trash className="w-4 h-4 mr-2" />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

// // Draggable Window Component
// const DraggableWindowComponent: FunctionComponent<{
//   window: DraggableWindow
//   onUpdateWindow: (id: string, updates: Partial<DraggableWindow>) => void
//   onCloseWindow: (id: string) => void
//   onDropInWindow?: (windowId: string, item: any, itemType: string) => void
//   children: ReactNode
// }> = ({ window, onUpdateWindow, onCloseWindow, onDropInWindow, children }) => {
//   const windowRef = useRef<HTMLDivElement>(null)
//   const headerRef = useRef<HTMLDivElement>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [isResizing, setIsResizing] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
//   const [showSnapZones, setShowSnapZones] = useState(false)
//   const [snapZones, setSnapZones] = useState<SnapZone[]>([])

//   const position = useMemo(() => safePosition(window.position), [window.position])
//   const size = useMemo(
//     () => safeSize(window.size, window.isMiniMode ? 200 : 300, window.isMiniMode ? 100 : 200),
//     [window.size, window.isMiniMode],
//   )

//   // Generate snap zones
//   const generateSnapZones = useCallback(() => {
//     const { width: screenWidth, height: screenHeight } = getScreenDimensions()

//     const zones: SnapZone[] = [
//       { id: "left", x: 0, y: 0, width: Math.floor(screenWidth / 2), height: screenHeight, type: "left" },
//       {
//         id: "right",
//         x: Math.floor(screenWidth / 2),
//         y: 0,
//         width: Math.floor(screenWidth / 2),
//         height: screenHeight,
//         type: "right",
//       },
//       { id: "top", x: 0, y: 0, width: screenWidth, height: Math.floor(screenHeight / 2), type: "top" },
//       {
//         id: "bottom",
//         x: 0,
//         y: Math.floor(screenHeight / 2),
//         width: screenWidth,
//         height: Math.floor(screenHeight / 2),
//         type: "bottom",
//       },
//       {
//         id: "top-left",
//         x: 0,
//         y: 0,
//         width: Math.floor(screenWidth / 2),
//         height: Math.floor(screenHeight / 2),
//         type: "top-left",
//       },
//       {
//         id: "top-right",
//         x: Math.floor(screenWidth / 2),
//         y: 0,
//         width: Math.floor(screenWidth / 2),
//         height: Math.floor(screenHeight / 2),
//         type: "top-right",
//       },
//       {
//         id: "bottom-left",
//         x: 0,
//         y: Math.floor(screenHeight / 2),
//         width: Math.floor(screenWidth / 2),
//         height: Math.floor(screenHeight / 2),
//         type: "bottom-left",
//       },
//       {
//         id: "bottom-right",
//         x: Math.floor(screenWidth / 2),
//         y: Math.floor(screenHeight / 2),
//         width: Math.floor(screenWidth / 2),
//         height: Math.floor(screenHeight / 2),
//         type: "bottom-right",
//       },
//     ]
//     setSnapZones(zones)
//   }, [])

//   const checkSnap = useCallback(
//     (x: number, y: number) => {
//       const snapThreshold = 50
//       const { width: screenWidth, height: screenHeight } = getScreenDimensions()

//       if (x < snapThreshold) {
//         if (y < snapThreshold) return "top-left"
//         if (y > screenHeight - size.height - snapThreshold) return "bottom-left"
//         return "left"
//       }
//       if (x > screenWidth - size.width - snapThreshold) {
//         if (y < snapThreshold) return "top-right"
//         if (y > screenHeight - size.height - snapThreshold) return "bottom-right"
//         return "right"
//       }
//       if (y < snapThreshold) {
//         return "top"
//       }
//       if (y > screenHeight - size.height - snapThreshold) {
//         return "bottom"
//       }

//       return null
//     },
//     [size],
//   )

//   const applySnap = useCallback(
//     (snapType: string) => {
//       const { width: screenWidth, height: screenHeight } = getScreenDimensions()

//       const updates: Partial<DraggableWindow> = {
//         isSnapped: true,
//         snapPosition: snapType as any,
//       }

//       switch (snapType) {
//         case "left":
//           updates.position = { x: 0, y: 0 }
//           updates.size = { width: Math.floor(screenWidth / 2), height: screenHeight }
//           break
//         case "right":
//           updates.position = { x: Math.floor(screenWidth / 2), y: 0 }
//           updates.size = { width: Math.floor(screenWidth / 2), height: screenHeight }
//           break
//         case "top":
//           updates.position = { x: 0, y: 0 }
//           updates.size = { width: screenWidth, height: Math.floor(screenHeight / 2) }
//           break
//         case "bottom":
//           updates.position = { x: 0, y: Math.floor(screenHeight / 2) }
//           updates.size = { width: screenWidth, height: Math.floor(screenHeight / 2) }
//           break
//         case "top-left":
//           updates.position = { x: 0, y: 0 }
//           updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
//           break
//         case "top-right":
//           updates.position = { x: Math.floor(screenWidth / 2), y: 0 }
//           updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
//           break
//         case "bottom-left":
//           updates.position = { x: 0, y: Math.floor(screenHeight / 2) }
//           updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
//           break
//         case "bottom-right":
//           updates.position = { x: Math.floor(screenWidth / 2), y: Math.floor(screenHeight / 2) }
//           updates.size = { width: Math.floor(screenWidth / 2), height: Math.floor(screenHeight / 2) }
//           break
//       }

//       onUpdateWindow(window.id, updates)
//     },
//     [window.id, onUpdateWindow],
//   )

//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === headerRef.current || headerRef.current?.contains(e.target as Node)) {
//         e.stopPropagation()
//         if (!window.isPinned) {
//           setIsDragging(true)
//           setShowSnapZones(true)
//           generateSnapZones()
//           setDragStart({
//             x: e.clientX - position.x,
//             y: e.clientY - position.y,
//           })
//           onUpdateWindow(window.id, { zIndex: Date.now(), isSnapped: false })
//         }
//       }
//     },
//     [window.isPinned, window.id, position, onUpdateWindow, generateSnapZones],
//   )

//   const handleResizeMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation()
//       setIsResizing(true)
//       setResizeStart({
//         x: e.clientX,
//         y: e.clientY,
//         width: size.width,
//         height: size.height,
//       })
//     },
//     [size],
//   )

//   const handleMouseMove = useCallback(
//     throttle((e: MouseEvent) => {
//       if (isDragging && !window.isPinned) {
//         const newPosition = {
//           x: Math.max(0, e.clientX - dragStart.x),
//           y: Math.max(0, e.clientY - dragStart.y),
//         }
//         onUpdateWindow(window.id, { position: newPosition })
//       } else if (isResizing) {
//         const deltaX = e.clientX - resizeStart.x
//         const deltaY = e.clientY - resizeStart.y
//         const newSize = {
//           width: Math.max(window.isMiniMode ? 200 : 300, resizeStart.width + deltaX),
//           height: Math.max(window.isMiniMode ? 100 : 200, resizeStart.height + deltaY),
//         }
//         onUpdateWindow(window.id, { size: newSize })
//       }
//     }, 16), // 60fps throttling
//     [isDragging, isResizing, dragStart, resizeStart, window.id, window.isPinned, window.isMiniMode, onUpdateWindow],
//   )

//   const handleMouseUp = useCallback(
//     (e: MouseEvent) => {
//       if (isDragging && !window.isPinned) {
//         const snapType = checkSnap(e.clientX - dragStart.x, e.clientY - dragStart.y)
//         if (snapType) {
//           applySnap(snapType)
//         }
//         setShowSnapZones(false)
//       }
//       setIsDragging(false)
//       setIsResizing(false)
//     },
//     [isDragging, checkSnap, applySnap, dragStart, window.isPinned],
//   )

//   useEffect(() => {
//     if (isDragging || isResizing) {
//       document.addEventListener("mousemove", handleMouseMove)
//       document.addEventListener("mouseup", handleMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove)
//         document.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

//   if (window.isMinimized) {
//     return null
//   }

//   // Calculate final dimensions and position
//   const finalPosition = window.isMaximized ? { x: 0, y: 0 } : position
//   const finalSize = window.isMaximized ? getScreenDimensions() : window.isMiniMode ? { width: 300, height: 100 } : size

//   return (
//     <>
//       <SnapZones isVisible={showSnapZones && !window.isPinned} zones={snapZones} />
//       <div
//         ref={windowRef}
//         className={`fixed bg-background border overflow-hidden ${
//           window.isMiniMode ? "rounded-full shadow-xl border-2" : "rounded-lg shadow-2xl"
//         } ${window.isPinned ? "border-blue-500 border-2" : ""}`}
//         style={{
//           left: finalPosition.x,
//           top: finalPosition.y,
//           width: finalSize.width,
//           height: finalSize.height,
//           zIndex: window.isPinned ? 9999 : safeNumber(window.zIndex, 1),
//         }}
//         onDrop={
//           onDropInWindow
//             ? (e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 try {
//                   const data = JSON.parse(e.dataTransfer.getData("application/json"))
//                   onDropInWindow(window.id, data.item, data.type)
//                 } catch (error) {
//                   console.error("Error processing window drop:", error)
//                 }
//               }
//             : undefined
//         }
//         onDragOver={
//           onDropInWindow
//             ? (e) => {
//                 e.preventDefault()
//                 e.stopPropagation()
//               }
//             : undefined
//         }
//       >
//         {/* Window Header */}
//         <div
//           ref={headerRef}
//           className={`flex items-center justify-between p-2 border-b bg-muted/30 select-none ${
//             window.isPinned ? "cursor-default" : "cursor-move"
//           } ${window.isMiniMode ? "h-8" : "h-12"}`}
//           onMouseDown={handleMouseDown}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className={`bg-primary rounded flex items-center justify-center ${window.isMiniMode ? "w-3 h-3" : "w-4 h-4"}`}
//             >
//               {window.type === "notes" && (
//                 <BookOpen className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "tasks" && (
//                 <CheckSquare className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "chrome" && (
//                 <Chrome className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "vscode" && (
//                 <Code className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "spotify" && (
//                 <Music className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "gallery" && (
//                 <ImageIcon className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "file-preview" && (
//                 <FileText className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "folder" && (
//                 <Folder className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//               {window.type === "integrations" && (
//                 <Settings className={`text-primary-foreground ${window.isMiniMode ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
//               )}
//             </div>
//             <span className={`font-medium ${window.isMiniMode ? "text-xs" : "text-sm"} truncate max-w-32`}>
//               {window.title}
//             </span>
//             {window.isSnapped && !window.isMiniMode && (
//               <Badge variant="outline" className="text-xs">
//                 <Magnet className="w-2 h-2 mr-1" />
//                 {window.snapPosition}
//               </Badge>
//             )}
//             {window.isPinned && <Pin className={`text-blue-500 ${window.isMiniMode ? "w-2 h-2" : "w-3 h-3"}`} />}
//           </div>

//           <div className="flex items-center gap-1">
//             {/* Pin/Unpin Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
//               onClick={() => onUpdateWindow(window.id, { isPinned: !window.isPinned })}
//               title={window.isPinned ? "Unpin window" : "Pin window on top"}
//             >
//               {window.isPinned ? (
//                 <PinOff className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
//               ) : (
//                 <Pin className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
//               )}
//             </Button>

//             {/* Mini Mode Toggle */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
//               onClick={() => onUpdateWindow(window.id, { isMiniMode: !window.isMiniMode })}
//               title={window.isMiniMode ? "Exit mini mode" : "Enter mini mode"}
//             >
//               <Minimize className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
//             </Button>

//             {!window.isMiniMode && (
//               <>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0"
//                   onClick={() => onUpdateWindow(window.id, { isMinimized: true })}
//                 >
//                   <Minimize2 className="w-3 h-3" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0"
//                   onClick={() => onUpdateWindow(window.id, { isMaximized: !window.isMaximized, isSnapped: false })}
//                 >
//                   {window.isMaximized ? <Square className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
//                 </Button>
//               </>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               className={`p-0 ${window.isMiniMode ? "h-4 w-4" : "h-6 w-6"}`}
//               onClick={() => onCloseWindow(window.id)}
//             >
//               <X className={window.isMiniMode ? "w-2 h-2" : "w-3 h-3"} />
//             </Button>
//           </div>
//         </div>

//         {/* Window Content */}
//         <div className="flex-1 overflow-hidden">{children}</div>

//         {/* Resize Handles */}
//         {!window.isMaximized && !window.isSnapped && !window.isPinned && !window.isMiniMode && (
//           <>
//             <div
//               className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted/50 hover:bg-muted"
//               onMouseDown={handleResizeMouseDown}
//             >
//               <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-gray-400" />
//             </div>
//             <div
//               className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-muted/30"
//               onMouseDown={(e) => {
//                 e.stopPropagation()
//                 setIsResizing(true)
//                 setResizeStart({
//                   x: e.clientX,
//                   y: e.clientY,
//                   width: size.width,
//                   height: size.height,
//                 })
//               }}
//             />
//             <div
//               className="absolute right-0 top-12 bottom-4 w-2 cursor-e-resize hover:bg-muted/30"
//               onMouseDown={(e) => {
//                 e.stopPropagation()
//                 setIsResizing(true)
//                 setResizeStart({
//                   x: e.clientX,
//                   y: e.clientY,
//                   width: size.width,
//                   height: size.height,
//                 })
//               }}
//             />
//           </>
//         )}
//       </div>
//     </>
//   )
// }

// // Draggable Widget Component
// const DraggableWidget: FunctionComponent<{
//   widget: DraggableWidget
//   onUpdateWidget: (id: string, updates: Partial<DraggableWidget>) => void
//   onDeleteWidget: (id: string) => void
//   onTransferWidget?: (widget: DraggableWidget) => void
//   children: ReactNode
// }> = ({ widget, onUpdateWidget, onDeleteWidget, onTransferWidget, children }) => {
//   const widgetRef = useRef<HTMLDivElement>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [isResizing, setIsResizing] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
//   const [shouldRender, setShouldRender] = useState(true)

//   const position = useMemo(() => safePosition(widget.position), [widget.position])
//   const size = useMemo(() => safeSize(widget.size, 200, 150), [widget.size])

//   // Don't render if widget is inside a window
//   useEffect(() => {
//     if (widget.parentWindowId) {
//       setShouldRender(false)
//     } else {
//       setShouldRender(true)
//     }
//   }, [widget.parentWindowId])

//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation()
//       setIsDragging(true)
//       setDragStart({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y,
//       })
//       onUpdateWidget(widget.id, { zIndex: Date.now() })
//     },
//     [widget.id, position, onUpdateWidget],
//   )

//   const handleDragStart = useCallback(
//     (e: React.DragEvent) => {
//       e.dataTransfer.setData("application/json", JSON.stringify({ item: widget, type: "widget" }))
//     },
//     [widget],
//   )

//   const handleResizeMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation()
//       setIsResizing(true)
//       setResizeStart({
//         x: e.clientX,
//         y: e.clientY,
//         width: size.width,
//         height: size.height,
//       })
//     },
//     [size],
//   )

//   const handleMouseMove = useCallback(
//     throttle((e: MouseEvent) => {
//       if (isDragging) {
//         const newPosition = {
//           x: Math.max(0, e.clientX - dragStart.x),
//           y: Math.max(0, e.clientY - dragStart.y),
//         }
//         onUpdateWidget(widget.id, { position: newPosition })
//       } else if (isResizing) {
//         const deltaX = e.clientX - resizeStart.x
//         const deltaY = e.clientY - resizeStart.y
//         const newSize = {
//           width: Math.max(200, resizeStart.width + deltaX),
//           height: Math.max(150, resizeStart.height + deltaY),
//         }
//         onUpdateWidget(widget.id, { size: newSize })
//       }
//     }, 16),
//     [isDragging, isResizing, dragStart, resizeStart, widget.id, onUpdateWidget],
//   )

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false)
//     setIsResizing(false)
//   }, [])

//   useEffect(() => {
//     if (isDragging || isResizing) {
//       document.addEventListener("mousemove", handleMouseMove)
//       document.addEventListener("mouseup", handleMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove)
//         document.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

//   if (!shouldRender) {
//     return null
//   }

//   return (
//     <div
//       ref={widgetRef}
//       className="absolute bg-background border rounded-lg shadow-lg overflow-hidden cursor-move"
//       style={{
//         left: position.x,
//         top: position.y,
//         width: size.width,
//         height: size.height,
//         zIndex: safeNumber(widget.zIndex, 1),
//       }}
//       onMouseDown={handleMouseDown}
//       draggable
//       onDragStart={handleDragStart}
//     >
//       {/* Widget Header */}
//       <div className="flex items-center justify-between p-2 border-b bg-muted/30 select-none">
//         <div className="flex items-center gap-2">
//           <GripVertical className="w-3 h-3 text-muted-foreground" />
//           <span className="text-xs font-medium capitalize">{widget.type}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           {onTransferWidget && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-4 w-4 p-0"
//               onClick={() => onTransferWidget(widget)}
//               title="Transfer to another workspace"
//             >
//               <Send className="w-2 h-2" />
//             </Button>
//           )}
//           <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onDeleteWidget(widget.id)}>
//             <X className="w-2 h-2" />
//           </Button>
//         </div>
//       </div>

//       {/* Widget Content */}
//       <div className="flex-1 overflow-hidden">{children}</div>

//       {/* Resize Handles */}
//       <>
//         <div
//           className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-muted/50 hover:bg-muted"
//           onMouseDown={handleResizeMouseDown}
//         >
//           <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-r border-b border-gray-400" />
//         </div>
//         <div
//           className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize hover:bg-muted/30"
//           onMouseDown={(e) => {
//             e.stopPropagation()
//             setIsResizing(true)
//             setResizeStart({
//               x: e.clientX,
//               y: e.clientY,
//               width: size.width,
//               height: size.height,
//             })
//           }}
//         />
//         <div
//           className="absolute right-0 top-8 bottom-3 w-1 cursor-e-resize hover:bg-muted/30"
//           onMouseDown={(e) => {
//             e.stopPropagation()
//             setIsResizing(true)
//             setResizeStart({
//               x: e.clientX,
//               y: e.clientY,
//               width: size.width,
//               height: size.height,
//             })
//           }}
//         />
//       </>
//     </div>
//   )
// }

// // Draggable Card Component
// const DraggableCard: FunctionComponent<{
//   children: ReactNode
//   onDragStart?: (e: React.DragEvent) => void
//   className?: string
// }> = ({ children, onDragStart, className = "" }) => {
//   return (
//     <div draggable onDragStart={onDragStart} className={`cursor-move hover:shadow-md transition-shadow ${className}`}>
//       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         <Move className="w-3 h-3 text-muted-foreground" />
//       </div>
//       {children}
//     </div>
//   )
// }

// // Minimized Window Preview Component
// const MinimizedWindowPreview: FunctionComponent<{
//   window: DraggableWindow
//   onClick: () => void
//   onClose: (id: string) => void
// }> = ({ window, onClick, onClose }) => {
//   return (
//     <div className="group relative">
//       <div
//         className="w-12 h-12 bg-background border rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center relative overflow-hidden"
//         onClick={onClick}
//       >
//         {/* Window preview content */}
//         <div className="w-full h-full flex flex-col">
//           <div className="h-2 bg-muted/50 flex items-center justify-center">
//             <div className="w-4 h-1 bg-primary rounded-full" />
//           </div>
//           <div className="flex-1 bg-muted/20 flex items-center justify-center">
//             {window.type === "notes" && <BookOpen className="w-4 h-4 text-primary" />}
//             {window.type === "tasks" && <CheckSquare className="w-4 h-4 text-primary" />}
//             {window.type === "gallery" && <ImageIcon className="w-4 h-4 text-primary" />}
//             {window.type === "chrome" && <Chrome className="w-4 h-4 text-primary" />}
//             {window.type === "vscode" && <Code className="w-4 h-4 text-primary" />}
//             {window.type === "spotify" && <Music className="w-4 h-4 text-primary" />}
//             {window.type === "file-preview" && <FileText className="w-4 h-4 text-primary" />}
//             {window.type === "folder" && <Folder className="w-4 h-4 text-primary" />}
//             {window.type === "integrations" && <Settings className="w-4 h-4 text-primary" />}
//           </div>
//         </div>

//         {/* Status indicators */}
//         {window.isPinned && (
//           <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
//             <Pin className="w-1.5 h-1.5 text-white" />
//           </div>
//         )}

//         {window.isMiniMode && (
//           <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
//             <Minimize className="w-1.5 h-1.5 text-white" />
//           </div>
//         )}

//         {/* Close button */}
//         <button
//           className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600 z-10"
//           onClick={(e) => {
//             e.stopPropagation()
//             onClose(window.id)
//           }}
//         >
//           <X className="w-2 h-2" />
//         </button>
//       </div>

//       {/* Tooltip */}
//       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//         {window.title}
//       </div>
//     </div>
//   )
// }

// // Mini Player Overlay Component
// const MiniPlayerOverlay: FunctionComponent<{
//   window: DraggableWindow
//   onUpdateWindow: (id: string, updates: Partial<DraggableWindow>) => void
//   onCloseWindow: (id: string) => void
// }> = ({ window, onUpdateWindow, onCloseWindow }) => {
//   const [position, setPosition] = useState(() => {
//     const { width: screenWidth, height: screenHeight } = getScreenDimensions()
//     const pos = safePosition(window.position)
//     return {
//       x: Math.max(0, Math.min(screenWidth - 300, pos.x)),
//       y: Math.max(0, Math.min(screenHeight - 100, pos.y)),
//     }
//   })
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation()
//       setIsDragging(true)
//       setDragStart({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y,
//       })
//     },
//     [position],
//   )

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (isDragging) {
//         const { width: screenWidth, height: screenHeight } = getScreenDimensions()
//         const newPosition = {
//           x: Math.max(0, Math.min(screenWidth - 300, e.clientX - dragStart.x)),
//           y: Math.max(0, Math.min(screenHeight - 100, e.clientY - dragStart.y)),
//         }
//         setPosition(newPosition)
//       }
//     },
//     [isDragging, dragStart],
//   )

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false)
//     // Update window position
//     onUpdateWindow(window.id, { position })
//   }, [position, window.id, onUpdateWindow])

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove)
//       document.addEventListener("mouseup", handleMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove)
//         document.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [isDragging, handleMouseMove, handleMouseUp])

//   return (
//     <div
//       className="fixed bg-background/95 backdrop-blur-sm border-2 border-primary/50 rounded-xl shadow-2xl overflow-hidden cursor-move"
//       style={{
//         left: position.x,
//         top: position.y,
//         width: 300,
//         height: 100,
//         zIndex: 10000,
//       }}
//       onMouseDown={handleMouseDown}
//     >
//       <div className="flex items-center justify-between p-2 bg-gradient-to-r from-primary/20 to-primary/10">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
//           <span className="text-xs font-medium truncate max-w-32">{window.title}</span>
//         </div>
//         <div className="flex items-center gap-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-4 w-4 p-0"
//             onClick={() => onUpdateWindow(window.id, { isMiniMode: false })}
//           >
//             <Maximize2 className="w-2 h-2" />
//           </Button>
//           <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => onCloseWindow(window.id)}>
//             <X className="w-2 h-2" />
//           </Button>
//         </div>
//       </div>
//       <div className="p-2 h-16 overflow-hidden">
//         {/* Mini content based on window type */}
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
//             <Music className="w-4 h-4 text-white" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-xs font-medium truncate">{window.title}</p>
//             <p className="text-xs text-muted-foreground">Mini mode active</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Memoized components for better performance - MOVED AFTER COMPONENT DEFINITIONS
// const MemoizedDraggableWidget = React.memo(DraggableWidget)
// const MemoizedDraggableWindowComponent = React.memo(DraggableWindowComponent)
// const MemoizedDesktopFolderComponent = React.memo(DesktopFolderComponent)

// export default function Component() {
//   const [activeSection, setActiveSection] = useState("desktop")
//   const [currentProfile, setCurrentProfile] = useState("personal")
//   const [profiles, setProfiles] = useState<DesktopProfile[]>([
//     {
//       id: "personal",
//       name: "Personal",
//       icon: "🏠",
//       color: "blue",
//       description: "Personal workspace",
//       windows: [],
//       widgets: [],
//       folders: [],
//       backgroundStyle: "from-blue-100 to-purple-100",
//       backgroundType: "gradient",
//       uploadedFiles: [],
//     },
//     {
//       id: "work",
//       name: "Work",
//       icon: "💼",
//       color: "green",
//       description: "Work projects and tasks",
//       windows: [],
//       widgets: [],
//       folders: [],
//       backgroundStyle: "from-green-100 to-blue-100",
//       backgroundType: "gradient",
//       uploadedFiles: [],
//     },
//     {
//       id: "learning",
//       name: "Learning",
//       icon: "📚",
//       color: "purple",
//       description: "Study and research",
//       windows: [],
//       widgets: [],
//       folders: [],
//       backgroundStyle: "from-purple-100 to-pink-100",
//       backgroundType: "gradient",
//       uploadedFiles: [],
//     },
//   ])

//   const [notes, setNotes] = useState<Note[]>([])
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [searchQuery, setSearchQuery] = useState("")
//   const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced")
//   const [isNewProfileOpen, setIsNewProfileOpen] = useState(false)
//   const [isNewWidgetOpen, setIsNewWidgetOpen] = useState(false)
//   const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
//   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
//   const [editingProfile, setEditingProfile] = useState<DesktopProfile | null>(null)
//   const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
//   const [transferItems, setTransferItems] = useState<{ windows: DraggableWindow[]; widgets: DraggableWidget[] }>({
//     windows: [],
//     widgets: [],
//   })
//   const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
//   const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false)
//   const [showTransferZone, setShowTransferZone] = useState(false)
//   const [newFolderName, setNewFolderName] = useState("")

//   // Desktop navigation state
//   const [desktopOffset, setDesktopOffset] = useState({ x: 0, y: 0 })
//   const [desktopZoom, setDesktopZoom] = useState(1)
//   const [isDraggingDesktop, setIsDraggingDesktop] = useState(false)
//   const [desktopDragStart, setDesktopDragStart] = useState({ x: 0, y: 0 })
//   const desktopRef = useRef<HTMLDivElement>(null)

//   const [currentTrack, setCurrentTrack] = useState<SpotifyTrack>({
//     id: "1",
//     name: "Bohemian Rhapsody",
//     artist: "Queen",
//     album: "A Night at the Opera",
//     duration: 355,
//     isPlaying: true,
//     progress: 120,
//   })

//   const [statistics, setStatistics] = useState<StatisticsData>({
//     tasksCompleted: 12,
//     totalTasks: 18,
//     notesCreated: 34,
//     hoursWorked: 6.5,
//     productivity: 78,
//     activeProjects: 3,
//   })

//   // Get current profile data with safe access
//   const profile = useMemo(
//     () => profiles.find((p) => p.id === currentProfile) || profiles[0],
//     [profiles, currentProfile],
//   )
//   const windows = useMemo(() => profile?.windows || [], [profile])
//   const widgets = useMemo(() => profile?.widgets || [], [profile])
//   const folders = useMemo(() => profile?.folders || [], [profile])

//   // Initialize with sample data
//   useEffect(() => {
//     const sampleNotes: Note[] = [
//       {
//         id: "1",
//         title: "Project Planning",
//         content: "Planning the next phase of development...",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         tags: ["planning", "development"],
//         source: "nexus",
//       },
//       {
//         id: "2",
//         title: "Meeting Notes",
//         content: "Weekly team meeting notes and action items...",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         tags: ["meetings", "work"],
//         source: "obsidian",
//       },
//     ]

//     const sampleTasks: Task[] = [
//       {
//         id: "1",
//         title: "Review Nexus integrations",
//         description: "Test all integration connections",
//         completed: false,
//         priority: "high",
//         createdAt: new Date(),
//       },
//       {
//         id: "2",
//         title: "Update documentation",
//         description: "Update project documentation",
//         completed: true,
//         priority: "medium",
//         createdAt: new Date(),
//       },
//     ]

//     setNotes(sampleNotes)
//     setTasks(sampleTasks)

//     // Add initial widgets to personal profile
//     const initialWidgets: DraggableWidget[] = [
//       {
//         id: "spotify-widget",
//         type: "spotify",
//         position: { x: 20, y: 100 },
//         size: { width: 300, height: 200 },
//         content: currentTrack,
//         zIndex: 100,
//       },
//       {
//         id: "stats-widget",
//         type: "statistics",
//         position: { x: 340, y: 100 },
//         size: { width: 280, height: 220 },
//         content: statistics,
//         zIndex: 101,
//       },
//     ]

//     // Update personal profile with initial widgets
//     setProfiles((prev) => prev.map((p) => (p.id === "personal" ? { ...p, widgets: initialWidgets } : p)))
//   }, [])

//   // Simulate sync status and data updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSyncStatus((prev) => (prev === "synced" ? "syncing" : "synced"))

//       if (currentTrack.isPlaying) {
//         setCurrentTrack((prev) => ({
//           ...prev,
//           progress: Math.min(prev.progress + 1, prev.duration),
//         }))
//       }

//       // Update statistics
//       setStatistics((prev) => ({
//         ...prev,
//         hoursWorked: Math.round((prev.hoursWorked + 0.01) * 100) / 100,
//         productivity: Math.min(100, prev.productivity + Math.random() * 2 - 1),
//       }))
//     }, 1000)
//     return () => clearInterval(interval)
//   }, [currentTrack.isPlaying])

//   // Desktop navigation handlers
//   const handleDesktopMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.button === 1 && e.target === desktopRef.current) {
//         e.preventDefault()
//         setIsDraggingDesktop(true)
//         setDesktopDragStart({
//           x: e.clientX - desktopOffset.x,
//           y: e.clientY - desktopOffset.y,
//         })
//       }
//     },
//     [desktopOffset],
//   )

//   const handleDesktopMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (isDraggingDesktop) {
//         setDesktopOffset({
//           x: e.clientX - desktopDragStart.x,
//           y: e.clientY - desktopDragStart.y,
//         })
//       }
//     },
//     [isDraggingDesktop, desktopDragStart],
//   )

//   const handleDesktopMouseUp = useCallback(() => {
//     setIsDraggingDesktop(false)
//   }, [])

//   useEffect(() => {
//     if (isDraggingDesktop) {
//       document.addEventListener("mousemove", handleDesktopMouseMove)
//       document.addEventListener("mouseup", handleDesktopMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleDesktopMouseMove)
//         document.removeEventListener("mouseup", handleDesktopMouseUp)
//       }
//     }
//   }, [isDraggingDesktop, handleDesktopMouseMove, handleDesktopMouseUp])

//   const openWindow = useCallback(
//     (type: DraggableWindow["type"], title: string, content?: any) => {
//       const newWindow: DraggableWindow = {
//         id: Date.now().toString(),
//         title,
//         type,
//         position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
//         size: { width: 800, height: 600 },
//         isMinimized: false,
//         isMaximized: false,
//         isSnapped: false,
//         isPinned: false,
//         isMiniMode: false,
//         zIndex: Date.now(),
//         content,
//       }

//       setProfiles((prev) =>
//         prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
//       )
//     },
//     [windows.length, currentProfile],
//   )

//   const openFilePreviewWindow = useCallback(
//     (file: UploadedFile) => {
//       const newWindow: DraggableWindow = {
//         id: Date.now().toString(),
//         title: file.name,
//         type: "file-preview",
//         position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
//         size: { width: 600, height: 400 },
//         isMinimized: false,
//         isMaximized: false,
//         isSnapped: false,
//         isPinned: false,
//         isMiniMode: false,
//         zIndex: Date.now(),
//         content: file,
//       }

//       setProfiles((prev) =>
//         prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
//       )
//     },
//     [windows.length, currentProfile],
//   )

//   const openFolderWindow = useCallback(
//     (folder: DesktopFolder) => {
//       // Check if folder window already exists
//       const existingWindow = windows.find((w) => w.type === "folder" && w.content?.id === folder.id)
//       if (existingWindow) {
//         // Just bring to front if already open
//         updateWindow(existingWindow.id, { isMinimized: false, zIndex: Date.now() })
//         return
//       }

//       const newWindow: DraggableWindow = {
//         id: Date.now().toString(),
//         title: folder.name,
//         type: "folder",
//         position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
//         size: { width: 600, height: 400 },
//         isMinimized: false,
//         isMaximized: false,
//         isSnapped: false,
//         isPinned: false,
//         isMiniMode: false,
//         zIndex: Date.now(),
//         content: folder,
//       }

//       setProfiles((prev) =>
//         prev.map((p) => (p.id === currentProfile ? { ...p, windows: [...p.windows, newWindow] } : p)),
//       )
//     },
//     [windows, currentProfile],
//   )

//   const updateWindow = useCallback(
//     (id: string, updates: Partial<DraggableWindow>) => {
//       // Ensure size values are valid numbers
//       if (updates.size) {
//         updates.size = safeSize(updates.size, 300, 200)
//       }

//       // Ensure position values are valid numbers
//       if (updates.position) {
//         updates.position = safePosition(updates.position)
//       }

//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 windows: p.windows.map((window) => (window.id === id ? { ...window, ...updates } : window)),
//               }
//             : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const closeWindow = useCallback(
//     (id: string) => {
//       const window = windows.find((w) => w.id === id)
//       if (window && window.type === "folder" && window.content?.id) {
//         // Mark folder as closed
//         updateFolder(window.content.id, { isOpen: false })
//       }

//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 windows: p.windows.filter((window) => window.id !== id),
//               }
//             : p,
//         ),
//       )
//     },
//     [windows, currentProfile],
//   )

//   const updateWidget = useCallback(
//     (id: string, updates: Partial<DraggableWidget>) => {
//       // Ensure size values are valid numbers
//       if (updates.size) {
//         updates.size = safeSize(updates.size, 200, 150)
//       }

//       // Ensure position values are valid numbers
//       if (updates.position) {
//         updates.position = safePosition(updates.position)
//       }

//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 widgets: p.widgets.map((widget) => (widget.id === id ? { ...widget, ...updates } : widget)),
//               }
//             : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const deleteWidget = useCallback(
//     (id: string) => {
//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 widgets: p.widgets.filter((widget) => widget.id !== id),
//               }
//             : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const addWidget = useCallback(
//     (type: DraggableWidget["type"], content: any) => {
//       const newWidget: DraggableWidget = {
//         id: Date.now().toString(),
//         type,
//         position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
//         size:
//           type === "statistics"
//             ? { width: 280, height: 220 }
//             : type === "clock"
//               ? { width: 200, height: 120 }
//               : type === "weather"
//                 ? { width: 250, height: 180 }
//                 : type === "file-preview"
//                   ? { width: 300, height: 250 }
//                   : { width: 250, height: 200 },
//         content,
//         zIndex: Date.now(),
//       }

//       setProfiles((prev) =>
//         prev.map((p) => (p.id === currentProfile ? { ...p, widgets: [...p.widgets, newWidget] } : p)),
//       )
//     },
//     [currentProfile],
//   )

//   const createFolder = useCallback(
//     (name: string) => {
//       const newFolder: DesktopFolder = {
//         id: Date.now().toString(),
//         name,
//         icon: "📁",
//         position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
//         size: { width: 80, height: 80 },
//         isOpen: false,
//         items: [],
//         zIndex: Date.now(),
//       }

//       setProfiles((prev) =>
//         prev.map((p) => (p.id === currentProfile ? { ...p, folders: [...p.folders, newFolder] } : p)),
//       )
//     },
//     [currentProfile],
//   )

//   const updateFolder = useCallback(
//     (id: string, updates: Partial<DesktopFolder>) => {
//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 folders: p.folders.map((folder) => (folder.id === id ? { ...folder, ...updates } : folder)),
//               }
//             : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const deleteFolder = useCallback(
//     (id: string) => {
//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 folders: p.folders.filter((folder) => folder.id !== id),
//               }
//             : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const dropInFolder = useCallback(
//     (folderId: string, item: any, itemType: string) => {
//       if (itemType === "widget") {
//         // Move widget to folder
//         setProfiles((prev) =>
//           prev.map((p) =>
//             p.id === currentProfile
//               ? {
//                   ...p,
//                   widgets: p.widgets.filter((w) => w.id !== item.id),
//                   folders: p.folders.map((folder) =>
//                     folder.id === folderId
//                       ? { ...folder, items: [...folder.items, { ...item, parentFolderId: folderId }] }
//                       : folder,
//                   ),
//                 }
//               : p,
//           ),
//         )
//       } else if (itemType === "file") {
//         // Move file to folder
//         setProfiles((prev) =>
//           prev.map((p) =>
//             p.id === currentProfile
//               ? {
//                   ...p,
//                   uploadedFiles: p.uploadedFiles.filter((f) => f.id !== item.id),
//                   folders: p.folders.map((folder) =>
//                     folder.id === folderId
//                       ? { ...folder, items: [...folder.items, { ...item, parentFolderId: folderId }] }
//                       : folder,
//                   ),
//                 }
//               : p,
//           ),
//         )
//       }
//     },
//     [currentProfile],
//   )

//   const dropInWindow = useCallback((windowId: string, item: any, itemType: string) => {
//     // Handle dropping items into windows
//     console.log("Dropped", itemType, "into window", windowId)
//   }, [])

//   const createProfile = useCallback((name: string, icon: string, color: string, description: string) => {
//     const newProfile: DesktopProfile = {
//       id: Date.now().toString(),
//       name,
//       icon,
//       color,
//       description,
//       windows: [],
//       widgets: [],
//       folders: [],
//       backgroundStyle: `from-${color}-100 to-blue-100`,
//       backgroundType: "gradient",
//       uploadedFiles: [],
//     }
//     setProfiles((prev) => [...prev, newProfile])
//   }, [])

//   const createWidget = useCallback(
//     (type: DraggableWidget["type"]) => {
//       let content = {}

//       switch (type) {
//         case "statistics":
//           content = statistics
//           break
//         case "weather":
//           content = { temperature: 22, condition: "Sunny", location: "San Francisco" }
//           break
//         case "clock":
//           content = { time: new Date() }
//           break
//         case "calendar":
//           content = { date: new Date(), events: [] }
//           break
//         case "calculator":
//           content = { display: "0" }
//           break
//         case "timer":
//           content = { duration: 0, isRunning: false }
//           break
//         default:
//           content = {}
//       }

//       addWidget(type, content)
//     },
//     [statistics, addWidget],
//   )

//   const handleCardDragStart = useCallback((e: React.DragEvent, item: any, type: string) => {
//     try {
//       const data = JSON.stringify({ item, type })
//       e.dataTransfer.setData("application/json", data)
//       e.dataTransfer.setData("text/plain", `${type}: ${item.title || "Item"}`)
//       setShowTransferZone(true)
//     } catch (error) {
//       console.error("Error starting drag operation:", error)
//     }
//   }, [])

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       setShowTransferZone(false)
//       try {
//         const jsonData = e.dataTransfer.getData("application/json")
//         if (!jsonData) {
//           console.warn("No JSON data found in drop event")
//           return
//         }

//         const data = JSON.parse(jsonData)
//         const rect = e.currentTarget.getBoundingClientRect()
//         const x = (e.clientX - rect.left - desktopOffset.x) / desktopZoom
//         const y = (e.clientY - rect.top - desktopOffset.y) / desktopZoom

//         if (data.type === "note") {
//           addWidget("note", data.item)
//         } else if (data.type === "task") {
//           addWidget("task", data.item)
//         } else if (data.type === "file") {
//           openFilePreviewWindow(data.item)
//         }
//       } catch (error) {
//         console.error("Error processing dropped item:", error)
//       }
//     },
//     [desktopOffset, desktopZoom, addWidget, openFilePreviewWindow],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//   }, [])

//   const handleDragEnd = useCallback(() => {
//     setShowTransferZone(false)
//   }, [])

//   const resetDesktopView = useCallback(() => {
//     setDesktopOffset({ x: 0, y: 0 })
//     setDesktopZoom(1)
//   }, [])

//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }, [])

//   const handleFileUpload = useCallback(
//     async (files: FileList) => {
//       const newFiles = Array.from(files)

//       for (const file of newFiles) {
//         const uploadedFile: UploadedFile = {
//           id: Date.now().toString() + Math.random(),
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           url: URL.createObjectURL(file),
//           uploadedAt: new Date(),
//         }

//         // Add to profile's uploaded files
//         setProfiles((prev) =>
//           prev.map((p) => (p.id === currentProfile ? { ...p, uploadedFiles: [...p.uploadedFiles, uploadedFile] } : p)),
//         )

//         // If it's a text file, convert to note
//         if (
//           (file.type && file.type.startsWith("text/")) ||
//           (file.name && (file.name.endsWith(".txt") || file.name.endsWith(".md")))
//         ) {
//           try {
//             const content = await file.text()
//             const newNote: Note = {
//               id: Date.now().toString() + Math.random(),
//               title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
//               content,
//               createdAt: new Date(),
//               updatedAt: new Date(),
//               tags: ["imported"],
//               source: "file",
//             }
//             setNotes((prev) => [newNote, ...prev])
//           } catch (error) {
//             console.error("Error reading text file:", error)
//           }
//         }

//         // Create file preview widget for all files
//         const filePreviewWidget: DraggableWidget = {
//           id: Date.now().toString() + Math.random(),
//           type: "file-preview",
//           position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
//           size: { width: 300, height: 250 },
//           content: uploadedFile,
//           zIndex: Date.now(),
//         }

//         setProfiles((prev) =>
//           prev.map((p) => (p.id === currentProfile ? { ...p, widgets: [...p.widgets, filePreviewWidget] } : p)),
//         )
//       }
//     },
//     [currentProfile],
//   )

//   const deleteFile = useCallback(
//     (fileId: string) => {
//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile ? { ...p, uploadedFiles: p.uploadedFiles.filter((f) => f.id !== fileId) } : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const renderWindowContent = useCallback(
//     (window: DraggableWindow) => {
//       switch (window.type) {
//         case "file-preview":
//           const file = window.content as UploadedFile
//           return (
//             <div className="h-full overflow-hidden">
//               {file?.type?.startsWith("image/") ? (
//                 <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-contain" />
//               ) : file?.type?.startsWith("video/") ? (
//                 <video
//                   src={file.url}
//                   controls
//                   className="w-full h-full"
//                   style={{ maxHeight: "100%" }}
//                   preload="metadata"
//                 />
//               ) : file?.type?.startsWith("audio/") ? (
//                 <div className="flex items-center justify-center h-full">
//                   <audio src={file.url} controls className="w-full max-w-md" />
//                 </div>
//               ) : (file?.type && file.type.startsWith("text/")) ||
//                 (file?.name && (file.name.endsWith(".md") || file.name.endsWith(".txt"))) ? (
//                 <div className="h-full p-4 overflow-y-auto bg-white">
//                   <iframe
//                     src={file.url}
//                     className="w-full h-full border-0"
//                     title={file.name}
//                     sandbox="allow-same-origin"
//                   />
//                 </div>
//               ) : file?.name && (file.name.endsWith(".doc") || file.name.endsWith(".docx")) ? (
//                 <iframe
//                   src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
//                   className="w-full h-full border-0"
//                   title={file.name}
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center">
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
//                     <p className="text-muted-foreground">Preview not available for this file type</p>
//                     <Button
//                       className="mt-4"
//                       onClick={() => {
//                         const link = document.createElement("a")
//                         link.href = file.url
//                         link.download = file.name
//                         link.click()
//                       }}
//                     >
//                       <Download className="w-4 h-4 mr-2" />
//                       Download
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )

//         case "folder":
//           const folder = window.content as DesktopFolder
//           return (
//             <div className="h-full overflow-hidden">
//               <div className="p-4 border-b">
//                 <h3 className="font-semibold">{folder.name}</h3>
//                 <p className="text-sm text-muted-foreground">{folder.items.length} items</p>
//               </div>
//               <div className="p-4 overflow-y-auto">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {folder.items.map((item) => (
//                     <Card
//                       key={item.id}
//                       className="cursor-pointer hover:shadow-md transition-shadow"
//                       onClick={() => {
//                         if ("type" in item && item.type) {
//                           // It's a file
//                           openFilePreviewWindow(item as UploadedFile)
//                         } else if ("content" in item) {
//                           // It's a widget - create a new widget on desktop
//                           const widgetItem = item as DraggableWidget
//                           const newWidget: DraggableWidget = {
//                             ...widgetItem,
//                             id: Date.now().toString(),
//                             position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
//                             zIndex: Date.now(),
//                             parentFolderId: undefined,
//                           }
//                           setProfiles((prev) =>
//                             prev.map((p) =>
//                               p.id === currentProfile ? { ...p, widgets: [...p.widgets, newWidget] } : p,
//                             ),
//                           )

//                           // Remove from folder
//                           updateFolder(folder.id, {
//                             items: folder.items.filter((i) => i.id !== item.id),
//                           })
//                         }
//                       }}
//                     >
//                       <CardContent className="p-3">
//                         <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
//                           {"type" in item && item.type ? (
//                             // File item
//                             item.type.startsWith("image/") ? (
//                               <img
//                                 src={item.url || "/placeholder.svg"}
//                                 alt={item.name}
//                                 className="w-full h-full object-cover rounded"
//                               />
//                             ) : item.type.startsWith("video/") ? (
//                               <Video className="w-8 h-8 text-purple-500" />
//                             ) : (
//                               <FileText className="w-8 h-8 text-blue-500" />
//                             )
//                           ) : (
//                             // Widget item
//                             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
//                               {"type" in item && (
//                                 <>
//                                   {item.type === "note" && <BookOpen className="w-4 h-4 text-primary-foreground" />}
//                                   {item.type === "task" && <CheckSquare className="w-4 h-4 text-primary-foreground" />}
//                                   {item.type === "spotify" && <Music className="w-4 h-4 text-primary-foreground" />}
//                                   {item.type === "statistics" && (
//                                     <BarChart3 className="w-4 h-4 text-primary-foreground" />
//                                   )}
//                                   {!["note", "task", "spotify", "statistics"].includes(item.type) && (
//                                     <Grid3X3 className="w-4 h-4 text-primary-foreground" />
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                         <h4 className="font-medium text-sm truncate">{item.name}</h4>
//                         {"size" in item && (
//                           <p className="text-xs text-muted-foreground">{(item.size / 1024 / 1024).toFixed(1)} MB</p>
//                         )}
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )

//         case "gallery":
//           return (
//             <div className="h-full overflow-hidden">
//               <Tabs defaultValue="grid" className="h-full flex flex-col">
//                 <TabsList className="m-4 mb-2">
//                   <TabsTrigger value="grid">Grid View</TabsTrigger>
//                   <TabsTrigger value="list">List View</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="grid" className="flex-1 overflow-y-auto p-4 pt-0">
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {profile.uploadedFiles.map((file) => (
//                       <Card
//                         key={file.id}
//                         className="cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => openFilePreviewWindow(file)}
//                       > 
//                         <CardContent className="p-3">
//                           <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center overflow-hidden">
//                             {file.type && file.type.startsWith("image/") ? (
//                               <img
//                                 src={file.url || "/placeholder.svg"}
//                                 alt={file.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : file.type && file.type.startsWith("video/") ? (
//                               <div className="relative w-full h-full">
//                                 <video src={file.url} className="w-full h-full object-cover" />
//                                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                                   <Play className="w-8 h-8 text-white" />
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="text-center">
//                                 <FileText className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
//                                 <span className="text-xs text-muted-foreground">
//                                   {file.type.split("/")[1]?.toUpperCase()}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                           <h4 className="font-medium text-sm truncate">{file.name}</h4>
//                           <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="list" className="flex-1 overflow-y-auto p-4 pt-0">
//                   <div className="space-y-2">
//                     {profile.uploadedFiles.map((file) => (
//                       <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
//                         <CardContent className="p-3">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
//                               {file.type.startsWith("image/") ? (
//                                 <ImageIcon className="w-6 h-6 text-blue-500" />
//                               ) : file.type.startsWith("video/") ? (
//                                 <Video className="w-6 h-6 text-purple-500" />
//                               ) : (
//                                 <FileText className="w-6 h-6 text-green-500" />
//                               )}
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="font-medium text-sm">{file.name}</h4>
//                               <p className="text-xs text-muted-foreground">
//                                 {(file.size / 1024 / 1024).toFixed(1)} MB • {file.uploadedAt.toLocaleDateString()}
//                               </p>
//                             </div>
//                             <div className="flex gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   openFilePreviewWindow(file)
//                                 }}
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   const link = document.createElement("a")
//                                   link.href = file.url
//                                   link.download = file.name
//                                   link.click()
//                                 }}
//                               >
//                                 <Download className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   deleteFile(file.id)
//                                 }}
//                               >
//                                 <Trash className="w-4 h-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           )

//         case "notes":
//           return (
//             <div className="flex h-full">
//               <div className="w-80 border-r overflow-y-auto">
//                 <div className="p-4 space-y-2">
//                   {notes.map((note) => (
//                     <DraggableCard
//                       key={note.id}
//                       onDragStart={(e) => handleCardDragStart(e, note, "note")}
//                       className="group"
//                     >
//                       <Card className="cursor-pointer hover:shadow-md transition-shadow">
//                         <CardHeader className="pb-2">
//                           <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
//                           <CardDescription className="text-xs">
//                             {note.updatedAt.toLocaleDateString()} • {note.source}
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent className="pt-0">
//                           <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
//                         </CardContent>
//                       </Card>
//                     </DraggableCard>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex-1 p-6">
//                 <div className="text-center text-muted-foreground">
//                   <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                   <p>Select a note to view its content</p>
//                   <p className="text-sm">Drag notes to create widgets or transfer</p>
//                 </div>
//               </div>
//             </div>
//           )

//         case "tasks":
//           return (
//             <div className="p-6 overflow-y-auto">
//               <div className="space-y-4">
//                 {tasks.map((task) => (
//                   <DraggableCard
//                     key={task.id}
//                     onDragStart={(e) => handleCardDragStart(e, task, "task")}
//                     className="group"
//                   >
//                     <Card>
//                       <CardContent className="p-4">
//                         <div className="flex items-start gap-3">
//                           <Checkbox checked={task.completed} className="mt-1" />
//                           <div className="flex-1">
//                             <h3 className="font-medium">{task.title}</h3>
//                             <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
//                             <Badge
//                               variant={
//                                 task.priority === "high"
//                                   ? "destructive"
//                                   : task.priority === "medium"
//                                     ? "default"
//                                     : "secondary"
//                               }
//                               className="mt-2"
//                             >
//                               {task.priority} priority
//                             </Badge>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </DraggableCard>
//                 ))}
//               </div>
//             </div>
//           )

//         case "chrome":
//           return (
//             <div className="p-6 overflow-y-auto">
//               <Tabs defaultValue="tabs">
//                 <TabsList className="mb-6">
//                   <TabsTrigger value="tabs">Open Tabs</TabsTrigger>
//                   <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="tabs" className="space-y-4">
//                   {[
//                     { title: "Nexus - Productivity Hub", url: "https://nexus.app", favicon: "🏠" },
//                     { title: "GitHub - nexus/app", url: "https://github.com/nexus/app", favicon: "🐙" },
//                   ].map((tab, index) => (
//                     <DraggableCard
//                       key={index}
//                       onDragStart={(e) => handleCardDragStart(e, tab, "bookmark")}
//                       className="group"
//                     >
//                       <Card>
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <span className="text-lg">{tab.favicon}</span>
//                             <div className="flex-1">
//                               <h3 className="font-medium text-sm">{tab.title}</h3>
//                               <p className="text-xs text-muted-foreground">{tab.url}</p>
//                             </div>
//                             <Button variant="ghost" size="sm">
//                               <ExternalLink className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </DraggableCard>
//                   ))}
//                 </TabsContent>
//                 <TabsContent value="bookmarks" className="space-y-4">
//                   {[
//                     { title: "React Documentation", url: "https://react.dev", folder: "Development" },
//                     { title: "Tailwind CSS", url: "https://tailwindcss.com", folder: "Development" },
//                   ].map((bookmark, index) => (
//                     <DraggableCard
//                       key={index}
//                       onDragStart={(e) => handleCardDragStart(e, bookmark, "bookmark")}
//                       className="group"
//                     >
//                       <Card>
//                         <CardContent className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Star className="w-4 h-4 text-yellow-500" />
//                             <div className="flex-1">
//                               <h3 className="font-medium text-sm">{bookmark.title}</h3>
//                               <p className="text-xs text-muted-foreground">{bookmark.url}</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </DraggableCard>
//                   ))}
//                 </TabsContent>
//               </Tabs>
//             </div>
//           )

//         case "vscode":
//           return (
//             <div className="p-6 overflow-y-auto">
//               <div className="space-y-4">
//                 {[
//                   { name: "nexus-app", path: "/Users/dev/nexus-app", language: "TypeScript" },
//                   { name: "portfolio", path: "/Users/dev/portfolio", language: "JavaScript" },
//                 ].map((project, index) => (
//                   <DraggableCard
//                     key={index}
//                     onDragStart={(e) => handleCardDragStart(e, project, "file")}
//                     className="group"
//                   >
//                     <Card>
//                       <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                           <Folder className="w-5 h-5 text-blue-500" />
//                           <div className="flex-1">
//                             <h3 className="font-medium">{project.name}</h3>
//                             <p className="text-sm text-muted-foreground">{project.path}</p>
//                             <Badge variant="outline" className="mt-1">
//                               {project.language}
//                             </Badge>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </DraggableCard>
//                 ))}
//               </div>
//             </div>
//           )

//         case "spotify":
//           return (
//             <div className="p-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Now Playing</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                       <Music className="w-8 h-8 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold">{currentTrack.name}</h3>
//                       <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Progress value={(currentTrack.progress / currentTrack.duration) * 100} />
//                     <div className="flex items-center justify-between text-xs text-muted-foreground">
//                       <span>{formatTime(currentTrack.progress)}</span>
//                       <span>{formatTime(currentTrack.duration)}</span>
//                     </div>
//                     <div className="flex items-center justify-center gap-2">
//                       <Button variant="ghost" size="sm">
//                         <SkipBack className="w-4 h-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         {currentTrack.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <SkipForward className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )

//         default:
//           return <div className="p-6">Window content</div>
//       }
//     },
//     [
//       notes,
//       tasks,
//       profile.uploadedFiles,
//       currentTrack,
//       formatTime,
//       handleCardDragStart,
//       openFilePreviewWindow,
//       currentProfile,
//       updateFolder,
//       deleteFile,
//     ],
//   )

//   const renderWidgetContent = useCallback(
//     (widget: DraggableWidget) => {
//       switch (widget.type) {
//         case "file-preview":
//           const fileContent = widget.content
//           return (
//             <div className="p-3 h-full">
//               <div className="h-full flex flex-col">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
//                     {fileContent?.type?.startsWith("image/") ? (
//                       <ImageIcon className="w-2 h-2 text-white" />
//                     ) : fileContent?.type?.startsWith("video/") ? (
//                       <Video className="w-2 h-2 text-white" />
//                     ) : (
//                       <FileText className="w-2 h-2 text-white" />
//                     )}
//                   </div>
//                   <span className="text-xs font-medium truncate">{fileContent?.name || "Unknown file"}</span>
//                 </div>

//                 <div className="flex-1 bg-muted rounded overflow-hidden">
//                   {fileContent?.type?.startsWith("image/") ? (
//                     <img
//                       src={fileContent.url || "/placeholder.svg"}
//                       alt={fileContent.name || "Image"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : fileContent?.type?.startsWith("video/") ? (
//                     <div className="relative w-full h-full">
//                       <video src={fileContent.url} className="w-full h-full object-cover" />
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                         <Play className="w-6 h-6 text-white" />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <div className="text-center">
//                         <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-xs text-muted-foreground">
//                           {fileContent?.type?.split("/")[1]?.toUpperCase() || "FILE"}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-2 text-xs text-muted-foreground">
//                   {fileContent?.size ? (fileContent.size / 1024 / 1024).toFixed(1) + " MB" : "Unknown size"}
//                 </div>
//               </div>
//             </div>
//           )

//         case "spotify":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
//                   <Music className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium truncate">{currentTrack.name}</p>
//                   <div className="flex items-center gap-1 mt-1">
//                     <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                       <SkipBack className="w-2 h-2" />
//                     </Button>
//                     <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                       {currentTrack.isPlaying ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2" />}
//                     </Button>
//                     <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                       <SkipForward className="w-2 h-2" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//               <Progress value={(currentTrack.progress / currentTrack.duration) * 100} className="h-1 mb-2" />
//               <div className="flex items-center justify-center gap-1">
//                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                   <SkipBack className="w-3 h-3" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                   {currentTrack.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
//                 </Button>
//                 <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
//                   <SkipForward className="w-3 h-3" />
//                 </Button>
//               </div>
//             </div>
//           )

//         case "statistics":
//           return (
//             <div className="p-3 space-y-3">
//               <div className="flex items-center gap-2 mb-2">
//                 <BarChart3 className="w-4 h-4 text-blue-500" />
//                 <span className="text-sm font-medium">Productivity Stats</span>
//               </div>

//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 <div className="bg-muted/50 p-2 rounded">
//                   <div className="flex items-center gap-1">
//                     <Target className="w-3 h-3 text-green-500" />
//                     <span>Tasks</span>
//                   </div>
//                   <p className="font-medium">
//                     {widget.content.tasksCompleted}/{widget.content.totalTasks}
//                   </p>
//                 </div>

//                 <div className="bg-muted/50 p-2 rounded">
//                   <div className="flex items-center gap-1">
//                     <BookOpen className="w-3 h-3 text-blue-500" />
//                     <span>Notes</span>
//                   </div>
//                   <p className="font-medium">{widget.content.notesCreated}</p>
//                 </div>

//                 <div className="bg-muted/50 p-2 rounded">
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-3 h-3 text-orange-500" />
//                     <span>Hours</span>
//                   </div>
//                   <p className="font-medium">{widget.content.hoursWorked}h</p>
//                 </div>

//                 <div className="bg-muted/50 p-2 rounded">
//                   <div className="flex items-center gap-1">
//                     <TrendingUp className="w-3 h-3 text-purple-500" />
//                     <span>Productivity</span>
//                   </div>
//                   <p className="font-medium">{Math.round(widget.content.productivity)}%</p>
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <div className="flex justify-between text-xs">
//                   <span>Today's Progress</span>
//                   <span>{Math.round(widget.content.productivity)}%</span>
//                 </div>
//                 <Progress value={widget.content.productivity} className="h-1" />
//               </div>
//             </div>
//           )

//         case "weather":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2 mb-2">
//                 <Globe className="w-4 h-4 text-blue-500" />
//                 <span className="text-sm font-medium">{widget.content.location}</span>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl mb-1">☀️</div>
//                 <div className="text-lg font-medium">{widget.content.temperature}°C</div>
//                 <div className="text-xs text-muted-foreground">{widget.content.condition}</div>
//               </div>
//             </div>
//           )

//         case "clock":
//           return (
//             <div className="p-3 text-center">
//               <div className="flex items-center gap-2 justify-center mb-2">
//                 <Clock className="w-4 h-4 text-blue-500" />
//                 <span className="text-sm font-medium">Current Time</span>
//               </div>
//               <div className="text-lg font-mono">{new Date().toLocaleTimeString()}</div>
//               <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
//             </div>
//           )

//         case "calendar":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2 mb-2">
//                 <Calendar className="w-4 h-4 text-green-500" />
//                 <span className="text-sm font-medium">Calendar</span>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold">{new Date().getDate()}</div>
//                 <div className="text-xs text-muted-foreground">
//                   {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
//                 </div>
//               </div>
//             </div>
//           )

//         case "calculator":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2 mb-2">
//                 <Calculator className="w-4 h-4 text-purple-500" />
//                 <span className="text-sm font-medium">Calculator</span>
//               </div>
//               <div className="bg-muted/50 p-2 rounded text-right font-mono">{widget.content.display || "0"}</div>
//               <div className="grid grid-cols-3 gap-1 mt-2">
//                 {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
//                   <Button key={num} variant="outline" size="sm" className="h-6 text-xs">
//                     {num}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           )

//         case "timer":
//           return (
//             <div className="p-3 text-center">
//               <div className="flex items-center gap-2 justify-center mb-2">
//                 <Timer className="w-4 h-4 text-red-500" />
//                 <span className="text-sm font-medium">Timer</span>
//               </div>
//               <div className="text-lg font-mono mb-2">{formatTime(widget.content.duration)}</div>
//               <div className="flex gap-1 justify-center">
//                 <Button variant="outline" size="sm" className="h-6 text-xs">
//                   {widget.content.isRunning ? "Pause" : "Start"}
//                 </Button>
//                 <Button variant="outline" size="sm" className="h-6 text-xs">
//                   Reset
//                 </Button>
//               </div>
//             </div>
//           )

//         case "note":
//           return (
//             <div className="p-3">
//               <h4 className="font-medium text-sm mb-1">{widget.content.title}</h4>
//               <p className="text-xs text-muted-foreground line-clamp-3">{widget.content.content}</p>
//               <Badge variant="outline" className="mt-2 text-xs">
//                 {widget.content.source}
//               </Badge>
//             </div>
//           )

//         case "task":
//           return (
//             <div className="p-3">
//               <div className="flex items-start gap-2">
//                 <Checkbox checked={widget.content.completed} className="mt-0.5" />
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-sm">{widget.content.title}</h4>
//                   <p className="text-xs text-muted-foreground line-clamp-2">{widget.content.description}</p>
//                   <Badge
//                     variant={
//                       widget.content.priority === "high"
//                         ? "destructive"
//                         : widget.content.priority === "medium"
//                           ? "default"
//                           : "secondary"
//                     }
//                     className="mt-1 text-xs"
//                   >
//                     {widget.content.priority}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           )

//         case "bookmark":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm">{widget.content.favicon || "🔗"}</span>
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-sm truncate">{widget.content.title}</h4>
//                   <p className="text-xs text-muted-foreground truncate">{widget.content.url}</p>
//                 </div>
//               </div>
//             </div>
//           )

//         case "file":
//           return (
//             <div className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
//                   {widget.content.type?.startsWith("image/")
//                     ? "🖼️"
//                     : widget.content.type?.startsWith("video/")
//                       ? "🎥"
//                       : widget.content.type?.startsWith("audio/")
//                         ? "🎵"
//                         : "📄"}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-sm truncate">{widget.content.name}</h4>
//                   <p className="text-xs text-muted-foreground">{(widget.content.size / 1024 / 1024).toFixed(1)} MB</p>
//                   {widget.content.url && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-6 text-xs mt-1"
//                       onClick={() => openFilePreviewWindow(widget.content)}
//                     >
//                       Open
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )

//         default:
//           return <div className="p-3">Widget content</div>
//       }
//     },
//     [currentTrack, formatTime, openFilePreviewWindow],
//   )

//   const editProfile = useCallback((id: string, updates: Partial<DesktopProfile>) => {
//     setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
//   }, [])

//   const transferItemsToProfile = useCallback(
//     (targetProfileId: string, items: { windows: DraggableWindow[]; widgets: DraggableWidget[] }) => {
//       // Remove items from current profile
//       setProfiles((prev) =>
//         prev.map((p) =>
//           p.id === currentProfile
//             ? {
//                 ...p,
//                 windows: p.windows.filter((w) => !items.windows.find((tw) => tw.id === w.id)),
//                 widgets: p.widgets.filter((w) => !items.widgets.find((tw) => tw.id === w.id)),
//               }
//             : p.id === targetProfileId
//               ? {
//                   ...p,
//                   windows: [...p.windows, ...items.windows],
//                   widgets: [...p.widgets, ...items.widgets],
//                 }
//               : p,
//         ),
//       )
//     },
//     [currentProfile],
//   )

//   const transferSingleItem = useCallback(
//     (targetProfileId: string, item: any, itemType: string) => {
//       if (itemType === "widget") {
//         // Remove from current profile and add to target
//         setProfiles((prev) =>
//           prev.map((p) =>
//             p.id === currentProfile
//               ? { ...p, widgets: p.widgets.filter((w) => w.id !== item.id) }
//               : p.id === targetProfileId
//                 ? { ...p, widgets: [...p.widgets, item] }
//                 : p,
//           ),
//         )
//       } else if (itemType === "note") {
//         // Create a note widget in target profile
//         const noteWidget: DraggableWidget = {
//           id: Date.now().toString(),
//           type: "note",
//           position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
//           size: { width: 250, height: 200 },
//           content: item,
//           zIndex: Date.now(),
//         }
//         setProfiles((prev) =>
//           prev.map((p) => (p.id === targetProfileId ? { ...p, widgets: [...p.widgets, noteWidget] } : p)),
//         )
//       } else if (itemType === "task") {
//         // Create a task widget in target profile
//         const taskWidget: DraggableWidget = {
//           id: Date.now().toString(),
//           type: "task",
//           position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
//           size: { width: 250, height: 200 },
//           content: item,
//           zIndex: Date.now(),
//         }
//         setProfiles((prev) =>
//           prev.map((p) => (p.id === targetProfileId ? { ...p, widgets: [...p.widgets, taskWidget] } : p)),
//         )
//       }
//     },
//     [currentProfile],
//   )

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar */}
//       <div className="w-64 border-r bg-muted/30 flex flex-col">
//         <div className="p-4 border-b">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Grid3X3 className="w-4 h-4 text-primary-foreground" />
//             </div>
//             <h1 className="font-bold text-lg">Nexus</h1>
//           </div>

//           {/* Profile Selector */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="w-full justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span>{profile.icon}</span>
//                   <span className="text-sm">{profile.name}</span>
//                 </div>
//                 <ChevronDown className="w-4 h-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56">
//               {profiles.map((p) => (
//                 <DropdownMenuItem key={p.id} onClick={() => setCurrentProfile(p.id)}>
//                   <span className="mr-2">{p.icon}</span>
//                   <div className="flex-1">
//                     <p className="font-medium">{p.name}</p>
//                     <p className="text-xs text-muted-foreground">{p.description}</p>
//                   </div>
//                   {p.id === currentProfile && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-6 w-6 p-0"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         setEditingProfile(p)
//                         setIsEditProfileOpen(true)
//                       }}
//                     >
//                       <Edit className="w-3 h-3" />
//                     </Button>
//                   )}
//                 </DropdownMenuItem>
//               ))}
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => setIsNewProfileOpen(true)}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 New Profile
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <nav className="flex-1 p-4">
//           <div className="space-y-2">
//             <Button
//               variant={activeSection === "desktop" ? "secondary" : "ghost"}
//               className="w-full justify-start gap-2"
//               onClick={() => setActiveSection("desktop")}
//             >
//               <Monitor className="w-4 h-4" />
//               Desktop
//             </Button>

//             <Separator className="my-2" />

//             {/* Desktop Navigation Controls */}
//             <div className="space-y-2">
//               <p className="text-xs font-medium text-muted-foreground mb-2">DESKTOP CONTROLS</p>

//               <div className="flex gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => setDesktopZoom(Math.min(2, desktopZoom + 0.1))}
//                 >
//                   <ZoomIn className="w-3 h-3" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => setDesktopZoom(Math.max(0.5, desktopZoom - 0.1))}
//                 >
//                   <ZoomOut className="w-3 h-3" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="flex-1" onClick={resetDesktopView}>
//                   <RotateCcw className="w-3 h-3" />
//                 </Button>
//               </div>

//               <div className="text-xs text-muted-foreground text-center">Zoom: {Math.round(desktopZoom * 100)}%</div>
//             </div>

//             <Separator className="my-2" />

//             <div className="space-y-2">
//               <p className="text-xs font-medium text-muted-foreground mb-2">FILE UPLOAD</p>
//               <div
//                 className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-3 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
//                 onClick={() => document.getElementById("file-upload")?.click()}
//                 onDrop={(e) => {
//                   e.preventDefault()
//                   if (e.dataTransfer.files) {
//                     handleFileUpload(e.dataTransfer.files)
//                   }
//                 }}
//                 onDragOver={(e) => e.preventDefault()}
//               >
//                 <input
//                   id="file-upload"
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={(e) => {
//                     if (e.target.files) {
//                       handleFileUpload(e.target.files)
//                     }
//                   }}
//                 />
//                 <div className="text-xs text-muted-foreground">
//                   <Plus className="w-4 h-4 mx-auto mb-1" />
//                   <p>Drop files or click to upload</p>
//                   <p className="text-xs mt-1">Creates preview widgets</p>
//                 </div>
//               </div>
//             </div>

//             <Separator className="my-2" />

//             <p className="text-xs font-medium text-muted-foreground mb-2">CREATE</p>

//             <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsNewFolderOpen(true)}>
//               <FolderPlus className="w-4 h-4" />
//               New Folder
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => openWindow("notes", "Notes")}>
//               <BookOpen className="w-4 h-4" />
//               Notes
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => openWindow("tasks", "Tasks")}>
//               <CheckSquare className="w-4 h-4" />
//               Tasks
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-2"
//               onClick={() => openWindow("gallery", "File Gallery")}
//             >
//               <ImageIcon className="w-4 h-4" />
//               Gallery
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-2"
//               onClick={() => openWindow("chrome", "Chrome")}
//             >
//               <Chrome className="w-4 h-4" />
//               Chrome
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Button
//               variant="ghost"
//               className="w-full justify-start gap-2"
//               onClick={() => openWindow("vscode", "VS Code")}
//             >
//               <Code className="w-4 h-4" />
//               VS Code
//               <Plus className="w-3 h-3 ml-auto" />
//             </Button>

//             <Separator className="my-2" />

//             <div className="flex items-center justify-between">
//               <p className="text-xs font-medium text-muted-foreground">WIDGETS</p>
//               <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsNewWidgetOpen(true)}>
//                 <Plus className="w-3 h-3" />
//               </Button>
//             </div>
//           </div>

//           <Separator className="my-4" />

//           <div className="space-y-1">
//             <p className="text-xs font-medium text-muted-foreground mb-2">ACTIVE WINDOWS</p>
//             {windows.map((window) => (
//               <div
//                 key={window.id}
//                 className={`flex items-center gap-2 p-1 rounded text-xs cursor-pointer hover:bg-muted ${
//                   window.isMinimized ? "opacity-60" : ""
//                 }`}
//                 onClick={() => updateWindow(window.id, { isMinimized: false, zIndex: Date.now() })}
//               >
//                 <div className={`w-2 h-2 rounded-full ${window.isMinimized ? "bg-yellow-500" : "bg-green-500"}`} />
//                 <span className="flex-1 truncate">{window.title}</span>
//                 {window.isSnapped && <Magnet className="w-2 h-2 text-blue-500" />}
//                 {window.isPinned && <Pin className="w-2 h-2 text-blue-500" />}
//                 {window.isMiniMode && <Minimize className="w-2 h-2 text-purple-500" />}
//                 <span className="text-xs text-muted-foreground">{window.isMinimized ? "Min" : "Open"}</span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-4 w-4 p-0"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     closeWindow(window.id)
//                   }}
//                 >
//                   <X className="w-2 h-2" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </nav>

//         <div className="p-4 border-t">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//             <div className="flex items-center gap-1">
//               {syncStatus === "synced" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
//               {syncStatus === "syncing" && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
//               <span className="capitalize">{syncStatus}</span>
//             </div>
//             <Sync className="w-3 h-3" />
//           </div>

//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Monitor className="w-3 h-3" />
//             <span>{profile.name} Desktop</span>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Area */}
//       <div className="flex-1 relative overflow-hidden">
//         {/* Header with Transfer Button */}
//         <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
//           <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
//             <div className="flex items-center gap-2">
//               <span className="text-lg">{profile.icon}</span>
//               <div>
//                 <h3 className="font-medium text-sm">{profile.name}</h3>
//                 <p className="text-xs text-muted-foreground">{profile.description}</p>
//               </div>
//             </div>
//           </div>

//           {(windows.length > 0 || widgets.length > 0) && (
//             <Button
//               variant="outline"
//               size="sm"
//               className="bg-white/80 backdrop-blur-sm"
//               onClick={() => {
//                 setTransferItems({ windows: profile.windows, widgets: profile.widgets })
//                 setIsTransferDialogOpen(true)
//               }}
//             >
//               <ArrowLeftRight className="w-4 h-4 mr-2" />
//               Transfer All
//             </Button>
//           )}
//         </div>

//         {/* Transfer Zone */}
//         <TransferZone
//           isVisible={showTransferZone}
//           onDrop={transferSingleItem}
//           profiles={profiles}
//           currentProfile={currentProfile}
//         />

//         <div
//           ref={desktopRef}
//           className={`w-full h-full relative ${isDraggingDesktop ? "cursor-grabbing" : ""}`}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onDragEnd={handleDragEnd}
//           onMouseDown={handleDesktopMouseDown}
//           onMouseUp={handleDesktopMouseUp}
//           onContextMenu={(e) => e.preventDefault()}
//           style={{
//             transform: `translate(${desktopOffset.x}px, ${desktopOffset.y}px) scale(${desktopZoom})`,
//             transformOrigin: "0 0",
//             minWidth: "100%",
//             minHeight: "100%",
//           }}
//         >
//           {/* Background Layer */}
//           <div className="absolute inset-0">
//             {profile.backgroundType === "gradient" && (
//               <div className={`w-full h-full bg-gradient-to-br ${profile.backgroundStyle}`} />
//             )}
//             {profile.backgroundType === "image" && profile.backgroundMedia && (
//               <img
//                 src={profile.backgroundMedia || "/placeholder.svg"}
//                 alt="Desktop background"
//                 className="w-full h-full object-cover"
//               />
//             )}
//             {profile.backgroundType === "video" && profile.backgroundMedia && (
//               <video src={profile.backgroundMedia} autoPlay loop muted className="w-full h-full object-cover" />
//             )}
//           </div>

//           {/* Grid Pattern Overlay */}
//           <div
//             className="absolute inset-0 opacity-10 pointer-events-none"
//             style={{
//               backgroundImage: `
//                 linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
//                 linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
//               `,
//               backgroundSize: "20px 20px",
//             }}
//           />

//           {/* Desktop Icons */}
//           <div className="absolute top-20 left-4 space-y-4">
//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => setIsNewFolderOpen(true)}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
//                 <FolderPlus className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">New Folder</span>
//             </div>

//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => openWindow("notes", "Notes")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
//                 <BookOpen className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">Notes</span>
//             </div>

//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => openWindow("tasks", "Tasks")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
//                 <CheckSquare className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">Tasks</span>
//             </div>

//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => openWindow("gallery", "File Gallery")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
//                 <ImageIcon className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">Gallery</span>
//             </div>

//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => openWindow("chrome", "Chrome")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
//                 <Chrome className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">Chrome</span>
//             </div>

//             <div
//               className="flex flex-col items-center gap-1 p-2 rounded cursor-pointer hover:bg-white/20 transition-colors"
//               onDoubleClick={() => openWindow("vscode", "VS Code")}
//               onMouseDown={(e) => e.stopPropagation()}
//             >
//               <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
//                 <Code className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xs font-medium">VS Code</span>
//             </div>
//           </div>

//           {/* Desktop Folders */}
//           {folders.map((folder) => (
//             <MemoizedDesktopFolderComponent
//               key={folder.id}
//               folder={folder}
//               onUpdateFolder={updateFolder}
//               onDeleteFolder={deleteFolder}
//               onDropInFolder={dropInFolder}
//               onOpenFolder={openFolderWindow}
//             />
//           ))}

//           {/* Floating Widgets */}
//           {widgets.map((widget) => (
//             <MemoizedDraggableWidget
//               key={widget.id}
//               widget={widget}
//               onUpdateWidget={updateWidget}
//               onDeleteWidget={deleteWidget}
//               onTransferWidget={(w) => setShowTransferZone(true)}
//             >
//               {renderWidgetContent(widget)}
//             </MemoizedDraggableWidget>
//           ))}

//           {/* Windows */}
//           {windows.map((window) => (
//             <MemoizedDraggableWindowComponent
//               key={window.id}
//               window={window}
//               onUpdateWindow={updateWindow}
//               onCloseWindow={closeWindow}
//               onDropInWindow={dropInWindow}
//             >
//               {renderWindowContent(window)}
//             </MemoizedDraggableWindowComponent>
//           ))}

//           {/* Drop Zone Indicator */}
//           <div className="absolute bottom-4 right-4 p-4 bg-white/80 rounded-lg shadow-lg backdrop-blur-sm">
//             <div className="text-center text-sm text-muted-foreground">
//               <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
//               <p>Drop items here to create widgets</p>
//               <p className="text-xs">Double-click icons to open windows</p>
//               <p className="text-xs mt-1">Middle-click and drag to pan desktop</p>
//               <p className="text-xs">Drag windows to edges to snap</p>
//               <p className="text-xs">Pin windows to keep them on top</p>
//               <p className="text-xs">Use mini mode for compact windows</p>
//             </div>
//           </div>
//         </div>

//         {/* Taskbar for minimized windows */}
//         {windows.some((w) => w.isMinimized) && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2">
//             {windows
//               .filter((w) => w.isMinimized)
//               .map((window) => (
//                 <MinimizedWindowPreview
//                   key={window.id}
//                   window={window}
//                   onClick={() => updateWindow(window.id, { isMinimized: false, zIndex: Date.now() })}
//                   onClose={closeWindow}
//                 />
//               ))}
//           </div>
//         )}
//       </div>

//       {/* File Preview Dialog */}
//       <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{selectedFile?.name || "File Preview"}</DialogTitle>
//             <DialogDescription>Preview of the selected file</DialogDescription>
//           </DialogHeader>
//           {selectedFile && (
//             <div className="h-64 overflow-hidden">
//               {selectedFile.type.startsWith("image/") ? (
//                 <img
//                   src={selectedFile.url || "/placeholder.svg"}
//                   alt={selectedFile.name}
//                   className="w-full h-full object-contain"
//                 />
//               ) : (
//                 <p>Preview not available for this file type</p>
//               )}
//             </div>
//           )}
//           <DialogFooter>
//             <Button onClick={() => setIsFilePreviewOpen(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* New Profile Dialog */}
//       <Dialog open={isNewProfileOpen} onOpenChange={setIsNewProfileOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Profile</DialogTitle>
//             <DialogDescription>Create a new profile to organize your workspace</DialogDescription>
//           </DialogHeader>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault()
//               const formData = new FormData(e.target as HTMLFormElement)
//               const name = formData.get("name") as string
//               const icon = formData.get("icon") as string
//               const color = formData.get("color") as string
//               const description = formData.get("description") as string

//               if (name && icon && color && description) {
//                 createProfile(name, icon, color, description)
//                 setIsNewProfileOpen(false)
//               }
//             }}
//           >
//             <div className="space-y-4">
//               <Input name="name" placeholder="Profile name..." required />
//               <Input name="icon" placeholder="Profile icon (emoji)..." required />
//               <Select name="color" required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select color theme" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="blue">Blue Ocean</SelectItem>
//                   <SelectItem value="green">Forest Green</SelectItem>
//                   <SelectItem value="purple">Purple Dream</SelectItem>
//                   <SelectItem value="red">Sunset Red</SelectItem>
//                   <SelectItem value="yellow">Golden Hour</SelectItem>
//                   <SelectItem value="pink">Rose Garden</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Textarea name="description" placeholder="Profile description..." required />
//             </div>
//             <DialogFooter className="mt-4">
//               <Button type="submit">Create Profile</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Profile Dialog */}
//       <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Profile</DialogTitle>
//             <DialogDescription>Modify profile settings and background</DialogDescription>
//           </DialogHeader>
//           {editingProfile && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault()
//                 const formData = new FormData(e.target as HTMLFormElement)
//                 const name = formData.get("name") as string
//                 const icon = formData.get("icon") as string
//                 const color = formData.get("color") as string
//                 const description = formData.get("description") as string
//                 const backgroundType = formData.get("backgroundType") as "gradient" | "image" | "video"

//                 const updates: Partial<DesktopProfile> = {
//                   name,
//                   icon,
//                   color,
//                   description,
//                   backgroundType,
//                 }

//                 // Update background style based on type
//                 if (backgroundType === "gradient") {
//                   updates.backgroundStyle = `from-${color}-100 to-blue-100`
//                   updates.backgroundMedia = undefined
//                 } else {
//                   // Keep existing media for image/video
//                   updates.backgroundStyle = editingProfile.backgroundStyle
//                   updates.backgroundMedia = editingProfile.backgroundMedia
//                 }

//                 editProfile(editingProfile.id, updates)
//                 setIsEditProfileOpen(false)
//                 setEditingProfile(null)
//               }}
//             >
//               <div className="space-y-4">
//                 <Input name="name" placeholder="Profile name..." defaultValue={editingProfile.name} required />
//                 <Input name="icon" placeholder="Icon (emoji)..." defaultValue={editingProfile.icon} required />
//                 <Select name="color" defaultValue={editingProfile.color}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select color theme" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="blue">Blue Ocean</SelectItem>
//                     <SelectItem value="green">Forest Green</SelectItem>
//                     <SelectItem value="purple">Purple Dream</SelectItem>
//                     <SelectItem value="red">Sunset Red</SelectItem>
//                     <SelectItem value="yellow">Golden Hour</SelectItem>
//                     <SelectItem value="pink">Rose Garden</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Textarea
//                   name="description"
//                   placeholder="Profile description..."
//                   defaultValue={editingProfile.description}
//                   rows={3}
//                   required
//                 />

//                 <div className="space-y-3">
//                   <label className="text-sm font-medium">Background Type</label>
//                   <Select name="backgroundType" defaultValue={editingProfile.backgroundType || "gradient"}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="gradient">Gradient</SelectItem>
//                       <SelectItem value="image">Image</SelectItem>
//                       <SelectItem value="video">Video</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <div className="space-y-2">
//                     <label className="text-xs text-muted-foreground">Upload Background Media</label>
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       className="text-xs"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0]
//                         if (file) {
//                           const url = URL.createObjectURL(file)
//                           editProfile(editingProfile.id, {
//                             backgroundMedia: url,
//                             backgroundType: file.type.startsWith("video/") ? "video" : "image",
//                           })
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter className="mt-4">
//                 <Button type="submit">Save Changes</Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* New Widget Dialog */}
//       <Dialog open={isNewWidgetOpen} onOpenChange={setIsNewWidgetOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Widget</DialogTitle>
//             <DialogDescription>Select a widget type to create</DialogDescription>
//           </DialogHeader>
//           <div className="grid grid-cols-2 gap-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("statistics")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Statistics
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("weather")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Weather
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("clock")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Clock
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("calendar")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Calendar
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("calculator")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Calculator
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 createWidget("timer")
//                 setIsNewWidgetOpen(false)
//               }}
//             >
//               Timer
//             </Button>
//           </div>
//           <DialogFooter>
//             <Button onClick={() => setIsNewWidgetOpen(false)}>Cancel</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* New Folder Dialog */}
//       <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Folder</DialogTitle>
//             <DialogDescription>Create a new folder to organize your items</DialogDescription>
//           </DialogHeader>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault()
//               if (newFolderName.trim()) {
//                 createFolder(newFolderName.trim())
//                 setNewFolderName("")
//                 setIsNewFolderOpen(false)
//               }
//             }}
//           >
//             <div className="space-y-4">
//               <Input
//                 placeholder="Folder name..."
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 required
//               />
//             </div>
//             <DialogFooter className="mt-4">
//               <Button type="submit">Create Folder</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Mini Player Overlays - Always on top */}
//       {windows
//         .filter((window) => window.isMiniMode && !window.isMinimized)
//         .map((window) => (
//           <MiniPlayerOverlay
//             key={`mini-${window.id}`}
//             window={window}
//             onUpdateWindow={updateWindow}
//             onCloseWindow={closeWindow}
//           />
//         ))}
//     </div>
//   )
// }
