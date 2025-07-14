import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Eye,
  X,
  FileCheck
} from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useFileUpload } from "@/hooks/useApi"
import { uploadFile, ApiError } from "@/lib/api"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'parsing' | 'ready' | 'error'
  progress: number
  preview?: string
  path?: string // Backend file path
  error?: string
}

const statusConfig = {
  uploading: { icon: Loader2, color: "bg-blue-500", text: "Uploading...", variant: "default" as const },
  parsing: { icon: Loader2, color: "bg-yellow-500", text: "Parsing...", variant: "default" as const },
  ready: { icon: CheckCircle, color: "bg-green-500", text: "Ready", variant: "success" as const },
  error: { icon: AlertCircle, color: "bg-red-500", text: "Error", variant: "destructive" as const }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const processFileUpload = async (file: File) => {
    const fileId = Math.random().toString(36).substring(7)
    
    // Add file to list with uploading status
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }

    setFiles(prev => [...prev, newFile])

    try {
      // Update progress to show upload starting
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: 10 } : f
      ))

      // Call the real API
      const response = await uploadFile(file)
      
      // Update to parsing status
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          progress: 100, 
          status: 'parsing',
          path: response.path 
        } : f
      ))

      // Simulate parsing time (in production, you might poll for status)
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'ready' } : f
        ))
        
        toast({
          title: "File processed successfully",
          description: `${file.name} is ready for analysis.`,
        })
      }, 2000)

    } catch (error) {
      const apiError = error as ApiError
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error', 
          error: apiError.message 
        } : f
      ))
    }
  }

  const handleFileSelect = (selectedFiles: FileList) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    Array.from(selectedFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload PDF or DOCX files only.",
          variant: "destructive"
        })
        return
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload files smaller than 50MB.",
          variant: "destructive"
        })
        return
      }

      // Process the file upload
      processFileUpload(file)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const readyFiles = files.filter(f => f.status === 'ready')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Upload Documents
        </h1>
        <p className="text-xl text-muted-foreground">
          Upload your PDF or DOCX files to get started with AI-powered analysis and whitepaper generation.
        </p>
      </div>

      {/* Upload Area */}
      <Card className={`mb-8 transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : ''}`}>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-4">
              Drop your files here, or click to browse
            </h3>
            <p className="text-muted-foreground mb-6">
              Supports PDF and DOCX files up to 50MB each
            </p>
            
            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button size="lg" variant="default" className="cursor-pointer">
                <UploadIcon className="w-5 h-5 mr-2" />
                Choose Files
              </Button>
            </label>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                PDF Files
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                DOCX Files
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Track the progress of your file uploads and processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => {
              const config = statusConfig[file.status]
              const StatusIcon = config.icon
              
              return (
                <div key={file.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <Badge 
                        variant={config.variant === 'success' ? 'default' : config.variant} 
                        className={`gap-1 ${config.variant === 'success' ? 'bg-success text-success-foreground' : ''}`}
                      >
                        <StatusIcon className={`w-3 h-3 ${file.status === 'uploading' || file.status === 'parsing' ? 'animate-spin' : ''}`} />
                        {config.text}
                      </Badge>
                    </div>
                    
                    {(file.status === 'uploading' || file.status === 'parsing') && (
                      <Progress value={file.progress} className="mt-2" />
                    )}
                  </div>
                  
                  {file.status === 'ready' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Ready to Analyze */}
      {readyFiles.length > 0 && (
        <Alert className="border-success bg-success/5">
          <FileCheck className="h-4 w-4 text-success" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {readyFiles.length} file{readyFiles.length > 1 ? 's' : ''} ready for analysis
            </span>
            <div className="flex gap-2">
              <Button asChild variant="default">
                <Link to="/chat">
                  Start Analysis
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/generate">
                  Generate Whitepaper
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}