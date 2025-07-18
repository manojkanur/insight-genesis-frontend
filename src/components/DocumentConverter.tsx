
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, RefreshCw, FileEdit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DocumentConverterProps {
  pdfUrl: string
  filename: string
  onConversionComplete?: (wordContent: string) => void
}

export function DocumentConverter({ pdfUrl, filename, onConversionComplete }: DocumentConverterProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [wordContent, setWordContent] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePdfToWord = async () => {
    setIsConverting(true)
    try {
      // Simulate PDF to Word conversion
      // In real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockWordContent = `
        <h1>Converted Document Content</h1>
        <p>This is the converted content from the PDF that can now be edited with rich text formatting.</p>
        <p><strong>Bold text</strong> and <em>italic text</em> are supported.</p>
        <ul>
          <li>Bullet points</li>
          <li>Are also supported</li>
        </ul>
      `
      
      setWordContent(mockWordContent)
      onConversionComplete?.(mockWordContent)
      
      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable format.",
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

  const handleDownloadWord = () => {
    if (!wordContent) return
    
    // Create a blob with the Word content
    const blob = new Blob([wordContent], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename.replace('.pdf', '')}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Download started",
      description: "Word document is being downloaded.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileEdit className="w-5 h-5" />
          Document Conversion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">{filename}</span>
            <Badge variant="outline">PDF</Badge>
          </div>
          
          {wordContent && (
            <Badge variant="secondary">Converted to Word</Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handlePdfToWord}
            disabled={isConverting}
            variant="outline"
            className="gap-2"
          >
            {isConverting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileEdit className="w-4 h-4" />
            )}
            Convert to Word
          </Button>
          
          {wordContent && (
            <Button
              onClick={handleDownloadWord}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Word
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
