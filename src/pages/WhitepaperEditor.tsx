
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Edit, 
  Eye,
  Printer
} from 'lucide-react'
import { PagedWordEditor } from '@/components/PagedWordEditor'
import { WhitepaperContent } from '@/components/WhitepaperContent'
import { useDocumentConversion } from '@/hooks/useDocumentConversion'

export default function WhitepaperEditor() {
  const [content, setContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  
  const {
    exportToPdf,
    exportToWord,
    isExporting,
    isSaving
  } = useDocumentConversion()

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!content) return
    
    try {
      // In a real implementation, this would save to a backend
      console.log('Saving content:', content)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const handleExportPdf = async () => {
    if (!content) return
    
    try {
      await exportToPdf('healthcare_ai_whitepaper.pdf', content)
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const handleExportWord = async () => {
    if (!content) return
    
    try {
      await exportToWord('healthcare_ai_whitepaper', content)
    } catch (error) {
      console.error('Word export failed:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Healthcare AI Whitepaper</h1>
            <p className="text-muted-foreground">Generative AI for Healthcare - Conference Paper</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved Changes
            </Badge>
          )}
          
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportWord}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Word
          </Button>
          
          <Button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Document
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-0">
          <Card>
            <CardHeader>
              <CardTitle>Document Editor</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div style={{ minHeight: '800px' }}>
                <PagedWordEditor
                  value={content}
                  onChange={handleContentChange}
                  onSave={handleSave}
                  onDownloadPdf={handleExportPdf}
                  onDownloadWord={handleExportWord}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSaving={isSaving}
                  placeholder="Your whitepaper content will appear here..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-0">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  minHeight: '800px',
                  background: 'white',
                  padding: '40px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  margin: '20px 0'
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Load the whitepaper content */}
      <WhitepaperContent onContentLoad={setContent} />
    </div>
  )
}
