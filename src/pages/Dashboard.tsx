
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview"
import { RecentDocuments } from "@/components/dashboard/RecentDocuments"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            WhitePaper AI Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your AI-powered document intelligence platform.
          </p>
        </div>
      </div>

      {/* Hero Stats */}
      <DashboardStats />

      {/* Quick Actions & Activity Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <ActivityFeed />
      </div>

      {/* Analytics Overview */}
      <AnalyticsOverview />

      {/* Recent Documents */}
      <RecentDocuments />
    </div>
  )
}
