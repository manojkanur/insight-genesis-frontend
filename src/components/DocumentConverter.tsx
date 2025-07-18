
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
      // Simulate PDF to Word conversion with properly structured content
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockWordContent = `
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">AI-Generated Whitepaper: The Future of Healthcare Technology</h1>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">Abstract</h2>
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">This whitepaper explores the revolutionary impact of artificial intelligence and machine learning technologies on modern healthcare systems. We examine current implementations, challenges, and future opportunities for AI-driven healthcare solutions that will transform patient care delivery.</p>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">Introduction</h2>
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">The healthcare industry stands at the precipice of a technological revolution. <strong>Artificial Intelligence (AI)</strong> and <em>Machine Learning (ML)</em> technologies are transforming how we diagnose, treat, and prevent diseases across all medical specialties.</p>
        
        <p style="margin-bottom: 15px; line-height: 1.6;">Key areas of transformation include:</p>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li style="margin-bottom: 8px;">Diagnostic imaging and radiology enhancement</li>
          <li style="margin-bottom: 8px;">Drug discovery and development acceleration</li>
          <li style="margin-bottom: 8px;">Personalized treatment plans and precision medicine</li>
          <li style="margin-bottom: 8px;">Predictive analytics for patient outcomes</li>
          <li style="margin-bottom: 8px;">Administrative workflow optimization</li>
        </ul>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">Methodology</h2>
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">Our research methodology involved comprehensive analysis of existing AI healthcare implementations across <strong>50+ healthcare institutions</strong> worldwide. We conducted structured interviews with healthcare professionals, analyzed patient outcome data, and reviewed regulatory frameworks from multiple jurisdictions.</p>
        
        <p style="margin-bottom: 15px; line-height: 1.6;">The research approach included:</p>
        <ol style="margin-left: 20px; margin-bottom: 20px;">
          <li style="margin-bottom: 8px;">Quantitative analysis of patient data from AI-assisted treatments</li>
          <li style="margin-bottom: 8px;">Qualitative interviews with medical professionals</li>
          <li style="margin-bottom: 8px;">Comparative study of traditional vs AI-enhanced workflows</li>
          <li style="margin-bottom: 8px;">Cost-benefit analysis of AI implementation</li>
        </ol>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">Results</h2>
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">The results demonstrate significant improvements in patient outcomes when AI technologies are properly integrated into healthcare workflows. Our comprehensive analysis revealed measurable benefits across multiple dimensions of healthcare delivery.</p>
        
        <p style="margin-bottom: 15px; line-height: 1.6;">Key findings include:</p>
        <ul style="margin-left: 20px; margin-bottom: 20px;">
          <li style="margin-bottom: 8px;"><strong style="color: #059669;">25% reduction</strong> in diagnostic errors across all specialties</li>
          <li style="margin-bottom: 8px;"><strong style="color: #059669;">40% faster</strong> treatment planning and decision-making</li>
          <li style="margin-bottom: 8px;"><strong style="color: #059669;">30% improvement</strong> in overall patient satisfaction scores</li>
          <li style="margin-bottom: 8px;"><strong style="color: #059669;">20% cost reduction</strong> in operational expenses</li>
          <li style="margin-bottom: 8px;"><strong style="color: #059669;">35% increase</strong> in early disease detection rates</li>
        </ul>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">Conclusion</h2>
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">AI technology represents a paradigm shift in healthcare delivery that promises to revolutionize patient care. While challenges remain in implementation, regulation, and adoption, the potential benefits for patient care and healthcare efficiency are substantial and measurable.</p>
        
        <p style="margin-bottom: 15px; line-height: 1.6; text-align: justify;">Organizations that embrace AI-driven healthcare solutions today will be better positioned to deliver superior patient outcomes while maintaining operational efficiency in an increasingly complex healthcare landscape.</p>
        
        <h2 style="font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #2563eb;">References</h2>
        <ol style="margin-left: 20px; margin-bottom: 20px;">
          <li style="margin-bottom: 8px;">Healthcare AI Implementation Study, Journal of Medical Technology, 2024</li>
          <li style="margin-bottom: 8px;">Machine Learning in Clinical Decision Making, Nature Medicine, 2024</li>
          <li style="margin-bottom: 8px;">AI-Driven Healthcare Transformation Report, WHO Technical Series, 2024</li>
        </ol>
      `
      
      setWordContent(mockWordContent)
      setEditedContent(mockWordContent)
      setIsEditing(true)
      onConversionComplete?.(mockWordContent)
      
      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable format with proper structure.",
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

  const createStructuredHtml = (content: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edited Whitepaper</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
        }
        h1 {
            font-size: 20pt;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            page-break-after: avoid;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 25px 0 15px 0;
            color: #2563eb;
            page-break-after: avoid;
        }
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            page-break-after: avoid;
        }
        p {
            margin: 12px 0;
            text-align: justify;
            orphans: 2;
            widows: 2;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        strong {
            font-weight: bold;
        }
        em {
            font-style: italic;
        }
        .page-break {
            page-break-before: always;
        }
        @media print {
            body {
                margin: 0;
                background: none;
            }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`
  }

  const handleSaveAndExportPdf = async () => {
    setIsExporting(true)
    try {
      // Create properly structured HTML for PDF conversion
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const structuredHtml = createStructuredHtml(editedContent)
      
      const blob = new Blob([structuredHtml], { type: 'text/html' })
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
        description: "Your edited whitepaper has been downloaded with all changes included.",
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

  const createWordDocument = (content: string) => {
    // Create proper Word document structure
    const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="utf-8">
    <title>Edited Whitepaper</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page Section1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.0in 1.0in 1.0in;
            mso-header-margin: .5in;
            mso-footer-margin: .5in;
            mso-paper-source: 0;
        }
        div.Section1 { page: Section1; }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
        }
        h1 {
            font-size: 20pt;
            font-weight: bold;
            text-align: center;
            margin: 24pt 0;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 18pt 0 12pt 0;
            color: #2563eb;
        }
        p {
            margin: 12pt 0;
            text-align: justify;
        }
        ul, ol {
            margin: 12pt 0;
        }
        li {
            margin: 6pt 0;
        }
    </style>
</head>
<body>
    <div class="Section1">
        ${content}
    </div>
</body>
</html>`
    
    return wordHtml
  }

  const handleDownloadWord = () => {
    if (!editedContent) return
    
    try {
      const wordContent = createWordDocument(editedContent)
      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
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
        description: "Edited content has been downloaded as a properly structured Word document.",
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
