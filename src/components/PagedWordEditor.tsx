
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
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table
} from 'lucide-react'

interface PagedWordEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: (content: string) => void
  onDownloadPdf?: (content: string) => void
  onDownloadWord?: (content: string) => void
  hasUnsavedChanges?: boolean
  isSaving?: boolean
  placeholder?: string
}

export function PagedWordEditor({ 
  value, 
  onChange, 
  onSave,
  onDownloadPdf,
  onDownloadWord,
  hasUnsavedChanges = false,
  isSaving = false,
  placeholder = "Start editing your document..." 
}: PagedWordEditorProps) {
  const [editorValue, setEditorValue] = useState(value)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'continuous' | 'pages'>('pages')
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

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
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
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'code-block'
  ]

  const handleChange = (content: string) => {
    setEditorValue(content)
    updateCounts(content)
    onChange(content)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editorValue)
    }
  }

  const handleDownloadPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf(editorValue)
    }
  }

  const handleDownloadWord = () => {
    if (onDownloadWord) {
      onDownloadWord(editorValue)
    }
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

  const formatText = (format: string, value?: any) => {
    const quill = editorRef.current?.getEditor()
    if (quill) {
      const range = quill.getSelection()
      if (range) {
        quill.format(format, value)
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'continuous' ? 'pages' : 'continuous')
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Word Editor
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
                onClick={toggleViewMode}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {viewMode === 'continuous' ? 'Page View' : 'Continuous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="gap-2"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
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
              Table
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className="text-sm">Size:</Label>
              <Input
                id="font-size"
                type="number"
                min="8"
                max="72"
                defaultValue="12"
                className="w-16 h-8"
                onChange={(e) => formatText('size', `${e.target.value}px`)}
              />
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('align', 'left')}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('align', 'center')}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => formatText('align', 'right')}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Navigation */}
      {viewMode === 'pages' && pageCount > 1 && (
        <Card>
          <CardContent className="py-2">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            className={`word-editor-wrapper ${viewMode === 'pages' ? 'page-view' : 'continuous-view'}`}
            style={{ minHeight: isFullscreen ? 'calc(100vh - 400px)' : '600px' }}
          >
            <ReactQuill
              ref={editorRef}
              theme="snow"
              value={editorValue}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              style={{ 
                height: isFullscreen ? 'calc(100vh - 450px)' : '550px',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Auto-save enabled</span>
          <span>•</span>
          <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadWord}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Word
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      <style jsx>{`
        .page-view .ql-editor {
          background: white;
          box-shadow: 0 0 0 1px #ccc;
          margin: 0 auto;
          max-width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          page-break-after: always;
        }
        
        .continuous-view .ql-editor {
          background: white;
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
        }
        
        @media print {
          .ql-editor {
            max-width: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
