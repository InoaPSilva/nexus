import { Plus } from "lucide-react"
import { useCallback, useState } from "react"

export function FileUpload({ }: any) {
    const [profiles, setProfiles] = useState<any[]>([])
    const [currentProfile, setCurrentProfile] = useState("personal")
    const [notes, setNotes] = useState<any[]>([])

    const handleFileUpload = useCallback(
        async (files: FileList) => {
            const newFiles = Array.from(files)

            for (const file of newFiles) {
                const uploadedFile: any = {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    uploadedAt: new Date(),
                }

                // Add to profile's uploaded files
                setProfiles((prev) =>
                    prev.map((p) => (p.id === currentProfile ? { ...p, uploadedFiles: [...p.uploadedFiles, uploadedFile] } : p)),
                )

                // If it's a text file, convert to note
                if (
                    (file.type && file.type.startsWith("text/")) ||
                    (file.name && (file.name.endsWith(".txt") || file.name.endsWith(".md")))
                ) {
                    try {
                        const content = await file.text()
                        const newNote: any = {
                            id: Date.now().toString() + Math.random(),
                            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                            content,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            tags: ["imported"],
                            source: "file",
                        }
                        setNotes((prev) => [newNote, ...prev])
                    } catch (error) {
                        console.error("Error reading text file:", error)
                    }
                }

                const filePreviewWidget: any = {
                    id: Date.now().toString() + Math.random(),
                    type: "file-preview",
                    position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
                    size: { width: 300, height: 250 },
                    content: uploadedFile,
                    zIndex: Date.now(),
                }

                setProfiles((prev) =>
                    prev.map((p) => (p.id === currentProfile ? { ...p, widgets: [...p.widgets, filePreviewWidget] } : p)),
                )
            }
        },
        [currentProfile],
    )
    return (


        <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">FILE UPLOAD</p>
            <div
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-3 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
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
                <div className="text-xs text-muted-foreground">
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    <p>Drop files or click to upload</p>
                    <p className="text-xs mt-1">Creates preview widgets</p>
                </div>
            </div>
        </div>
    )
}