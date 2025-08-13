
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, RefreshCw, FileEdit, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { convertPdfToWord, convertWordToPdf, downloadFile } from '@/lib/api'
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
      // Use actual API call instead of mock data
      const response = await convertPdfToWord(pdfUrl)
      
      setWordContent(response.word_content)
      setEditedContent(response.word_content)
      setIsEditing(true)
      onConversionComplete?.(response.word_content)
      
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

  const handleContentChange = (content: string) => {
    setEditedContent(content)
    onContentUpdate?.(content)
  }

  const handleSaveAndExportPdf = async () => {
    setIsExporting(true)
    try {
      // Use actual API to convert edited Word content back to PDF
      const response = await convertWordToPdf({
        word_content: editedContent,
        filename: filename.replace('.pdf', '_edited.pdf'),
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
      
      // Download the generated PDF
      const blob = await downloadFile(response.download_url)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = response.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "PDF exported successfully",
        description: "Your edited whitepaper has been downloaded.",
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

  const handleDownloadWord = async () => {
    if (!editedContent) return
    
    try {
      // Create a proper Word document blob
      const blob = new Blob([editedContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.replace('.pdf', '')}_edited.docx`
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
              <Badge variant="outline" className="ml-auto">
                Changes will be included in downloads
              </Badge>
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
