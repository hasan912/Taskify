"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collection, query, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { sendTaskAssignmentEmail } from "@/lib/email-service"
import { notifyTaskAssignment } from "@/lib/notification-service"
import { useAuth } from "@/lib/auth-context"
import type { Task } from "@/app/dashboard/page"
import { toast } from "sonner"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (task: Omit<Task, "id" | "createdAt" | "createdBy" | "createdByName">) => Promise<string>
}

interface User {
  uid: string
  name: string
  email: string
  role: string
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) {
  const { userProfile } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    assignedTo: "",
    assignedToName: "",
    assignedToEmail: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(query(collection(db, "users")))
      const usersData = usersSnapshot.docs.map((doc) => doc.data() as User)
      setUsers(usersData)
    }

    if (open) {
      fetchUsers()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create the task and get the ID
      const taskId = await onCreateTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo,
        assignedToName: formData.assignedToName,
      })

      // Send notifications
      if (formData.assignedTo && userProfile && taskId) {
        // Create in-app notification (always works)
        await notifyTaskAssignment(
          formData.assignedTo,
          formData.title,
          userProfile.name,
          taskId
        )

        // Try to send email notification (optional - won't block task creation)
        if (formData.assignedToEmail) {
          // Send email in background - don't wait for it
          sendTaskAssignmentEmail({
            to: formData.assignedToEmail,
            toName: formData.assignedToName,
            taskTitle: formData.title,
            taskDescription: formData.description,
            assignedBy: userProfile.name,
          }).catch(err => {
            console.warn('Email failed (non-blocking):', err)
          })
        }
        
        toast.success("Task created successfully!", {
          description: `${formData.assignedToName} will be notified.`,
        })
      } else {
        toast.success("Task created successfully!")
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "pending",
        assignedTo: "",
        assignedToName: "",
        assignedToEmail: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.uid === userId)
    if (user) {
      setFormData({
        ...formData,
        assignedTo: userId,
        assignedToName: user.name,
        assignedToEmail: user.email,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-blue-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text bg-clip-text text-transparent">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-base">
            Assign a task to a team member - they'll receive an email notification
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-11 border-blue-950"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="border-blue-950 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="text-sm font-semibold">
              Assign To <span className="">*</span>
            </Label>
            <Select value={formData.assignedTo} onValueChange={handleUserSelect} required>
              <SelectTrigger className="h-11 border-blue-950">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.uid} value={user.uid}>
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {user.role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.assignedToEmail && (
              <p className="text-xs text-muted-foreground">
                📧 Notification will be sent to: {formData.assignedToEmail}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Task["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="h-11 border-blue-950">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Pending
                  </span>
                </SelectItem>
                <SelectItem value="in-progress">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    In Progress
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Completed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 h-11 border-blue-950 hover:bg-blue-50 dark:border-blue-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-11 border-blue-950 hover:bg-blue-200 dark:border-blue-800 font-semibold"
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
