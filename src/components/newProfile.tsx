import * as Dialog from "@radix-ui/react-dialog";
import {
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select"; 

export function NewProfileDialog({
    open,
    onOpenChange,
    setProfiles,
}: any) {
    const [isNewProfileOpen, setIsNewProfileOpen] = useState(open);
    const [selectedColor, setSelectedColor] = useState<string>("");

    const handleOpenChange = (open: boolean) => {
        setIsNewProfileOpen(open);
        onOpenChange(open);
    };

    const createProfile = (
        name: string,
        icon: string,
        color: string,
        description: string
    ) => {
        setProfiles((prev: any) => [
            ...prev,
            { name, icon, color, description, id: Date.now().toString() },
        ]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const icon = formData.get("icon") as string;
        const description = formData.get("description") as string;

        if (!selectedColor) {
            alert("Select a color first.");
            return;
        }

        createProfile(name, icon, selectedColor, description);
        setIsNewProfileOpen(false);
        onOpenChange(false);
    };

    return (
        <Dialog.Root open={isNewProfileOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Profile</DialogTitle>
                    <DialogDescription>
                        Create a new profile to organize your workspace
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="Profile name..." required />
                    <Input name="icon" placeholder="Profile icon (emoji)..." required />

                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select color theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blue">Blue Ocean</SelectItem>
                            <SelectItem value="green">Forest Green</SelectItem>
                            <SelectItem value="purple">Purple Dream</SelectItem>
                            <SelectItem value="red">Sunset Red</SelectItem>
                            <SelectItem value="yellow">Golden Hour</SelectItem>
                            <SelectItem value="pink">Rose Garden</SelectItem>
                        </SelectContent>
                    </Select>

                    <Textarea name="description" placeholder="Profile description..." required />

                    <DialogFooter>
                        <Button type="submit">Create Profile</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog.Root>
    );
}
