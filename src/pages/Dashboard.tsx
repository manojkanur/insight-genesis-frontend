
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { DashboardStats } from "@/components/dashboard/DashboardStats"

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            AI-Powered Whitepaper Generation
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your research and content creation with our intelligent platform. Generate 
            professional whitepapers, analyze documents, and interact with your content using advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-lg"
              onClick={() => navigate("/generate")}
            >
              Start Generating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg"
              onClick={() => navigate("/upload")}
            >
              Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-8 bg-background">
        <DashboardStats />
      </div>
    </div>
  )
}
