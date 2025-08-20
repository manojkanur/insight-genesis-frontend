
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, RefreshCw, Edit, Check, Download, AlertCircle } from 'lucide-react'
import { useWhitepaperNormalization } from '@/hooks/useWhitepaperNormalization'
import { RichTextEditor } from './RichTextEditor'
import { PdfViewer } from './PdfViewer'
import { FileUploadZone } from './FileUploadZone'

interface WhitepaperNormalizerProps {
  onComplete?: (result: any) => void
}

export function WhitepaperNormalizer({ onComplete }: WhitepaperNormalizerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState<'llm' | 'fast'>('llm')
  const [showEditor, setShowEditor] = useState(false)

  const {
    isNormalizing,
    isNormalized,
    normalizedData,
    error,
    isConverting,
    isConverted,
    wordContent,
    editedContent,
    hasUnsavedChanges,
    conversionProgress,
    normalizeDocument,
    convertToWordForEditing,
    updateContent,
    exportToPdf,
    exportToWord,
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
    if (!selectedFile || !title.trim()) return

    try {
      const result = await normalizeDocument({
        document: selectedFile,
        title: title.trim(),
        description: description.trim() || undefined,
        mode
      })
      onComplete?.(result)
    } catch (error) {
      console.error('Normalization failed:', error)
    }
  }

  const handleConvertToWord = async () => {
    if (!normalizedData?.pdf_url) return

    try {
      await convertToWordForEditing(normalizedData.pdf_url)
      setShowEditor(true)
    } catch (error) {
      console.error('Conversion failed:', error)
    }
  }

  const handleExportPdf = async () => {
    if (!editedContent) return

    try {
      await exportToPdf(
        `${title.replace(/\s+/g, '_')}_edited.pdf`,
        editedContent
      )
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const handleExportWord = async () => {
    if (!editedContent) return

    try {
      await exportToWord(
        `${title.replace(/\s+/g, '_')}_edited`,
        editedContent
      )
    } catch (error) {
      console.error('Word export failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Whitepaper Normalizer
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

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter whitepaper description..."
              rows={3}
              disabled={isNormalizing}
            />
          </div>

          <Button
            onClick={handleNormalize}
            disabled={!selectedFile || !title.trim() || isNormalizing}
            className="w-full"
            size="lg"
          >
            {isNormalizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Normalizing Document...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Normalize Whitepaper
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Normalization Failed</p>
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
        </CardContent>
      </Card>

      {/* Results */}
      {isNormalized && normalizedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Normalization Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {normalizedData.stats.sectors_detected.length} sectors detected
              </Badge>
              <Badge variant="outline">
                Mode: {normalizedData.stats.mode.toUpperCase()}
              </Badge>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleConvertToWord}
                disabled={isConverting}
                variant="outline"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Convert to Editable Format
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(normalizedData.pdf_url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* Conversion Progress */}
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting to editable format...</span>
                  <span>{conversionProgress}%</span>
                </div>
                <Progress value={conversionProgress} />
              </div>
            )}

            {/* PDF Preview */}
            <div className="mt-4">
              <PdfViewer pdfUrl={normalizedData.pdf_url} className="h-96" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Word Editor */}
      {isConverted && wordContent && showEditor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Document Content
              </div>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-orange-600">
                    Unsaved changes
                  </Badge>
                )}
                <Button
                  onClick={handleExportPdf}
                  size="sm"
                  disabled={!editedContent}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  onClick={handleExportWord}
                  size="sm"
                  variant="outline"
                  disabled={!editedContent}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Word
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={editedContent}
              onChange={updateContent}
              height="600px"
              placeholder="Edit your normalized whitepaper content here..."
            />
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      {(isNormalized || error) && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              resetNormalization()
              setSelectedFile(null)
              setTitle('')
              setDescription('')
              setShowEditor(false)
            }}
            variant="outline"
          >
            Start New Normalization
          </Button>
        </div>
      )}
    </div>
  )
}
