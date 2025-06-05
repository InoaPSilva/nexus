"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Plus, Trash } from "lucide-react"
import type { Task } from "@/lib/types"

interface TasksWindowProps {
  tasks: Task[]
  onCreateTask: (title: string, description: string, priority: "low" | "medium" | "high") => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onCardDragStart?: (e: React.DragEvent, task: Task, type: string) => void
}

export function TasksWindow({ tasks, onCreateTask, onUpdateTask, onDeleteTask, onCardDragStart }: TasksWindowProps) {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

  return (
    <div className="p-6 overflow-y-auto">
      <div className="mb-6">
        <Button onClick={() => setIsNewTaskDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({tasks.filter((t) => !t.completed).length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tasks.filter((t) => t.completed).length})</TabsTrigger>
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <div
                key={task.id}
                draggable={!!onCardDragStart}
                onDragStart={onCardDragStart ? (e) => onCardDragStart(e, task, "task") : undefined}
                className="group cursor-move hover:shadow-md transition-shadow"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => onUpdateTask(task.id, { completed: !!checked })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {task.priority} priority
                          </Badge>
                          <span className="text-xs text-muted-foreground">{task.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          {tasks.filter((t) => !t.completed).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active tasks</p>
              <Button className="mt-4" onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => onUpdateTask(task.id, { completed: !!checked })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium line-through">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-through">{task.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => onUpdateTask(task.id, { completed: !!checked })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
                    <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? "line-through" : ""}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority} priority
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your list</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const title = formData.get("title") as string
              const description = formData.get("description") as string
              const priority = formData.get("priority") as "low" | "medium" | "high"
              if (title) {
                onCreateTask(title, description, priority)
                setIsNewTaskDialogOpen(false)
              }
            }}
          >
            <div className="space-y-4">
              <Input name="title" placeholder="Task title..." required />
              <Textarea name="description" placeholder="Task description..." rows={3} />
              <Select name="priority" defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
