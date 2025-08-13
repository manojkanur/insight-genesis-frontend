
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Sparkles, 
  Target, 
  Users, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Download,
  Eye,
  Settings,
  Lightbulb,
  BarChart,
  PieChart,
  FileCheck,
  AlertCircle,
  Info
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TemplateSelector } from "@/components/TemplateSelector"

interface GenerationForm {
  title: string
  topic: string
  audience: string
  tone: string
  length: number[]
  includeCharts: boolean
  includeReferences: boolean
  includeSummary: boolean
  keyPoints: string
  methodology: string
  template: string
}

interface GenerationResult {
  id: string
  title: string
  content: string
  wordCount: number
  createdAt: Date
  downloadUrl: string
}

export default function Generate() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const { toast } = useToast()

  const [form, setForm] = useState<GenerationForm>({
    title: "",
    topic: "",
    audience: "",
    tone: "",
    length: [3000],
    includeCharts: false,
    includeReferences: true,
    includeSummary: true,
    keyPoints: "",
    methodology: "",
    template: ""
  })

  const steps = [
    { id: 1, title: "Basic Information", icon: FileText },
    { id: 2, title: "Content Structure", icon: BookOpen },
    { id: 3, title: "Template Selection", icon: Target },
    { id: 4, title: "Review & Generate", icon: Sparkles }
  ]

  const audiences = [
    { value: "academic", label: "Academic Researchers" },
    { value: "business", label: "Business Executives" },
    { value: "technical", label: "Technical Teams" },
    { value: "general", label: "General Public" },
    { value: "investors", label: "Investors & Stakeholders" }
  ]

  const tones = [
    { value: "formal", label: "Formal & Professional" },
    { value: "conversational", label: "Conversational" },
    { value: "technical", label: "Technical & Detailed" },
    { value: "persuasive", label: "Persuasive" },
    { value: "analytical", label: "Analytical" }
  ]

  const handleInputChange = (field: keyof GenerationForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const simulateGeneration = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 500)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    clearInterval(progressInterval)
    setGenerationProgress(100)

    // Simulate result
    const result: GenerationResult = {
      id: Date.now().toString(),
      title: form.title || "Generated Whitepaper",
      content: "Your comprehensive whitepaper has been generated successfully...",
      wordCount: form.length[0],
      createdAt: new Date(),
      downloadUrl: "#"
    }

    setGenerationResult(result)
    setIsGenerating(false)
    
    toast({
      title: "Whitepaper Generated!",
      description: "Your whitepaper has been successfully created and is ready for download.",
    })
  }

  const resetGeneration = () => {
    setGenerationResult(null)
    setCurrentStep(1)
    setForm({
      title: "",
      topic: "",
      audience: "",
      tone: "",
      length: [3000],
      includeCharts: false,
      includeReferences: true,
      includeSummary: true,
      keyPoints: "",
      methodology: "",
      template: ""
    })
  }

  if (generationResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Whitepaper Generated Successfully!</h1>
          <p className="text-xl text-muted-foreground">
            Your whitepaper "{generationResult.title}" is ready for download.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Generation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Document Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Title:</strong> {generationResult.title}</p>
                  <p><strong>Word Count:</strong> {generationResult.wordCount.toLocaleString()} words</p>
                  <p><strong>Generated:</strong> {generationResult.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Document
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <Button 
                onClick={resetGeneration}
                variant="outline" 
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Another Whitepaper
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Generating Your Whitepaper</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Our AI is crafting your comprehensive document...
          </p>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
                
                <div className="text-sm text-muted-foreground">
                  {generationProgress < 20 && "Analyzing your requirements..."}
                  {generationProgress >= 20 && generationProgress < 40 && "Researching topic and gathering information..."}
                  {generationProgress >= 40 && generationProgress < 60 && "Structuring content and creating outline..."}
                  {generationProgress >= 60 && generationProgress < 80 && "Writing content and adding details..."}
                  {generationProgress >= 80 && generationProgress < 95 && "Formatting and adding final touches..."}
                  {generationProgress >= 95 && "Almost ready! Finalizing your whitepaper..."}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Targeted Content</h3>
                <p className="text-sm text-muted-foreground">Creating content tailored to your specific audience</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <BarChart className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Data Integration</h3>
                <p className="text-sm text-muted-foreground">Including relevant charts and supporting data</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">Ensuring professional formatting and structure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate AI Whitepaper</h1>
        <p className="text-xl text-muted-foreground">
          Create comprehensive, professional whitepapers using AI technology
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground/30 text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <div key={step.id} className={`text-center ${
              currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              {step.title}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {steps.find(s => s.id === currentStep)?.icon && (
                  <steps.find(s => s.id === currentStep)!.icon className="w-5 h-5" />
                )}
                {steps.find(s => s.id === currentStep)?.title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Provide basic information about your whitepaper"}
                {currentStep === 2 && "Define the structure and content preferences"}
                {currentStep === 3 && "Choose a template that fits your needs"}
                {currentStep === 4 && "Review your settings and generate the whitepaper"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter your whitepaper title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic & Focus Area</Label>
                    <Textarea
                      id="topic"
                      value={form.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="Describe the main topic and focus area of your whitepaper..."
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Select value={form.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {audiences.map((audience) => (
                            <SelectItem key={audience.value} value={audience.value}>
                              {audience.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Writing Tone</Label>
                      <Select value={form.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select writing tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Document Length</Label>
                      <div className="mt-2">
                        <Slider
                          value={form.length}
                          onValueChange={(value) => handleInputChange('length', value)}
                          max={10000}
                          min={1000}
                          step={500}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>1,000 words</span>
                          <span className="font-medium">{form.length[0].toLocaleString()} words</span>
                          <span>10,000 words</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keyPoints">Key Points to Cover</Label>
                      <Textarea
                        id="keyPoints"
                        value={form.keyPoints}
                        onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                        placeholder="List the main points, arguments, or sections you want to include..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="methodology">Research Methodology</Label>
                      <Textarea
                        id="methodology"
                        value={form.methodology}
                        onChange={(e) => handleInputChange('methodology', e.target.value)}
                        placeholder="Describe your research approach, data sources, or methodology..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Include Additional Elements</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeCharts"
                            checked={form.includeCharts}
                            onCheckedChange={(checked) => handleInputChange('includeCharts', checked)}
                          />
                          <Label htmlFor="includeCharts" className="flex items-center gap-2">
                            <PieChart className="w-4 h-4" />
                            Charts and Visualizations
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeReferences"
                            checked={form.includeReferences}
                            onCheckedChange={(checked) => handleInputChange('includeReferences', checked)}
                          />
                          <Label htmlFor="includeReferences" className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            References and Citations
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeSummary"
                            checked={form.includeSummary}
                            onCheckedChange={(checked) => handleInputChange('includeSummary', checked)}
                          />
                          <Label htmlFor="includeSummary" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Executive Summary
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <TemplateSelector 
                  selectedTemplate={form.template}
                  onTemplateSelect={(templateId) => handleInputChange('template', templateId)}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Review Your Configuration</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div><strong>Title:</strong> {form.title || "Not specified"}</div>
                          <div><strong>Audience:</strong> {audiences.find(a => a.value === form.audience)?.label || "Not selected"}</div>
                          <div><strong>Tone:</strong> {tones.find(t => t.value === form.tone)?.label || "Not selected"}</div>
                          <div><strong>Length:</strong> {form.length[0].toLocaleString()} words</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Content Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            {form.includeCharts ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4" />}
                            Charts & Visualizations
                          </div>
                          <div className="flex items-center gap-2">
                            {form.includeReferences ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4" />}
                            References & Citations
                          </div>
                          <div className="flex items-center gap-2">
                            {form.includeSummary ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4" />}
                            Executive Summary
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {form.topic && (
                      <Card className="mt-4">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Topic Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{form.topic}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Ready to Generate</h4>
                        <p className="text-sm text-blue-800">
                          Your whitepaper will be generated based on the configuration above. 
                          This process typically takes 3-5 minutes depending on the document length.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={simulateGeneration}
                    size="lg" 
                    className="gap-2 text-black bg-white hover:bg-gray-100 border border-gray-300"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Whitepaper
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <div>
                  <strong>Be Specific:</strong> Provide detailed topic descriptions for better results
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <div>
                  <strong>Know Your Audience:</strong> Select the right target audience for appropriate language
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <div>
                  <strong>Key Points:</strong> List important topics you want covered in your whitepaper
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Generation Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. Generation Time</span>
                <span className="font-medium">3-5 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">99.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents Generated</span>
                <span className="font-medium">12,847</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
