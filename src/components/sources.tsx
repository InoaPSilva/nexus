import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

interface Profile {
    id: string;
    sources?: string[];
    [key: string]: any;
}

interface FolderSelectorProps {
    profiles: Profile[];
    currentProfile: string;
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}

export default function FolderSelector({ profiles, currentProfile, setProfiles }: FolderSelectorProps) {
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    const handleFolderSelect = async () => {
        const folder = await open({
            directory: true,
            multiple: false,
        });

        if (typeof folder === "string") {
            setSelectedFolder(folder);

            setProfiles((prevProfiles: any) =>
                prevProfiles.map((profile: any) =>
                    profile.id === currentProfile
                        ? {
                            ...profile,
                            sources: [...(profile.sources || []), folder],
                        }
                        : profile
                )
            );
        }
    };

    const currentSources =
        profiles.find((profile: any) => profile.id === currentProfile)?.sources || [];

    return (
        <>
            <section>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                    SELECT SOURCE
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleFolderSelect}
                        className="px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-primary-dark"
                    >
                        Select Folder
                    </button>
                    <span className="text-sm text-muted-foreground">
                        {selectedFolder || "No folder selected"}
                    </span>
                </div>
            </section>

            <section className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                    CURRENT SOURCES
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {currentSources.length > 0 ? (
                        currentSources.map((source: any, index: any) => <li key={index}>{source}</li>)
                    ) : (
                        <li>No sources added</li>
                    )}
                </ul>
            </section>
        </>
    );
}
