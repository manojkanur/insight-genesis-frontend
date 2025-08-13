
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { pdfConverter, ConversionResult } from '@/lib/conversionService'
import { downloadFile } from '@/lib/api'

export interface ConversionState {
  isConverting: boolean
  isConverted: boolean
  isExporting: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  wordContent: string
  editedContent: string
  originalPdfUrl: string
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
    error: null
  })

  const { toast } = useToast()

  const convertPdfToWord = useCallback(async (pdfUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      isConverting: true, 
      error: null,
      originalPdfUrl: pdfUrl 
    }))

    try {
      const result: ConversionResult = await pdfConverter.convertPdfToWord(pdfUrl)
      
      setState(prev => ({
        ...prev,
        isConverting: false,
        isConverted: true,
        wordContent: result.wordContent,
        editedContent: result.wordContent,
        hasUnsavedChanges: false
      }))

      toast({
        title: "Conversion successful",
        description: "PDF has been converted to editable Word format.",
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed'
      
      setState(prev => ({
        ...prev,
        isConverting: false,
        error: errorMessage
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
      // Convert the edited content back to PDF
      const response = await pdfConverter.convertWordToPdf(
        state.editedContent,
        filename.replace('.pdf', '_edited.pdf')
      )

      setState(prev => ({
        ...prev,
        isSaving: false,
        hasUnsavedChanges: false,
        wordContent: prev.editedContent // Update the saved version
      }))

      toast({
        title: "Changes saved",
        description: "Your edits have been saved successfully.",
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
        filename.replace('.pdf', '_edited.pdf')
      )

      // Download the PDF
      const blob = await downloadFile(response.download_url)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = response.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

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
      // Create a proper Word document blob
      const blob = new Blob([state.editedContent], { 
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
