import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Loader2, 
  Sparkles,
  Lightbulb,
  Zap,
  Download,
  Save
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  generateWhitepaper, 
  ApiError, 
  GenerateResponse, 
  downloadFile,
  convertPdfToWord,
  convertWordToPdf
} from "@/lib/api"
import { TemplateSelector } from "@/components/TemplateSelector"
import { PdfViewer } from "@/components/PdfViewer"
import { WordEditor } from "@/components/WordEditor"
import { ConversionToolbar } from "@/components/ConversionToolbar"
import { ViewToggle } from "@/components/ViewToggle"

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
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedFile, setGeneratedFile] = useState<GenerateResponse | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isConverted, setIsConverted] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [viewMode, setViewMode] = useState<'pdf' | 'word'>('pdf')
  const [wordContent, setWordContent] = useState<string>('')
  const [editedWordContent, setEditedWordContent] = useState<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const updateForm = (field: keyof GenerationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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

      // Call real API
      const response = await generateWhitepaper({
        title: form.title,
        industry: form.industry,
        audience: form.audience,
        problem_statement: form.problemStatement,
        solution_outline: form.solutionOutline,
        tone: form.tone,
        length: form.length,
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
    
    setIsConverting(true)
    try {
      const response = await convertPdfToWord(generatedFile.pdf_url)
      
      setWordContent(response.word_content)
      setEditedWordContent(response.word_content)
      setIsConverted(true)
      setViewMode('word')
      
      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable Word format.",
      })
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "Unable to convert PDF to Word format.",
        variant: "destructive"
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleWordContentChange = (content: string) => {
    setEditedWordContent(content)
    setHasUnsavedChanges(true)
  }

  const handleSaveWordChanges = async () => {
    if (!generatedFile) return
    
    setIsSaving(true)
    try {
      const response = await convertWordToPdf({
        word_content: editedWordContent,
        filename: generatedFile.filename.replace('.pdf', '_edited.pdf'),
        formatting: {
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineSpacing: 1.6,
          margins: {
            top: 1,
            bottom: 1,
            left: 1,
            right: 1
          }
        }
      })
      
      // Update the PDF URL with the new edited version
      setGeneratedFile(prev => prev ? { ...prev, pdf_url: response.download_url } : null)
      setHasUnsavedChanges(false)
      
      toast({
        title: "Changes saved",
        description: "Your edits have been saved and PDF updated.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to save changes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadEditedPdf = async () => {
    if (!generatedFile) return
    
    setIsExporting(true)
    try {
      let downloadUrl = generatedFile.pdf_url
      
      // If there are unsaved changes, generate new PDF first
      if (hasUnsavedChanges) {
        const response = await convertWordToPdf({
          word_content: editedWordContent,
          filename: generatedFile.filename.replace('.pdf', '_edited.pdf'),
          formatting: {
            fontSize: 12,
            fontFamily: 'Times New Roman',
            lineSpacing: 1.6,
            margins: { top: 1, bottom: 1, left: 1, right: 1 }
          }
        })
        downloadUrl = response.download_url
      }
      
      const blob = await downloadFile(downloadUrl)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = generatedFile.filename.replace('.pdf', '_edited.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Download successful",
        description: "Your edited PDF has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadWord = async () => {
    if (!editedWordContent) return
    
    try {
      const blob = new Blob([editedWordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${generatedFile?.filename.replace('.pdf', '') || 'document'}_edited.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Word document downloaded",
        description: "Edited content has been downloaded as Word document.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download Word document.",
        variant: "destructive"
      })
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
      problemStatement: "",
      solutionOutline: "",
      tone: "",
      length: ""
    })
    setSelectedTemplate(null)
    setGeneratedFile(null)
    setProgress(0)
    // Reset word editing states
    setIsConverted(false)
    setViewMode('pdf')
    setWordContent('')
    setEditedWordContent('')
    setHasUnsavedChanges(false)
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {!generatedFile ? (
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
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
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
                        <Label htmlFor="audience">Target Audience</Label>
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
                      <Label htmlFor="problem">Problem Statement</Label>
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
                      <Label htmlFor="solution">Solution Outline</Label>
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
        ) : (
          // Generated PDF View with Word Conversion
          <div className="h-full flex flex-col">
            {/* Header with actions */}
            <div className="flex items-center justify-between p-4 border-b border-border">
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
            <div className="p-4">
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

            {/* Content Area */}
            <div className="flex-1 overflow-hidden px-4 pb-4">
              {viewMode === 'pdf' ? (
                <PdfViewer 
                  pdfUrl={generatedFile.pdf_url}
                  className="h-full w-full"
                />
              ) : (
                <WordEditor
                  value={editedWordContent}
                  onChange={handleWordContentChange}
                  onSave={handleSaveWordChanges}
                  onDownloadPdf={handleDownloadEditedPdf}
                  onDownloadWord={handleDownloadWord}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSaving={isSaving}
                  placeholder="Edit your whitepaper content here..."
                />
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
