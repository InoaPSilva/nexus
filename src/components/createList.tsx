import { FolderPlus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { NewFolderDialog } from "./newFolder";

interface Profile {
  id: string;
  name: string;
  folders: any[];
}


export function CreateList({
  currentProfile,
  setProfiles,
}: {
  currentProfile: string;
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewFolderDialog
        open={open}
        onOpenChange={setOpen}
        currentProfile={currentProfile}
        setProfiles={setProfiles}
      />
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">CREATE</p>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setOpen(true)}
        >
          <FolderPlus className="w-4 h-4" />
          New Folder
          <Plus className="w-3 h-3 ml-auto" />
        </Button>
      </div>
    </>
  );
}
