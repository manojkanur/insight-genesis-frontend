
import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FileText, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  disabled?: boolean
  accept?: string
}

export function FileUploadZone({ onFileSelect, selectedFile, disabled, accept = ".pdf,.docx,.md,.txt" }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && isValidFileType(file)) {
      onFileSelect(file)
    }
  }, [disabled, onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const isValidFileType = (file: File) => {
    const validTypes = ['.pdf', '.docx', '.md', '.txt']
    const fileName = file.name.toLowerCase()
    return validTypes.some(type => fileName.endsWith(type))
  }

  const removeFile = useCallback(() => {
    onFileSelect(null as any)
  }, [onFileSelect])

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Document *</Label>
      <Card
        className={cn(
          "relative transition-all duration-200 cursor-pointer",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent
          className="p-8"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="file"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Upload className={cn(
                  "w-12 h-12 transition-colors",
                  isDragOver ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="space-y-2">
                <p className={cn(
                  "text-lg font-medium transition-colors",
                  isDragOver ? "text-primary" : "text-foreground"
                )}>
                  {isDragOver ? "Drop your document here" : "Choose a document or drag it here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, Markdown, and Text files (max 25MB)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
