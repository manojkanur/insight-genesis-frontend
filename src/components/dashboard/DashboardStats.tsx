
import { FileText, Clock, Users, Target } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"

const stats = [
  {
    title: "Documents Processed",
    value: "10,247",
    description: "Total documents analyzed",
    icon: <FileText className="h-6 w-6" />,
    trend: { value: 12.5, isPositive: true }
  },
  {
    title: "Hours Saved",
    value: "52,340",
    description: "Time saved through automation",
    icon: <Clock className="h-6 w-6" />,
    trend: { value: 8.2, isPositive: true }
  },
  {
    title: "Active Users",
    value: "2,547",
    description: "Users this month",
    icon: <Users className="h-6 w-6" />,
    trend: { value: 15.3, isPositive: true }
  },
  {
    title: "Accuracy Rate",
    value: "99.2%",
    description: "AI processing accuracy",
    icon: <Target className="h-6 w-6" />,
    trend: { value: 0.3, isPositive: true }
  }
]

export function DashboardStats() {
  return (
    <div className="animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
