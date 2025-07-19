
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const usageData = [
  { name: 'Jan', documents: 45, chats: 120 },
  { name: 'Feb', documents: 52, chats: 145 },
  { name: 'Mar', documents: 78, chats: 180 },
  { name: 'Apr', documents: 95, chats: 220 },
  { name: 'May', documents: 125, chats: 280 },
  { name: 'Jun', documents: 180, chats: 350 },
]

const processingData = [
  { name: 'PDF', value: 45 },
  { name: 'DOCX', value: 30 },
  { name: 'TXT', value: 15 },
  { name: 'Other', value: 10 },
]

export function AnalyticsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Documents"
              />
              <Line 
                type="monotone" 
                dataKey="chats" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                name="Chat Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
