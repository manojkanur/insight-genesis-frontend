
const stats = [
  {
    value: "10,000+",
    label: "Documents Processed"
  },
  {
    value: "50,000+",
    label: "Hours Saved"
  },
  {
    value: "2,500+",
    label: "Active Users"
  },
  {
    value: "99.2%",
    label: "Accuracy Rate"
  }
]

export function DashboardStats() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
