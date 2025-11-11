"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts"
import type { Task } from "@/app/dashboard/page"
import { TrendingUp } from "lucide-react"

interface TaskChartProps {
  tasks: Task[]
}

export function TaskChart({ tasks }: TaskChartProps) {
  const barData = [
    {
      name: "Pending",
      value: tasks.filter((t) => t.status === "pending").length,
      fill: "#f59e0b", // Amber
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "in-progress").length,
      fill: "#3b82f6", // Blue
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
      fill: "#10b981", // Green
    },
  ]

  const pieData = [
    {
      name: "Pending",
      value: tasks.filter((t) => t.status === "pending").length,
      fill: "#f59e0b",
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "in-progress").length,
      fill: "#3b82f6",
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
      fill: "#10b981",
    },
  ]

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
    : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bar Chart */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Task Distribution
          </CardTitle>
          <CardDescription>Overview of tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Tasks",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 0, 0]}
                  className="cursor-pointer"
                >
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-primary to-secondary" />
            Completion Rate
          </CardTitle>
          <CardDescription>{completionRate}% of tasks completed</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Tasks",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.value > 0 ? entry.value : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
