import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for safe number handling
export const safeNumber = (value: any, fallback = 0): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? fallback : num
}

export const safePosition = (position: any): { x: number; y: number } => ({
  x: safeNumber(position?.x, 100),
  y: safeNumber(position?.y, 100),
})

export const safeSize = (size: any, minWidth = 300, minHeight = 200): { width: number; height: number } => ({
  width: Math.max(minWidth, safeNumber(size?.width, 800)),
  height: Math.max(minHeight, safeNumber(size?.height, 600)),
})

export const getScreenDimensions = () => {
  if (typeof window === "undefined") return { width: 1920, height: 1080 }
  return {
    width: Math.max(800, window.innerWidth),
    height: Math.max(600, window.innerHeight),
  }
}

// Throttle utility for performance
export const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0
  return (...args: any[]) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
