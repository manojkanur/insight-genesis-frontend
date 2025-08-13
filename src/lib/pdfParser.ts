
import * as pdfjsLib from 'pdfjs-dist'
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`

export interface ParsedPdfContent {
  text: string
  pages: ParsedPage[]
  metadata: {
    title?: string
    author?: string
    subject?: string
    creator?: string
    producer?: string
    creationDate?: Date
    modificationDate?: Date
  }
}

export interface ParsedPage {
  pageNumber: number
  text: string
  textItems: ParsedTextItem[]
  images?: ParsedImage[]
}

export interface ParsedTextItem {
  text: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontName: string
  isHeading: boolean
  isBold: boolean
  isItalic: boolean
}

export interface ParsedImage {
  x: number
  y: number
  width: number
  height: number
  data: string // base64 encoded image data
}

export class PdfParser {
  private static instance: PdfParser
  
  static getInstance(): PdfParser {
    if (!PdfParser.instance) {
      PdfParser.instance = new PdfParser()
    }
    return PdfParser.instance
  }

  async parsePdfFromUrl(pdfUrl: string, onProgress?: (progress: number) => void): Promise<ParsedPdfContent> {
    try {
      console.log('🔄 Loading PDF document...')
      
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/',
        cMapPacked: true,
      })

      if (onProgress) {
        loadingTask.onProgress = (progressData) => {
          const progress = (progressData.loaded / progressData.total) * 100
          onProgress(Math.min(progress, 100))
        }
      }

      const pdf = await loadingTask.promise
      console.log(`📄 PDF loaded with ${pdf.numPages} pages`)

      // Get metadata
      const metadata = await this.extractMetadata(pdf)
      
      // Parse all pages
      const pages: ParsedPage[] = []
      let allText = ''

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const parsedPage = await this.parsePage(page, pageNum)
        pages.push(parsedPage)
        allText += parsedPage.text + '\n\n'

        if (onProgress) {
          const progress = ((pageNum / pdf.numPages) * 100)
          onProgress(progress)
        }
      }

      console.log('✅ PDF parsing completed')
      
      return {
        text: allText.trim(),
        pages,
        metadata
      }
    } catch (error) {
      console.error('❌ PDF parsing failed:', error)
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async extractMetadata(pdf: any) {
    try {
      const metadata = await pdf.getMetadata()
      const info = metadata.info || {}
      
      return {
        title: info.Title,
        author: info.Author,
        subject: info.Subject,
        creator: info.Creator,
        producer: info.Producer,
        creationDate: info.CreationDate ? new Date(info.CreationDate) : undefined,
        modificationDate: info.ModDate ? new Date(info.ModDate) : undefined,
      }
    } catch (error) {
      console.warn('Could not extract PDF metadata:', error)
      return {}
    }
  }

  private async parsePage(page: any, pageNumber: number): Promise<ParsedPage> {
    const textContent = await page.getTextContent()
    const textItems: ParsedTextItem[] = []
    let pageText = ''

    // Process text items
    textContent.items.forEach((item: TextItem | TextMarkedContent) => {
      if ('str' in item && item.str.trim()) {
        const textItem: ParsedTextItem = {
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height,
          fontSize: Math.abs(item.transform[0]),
          fontName: item.fontName,
          isHeading: this.detectHeading(item),
          isBold: this.detectBold(item.fontName),
          isItalic: this.detectItalic(item.fontName)
        }
        
        textItems.push(textItem)
        pageText += item.str + ' '
      }
    })

    // Sort text items by position (top to bottom, left to right)
    textItems.sort((a, b) => {
      const yDiff = b.y - a.y // Reverse Y (PDF coordinates are bottom-up)
      if (Math.abs(yDiff) > 5) return yDiff
      return a.x - b.x
    })

    // Build structured text
    const structuredText = this.buildStructuredText(textItems)

    return {
      pageNumber,
      text: structuredText,
      textItems
    }
  }

  private detectHeading(item: TextItem): boolean {
    const fontSize = Math.abs(item.transform[0])
    const fontName = item.fontName.toLowerCase()
    
    // Common patterns for headings
    return fontSize > 14 || 
           fontName.includes('bold') || 
           fontName.includes('heading') ||
           fontName.includes('title')
  }

  private detectBold(fontName: string): boolean {
    return fontName.toLowerCase().includes('bold')
  }

  private detectItalic(fontName: string): boolean {
    return fontName.toLowerCase().includes('italic') || 
           fontName.toLowerCase().includes('oblique')
  }

  private buildStructuredText(textItems: ParsedTextItem[]): string {
    let result = ''
    let currentLine = ''
    let lastY = -1

    textItems.forEach((item, index) => {
      // Check if we're on a new line
      if (lastY !== -1 && Math.abs(item.y - lastY) > 5) {
        if (currentLine.trim()) {
          // Determine if this is a heading or paragraph
          const prevItem = textItems[index - 1]
          if (prevItem && prevItem.isHeading) {
            result += `\n# ${currentLine.trim()}\n\n`
          } else {
            result += `${currentLine.trim()}\n\n`
          }
        }
        currentLine = ''
      }

      currentLine += item.text + ' '
      lastY = item.y
    })

    // Add the last line
    if (currentLine.trim()) {
      result += currentLine.trim()
    }

    return result
  }

  convertToHtml(parsedContent: ParsedPdfContent): string {
    let html = ''
    
    // Add metadata as comments
    if (parsedContent.metadata.title) {
      html += `<!-- Title: ${parsedContent.metadata.title} -->\n`
    }
    
    // Process each page
    parsedContent.pages.forEach(page => {
      const lines = page.text.split('\n')
      
      lines.forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return
        
        // Check if it's a heading
        if (trimmedLine.startsWith('#')) {
          const headingText = trimmedLine.substring(1).trim()
          html += `<h2>${headingText}</h2>\n`
        } else {
          html += `<p>${trimmedLine}</p>\n`
        }
      })
    })
    
    return html
  }
}

export const pdfParser = PdfParser.getInstance()
