import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Star, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  CheckCircle,
  Brain,
  Target,
  Rocket
} from "lucide-react"
import { Link } from "react-router-dom"
import heroImage from "@/assets/hero-image.jpg"

const features = [
  {
    icon: Upload,
    title: "Smart Document Upload",
    description: "Upload PDFs and DOCX files for instant AI-powered analysis and insights extraction.",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "AI Whitepaper Generation",
    description: "Generate comprehensive, professional whitepapers tailored to your industry and audience.",
    color: "text-purple-500"
  },
  {
    icon: MessageCircle,
    title: "Intelligent Q&A Chat",
    description: "Ask questions about your documents and get contextual, accurate answers powered by AI.",
    color: "text-green-500"
  }
]

const benefits = [
  { title: "Save 90% of research time", icon: Clock },
  { title: "Enterprise-grade security", icon: Shield },
  { title: "AI-powered insights", icon: Brain },
  { title: "Professional quality output", icon: Target },
]

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Head of Research, TechCorp",
    content: "WhitePaper AI transformed our content creation process. What used to take weeks now takes hours.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    title: "Strategy Director, Innovation Labs",
    content: "The AI-powered analysis is incredibly accurate. It's like having a research team at your fingertips.",
    rating: 5
  },
  {
    name: "Emily Watson",
    title: "Content Manager, StartupXYZ",
    content: "Finally, a tool that understands context and delivers professional-grade whitepapers every time.",
    rating: 5
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Whitepaper Platform" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Intelligence Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Documents into 
              <span className="text-transparent bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text">
                {" "}Professional Whitepapers
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Upload your documents, generate AI-powered whitepapers, and get intelligent insights 
              through natural conversation. The future of content creation is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" variant="accent" className="group">
                <Link to="/upload">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild size="xl" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/generate">
                  Explore Features
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-blue-200">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <benefit.icon className="w-4 h-4" />
                  {benefit.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Core Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything you need for 
              <span className="text-gradient"> intelligent content creation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform combines advanced document analysis with intelligent content generation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift card-gradient border-0 shadow-lg group">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              What our users say
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by professionals 
              <span className="text-gradient">worldwide</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to revolutionize your content creation?
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Join thousands of professionals who trust WhitePaper AI for their content needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" variant="accent">
                <Link to="/upload">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Link>
              </Button>
              
              <Button asChild size="xl" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/chat">
                  Learn More
                </Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-blue-200">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}