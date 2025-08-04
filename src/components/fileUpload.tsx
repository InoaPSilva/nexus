import React, { useCallback, useState } from "react"
import { Plus } from "lucide-react"

export function FileUpload({
    setProfiles,
    currentProfile,
}: {
    setProfiles: React.Dispatch<React.SetStateAction<any[]>>
    currentProfile: string
}) {
    const [isDragging, setIsDragging] = useState(false)

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
            className={`border-2 border-dashed p-3 text-center cursor-pointer transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            onClick={() => document.getElementById("file-upload")?.click()}
            onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)

                const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain")

                if (url && /^https?:\/\//.test(url)) {
                    const browserWindow = {
                        id: Date.now().toString() + Math.random(),
                        type: "browser",
                        position: { x: 150, y: 150 },
                        size: { width: 350, height: 200 },
                        content: {
                            url,
                            title: url,
                            favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`,
                        },
                        zIndex: Date.now(),
                    }

                    setProfiles((all) =>
                        all.map((p) =>
                            p.id === currentProfile
                                ? { ...p, windows: [...p.windows, browserWindow] }
                                : p
                        )
                    )
                    return
                }

                if (e.dataTransfer.files?.length) {
                    handleFileUpload(e.dataTransfer.files)
                }
            }}
            onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
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
            <p className="text-sm">
                {isDragging ? "Drop your link or file here" : "Drop files or paste links"}
            </p>
        </div>
    )
}
