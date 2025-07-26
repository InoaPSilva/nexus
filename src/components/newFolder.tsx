import * as Dialog from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";

interface NewFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentProfile: string;
    setProfiles: React.Dispatch<React.SetStateAction<any[]>>;
}

export function NewFolderDialog({
    open,
    onOpenChange,
    currentProfile,
    setProfiles,
}: NewFolderDialogProps) {
    const [newFolderName, setNewFolderName] = useState("");

    const createFolder = useCallback(
        (name: string) => {
            const newFolder = {
                id: Date.now().toString(),
                name,
                icon: "📁",
                position: {
                    x: Math.random() * 200 + 100,
                    y: Math.random() * 200 + 100,
                },
                size: { width: 80, height: 80 },
                isOpen: false,
                items: [],
                zIndex: Date.now(),
            };

            setProfiles((prev) =>
                prev.map((p) =>
                    p.id === currentProfile
                        ? { ...p, folders: [...p.folders, newFolder] }
                        : p
                )
            );
        },
        [currentProfile, setProfiles]
    );

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <DialogHeader>
                        <Dialog.Title className="text-lg font-medium">Create New Folder</Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Create a new folder to organize your items.
                        </Dialog.Description>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (newFolderName.trim()) {
                                createFolder(newFolderName.trim());
                                setNewFolderName("");
                                onOpenChange(false);
                            }
                        }}
                    >
                        <div className="space-y-4">
                            <Input
                                placeholder="Folder name..."
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit">Create Folder</Button>
                        </DialogFooter>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
