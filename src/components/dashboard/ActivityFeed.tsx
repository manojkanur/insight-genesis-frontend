
import { FileText, Upload, MessageSquare, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"

const activities = [
  {
    id: 1,
    type: "whitepaper",
    title: "AI in Healthcare Whitepaper",
    description: "Generated successfully",
    time: "2 minutes ago",
    icon: FileText,
    status: "success" as const
  },
  {
    id: 2,
    type: "upload",
    title: "Research Document.pdf",
    description: "Processing document",
    time: "5 minutes ago",
    icon: Upload,
    status: "processing" as const
  },
  {
    id: 3,
    type: "chat",
    title: "AI Chat Session",
    description: "Asked 5 questions about document analysis",
    time: "10 minutes ago",
    icon: MessageSquare,
    status: "info" as const
  },
  {
    id: 4,
    type: "download",
    title: "Financial Analysis Report",
    description: "Downloaded as PDF",
    time: "15 minutes ago",
    icon: Download,
    status: "success" as const
  },
  {
    id: 5,
    type: "whitepaper",
    title: "Blockchain Technology Overview",
    description: "Generation in progress",
    time: "20 minutes ago",
    icon: FileText,
    status: "processing" as const
  }
]

export function ActivityFeed() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <StatusBadge variant={activity.status} size="sm">
                  {activity.status === "processing" ? "Processing" : 
                   activity.status === "success" ? "Complete" : "Info"}
                </StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
