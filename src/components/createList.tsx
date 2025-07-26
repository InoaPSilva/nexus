import { FolderPlus, Plus } from "lucide-react";
import { Button } from "./ui/button";

export function CreateList({ }: any) {
    return (
        <>
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">CREATE</p>

                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { }}>
                    {/* <FolderPlus className="w-4 h-4" />
                    New Folder
                    <Plus className="w-3 h-3 ml-auto" /> */}
                </Button>
            </div>
        </>
    )
}