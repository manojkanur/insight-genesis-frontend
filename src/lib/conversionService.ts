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
      html += `<h1 style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">${parsedContent.metadata.title}</h1>\n`
    }
    
    // Process content with better formatting
    parsedContent.pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        html += '<div style="page-break-before: always; margin-top: 40px;"></div>\n'
      }
      
      const lines = page.text.split('\n')
      let inList = false
      let inTable = false
      
      lines.forEach((line, lineIndex) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) {
          if (!inList && !inTable) {
            html += '<br>\n'
          }
          return
        }
        
        // Detect different content types with better formatting
        if (this.isHeading(trimmedLine)) {
          if (inList) {
            html += '</ul>\n'
            inList = false
          }
          const level = this.getHeadingLevel(trimmedLine)
          const headingText = trimmedLine.replace(/^#+\s*/, '').trim()
          html += `<h${level} style="font-weight: bold; margin: 20px 0 10px 0; color: #333;">${headingText}</h${level}>\n`
        } else if (this.isBulletPoint(trimmedLine)) {
          if (!inList) {
            html += '<ul style="margin: 10px 0; padding-left: 30px;">\n'
            inList = true
          }
          const listText = trimmedLine.replace(/^[\s•\-\*\d\.]+/, '').trim()
          html += `<li style="margin: 5px 0;">${listText}</li>\n`
        } else if (this.isTableRow(trimmedLine)) {
          if (!inTable) {
            html += '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">\n'
            inTable = true
          }
          const cells = this.parseTableCells(trimmedLine)
          html += '<tr>\n'
          cells.forEach(cell => {
            html += `<td style="border: 1px solid #ccc; padding: 8px;">${cell}</td>\n`
          })
          html += '</tr>\n'
        } else {
          if (inList) {
            html += '</ul>\n'
            inList = false
          }
          if (inTable && !this.isTableRow(lines[lineIndex + 1])) {
            html += '</table>\n'
            inTable = false
          }
          
          if (!inTable) {
            // Format regular paragraphs with better styling
            const formattedText = this.formatInlineText(trimmedLine)
            html += `<p style="margin: 10px 0; line-height: 1.6; text-align: justify;">${formattedText}</p>\n`
          }
        }
      })
      
      // Close any open lists
      if (inList) {
        html += '</ul>\n'
      }
      if (inTable) {
        html += '</table>\n'
      }
    })
    
    return html
  }

  private isHeading(line: string): boolean {
    return /^#+\s/.test(line) || 
           /^[A-Z][A-Z\s]{3,}$/.test(line) ||
           line.length < 50 && /^[A-Z]/.test(line) && !line.includes('.')
  }

  private getHeadingLevel(line: string): number {
    const hashMatch = line.match(/^(#+)/)
    if (hashMatch) {
      return Math.min(hashMatch[1].length, 6)
    }
    return 2 // Default heading level
  }

  private isBulletPoint(line: string): boolean {
    return /^[\s]*[•\-\*]\s/.test(line) || /^\d+\.\s/.test(line)
  }

  private isTableRow(line: string): boolean {
    return line && (line.includes('|') || line.includes('\t'))
  }

  private parseTableCells(line: string): string[] {
    return line.split(/[\|\t]/).map(cell => cell.trim()).filter(cell => cell.length > 0)
  }

  private formatInlineText(text: string): string {
    // Basic inline formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
  }

  async convertWordToPdf(
    wordContent: string,
    filename: string,
    formatting: Partial<DocumentFormatting> = {}
  ): Promise<{ download_url: string; filename: string }> {
    try {
      console.log('🔄 Starting enhanced Word to PDF conversion...')
      
      const defaultFormatting: DocumentFormatting = {
        fontSize: 12,
        fontFamily: 'Times New Roman',
        lineSpacing: 1.6,
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
      }
      
      const finalFormatting = { ...defaultFormatting, ...formatting }
      
      // Create PDF with better formatting
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Enhanced HTML to text conversion
      const { text, structure } = this.htmlToStructuredText(wordContent)
      
      let yPosition = finalFormatting.margins.top
      const lineHeight = finalFormatting.fontSize * finalFormatting.lineSpacing * 0.35
      const pageHeight = 297 // A4 height in mm
      const maxWidth = 210 - finalFormatting.margins.left - finalFormatting.margins.right
      
      structure.forEach((element) => {
        // Check if we need a new page
        if (yPosition > pageHeight - finalFormatting.margins.bottom - 20) {
          pdf.addPage()
          yPosition = finalFormatting.margins.top
        }
        
        // Set font based on element type
        if (element.type === 'heading') {
          pdf.setFontSize(finalFormatting.fontSize + 4)
          pdf.setFont('helvetica', 'bold')
          yPosition += 10 // Extra space before heading
        } else {
          pdf.setFontSize(finalFormatting.fontSize)
          pdf.setFont('helvetica', 'normal')
        }
        
        // Split text to fit page width
        const lines = pdf.splitTextToSize(element.text, maxWidth)
        
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - finalFormatting.margins.bottom) {
            pdf.addPage()
            yPosition = finalFormatting.margins.top
          }
          
          pdf.text(line, finalFormatting.margins.left, yPosition)
          yPosition += lineHeight
        })
        
        // Add space after element
        yPosition += element.type === 'heading' ? 5 : 2
      })

      // Generate blob and create download URL
      const pdfBlob = pdf.output('blob')
      const downloadUrl = URL.createObjectURL(pdfBlob)
      
      console.log('✅ Enhanced Word to PDF conversion completed')
      
      return {
        download_url: downloadUrl,
        filename: filename.replace('.pdf', '_edited.pdf')
      }
    } catch (error) {
      console.error('❌ Word to PDF conversion failed:', error)
      throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private htmlToStructuredText(html: string): { text: string; structure: Array<{type: string; text: string}> } {
    const div = document.createElement('div')
    div.innerHTML = html
    
    let text = ''
    const structure: Array<{type: string; text: string}> = []
    
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || ''
        text += textContent
        return textContent
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        
        switch (element.tagName?.toLowerCase()) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            const headingText = element.textContent || ''
            structure.push({ type: 'heading', text: headingText })
            text += '\n\n' + headingText + '\n'
            return headingText
          case 'p':
            const pText = element.textContent || ''
            structure.push({ type: 'paragraph', text: pText })
            text += '\n' + pText + '\n'
            return pText
          case 'br':
            text += '\n'
            return '\n'
          case 'li':
            const liText = '• ' + (element.textContent || '')
            structure.push({ type: 'list-item', text: liText })
            text += '\n' + liText
            return liText
          case 'ul':
          case 'ol':
            text += '\n'
            element.childNodes.forEach(processNode)
            text += '\n'
            return ''
          default:
            let childText = ''
            element.childNodes.forEach(child => {
              childText += processNode(child)
            })
            return childText
        }
      }
      return ''
    }
    
    div.childNodes.forEach(processNode)
    
    return { text: text.replace(/\n{3,}/g, '\n\n').trim(), structure }
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
