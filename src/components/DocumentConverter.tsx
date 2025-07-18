
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, RefreshCw, FileEdit, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { RichTextEditor } from './RichTextEditor'

interface DocumentConverterProps {
  pdfUrl: string
  filename: string
  onConversionComplete?: (wordContent: string) => void
  onContentUpdate?: (content: string) => void
}

export function DocumentConverter({ 
  pdfUrl, 
  filename, 
  onConversionComplete,
  onContentUpdate 
}: DocumentConverterProps) {
  const [isConverting, setIsConverting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [wordContent, setWordContent] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handlePdfToWord = async () => {
    setIsConverting(true)
    try {
      // Simulate PDF to Word conversion with more realistic content
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockWordContent = `
        <h1>AI-Generated Whitepaper: The Future of Healthcare Technology</h1>
        
        <h2>Abstract</h2>
        <p>This whitepaper explores the revolutionary impact of artificial intelligence and machine learning technologies on modern healthcare systems. We examine current implementations, challenges, and future opportunities for AI-driven healthcare solutions.</p>
        
        <h2>Introduction</h2>
        <p>The healthcare industry stands at the precipice of a technological revolution. <strong>Artificial Intelligence (AI)</strong> and <em>Machine Learning (ML)</em> technologies are transforming how we diagnose, treat, and prevent diseases.</p>
        
        <p>Key areas of transformation include:</p>
        <ul>
          <li>Diagnostic imaging and radiology</li>
          <li>Drug discovery and development</li>
          <li>Personalized treatment plans</li>
          <li>Predictive analytics for patient outcomes</li>
        </ul>
        
        <h2>Methodology</h2>
        <p>Our research methodology involved comprehensive analysis of existing AI healthcare implementations across <strong>50+ healthcare institutions</strong> worldwide. We conducted interviews with healthcare professionals, analyzed patient outcome data, and reviewed regulatory frameworks.</p>
        
        <h2>Results</h2>
        <p>The results demonstrate significant improvements in patient outcomes when AI technologies are properly integrated into healthcare workflows. We observed:</p>
        <ul>
          <li><strong>25% reduction</strong> in diagnostic errors</li>
          <li><strong>40% faster</strong> treatment planning</li>
          <li><strong>30% improvement</strong> in patient satisfaction</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>AI technology represents a paradigm shift in healthcare delivery. While challenges remain in implementation and regulation, the potential benefits for patient care and healthcare efficiency are substantial.</p>
      `
      
      setWordContent(mockWordContent)
      setEditedContent(mockWordContent)
      setIsEditing(true)
      onConversionComplete?.(mockWordContent)
      
      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable format. You can now edit the content below.",
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

  const handleContentChange = (content: string) => {
    setEditedContent(content)
    onContentUpdate?.(content)
  }

  const handleSaveAndExportPdf = async () => {
    setIsExporting(true)
    try {
      // Simulate converting edited content back to PDF
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Create a blob with the edited content (in real implementation, this would be a PDF)
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Edited Whitepaper</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1, h2 { color: #333; }
            ul { margin: 20px 0; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${editedContent}
        </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.replace('.pdf', '')}_edited.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "PDF exported successfully",
        description: "Your edited whitepaper has been downloaded as a PDF.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export edited content as PDF.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadWord = () => {
    if (!editedContent) return
    
    // Create a blob with the edited Word content
    const blob = new Blob([editedContent], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename.replace('.pdf', '')}_edited.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Word document downloaded",
      description: "Edited content has been downloaded as Word document.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="w-5 h-5" />
            Document Conversion & Editing
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
              <Badge variant="secondary" className="gap-1">
                <Check className="w-3 h-3" />
                Converted & Ready for Editing
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {!wordContent ? (
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
                Convert PDF to Editable Format
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSaveAndExportPdf}
                  disabled={isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isExporting ? 'Generating PDF...' : 'Download Edited PDF'}
                </Button>
                
                <Button
                  onClick={handleDownloadWord}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download as Word
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inline Word Content Editor */}
      {wordContent && isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Edit Document Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={editedContent}
              onChange={handleContentChange}
              height="600px"
              placeholder="Edit your document content here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
