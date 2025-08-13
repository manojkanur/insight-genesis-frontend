
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileEdit, Save, Download } from 'lucide-react'

interface WordEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  onDownloadPdf?: () => void
  onDownloadWord?: () => void
  hasUnsavedChanges?: boolean
  isSaving?: boolean
  placeholder?: string
}

export function WordEditor({ 
  value, 
  onChange, 
  onSave,
  onDownloadPdf,
  onDownloadWord,
  hasUnsavedChanges = false,
  isSaving = false,
  placeholder = "Start editing your document..." 
}: WordEditorProps) {
  const [editorValue, setEditorValue] = useState(value)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setEditorValue(value)
    updateCounts(value)
  }, [value])

  const updateCounts = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
    const chars = text.length
    setWordCount(words)
    setCharCount(chars)
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ]

  const handleChange = (content: string) => {
    setEditorValue(content)
    updateCounts(content)
    onChange(content)
  }

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Word Document Editor
            </CardTitle>
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <Badge variant="destructive" className="text-xs">
                  Unsaved Changes
                </Badge>
              )}
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Word Editor */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="word-editor-wrapper" style={{ minHeight: '600px' }}>
            <ReactQuill
              theme="snow"
              value={editorValue}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              style={{ 
                height: '550px',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground">
          Auto-save enabled • Last saved: Just now
        </div>
        <div className="flex gap-2">
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-3 h-3" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
            >
              <Download className="w-3 h-3" />
              Download PDF
            </button>
          )}
          {onDownloadWord && (
            <button
              onClick={onDownloadWord}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
            >
              <Download className="w-3 h-3" />
              Download Word
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
