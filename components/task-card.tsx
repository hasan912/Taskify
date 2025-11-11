"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, User, Calendar, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { notifyTaskUpdate, notifyTaskCompleted } from "@/lib/notification-service"
import { useAuth } from "@/lib/auth-context"
import type { Task } from "@/app/dashboard/page"

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  userRole: "admin" | "member"
}

export function TaskCard({ task, onUpdate, onDelete, userRole }: TaskCardProps) {
  const { userProfile } = useAuth()
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: Task["status"]) => {
    setUpdating(true)
    const oldStatus = task.status
    await onUpdate(task.id, { status: newStatus })
    
    // Send notification if status changed
    if (oldStatus !== newStatus && userProfile) {
      // Notify the assigned user about status change
      await notifyTaskUpdate(
        task.assignedTo,
        task.title,
        userProfile.name,
        newStatus,
        task.id
      )
      
      // If task completed, also notify the creator
      if (newStatus === "completed" && task.createdBy !== task.assignedTo) {
        await notifyTaskCompleted(
          task.createdBy,
          task.title,
          task.assignedToName,
          task.id
        )
      }
    }
    
    setUpdating(false)
  }

  const getStatusConfig = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          label: "Completed"
        }
      case "in-progress":
        return {
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          icon: <Clock className="h-3.5 w-3.5" />,
          label: "In Progress"
        }
      case "pending":
        return {
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          label: "Pending"
        }
    }
  }

  const statusConfig = getStatusConfig(task.status)

  return (
    <Card className="modern-card group hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <Badge className={`${statusConfig.color} flex items-center gap-1 px-2.5 py-1`}>
            {statusConfig.icon}
            <span className="text-xs font-medium">{statusConfig.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {task.description}
        </p>
        
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assigned to</p>
              <p className="font-medium">{task.assignedToName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 text-sm p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="p-1.5 bg-secondary/10 rounded-md">
              <Calendar className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created by</p>
              <p className="font-medium">{task.createdByName}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4 border-t">
        <Select value={task.status} onValueChange={handleStatusChange} disabled={updating}>
          <SelectTrigger className="flex-1 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <Circle className="h-3.5 w-3.5 text-amber-500" />
                <span>Pending</span>
              </div>
            </SelectItem>
            <SelectItem value="in-progress">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>In Progress</span>
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span>Completed</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {userRole === "admin" && (
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={() => onDelete(task.id)}
            className="h-10 w-10 hover:scale-110 transition-transform"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
