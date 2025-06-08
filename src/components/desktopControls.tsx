import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";

export function DesktopControls({}: any) {
    const [desktopOffset, setDesktopOffset] = useState({ x: 0, y: 0 })
    const [desktopZoom, setDesktopZoom] = useState(1)
    const resetDesktopView = useCallback(() => {
        setDesktopOffset({ x: 0, y: 0 })
        setDesktopZoom(1)
    }, [])
    return (<div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">DESKTOP CONTROLS</p>

        <div className="flex gap-1">
            <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setDesktopZoom(Math.min(2, desktopZoom + 0.1))}
            >
                <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setDesktopZoom(Math.max(0.5, desktopZoom - 0.1))}
            >
                <ZoomOut className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={resetDesktopView}>
                <RotateCcw className="w-3 h-3" />
            </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">Zoom: {Math.round(desktopZoom * 100)}%</div>
    </div>
    );
}