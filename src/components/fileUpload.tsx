import React, { useCallback } from "react"
import { Plus } from "lucide-react"

export function FileUpload({
    setProfiles,
    currentProfile,
}: {
    setProfiles: React.Dispatch<React.SetStateAction<any[]>>
    currentProfile: string
}) {
    const handleFileUpload = useCallback(
        (files: FileList) => {
            Array.from(files).forEach((file) => {
                const uploadedFile = {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    uploadedAt: new Date(),
                }

                const widget = {
                    id: Date.now().toString() + Math.random(),
                    type: "file-preview",
                    position: { x: 150, y: 150 },
                    size: { width: 300, height: 250 },
                    content: uploadedFile,
                    zIndex: Date.now(),
                }

                setProfiles((all) =>
                    all.map((p) =>
                        p.id === currentProfile
                            ? { ...p, widgets: [...p.widgets, widget] }
                            : p
                    )
                )
            })
        },
        [currentProfile, setProfiles]
    )

    return (
        <div
            className="border-2 border-dashed p-3 text-center cursor-pointer"
            onClick={() => document.getElementById("file-upload")?.click()}
            onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files) {
                    handleFileUpload(e.dataTransfer.files)
                }
            }}
            onDragOver={(e) => e.preventDefault()}
        >
            <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files) {
                        handleFileUpload(e.target.files)
                    }
                }}
            />
            <Plus className="w-4 h-4 mx-auto mb-1" />
            <p>Drop files or click to upload</p>
        </div>
    )
}
