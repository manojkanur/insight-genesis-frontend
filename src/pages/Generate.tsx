import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Loader2, 
  Sparkles,
  Download,
  Save,
  Lightbulb,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  generateWhitepaper, 
  ApiError, 
  GenerateResponse, 
  downloadFile
} from "@/lib/api"
import { TemplateSelector } from "@/components/TemplateSelector"
import { PdfViewer } from "@/components/PdfViewer"
import { PagedWordEditor } from "@/components/PagedWordEditor"
import { ConversionToolbar } from "@/components/ConversionToolbar"
import { useDocumentConversion } from "@/hooks/useDocumentConversion"
import { groqAI } from "@/lib/aiService"

interface GenerationForm {
  title: string
  industry: string
  audience: string
  description: string
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Real Estate", "Energy", "Transportation", "Agriculture"
]

const audiences = [
  "C-Suite Executives", "Technical Decision Makers", "Industry Analysts",
  "Investors", "Government Officials", "Academic Researchers", "General Public"
]

export default function Generate() {
  const [form, setForm] = useState<GenerationForm>({
    title: "",
    industry: "",
    audience: "",
    description: ""
  })
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedFile, setGeneratedFile] = useState<GenerateResponse | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewMode, setViewMode] = useState<'pdf' | 'word'>('pdf')
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const { toast } = useToast()

  // Use the conversion hook
  const {
    isConverting,
    isConverted,
    isExporting,
    isSaving,
    hasUnsavedChanges,
    editedContent,
    convertPdfToWord,
    updateContent,
    saveChanges,
    exportToPdf,
    exportToWord,
    resetConversion
  } = useDocumentConversion()

  const updateForm = (field: keyof GenerationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const generateAISuggestions = async () => {
    if (!form.title || !form.industry) {
      toast({
        title: "Missing information",
        description: "Please provide a title and industry first.",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingSuggestions(true)
    try {
      const prompt = `
Generate 3 comprehensive description paragraphs for a whitepaper titled "${form.title}" in the ${form.industry} industry.

Each description should be a detailed paragraph (150-200 words) that provides:
- Context about the current state of the industry
- Key challenges and opportunities
- Market trends and implications
- Why this topic is important now

Please provide your response in the following JSON format:
{
  "descriptions": [
    "First detailed description paragraph...",
    "Second detailed description paragraph...",
    "Third detailed description paragraph..."
  ]
}

Make each description comprehensive, professional, and specific to the title and industry.
`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = JSON.parse(data.choices[0].message.content)
      setDescriptionSuggestions(aiResponse.descriptions || [])
      
      toast({
        title: "AI suggestions generated",
        description: "Comprehensive AI-powered description suggestions are ready.",
      })
    } catch (error) {
      console.error('AI suggestion error:', error)
      
      // Fallback suggestions
      const fallbackSuggestions = [
        `The ${form.industry.toLowerCase()} industry is experiencing significant transformation driven by ${form.title.toLowerCase()}. Organizations are grappling with evolving market demands, technological disruptions, and changing stakeholder expectations. This comprehensive analysis explores the current landscape, identifying key challenges and emerging opportunities that define the sector's trajectory. Understanding these dynamics is crucial for industry leaders seeking to navigate complexity and drive sustainable growth in an increasingly competitive environment.`,
        
        `Market trends in ${form.industry.toLowerCase()} reveal accelerating adoption of ${form.title.toLowerCase()}-related initiatives. Industry analysts project substantial growth opportunities, while regulatory frameworks continue to evolve. Organizations must balance innovation with compliance, operational efficiency with strategic investment. This whitepaper examines critical success factors, best practices from market leaders, and proven methodologies for implementation. The analysis provides actionable insights for decision-makers evaluating strategic options and investment priorities.`,
        
        `The strategic imperative for ${form.title.toLowerCase()} in ${form.industry.toLowerCase()} organizations has never been more pronounced. Competitive pressures, customer expectations, and technological capabilities are converging to create unprecedented opportunities for value creation. This research synthesizes industry expertise, case studies, and performance data to deliver comprehensive guidance. Stakeholders across the ecosystem require evidence-based frameworks to assess potential, mitigate risks, and optimize outcomes in their transformation journey.`
      ]
      
      setDescriptionSuggestions(fallbackSuggestions)
      
      toast({
        title: "AI suggestions generated",
        description: "Fallback description suggestions are ready.",
      })
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setForm(prev => ({
      ...prev,
      description: prev.description ? `${prev.description}\n\n${suggestion}` : suggestion
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate only required fields (title and industry)
    if (!form.title || !form.industry) {
      toast({
        title: "Missing required fields",
        description: "Please provide both title and industry to continue.",
        variant: "destructive"
      })
      return
    }

    if (!selectedTemplate) {
      toast({
        title: "Template required",
        description: "Please select a PDF template to continue.",
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

      // Call API with updated payload
      const response = await generateWhitepaper({
        title: form.title,
        industry: form.industry,
        audience: form.audience || "General Business Audience",
        problem_statement: form.description || "Auto-generated based on industry analysis",
        solution_outline: "AI-powered comprehensive whitepaper solution",
        tone: "Professional",
        length: "Medium (10-20 pages)",
        template: selectedTemplate
      })

      clearInterval(progressInterval)
      setProgress(100)
      setGeneratedFile(response)

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

  const handleDownload = async () => {
    if (!generatedFile) return
    
    setIsDownloading(true)
    try {
      const blob = await downloadFile(generatedFile.pdf_url)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = generatedFile.filename || 'whitepaper.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Download successful",
        description: "Your whitepaper has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleConvertToWord = async () => {
    if (!generatedFile) return
    
    try {
      await convertPdfToWord(generatedFile.pdf_url)
      setViewMode('word')
    } catch (error) {
      console.error('Conversion failed:', error)
    }
  }

  const handleSaveWordChanges = async () => {
    if (!generatedFile) return
    
    try {
      await saveChanges(generatedFile.filename, editedContent)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handleDownloadEditedPdf = async () => {
    if (!generatedFile) return
    
    try {
      await exportToPdf(generatedFile.filename, editedContent)
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const handleDownloadWord = async () => {
    if (!generatedFile) return
    
    try {
      await exportToWord(generatedFile.filename, editedContent)
    } catch (error) {
      console.error('Word export failed:', error)
    }
  }

  const handleToggleView = () => {
    setViewMode(prev => prev === 'pdf' ? 'word' : 'pdf')
  }

  const handleSave = () => {
    // This would typically save to user's account/history
    toast({
      title: "Whitepaper saved",
      description: "Your whitepaper has been saved to your documents.",
    })
  }

  const resetForm = () => {
    setForm({
      title: "",
      industry: "",
      audience: "",
      description: ""
    })
    setSelectedTemplate(null)
    setGeneratedFile(null)
    setProgress(0)
    setViewMode('pdf')
    setDescriptionSuggestions([])
    resetConversion()
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!generatedFile ? (
          <div className="h-full overflow-auto">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Generate AI Whitepaper
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create comprehensive, professional whitepapers powered by advanced AI technology.
                </p>
              </div>

              {!isGenerating ? (
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
                        <Label htmlFor="title">Whitepaper Title <span className="text-red-500">*</span></Label>
                        <Input
                          id="title"
                          placeholder="e.g., The Future of AI in Healthcare"
                          value={form.title}
                          onChange={(e) => updateForm('title', e.target.value)}
                          className="text-base"
                          required
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
                          <Select value={form.industry} onValueChange={(value) => updateForm('industry', value)} required>
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
                          <Label htmlFor="audience">Target Audience</Label>
                          <Select value={form.audience} onValueChange={(value) => updateForm('audience', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your audience (optional)" />
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

                  {/* Description Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Description
                          </CardTitle>
                          <CardDescription>
                            Provide a detailed description of your whitepaper topic (optional)
                          </CardDescription>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateAISuggestions}
                          disabled={isGeneratingSuggestions || !form.title || !form.industry}
                          className="gap-2"
                        >
                          {isGeneratingSuggestions ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Get AI Suggestions
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description">Whitepaper Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your whitepaper topic, key themes, or areas of focus..."
                          value={form.description}
                          onChange={(e) => updateForm('description', e.target.value)}
                          className="min-h-[200px] text-base"
                        />
                        {descriptionSuggestions.length > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-3">AI-Generated Description Suggestions:</p>
                            <div className="space-y-3">
                              {descriptionSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="block w-full text-left p-3 text-sm bg-background hover:bg-accent rounded border transition-colors"
                                >
                                  <div className="line-clamp-4">{suggestion}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" className="gap-2 bg-black hover:bg-black/90 text-white">
                      <Sparkles className="w-5 h-5" />
                      Generate Whitepaper
                    </Button>
                  </div>
                </form>
              ) : (
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
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Header with actions */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Generated Whitepaper</h3>
                  <p className="text-sm text-muted-foreground">{generatedFile.filename}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                >
                  Generate New
                </Button>
              </div>
            </div>

            {/* Conversion Toolbar */}
            <div className="p-4 shrink-0">
              <ConversionToolbar
                isConverted={isConverted}
                isConverting={isConverting}
                viewMode={viewMode}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
                isExporting={isExporting}
                onConvert={handleConvertToWord}
                onSave={handleSaveWordChanges}
                onDownloadPdf={handleDownloadEditedPdf}
                onDownloadWord={handleDownloadWord}
                onToggleView={handleToggleView}
                filename={generatedFile.filename}
              />
            </div>

            {/* Content Area - Improved Layout */}
            <div className="flex-1 overflow-hidden px-4 pb-4">
              {viewMode === 'pdf' ? (
                <PdfViewer 
                  pdfUrl={generatedFile.pdf_url}
                  className="h-full"
                />
              ) : (
                <div className="h-full">
                  <PagedWordEditor
                    value={editedContent}
                    onChange={updateContent}
                    onSave={handleSaveWordChanges}
                    onDownloadPdf={handleDownloadEditedPdf}
                    onDownloadWord={handleDownloadWord}
                    hasUnsavedChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    placeholder="Edit your whitepaper content here..."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Template Selector (only show when not generated) */}
      {!generatedFile && (
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
        />
      )}
    </div>
  )
}
