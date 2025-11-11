"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { collection, addDoc, query, onSnapshot, updateDoc, deleteDoc, doc, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, LogOut, Plus, Sparkles } from "lucide-react"
import { TaskCard } from "@/components/task-card"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { StatsCards } from "@/components/stats-cards"
import { TaskChart } from "@/components/task-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"

export type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
  assignedToName: string
  createdBy: string
  createdByName: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, userProfile, loading, signOut } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | "my-tasks" | "completed" | "pending">("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    let q = query(collection(db, "tasks"), orderBy("createdAt", "desc"))

    if (filter === "my-tasks") {
      q = query(collection(db, "tasks"), where("assignedTo", "==", user.uid), orderBy("createdAt", "desc"))
    } else if (filter === "completed") {
      q = query(collection(db, "tasks"), where("status", "==", "completed"), orderBy("createdAt", "desc"))
    } else if (filter === "pending") {
      q = query(collection(db, "tasks"), where("status", "==", "pending"), orderBy("createdAt", "desc"))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[]
      setTasks(tasksData)
    })

    return unsubscribe
  }, [user, filter])

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "createdBy" | "createdByName">) => {
    if (!user || !userProfile) return ""

    const docRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      createdBy: user.uid,
      createdByName: userProfile.name,
      createdAt: new Date().toISOString(),
    })
    
    return docRef.id
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", taskId), updates)
  }

  const handleDeleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId))
  }

  if (loading || !user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header with Gradient */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <CheckSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">Taskify</h1>
                  <p className="text-xs text-muted-foreground">Task Management System</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="text-sm font-semibold">{userProfile.name}</span>
                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                  {userProfile.role.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationBell />
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <StatsCards tasks={tasks} />

        {/* Chart Section */}
        <div className="mt-8">
          <TaskChart tasks={tasks} />
        </div>

        {/* Tasks Section with Modern Design */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-primary" />
                Your Tasks
              </h2>
              <p className="text-muted-foreground mt-1">Manage and track all your tasks</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "shadow-lg" : ""}
                >
                  All Tasks
                </Button>
                <Button
                  variant={filter === "my-tasks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("my-tasks")}
                  className={filter === "my-tasks" ? "shadow-lg" : ""}
                >
                  My Tasks
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                  className={filter === "pending" ? "shadow-lg" : ""}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                  className={filter === "completed" ? "shadow-lg" : ""}
                >
                  Completed
                </Button>
              </div>
              
              {userProfile.role === "admin" && (
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              )}
            </div>
          </div>

          {tasks.length === 0 ? (
            <Card className="modern-card">
              <CardContent className="py-16 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto">
                    <CheckSquare className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {userProfile.role === "admin"
                    ? "Get started by creating your first task and assigning it to team members"
                    : "No tasks assigned to you yet. Check back later for new assignments"}
                </p>
                {userProfile.role === "admin" && (
                  <Button 
                    onClick={() => setCreateDialogOpen(true)}
                    className="shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  userRole={userProfile.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {userProfile.role === "admin" && (
        <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onCreateTask={handleCreateTask} />
      )}
    </div>
  )
}
