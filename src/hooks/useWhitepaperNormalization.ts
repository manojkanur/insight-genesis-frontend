
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { normalizeWhitepaper, NormalizeResponse } from '@/lib/api'
import { useDocumentConversion } from './useDocumentConversion'

export interface NormalizationState {
  isNormalizing: boolean
  isNormalized: boolean
  normalizedData: NormalizeResponse | null
  error: string | null
}

export function useWhitepaperNormalization() {
  const [state, setState] = useState<NormalizationState>({
    isNormalizing: false,
    isNormalized: false,
    normalizedData: null,
    error: null
  })

  const { toast } = useToast()
  const documentConverter = useDocumentConversion()

  const normalizeDocument = useCallback(async (data: {
    document?: File | null
    title: string
    description?: string
    prompt?: string
    mode?: 'llm' | 'fast'
  }) => {
    setState(prev => ({ 
      ...prev, 
      isNormalizing: true, 
      error: null,
      normalizedData: null,
      isNormalized: false
    }))

    try {
      const result = await normalizeWhitepaper(data as any)
      
      setState(prev => ({
        ...prev,
        isNormalizing: false,
        isNormalized: true,
        normalizedData: result
      }))

      toast({
        title: "Document normalized successfully",
        description: result?.message || "Your document has been processed.",
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Normalization failed'
      
      setState(prev => ({
        ...prev,
        isNormalizing: false,
        error: errorMessage
      }))

      toast({
        title: "Normalization failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [toast])

  const convertToWordForEditing = useCallback(async (pdfUrl: string) => {
    try {
      // Use the document conversion hook to convert the normalized PDF to Word
      const result = await documentConverter.convertPdfToWord(pdfUrl)
      
      toast({
        title: "Ready for editing",
        description: "Your normalized whitepaper is now ready for editing.",
      })

      return result
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "Failed to convert normalized PDF to editable format.",
        variant: "destructive"
      })
      throw error
    }
  }, [documentConverter, toast])

  const resetNormalization = useCallback(() => {
    setState({
      isNormalizing: false,
      isNormalized: false,
      normalizedData: null,
      error: null
    })
    documentConverter.resetConversion()
  }, [documentConverter])

  return {
    ...state,
    normalizeDocument,
    convertToWordForEditing,
    resetNormalization,
    // Also expose document conversion state and methods
    ...documentConverter
  }
}
