"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpen, Plus } from "lucide-react"
import type { Note } from "@/lib/types"

interface NotesWindowProps {
  notes: Note[]
  onCreateNote: (title: string, content: string) => void
  onCardDragStart?: (e: React.DragEvent, note: Note, type: string) => void
}

export function NotesWindow({ notes, onCreateNote, onCardDragStart }: NotesWindowProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false)

  return (
    <div className="flex h-full">
      <div className="w-80 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <Button onClick={() => setIsNewNoteDialogOpen(true)} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
        <div className="p-4 space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              draggable={!!onCardDragStart}
              onDragStart={onCardDragStart ? (e) => onCardDragStart(e, note, "note") : undefined}
              className="group cursor-move hover:shadow-md transition-shadow"
            >
              <Card
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedNote?.id === note.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {note.updatedAt.toLocaleDateString()} • {note.source}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>Add a new note to your collection</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const title = formData.get("title") as string
                const content = formData.get("content") as string
                if (title && content) {
                  onCreateNote(title, content)
                  setIsNewNoteDialogOpen(false)
                }
              }}
            >
              <div className="space-y-4">
                <Input name="title" placeholder="Note title..." required />
                <Textarea name="content" placeholder="Start writing..." rows={6} required />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Create Note</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 p-6">
        {selectedNote ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{selectedNote.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created {selectedNote.createdAt.toLocaleDateString()}</span>
                <span>Updated {selectedNote.updatedAt.toLocaleDateString()}</span>
                <Badge variant="outline">{selectedNote.source}</Badge>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a note to view its content</p>
              <p className="text-sm mt-2">Drag notes to create widgets or transfer</p>
              <Button className="mt-4" onClick={() => setIsNewNoteDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
