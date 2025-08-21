
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RefreshCw, FileText, AlertCircle } from 'lucide-react'
import { useWhitepaperNormalization } from '@/hooks/useWhitepaperNormalization'
import { FileUploadZone } from './FileUploadZone'

interface WhitepaperNormalizerProps {
  onComplete?: (result: any) => void
  selectedTemplate?: string | null
}

export function WhitepaperNormalizer({ onComplete, selectedTemplate }: WhitepaperNormalizerProps) {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')

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

  const handleNormalize = async () => {
    if (!title.trim()) return

    try {
      const result = await normalizeDocument({
        document: selectedFile,
        title: title.trim(),
        description: description.trim() || undefined,
        mode: 'llm'
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
    setPrompt('')
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Whitepaper Normalizer
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description for whitepaper customization..."
              rows={3}
              disabled={isNormalizing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Eg; Make the document into Direct speaker"
              rows={3}
              disabled={isNormalizing}
            />
          </div>

          <Button
            onClick={handleNormalize}
            disabled={!title.trim() || isNormalizing}
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
                      Make sure your document contains sections for: Digital Marketing, Healthcare, Information Technology (IT), or Logistics.
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
