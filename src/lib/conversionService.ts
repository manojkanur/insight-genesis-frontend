
import { pdfParser, ParsedPdfContent } from './pdfParser'
import jsPDF from 'jspdf'

export interface ConversionResult {
  wordContent: string
  originalPdf: string
  convertedAt: string
  success: boolean
  metadata?: ParsedPdfContent['metadata']
}

export interface ConversionOptions {
  extractImages?: boolean
  preserveFormatting?: boolean
  includeHeaders?: boolean
  includeFooters?: boolean
}

export interface DocumentFormatting {
  fontSize: number
  fontFamily: string
  lineSpacing: number
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export class PdfToWordConverter {
  private static instance: PdfToWordConverter
  
  static getInstance(): PdfToWordConverter {
    if (!PdfToWordConverter.instance) {
      PdfToWordConverter.instance = new PdfToWordConverter()
    }
    return PdfToWordConverter.instance
  }

  async convertPdfToWord(
    pdfUrl: string, 
    options: ConversionOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<ConversionResult> {
    try {
      console.log('🔄 Starting frontend PDF to Word conversion...')
      
      // Parse PDF using frontend parser
      const parsedContent = await pdfParser.parsePdfFromUrl(pdfUrl, (progress) => {
        onProgress?.(progress * 0.8) // 80% for parsing
      })

      // Convert to HTML format for rich text editor
      const htmlContent = this.convertToRichHtml(parsedContent)
      
      onProgress?.(100)

      const result: ConversionResult = {
        wordContent: htmlContent,
        originalPdf: pdfUrl,
        convertedAt: new Date().toISOString(),
        success: true,
        metadata: parsedContent.metadata
      }
      
      console.log('✅ Frontend PDF to Word conversion completed')
      return result
      
    } catch (error) {
      console.error('❌ PDF to Word conversion failed:', error)
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private convertToRichHtml(parsedContent: ParsedPdfContent): string {
    let html = ''
    
    // Add document title if available
    if (parsedContent.metadata.title) {
      html += `<h1>${parsedContent.metadata.title}</h1>\n`
    }
    
    // Process content with better formatting
    parsedContent.pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        html += '<div style="page-break-before: always;"></div>\n'
      }
      
      const lines = page.text.split('\n')
      let inList = false
      
      lines.forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return
        
        // Detect different content types
        if (trimmedLine.startsWith('#')) {
          if (inList) {
            html += '</ul>\n'
            inList = false
          }
          const headingText = trimmedLine.substring(1).trim()
          html += `<h2>${headingText}</h2>\n`
        } else if (this.isBulletPoint(trimmedLine)) {
          if (!inList) {
            html += '<ul>\n'
            inList = true
          }
          const listText = trimmedLine.replace(/^[\s•\-\*]+/, '').trim()
          html += `<li>${listText}</li>\n`
        } else {
          if (inList) {
            html += '</ul>\n'
            inList = false
          }
          html += `<p>${trimmedLine}</p>\n`
        }
      })
      
      if (inList) {
        html += '</ul>\n'
      }
    })
    
    return html
  }

  private isBulletPoint(line: string): boolean {
    return /^[\s]*[•\-\*]\s/.test(line) || /^\d+\.\s/.test(line)
  }

  async convertWordToPdf(
    wordContent: string,
    filename: string,
    formatting: Partial<DocumentFormatting> = {}
  ): Promise<{ download_url: string; filename: string }> {
    try {
      console.log('🔄 Starting frontend Word to PDF conversion...')
      
      const defaultFormatting: DocumentFormatting = {
        fontSize: 12,
        fontFamily: 'Times New Roman',
        lineSpacing: 1.6,
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
      }
      
      const finalFormatting = { ...defaultFormatting, ...formatting }
      
      // Create PDF using jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Convert HTML to plain text and add to PDF
      const textContent = this.htmlToText(wordContent)
      const lines = pdf.splitTextToSize(textContent, 170) // Adjust for margins
      
      let yPosition = finalFormatting.margins.top
      const lineHeight = finalFormatting.fontSize * finalFormatting.lineSpacing * 0.35
      
      lines.forEach((line: string, index: number) => {
        if (yPosition > 277 - finalFormatting.margins.bottom) { // A4 height - margin
          pdf.addPage()
          yPosition = finalFormatting.margins.top
        }
        
        pdf.setFontSize(finalFormatting.fontSize)
        pdf.text(line, finalFormatting.margins.left, yPosition)
        yPosition += lineHeight
      })

      // Generate blob and create download URL
      const pdfBlob = pdf.output('blob')
      const downloadUrl = URL.createObjectURL(pdfBlob)
      
      console.log('✅ Frontend Word to PDF conversion completed')
      
      return {
        download_url: downloadUrl,
        filename: filename.replace('.pdf', '_edited.pdf')
      }
    } catch (error) {
      console.error('❌ Word to PDF conversion failed:', error)
      throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private htmlToText(html: string): string {
    // Create a temporary div to parse HTML
    const div = document.createElement('div')
    div.innerHTML = html
    
    // Convert HTML elements to formatted text
    let text = ''
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || ''
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        
        switch (element.tagName?.toLowerCase()) {
          case 'h1':
          case 'h2':
          case 'h3':
            text += '\n\n' + (element.textContent || '').toUpperCase() + '\n'
            break
          case 'p':
            text += '\n' + (element.textContent || '') + '\n'
            break
          case 'br':
            text += '\n'
            break
          case 'li':
            text += '\n• ' + (element.textContent || '')
            break
          case 'ul':
          case 'ol':
            text += '\n'
            element.childNodes.forEach(processNode)
            text += '\n'
            return
          default:
            element.childNodes.forEach(processNode)
        }
      }
    }
    
    div.childNodes.forEach(processNode)
    return text.replace(/\n{3,}/g, '\n\n').trim()
  }

  // Extract text content for preview/editing
  extractTextContent(wordContent: string): string {
    return wordContent
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .trim()
  }

  // Convert plain text back to rich HTML content
  convertTextToRichContent(text: string): string {
    return text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }

  // Download Word document as .docx (simplified version)
  async downloadAsWord(content: string, filename: string): Promise<void> {
    try {
      // For now, download as HTML file that can be opened in Word
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 1in; }
            h1, h2, h3 { font-weight: bold; margin: 1em 0 0.5em 0; }
            p { margin: 0 0 1em 0; }
            ul, ol { margin: 1em 0; padding-left: 2em; }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename.replace('.pdf', '')}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error(`Word download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const pdfConverter = PdfToWordConverter.getInstance()
