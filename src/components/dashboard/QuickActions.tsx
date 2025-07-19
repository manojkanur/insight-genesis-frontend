
import { FileText, Upload, MessageSquare, Layout } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const actions = [
  {
    title: "Generate Whitepaper",
    description: "Create AI-powered professional documents",
    icon: FileText,
    href: "/generate",
    variant: "hero" as const,
    primary: true
  },
  {
    title: "Upload Document",
    description: "Analyze and process your documents",
    icon: Upload,
    href: "/upload",
    variant: "outline" as const
  },
  {
    title: "AI Chat",
    description: "Ask questions about your documents",
    icon: MessageSquare,
    href: "/chat",
    variant: "outline" as const
  },
  {
    title: "Browse Templates",
    description: "Choose from professional templates",
    icon: Layout,
    href: "/generate",
    variant: "outline" as const
  }
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action, index) => (
          <Card 
            key={action.title} 
            className={`hover-lift cursor-pointer transition-all duration-200 ${
              action.primary ? 'hero-gradient text-white border-0' : ''
            }`}
            onClick={() => navigate(action.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  action.primary 
                    ? 'bg-white/20 text-white' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    action.primary ? 'text-white' : 'text-foreground'
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    action.primary ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
