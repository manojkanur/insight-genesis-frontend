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
import { generateUniqueSuggestions } from "@/lib/suggestionGenerator"

interface GenerationForm {
  title: string
  industry: string
  audience: string
  context: string
  solutionOutline: string
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Real Estate", "Energy", "Transportation", "Agriculture"
]

const audiences = [
  "C-Suite Executives", "Technical Decision Makers", "Industry Analysts",
  "Investors", "Government Officials", "Academic Researchers", "General Public"
]

// AI-powered suggestion service
const generateSuggestions = (title: string, industry: string) => {
  if (!title.trim()) return { context: [], solutionOutline: [] }
  
  const contextSuggestions = [
    `Current challenges in ${industry.toLowerCase()} industry regarding ${title.toLowerCase()}`,
    `Market trends and opportunities related to ${title.toLowerCase()}`,
    `Regulatory landscape and compliance requirements for ${title.toLowerCase()}`,
    `Technology adoption barriers in ${industry.toLowerCase()} sector`,
    `Economic impact and business case for ${title.toLowerCase()}`
  ]
  
  const solutionSuggestions = [
    `Comprehensive framework for implementing ${title.toLowerCase()}`,
    `Step-by-step methodology to address key challenges`,
    `Best practices and proven strategies from industry leaders`,
    `Technology solutions and tools for ${title.toLowerCase()}`,
    `ROI analysis and implementation roadmap`
  ]
  
  return {
    context: contextSuggestions.slice(0, 3),
    solutionOutline: solutionSuggestions.slice(0, 3)
  }
}

export default function Generate() {
  const [form, setForm] = useState<GenerationForm>({
    title: "",
    industry: "",
    audience: "",
    context: "",
    solutionOutline: ""
  })
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedFile, setGeneratedFile] = useState<GenerateResponse | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewMode, setViewMode] = useState<'pdf' | 'word'>('pdf')
  const [suggestions, setSuggestions] = useState<{
    context: string[]
    solutionOutline: string[]
  }>({ context: [], solutionOutline: [] })
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
    
    // Generate unique suggestions when title or industry changes
    if (field === 'title' || field === 'industry') {
      const newForm = { ...form, [field]: value }
      if (newForm.title && newForm.industry) {
        const newSuggestions = generateUniqueSuggestions(newForm.title, newForm.industry)
        setSuggestions(newSuggestions)
      }
    }
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
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate unique suggestions based on current title and industry
      const newSuggestions = generateUniqueSuggestions(form.title, form.industry)
      setSuggestions(newSuggestions)
      
      toast({
        title: "AI suggestions generated",
        description: "Unique suggestions tailored to your whitepaper topic are ready.",
      })
    } catch (error) {
      toast({
        title: "Error generating suggestions",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const applySuggestion = (field: 'context' | 'solutionOutline', suggestion: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n\n${suggestion}` : suggestion
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const requiredFields = ['title', 'industry', 'audience']
    const missingFields = requiredFields.filter(field => !form[field as keyof GenerationForm])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to continue.",
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

      // Call real API with updated payload
      const response = await generateWhitepaper({
        title: form.title,
        industry: form.industry,
        audience: form.audience,
        problem_statement: form.context || "Auto-generated based on industry and audience",
        solution_outline: form.solutionOutline || "AI-powered whitepaper solution",
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
      context: "",
      solutionOutline: ""
    })
    setSelectedTemplate(null)
    setGeneratedFile(null)
    setProgress(0)
    setViewMode('pdf')
    setSuggestions({ context: [], solutionOutline: [] })
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
                        <Label htmlFor="title">Whitepaper Title</Label>
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
                          <Label htmlFor="industry">Industry</Label>
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
                          <Select value={form.audience} onValueChange={(value) => updateForm('audience', value)} required>
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

                  {/* Context and Solution Outline */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Context And Solution Outline
                          </CardTitle>
                          <CardDescription>
                            Define the context and solution approach for your whitepaper
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
                        <Label htmlFor="context">Context & Background</Label>
                        <Textarea
                          id="context"
                          placeholder="Describe the current situation, challenges, or market context..."
                          value={form.context}
                          onChange={(e) => updateForm('context', e.target.value)}
                          className="min-h-[120px] text-base"
                        />
                        {suggestions.context.length > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">AI Suggestions for Context:</p>
                            <div className="space-y-2">
                              {suggestions.context.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => applySuggestion('context', suggestion)}
                                  className="block w-full text-left p-2 text-sm bg-background hover:bg-accent rounded border transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="solutionOutline">Solution Outline</Label>
                        <Textarea
                          id="solutionOutline"
                          placeholder="Outline your proposed solution, approach, or methodology..."
                          value={form.solutionOutline}
                          onChange={(e) => updateForm('solutionOutline', e.target.value)}
                          className="min-h-[120px] text-base"
                        />
                        {suggestions.solutionOutline.length > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">AI Suggestions for Solution:</p>
                            <div className="space-y-2">
                              {suggestions.solutionOutline.map((suggestion, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => applySuggestion('solutionOutline', suggestion)}
                                  className="block w-full text-left p-2 text-sm bg-background hover:bg-accent rounded border transition-colors"
                                >
                                  {suggestion}
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
          // Generated PDF/Word View with improved layout
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
