
import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, FileText, Loader2 } from 'lucide-react'
import { groqAI } from '@/lib/aiService'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  title: string
  industry: string
  description: string
}

export default function Generate() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    industry: '',
    description: ''
  })
  
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  
  const { toast } = useToast()

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Real Estate',
    'Transportation',
    'Energy',
    'Agriculture',
    'Entertainment',
    'Consulting',
    'Other'
  ]

  const generateDescriptions = useCallback(async () => {
    if (!formData.title.trim() || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and industry to generate descriptions.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const suggestions = await groqAI.generateSuggestions(formData.title, formData.industry)
      // Combine context and solution outline into description suggestions
      const descriptions = [
        ...suggestions.context,
        ...suggestions.solutionOutline
      ]
      setAiSuggestions(descriptions)
      setHasGenerated(true)
      
      toast({
        title: "Descriptions Generated",
        description: "AI has generated description suggestions for your whitepaper.",
      })
    } catch (error) {
      console.error('Error generating descriptions:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate descriptions. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }, [formData.title, formData.industry, toast])

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectSuggestion = (suggestion: string) => {
    updateForm('description', suggestion)
  }

  const handleGenerate = () => {
    if (!formData.title.trim() || !formData.industry) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in both Title and Industry fields.",
        variant: "destructive"
      })
      return
    }

    // Here you would typically send the data to your backend
    console.log('Generating whitepaper with:', formData)
    
    toast({
      title: "Whitepaper Generation Started",
      description: "Your whitepaper is being generated. This may take a few minutes.",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Generate Whitepaper</h1>
        <p className="text-muted-foreground">
          Create professional whitepapers with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Whitepaper Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter whitepaper title..."
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => updateForm('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your whitepaper content... (optional)"
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={4}
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={!formData.title.trim() || !formData.industry}
            >
              Generate Whitepaper
            </Button>
          </CardContent>
        </Card>

        {/* AI Suggestions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Description Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateDescriptions}
              disabled={isGenerating || !formData.title.trim() || !formData.industry}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate AI Suggestions'
              )}
            </Button>

            {hasGenerated && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Click on any suggestion to use it as your description:
                </p>
                
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
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

            {!hasGenerated && (
              <div className="text-center text-muted-foreground">
                <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Generate AI suggestions to get description ideas for your whitepaper
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
