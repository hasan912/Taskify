"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { CheckSquare, Users, BarChart3, Zap, ArrowRight, Star } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold gradient-text">Taskify</span>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border bg-muted/50">
          <Star className="h-4 w-4 text-primary fill-primary" />
          <span className="text-sm font-medium">Transform Your Team Workflow</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Team Task Collaboration
          <br />
          <span className="gradient-text">Made Simple</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Assign, track, and complete tasks collaboratively in real-time with email notifications. 
          Built for modern teams who value clarity and speed.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all group">
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Powerful features to supercharge your team's productivity</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="modern-card group hover:scale-105 transition-transform p-6">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CheckSquare className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Task Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create, assign, and track tasks with ease. Keep your team aligned on priorities.
            </p>
          </div>
          
          <div className="modern-card group hover:scale-105 transition-transform p-6">
            <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Work together seamlessly with role-based access and instant email notifications.
            </p>
          </div>
          
          <div className="modern-card group hover:scale-105 transition-transform p-6">
            <div className="h-14 w-14 rounded-xl bg-success/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track progress with visual charts and detailed task distribution metrics.
            </p>
          </div>
          
          <div className="modern-card group hover:scale-105 transition-transform p-6">
            <div className="h-14 w-14 rounded-xl bg-warning/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-warning" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stay in sync with instant notifications and live task status changes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-24 bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="font-medium">&copy; 2025 Taskify. Built with ❤️ using Next.js & Firebase.</p>
        </div>
      </footer>
    </div>
  )
}
