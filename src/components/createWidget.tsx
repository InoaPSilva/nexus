import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function CreateWidget() {
    const [isNewWidgetOpen, setIsNewWidgetOpen] = useState(false)

    return (
        <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">WIDGETS</p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsNewWidgetOpen(true)}>
                <Plus className="w-3 h-3" />
            </Button>
        </div>
    )

}
