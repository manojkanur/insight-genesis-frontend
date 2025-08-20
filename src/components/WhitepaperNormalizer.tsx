
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RefreshCw, FileText, AlertCircle, Lightbulb, Loader2 } from 'lucide-react'
import { useWhitepaperNormalization } from '@/hooks/useWhitepaperNormalization'
import { FileUploadZone } from './FileUploadZone'
import { groqAI } from '@/lib/aiService'
import { useToast } from '@/hooks/use-toast'

interface WhitepaperNormalizerProps {
  onComplete?: (result: any) => void
  selectedTemplate?: string | null
}

const availableSectors = [
  { id: 'digital-marketing', label: 'Digital Marketing' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'it', label: 'Information Technology (IT)' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'finance', label: 'Finance' },
  { id: 'education', label: 'Education' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'retail', label: 'Retail' },
  { id: 'energy', label: 'Energy' },
  { id: 'real-estate', label: 'Real Estate' }
]

export function WhitepaperNormalizer({ onComplete, selectedTemplate }: WhitepaperNormalizerProps) {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState<'llm' | 'fast'>('llm')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [hasGeneratedSuggestions, setHasGeneratedSuggestions] = useState(false)

  const { toast } = useToast()

  const {
    isNormalizing,
    error,
    normalizeDocument,
    resetNormalization
  } = useWhitepaperNormalization()

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    // Auto-generate title from filename if not set
    if (file && !title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setTitle(nameWithoutExt.replace(/[_-]/g, ' '))
    }
  }

  const handleSectorChange = (sectorId: string, checked: boolean) => {
    setSelectedSectors(prev => 
      checked 
        ? [...prev, sectorId]
        : prev.filter(id => id !== sectorId)
    )
  }

  const generatePromptSuggestions = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title to generate prompt suggestions.",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingSuggestions(true)
    
    try {
      // Use a generic industry for prompt generation if not specified
      const suggestions = await groqAI.generateSuggestions(title, 'Business')
      
      // Create prompt suggestions from the AI response
      const promptSuggestions = [
        `Transform this document into a comprehensive whitepaper focusing on ${title.toLowerCase()} with detailed analysis and actionable insights.`,
        `Create a professional whitepaper that explores the key challenges and solutions related to ${title.toLowerCase()}.`,
        `Generate a structured whitepaper that provides expert guidance on ${title.toLowerCase()} implementation and best practices.`,
        ...suggestions.context.slice(0, 2).map(context => 
          `Please focus on: ${context.toLowerCase()}`
        ),
        ...suggestions.solutionOutline.slice(0, 2).map(solution => 
          `Include: ${solution.toLowerCase()}`
        )
      ]
      
      setPromptSuggestions(promptSuggestions)
      setHasGeneratedSuggestions(true)
      
      toast({
        title: "Suggestions Generated",
        description: "AI has generated prompt suggestions based on your title.",
      })
    } catch (error) {
      console.error('Error generating suggestions:', error)
      
      // Fallback suggestions
      const fallbackSuggestions = [
        `Transform this document into a comprehensive whitepaper focusing on ${title.toLowerCase()} with detailed analysis and actionable insights.`,
        `Create a professional whitepaper that explores the key challenges and solutions related to ${title.toLowerCase()}.`,
        `Generate a structured whitepaper that provides expert guidance on ${title.toLowerCase()} implementation and best practices.`
      ]
      
      setPromptSuggestions(fallbackSuggestions)
      setHasGeneratedSuggestions(true)
      
      toast({
        title: "Suggestions Generated",
        description: "Generated fallback prompt suggestions for your whitepaper.",
      })
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setDescription(suggestion)
  }

  const handleNormalize = async () => {
    if (!selectedFile || !title.trim()) return

    try {
      const result = await normalizeDocument({
        document: selectedFile,
        title: title.trim(),
        description: description.trim() || undefined,
        mode,
        sectors: selectedSectors
      })

      onComplete?.(result)

      // Navigate to the result page with the normalized data
      const params = new URLSearchParams({
        pdfUrl: result.pdf_url,
        sectors: result.stats.sectors_detected.join(','),
        mode: result.stats.mode,
        title: title.trim()
      })
      
      navigate(`/normalization-result?${params.toString()}`)
    } catch (error) {
      console.error('Normalization failed:', error)
    }
  }

  const handleReset = () => {
    resetNormalization()
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setSelectedSectors([])
    setPromptSuggestions([])
    setHasGeneratedSuggestions(false)
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Whitepaper Generator
            {selectedTemplate && (
              <span className="text-sm font-normal text-muted-foreground">
                (Template: {selectedTemplate})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            disabled={isNormalizing}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter whitepaper title..."
                disabled={isNormalizing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Processing Mode</Label>
              <Select value={mode} onValueChange={(value: 'llm' | 'fast') => setMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llm">LLM Mode (Better quality)</SelectItem>
                  <SelectItem value="fast">Fast Mode (Quick processing)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Choose Sectors (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Select the industry sectors you want your whitepaper to focus on
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSectors.map((sector) => (
                <div key={sector.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={sector.id}
                    checked={selectedSectors.includes(sector.id)}
                    onCheckedChange={(checked) => handleSectorChange(sector.id, checked === true)}
                    disabled={isNormalizing}
                  />
                  <Label 
                    htmlFor={sector.id} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {sector.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedSectors.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedSectors.map(id => 
                  availableSectors.find(s => s.id === id)?.label
                ).join(', ')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Enter your prompt (Optional)</Label>
              <Button
                onClick={generatePromptSuggestions}
                disabled={isGeneratingSuggestions || !title.trim() || isNormalizing}
                variant="outline"
                size="sm"
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your prompt for whitepaper customization..."
              rows={3}
              disabled={isNormalizing}
            />
          </div>

          {hasGeneratedSuggestions && promptSuggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click on any suggestion to use it as your prompt:
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {promptSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleNormalize}
            disabled={!selectedFile || !title.trim() || isNormalizing}
            className="w-full"
            size="lg"
          >
            {isNormalizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Whitepaper...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Whitepaper
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Generation Failed</p>
                  <p className="text-sm">{error}</p>
                  {error.includes("No recognizable sector sections") && (
                    <p className="text-xs mt-2 opacity-90">
                      Make sure your document contains clear sections and content that can be structured into a whitepaper format. The system looks for identifiable content areas to organize your document properly.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
