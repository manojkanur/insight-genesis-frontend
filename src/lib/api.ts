import axios, { AxiosResponse, AxiosError } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message)
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      console.error('Unauthorized access - consider redirecting to login')
    } else if (error.response?.status === 403) {
      console.error('Forbidden access')
    } else if (error.response?.status >= 500) {
      console.error('Server error - please try again later')
    }
    
    return Promise.reject(error)
  }
)

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadResponse {
  filename: string
  path: string
  message: string
}

export interface PdfContent {
  title: string
  abstract: string
  introduction: string
  methodology: string
  results: string
  conclusion: string
  references: string[]
}

export interface GenerateResponse {
  pdf_url: string
  filename: string
  content?: PdfContent
  sections?: string[]
}

export interface ChatResponse {
  question: string
  answer: string
  context_used: string
}

export interface RichPdfContent {
  title: string
  abstract: string
  introduction: string
  methodology: string
  results: string
  conclusion: string
  references: string[]
  formatting?: DocumentFormatting
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

export interface ConversionResponse {
  word_content: string
  original_pdf: string
  converted_at: string
}

export interface ExportResponse {
  download_url: string
  filename: string
  format: 'pdf' | 'word'
}

// API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Helper function to handle API errors
const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    // Server responded with error status
    const responseData = error.response.data as any
    const message = responseData?.message || responseData?.error || error.message
    throw new ApiError(message, error.response.status, error.response.data)
  } else if (error.request) {
    // Request was made but no response received
    throw new ApiError('Network error - please check your connection', 0)
  } else {
    // Something happened in setting up the request
    throw new ApiError(error.message)
  }
}

// API Functions

/**
 * Upload a file (PDF or DOCX) to the backend
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`📤 Upload Progress: ${percentCompleted}%`)
        }
      },
    })

    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Generate a whitepaper using AI
 */
export const generateWhitepaper = async (data: {
  title: string
  industry: string
  audience: string
  problem_statement: string
  solution_outline: string
  tone?: string
  length?: string
  template?: string
}): Promise<GenerateResponse> => {
  try {
    const response = await apiClient.post<GenerateResponse>('/api/generate', data)
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Save edited content and regenerate PDF
 */
export const saveWhitepaperContent = async (data: {
  filename: string
  content: PdfContent
}): Promise<GenerateResponse> => {
  try {
    const response = await apiClient.post<GenerateResponse>('/api/save-content', data)
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Chat with uploaded documents
 */
export const chatWithWhitepaper = async (
  question: string,
  docPath: string
): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/api/chat', {
      question,
      doc_path: docPath,
    })
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Get health status of the API
 */
export const getHealthStatus = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await apiClient.get('/api/health')
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Download a generated file
 */
export const downloadFile = async (filePath: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/api/download/${encodeURIComponent(filePath)}`, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Convert PDF to Word format for editing
 */
export const convertPdfToWord = async (pdfPath: string): Promise<ConversionResponse> => {
  try {
    const response = await apiClient.post<ConversionResponse>('/api/pdf-to-word', {
      pdf_path: pdfPath
    })
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Convert edited Word content back to PDF
 */
export const convertWordToPdf = async (data: {
  word_content: string
  filename: string
  formatting?: DocumentFormatting
}): Promise<ExportResponse> => {
  try {
    const response = await apiClient.post<ExportResponse>('/api/word-to-pdf', data)
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Save rich text content and regenerate document
 */
export const saveRichContent = async (data: {
  filename: string
  content: RichPdfContent
}): Promise<GenerateResponse> => {
  try {
    const response = await apiClient.post<GenerateResponse>('/api/save-rich-content', data)
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

/**
 * Export document in specified format
 */
export const exportDocument = async (data: {
  filename: string
  format: 'pdf' | 'word'
  content: RichPdfContent
}): Promise<ExportResponse> => {
  try {
    const response = await apiClient.post<ExportResponse>(`/api/export/${data.format}`, {
      filename: data.filename,
      content: data.content
    })
    return response.data
  } catch (error) {
    handleApiError(error as AxiosError)
  }
}

// Export the configured axios instance for custom requests
export { apiClient }

// Development utilities
export const isDevelopment = import.meta.env.MODE === 'development'
export const API_URL = API_BASE_URL

console.log(`🔗 API Base URL: ${API_BASE_URL}`)
