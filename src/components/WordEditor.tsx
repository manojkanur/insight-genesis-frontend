
import { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  FileEdit, 
  Save, 
  Download, 
  Search, 
  Replace,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Image,
  Table,
  Maximize2,
  Minimize2
} from 'lucide-react'

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
  const [pageCount, setPageCount] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editorRef = useRef<ReactQuill>(null)

  useEffect(() => {
    setEditorValue(value)
    updateCounts(value)
  }, [value])

  const updateCounts = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
    const chars = text.length
    const pages = Math.max(1, Math.ceil(chars / 2500)) // Rough estimate: 2500 chars per page
    
    setWordCount(words)
    setCharCount(chars)
    setPageCount(pages)
  }

  const extendedModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'formula',
    'align', 'direction',
    'color', 'background',
    'script', 'code-block'
  ]

  const handleChange = (content: string) => {
    setEditorValue(content)
    updateCounts(content)
    onChange(content)
  }

  const insertTable = () => {
    const quill = editorRef.current?.getEditor()
    if (quill) {
      const range = quill.getSelection()
      if (range) {
        const tableHtml = `
          <table style="width: 100%; border-collapse: collapse; margin: 1em 0;">
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 1</td>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 2</td>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 3</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 4</td>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 5</td>
              <td style="border: 1px solid #ccc; padding: 8px;">Cell 6</td>
            </tr>
          </table>
        `
        quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml)
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Enhanced Editor Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Advanced Word Editor
            </CardTitle>
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <Badge variant="destructive" className="text-xs">
                  Unsaved Changes
                </Badge>
              )}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
                <span>•</span>
                <span>{pageCount} pages</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="gap-2"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Additional Toolbar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={insertTable}
              className="gap-2"
            >
              <Table className="w-4 h-4" />
              Insert Table
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className="text-sm">Font Size:</Label>
              <Input
                id="font-size"
                type="number"
                min="8"
                max="72"
                defaultValue="12"
                className="w-16 h-8"
                onChange={(e) => {
                  const quill = editorRef.current?.getEditor()
                  if (quill) {
                    const range = quill.getSelection()
                    if (range) {
                      quill.format('size', `${e.target.value}px`)
                    }
                  }
                }}
              />
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const quill = editorRef.current?.getEditor()
                  if (quill) {
                    const range = quill.getSelection()
                    if (range) {
                      const format = quill.getFormat(range)
                      quill.format('align', format.align === 'left' ? false : 'left')
                    }
                  }
                }}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const quill = editorRef.current?.getEditor()
                  if (quill) {
                    const range = quill.getSelection()
                    if (range) {
                      quill.format('align', 'center')
                    }
                  }
                }}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const quill = editorRef.current?.getEditor()
                  if (quill) {
                    const range = quill.getSelection()
                    if (range) {
                      quill.format('align', 'right')
                    }
                  }
                }}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Word Editor */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="word-editor-wrapper" style={{ minHeight: isFullscreen ? 'calc(100vh - 300px)' : '600px' }}>
            <ReactQuill
              ref={editorRef}
              theme="snow"
              value={editorValue}
              onChange={handleChange}
              modules={extendedModules}
              formats={formats}
              placeholder={placeholder}
              style={{ 
                height: isFullscreen ? 'calc(100vh - 350px)' : '550px',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Footer with More Actions */}
      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Auto-save enabled</span>
          <span>•</span>
          <span>Last saved: Just now</span>
          <span>•</span>
          <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
        </div>
        
        <div className="flex gap-2">
          {onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          
          {onDownloadWord && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadWord}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Word
            </Button>
          )}
          
          {onDownloadPdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPdf}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
