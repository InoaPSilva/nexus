import React, { useState } from 'react'
import Sidebar from '@/layout/sideBar/sideBar'
import { WorkspaceArea } from './workspaceArea'

const initialProfiles = [
    {
        id: 'personal',
        name: 'Personal',
        icon: '🏠',
        color: 'blue',
        description: 'Personal workspace',
        windows: [],
        widgets: [],
        folders: [],
        backgroundStyle: 'from-blue-100 to-purple-100',
        backgroundType: 'gradient',
        uploadedFiles: [],
    },
    {
        id: 'work',
        name: 'Work',
        icon: '💼',
        color: 'green',
        description: 'Work projects and tasks',
        windows: [],
        widgets: [],
        folders: [],
        backgroundStyle: 'from-green-100 to-blue-100',
        backgroundType: 'gradient',
        uploadedFiles: [],
    },
    {
        id: 'learning',
        name: 'Learning',
        icon: '📚',
        color: 'purple',
        description: 'Study and research',
        windows: [],
        widgets: [],
        folders: [],
        backgroundStyle: 'from-purple-100 to-pink-100',
        backgroundType: 'gradient',
        uploadedFiles: [],
    },
]

export default function Home() {
    const [profiles, setProfiles] = useState(initialProfiles)
    const [currentProfile, setCurrentProfile] = useState('personal')
    return (

        <div className="flex h-screen w-screen overflow-visible">
            <Sidebar
                profiles={profiles}
                setProfiles={setProfiles}
                currentProfile={currentProfile}
                setCurrentProfile={setCurrentProfile}
            />

            <WorkspaceArea
                profiles={profiles}
                setProfiles={setProfiles}
                currentProfile={currentProfile}
                setCurrentProfile={setCurrentProfile}
            />
        </div>
    )
    }
