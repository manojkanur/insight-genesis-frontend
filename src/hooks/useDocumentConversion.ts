
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { pdfConverter, ConversionResult } from '@/lib/conversionService'

export interface ConversionState {
  isConverting: boolean
  isConverted: boolean
  isExporting: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  wordContent: string
  editedContent: string
  originalPdfUrl: string
  conversionProgress: number
  error: string | null
}

export function useDocumentConversion() {
  const [state, setState] = useState<ConversionState>({
    isConverting: false,
    isConverted: false,
    isExporting: false,
    isSaving: false,
    hasUnsavedChanges: false,
    wordContent: '',
    editedContent: '',
    originalPdfUrl: '',
    conversionProgress: 0,
    error: null
  })

  const { toast } = useToast()

  const convertPdfToWord = useCallback(async (pdfUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isConverting: true, 
      error: null,
      originalPdfUrl: pdfUrl,
      conversionProgress: 0
    }))

    try {
      const result: ConversionResult = await pdfConverter.convertPdfToWord(
        pdfUrl,
        {
          extractImages: true,
          preserveFormatting: true,
          includeHeaders: true,
          includeFooters: true
        },
        (progress) => {
          setState(prev => ({ ...prev, conversionProgress: progress }))
        }
      )
      
      setState(prev => ({
        ...prev,
        isConverting: false,
        isConverted: true,
        wordContent: result.wordContent,
        editedContent: result.wordContent,
        hasUnsavedChanges: false,
        conversionProgress: 100
      }))

      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable Word format using advanced parsing.",
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed'
      
      setState(prev => ({
        ...prev,
        isConverting: false,
        error: errorMessage,
        conversionProgress: 0
      }))

      toast({
        title: "Conversion failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [toast])

  const updateContent = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      editedContent: content,
      hasUnsavedChanges: prev.wordContent !== content
    }))
  }, [])

  const saveChanges = useCallback(async (filename: string) => {
    setState(prev => ({ ...prev, isSaving: true }))

    try {
      // Convert the edited content back to PDF using frontend conversion
      const response = await pdfConverter.convertWordToPdf(
        state.editedContent,
        filename.replace('.pdf', '_edited.pdf'),
        {
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineSpacing: 1.6,
          margins: { top: 20, bottom: 20, left: 20, right: 20 }
        }
      )

      setState(prev => ({
        ...prev,
        isSaving: false,
        hasUnsavedChanges: false,
        wordContent: prev.editedContent // Update the saved version
      }))

      toast({
        title: "Changes saved",
        description: "Your edits have been saved successfully using frontend processing.",
      })

      return response
    } catch (error) {
      setState(prev => ({ ...prev, isSaving: false }))
      
      toast({
        title: "Save failed",
        description: "Unable to save changes. Please try again.",
        variant: "destructive"
      })
      
      throw error
    }
  }, [state.editedContent, toast])

  const exportToPdf = useCallback(async (filename: string) => {
    setState(prev => ({ ...prev, isExporting: true }))

    try {
      const response = await pdfConverter.convertWordToPdf(
        state.editedContent,
        filename.replace('.pdf', '_edited.pdf'),
        {
          fontSize: 12,
          fontFamily: 'Times New Roman',
          lineSpacing: 1.6,
          margins: { top: 20, bottom: 20, left: 20, right: 20 }
        }
      )

      // Download the PDF
      const link = document.createElement('a')
      link.href = response.download_url
      link.download = response.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setState(prev => ({ ...prev, isExporting: false }))

      toast({
        title: "PDF exported",
        description: "Your edited document has been downloaded as PDF.",
      })

      return response
    } catch (error) {
      setState(prev => ({ ...prev, isExporting: false }))
      
      toast({
        title: "Export failed",
        description: "Unable to export PDF. Please try again.",
        variant: "destructive"
      })
      
      throw error
    }
  }, [state.editedContent, toast])

  const exportToWord = useCallback(async (filename: string) => {
    try {
      await pdfConverter.downloadAsWord(state.editedContent, filename)

      toast({
        title: "Word document downloaded",
        description: "Your edited content has been downloaded as Word document.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download Word document.",
        variant: "destructive"
      })
      
      throw error
    }
  }, [state.editedContent, toast])

  const resetConversion = useCallback(() => {
    setState({
      isConverting: false,
      isConverted: false,
      isExporting: false,
      isSaving: false,
      hasUnsavedChanges: false,
      wordContent: '',
      editedContent: '',
      originalPdfUrl: '',
      conversionProgress: 0,
      error: null
    })
  }, [])

  return {
    ...state,
    convertPdfToWord,
    updateContent,
    saveChanges,
    exportToPdf,
    exportToWord,
    resetConversion
  }
}
