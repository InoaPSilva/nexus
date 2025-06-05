"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import type { DesktopProfile } from "@/lib/types"

interface TransferZoneProps {
  isVisible: boolean
  onDrop: (targetProfileId: string, item: any, itemType: string) => void
  profiles: DesktopProfile[]
  currentProfile: string
}

export function TransferZone({ isVisible, onDrop, profiles, currentProfile }: TransferZoneProps) {
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-4 min-w-64">
      <div className="flex items-center gap-2 mb-3">
        <Send className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-sm">Transfer to Workspace</span>
      </div>
      <div className="space-y-2">
        {profiles
          .filter((p) => p.id !== currentProfile)
          .map((profile) => (
            <div
              key={profile.id}
              className={`p-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                draggedOver === profile.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDraggedOver(profile.id)
              }}
              onDragLeave={() => setDraggedOver(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDraggedOver(null)
                try {
                  const data = JSON.parse(e.dataTransfer.getData("application/json"))
                  onDrop(profile.id, data.item, data.type)
                } catch (error) {
                  console.error("Error processing drop:", error)
                }
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{profile.icon}</span>
                <div>
                  <p className="font-medium text-sm">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.description}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-center">Drag items here to transfer them</div>
    </div>
  )
}
