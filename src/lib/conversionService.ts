
import { convertPdfToWord as apiConvertPdfToWord, convertWordToPdf as apiConvertWordToPdf } from './api'

export interface ConversionResult {
  wordContent: string
  originalPdf: string
  convertedAt: string
  success: boolean
}

export interface ConversionOptions {
  extractImages?: boolean
  preserveFormatting?: boolean
  includeHeaders?: boolean
  includeFooters?: boolean
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
    options: ConversionOptions = {}
  ): Promise<ConversionResult> {
    try {
      console.log('🔄 Starting PDF to Word conversion...')
      
      // Call the API to convert PDF to Word
      const response = await apiConvertPdfToWord(pdfUrl)
      
      // Process the conversion result
      const result: ConversionResult = {
        wordContent: response.word_content,
        originalPdf: pdfUrl,
        convertedAt: new Date().toISOString(),
        success: true
      }
      
      console.log('✅ PDF to Word conversion completed')
      return result
      
    } catch (error) {
      console.error('❌ PDF to Word conversion failed:', error)
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async convertWordToPdf(
    wordContent: string,
    filename: string,
    formatting?: {
      fontSize?: number
      fontFamily?: string
      lineSpacing?: number
      margins?: {
        top: number
        bottom: number
        left: number
        right: number
      }
    }
  ) {
    try {
      console.log('🔄 Starting Word to PDF conversion...')
      
      const response = await apiConvertWordToPdf({
        word_content: wordContent,
        filename,
        formatting: formatting || {
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineSpacing: 1.6,
          margins: { top: 1, bottom: 1, left: 1, right: 1 }
        }
      })
      
      console.log('✅ Word to PDF conversion completed')
      return response
      
    } catch (error) {
      console.error('❌ Word to PDF conversion failed:', error)
      throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Extract text content for preview/editing
  extractTextContent(wordContent: string): string {
    // Remove HTML tags but preserve line breaks and basic formatting
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
}

// Export singleton instance
export const pdfConverter = PdfToWordConverter.getInstance()
