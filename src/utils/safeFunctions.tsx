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

export default { safeNumber, safePosition, safeSize }
