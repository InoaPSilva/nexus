import type { SnapZone } from "@/lib/types"
import { safeNumber } from "@/lib/utils"

interface SnapZonesProps {
  isVisible: boolean
  zones: SnapZone[]
}

export function SnapZones({ isVisible, zones }: SnapZonesProps) {
  if (!isVisible) return null

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
