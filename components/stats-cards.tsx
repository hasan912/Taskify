"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, Target } from "lucide-react"
import type { Task } from "@/app/dashboard/page"

interface StatsCardsProps {
  tasks: Task[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Tasks */}
      <Card className="modern-card border-l-4 border-l-blue-500 hover:scale-105 transition-transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <ListTodo className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Target className="h-3 w-3" />
            All tasks in system
          </p>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="modern-card border-l-4 border-l-green-500 hover:scale-105 transition-transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {completionRate}% completion rate
          </p>
        </CardContent>
      </Card>

      {/* In Progress */}
      <Card className="modern-card border-l-4 border-l-blue-600 hover:scale-105 transition-transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          <div className="p-2 bg-blue-600/10 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Currently active
          </p>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="modern-card border-l-4 border-l-amber-500 hover:scale-105 transition-transform">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Target className="h-3 w-3" />
            Waiting to start
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
