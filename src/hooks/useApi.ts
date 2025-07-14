import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ApiError } from '@/lib/api'

// Generic API state hook
export interface ApiState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApiState<T = any>(initialData: T | null = null): [
  ApiState<T>,
  {
    setData: (data: T | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
  }
] {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data, error: null }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null })
  }, [initialData])

  return [state, { setData, setLoading, setError, reset }]
}

// Hook for API calls with automatic error handling
export function useApiCall<T = any, P extends any[] = any[]>(
  apiFunction: (...args: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: ApiError) => void
    showSuccessToast?: boolean
    showErrorToast?: boolean
    successMessage?: string
  } = {}
) {
  const [state, { setData, setLoading, setError, reset }] = useApiState<T>()
  const { toast } = useToast()

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
  } = options

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)

        const result = await apiFunction(...args)
        setData(result)

        if (showSuccessToast) {
          toast({
            title: 'Success',
            description: successMessage,
          })
        }

        onSuccess?.(result)
        return result
      } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(String(error))
        setError(apiError.message)

        if (showErrorToast) {
          toast({
            title: 'Error',
            description: apiError.message,
            variant: 'destructive',
          })
        }

        onError?.(apiError)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, setData, setLoading, setError, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, toast]
  )

  return {
    ...state,
    execute,
    reset,
  }
}

// Specific hooks for common operations
export function useFileUpload() {
  return useApiCall(
    async (file: File) => {
      const { uploadFile } = await import('@/lib/api')
      return uploadFile(file)
    },
    {
      showSuccessToast: true,
      successMessage: 'File uploaded successfully',
    }
  )
}

export function useWhitepaperGeneration() {
  return useApiCall(
    async (data: {
      title: string
      industry: string
      audience: string
      problem_statement: string
      solution_outline: string
      tone?: string
      length?: string
    }) => {
      const { generateWhitepaper } = await import('@/lib/api')
      return generateWhitepaper(data)
    },
    {
      showSuccessToast: true,
      successMessage: 'Whitepaper generated successfully',
    }
  )
}

export function useDocumentChat() {
  return useApiCall(
    async (question: string, docPath: string) => {
      const { chatWithWhitepaper } = await import('@/lib/api')
      return chatWithWhitepaper(question, docPath)
    },
    {
      showErrorToast: true,
    }
  )
}

// Hook for file download with blob handling
export function useFileDownload() {
  const [state, { setLoading, setError }] = useApiState()
  const { toast } = useToast()

  const downloadFile = useCallback(
    async (filePath: string, fileName?: string) => {
      try {
        setLoading(true)
        setError(null)

        const { downloadFile: apiDownloadFile } = await import('@/lib/api')
        const blob = await apiDownloadFile(filePath)

        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName || filePath.split('/').pop() || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: 'Success',
          description: 'File downloaded successfully',
        })
      } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(String(error))
        setError(apiError.message)
        toast({
          title: 'Download Error',
          description: apiError.message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, toast]
  )

  return {
    ...state,
    downloadFile,
  }
}

// Connection test hook
export function useApiConnection() {
  const [state, { setData, setLoading, setError }] = useApiState<boolean>(false)

  const testConnection = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { getHealthStatus } = await import('@/lib/api')
      await getHealthStatus()
      setData(true)
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(String(error))
      setError(apiError.message)
      setData(false)
    } finally {
      setLoading(false)
    }
  }, [setData, setLoading, setError])

  return {
    ...state,
    testConnection,
  }
}