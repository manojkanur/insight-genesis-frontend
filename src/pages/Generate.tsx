import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Loader2, 
  CheckCircle, 
  Download, 
  Eye, 
  Sparkles,
  Target,
  Users,
  Building,
  Lightbulb,
  Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWhitepaperGeneration, useFileDownload } from "@/hooks/useApi"
import { generateWhitepaper, ApiError } from "@/lib/api"

interface GenerationForm {
  title: string
  industry: string
  audience: string
  problemStatement: string
  solutionOutline: string
  tone: string
  length: string
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Real Estate", "Energy", "Transportation", "Agriculture"
]

const audiences = [
  "C-Suite Executives", "Technical Decision Makers", "Industry Analysts",
  "Investors", "Government Officials", "Academic Researchers", "General Public"
]

const tones = [
  "Professional", "Technical", "Conversational", "Academic", "Persuasive"
]

const lengths = [
  "Short (5-10 pages)", "Medium (10-20 pages)", "Long (20-30 pages)", "Extended (30+ pages)"
]

export default function Generate() {
  const [form, setForm] = useState<GenerationForm>({
    title: "",
    industry: "",
    audience: "",
    problemStatement: "",
    solutionOutline: "",
    tone: "",
    length: ""
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedFile, setGeneratedFile] = useState<{ path: string; sections: string[] } | null>(null)
  const { toast } = useToast()
  const { downloadFile, loading: downloadLoading } = useFileDownload()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const requiredFields = ['title', 'industry', 'audience', 'problemStatement', 'solutionOutline']
    const missingFields = requiredFields.filter(field => !form[field as keyof GenerationForm])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to continue.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 500)

      // Call real API
      const response = await generateWhitepaper({
        title: form.title,
        industry: form.industry,
        audience: form.audience,
        problem_statement: form.problemStatement,
        solution_outline: form.solutionOutline,
        tone: form.tone,
        length: form.length
      })

      clearInterval(progressInterval)
      setProgress(100)
      setGeneratedFile({
        path: response.pdf_path,
        sections: response.sections
      })

      toast({
        title: "Whitepaper generated successfully!",
        description: "Your AI-powered whitepaper is ready for download.",
      })
    } catch (error) {
      const apiError = error as ApiError
      toast({
        title: "Generation failed",
        description: apiError.message,
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedFile?.path) {
      const filename = generatedFile.path.split('/').pop() || generatedFile.path.split('\\').pop()
      downloadFile(filename!, `${form.title.replace(/\s+/g, '_')}_whitepaper.pdf`)
    }
  }

  const handlePreview = () => {
    if (generatedFile?.path) {
      // Open PDF in new tab for preview
      const pdfUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'}/api/download/${encodeURIComponent(generatedFile.path)}`
      window.open(pdfUrl, '_blank')
    }
  }

  const updateForm = (field: keyof GenerationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Generate AI Whitepaper
        </h1>
        <p className="text-xl text-muted-foreground">
          Create comprehensive, professional whitepapers powered by advanced AI technology.
        </p>
      </div>

      {!isGenerating && !generatedFile && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Define the core details of your whitepaper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Whitepaper Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., The Future of AI in Healthcare"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className="text-base"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={form.industry} onValueChange={(value) => updateForm('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience *</Label>
                  <Select value={form.audience} onValueChange={(value) => updateForm('audience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map(audience => (
                        <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Content Details
              </CardTitle>
              <CardDescription>
                Describe the problem and solution your whitepaper will address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement *</Label>
                <Textarea
                  id="problem"
                  placeholder="Describe the key problem or challenge your whitepaper will address..."
                  value={form.problemStatement}
                  onChange={(e) => updateForm('problemStatement', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="solution">Solution Outline *</Label>
                <Textarea
                  id="solution"
                  placeholder="Outline your proposed solution or approach..."
                  value={form.solutionOutline}
                  onChange={(e) => updateForm('solutionOutline', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Style & Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Style & Format
              </CardTitle>
              <CardDescription>
                Customize the tone and length of your whitepaper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tone">Writing Tone</Label>
                  <Select value={form.tone} onValueChange={(value) => updateForm('tone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select writing tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(tone => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Document Length</Label>
                  <Select value={form.length} onValueChange={(value) => updateForm('length', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document length" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengths.map(length => (
                        <SelectItem key={length} value={length}>{length}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" variant="hero" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Whitepaper
            </Button>
          </div>
        </form>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center glow">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-2">Generating Your Whitepaper</h3>
                <p className="text-muted-foreground">
                  Our AI is crafting your professional whitepaper. This may take a few minutes.
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <Progress value={progress} className="mb-2" />
                <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {generatedFile && (
        <Card className="border-success">
          <CardContent className="py-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-2">Whitepaper Generated Successfully!</h3>
                <p className="text-muted-foreground mb-6">
                  Your AI-powered whitepaper is ready for download and review.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="success" className="gap-2" onClick={handleDownload} disabled={downloadLoading}>
                    <Download className="w-5 h-5" />
                    {downloadLoading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  
                  <Button size="lg" variant="outline" className="gap-2" onClick={handlePreview}>
                    <Eye className="w-5 h-5" />
                    Preview
                  </Button>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  File: {generatedFile.path}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
