
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Edit3, 
  Save,
  FileText,
  RefreshCw,
  Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichPdfContent, saveRichContent, exportDocument } from "@/lib/api"
import { PdfViewer } from "./PdfViewer"
import { PdfActions } from "./PdfActions"
import { RichTextEditor } from "./RichTextEditor"
import { DocumentConverter } from "./DocumentConverter"
import { EditingToolbar } from "./EditingToolbar"

interface PdfEditorProps {
  pdfUrl: string
  filename: string
  initialContent?: RichPdfContent
  title: string
}

export function PdfEditor({ pdfUrl, filename, initialContent, title }: PdfEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfUrl)
  const [activeTab, setActiveTab] = useState("content")
  const [content, setContent] = useState<RichPdfContent>(
    initialContent || {
      title: title || "Untitled Whitepaper",
      abstract: "Abstract content will appear here...",
      introduction: "Introduction content will appear here...",
      methodology: "Methodology content will appear here...",
      results: "Results content will appear here...",
      conclusion: "Conclusion content will appear here...",
      references: []
    }
  )
  const { toast } = useToast()

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
    }
  }, [initialContent])

  const sections = [
    { key: 'title', label: 'Title', type: 'input' },
    { key: 'abstract', label: 'Abstract', type: 'richtext' },
    { key: 'introduction', label: 'Introduction', type: 'richtext' },
    { key: 'methodology', label: 'Methodology', type: 'richtext' },
    { key: 'results', label: 'Results', type: 'richtext' },
    { key: 'conclusion', label: 'Conclusion', type: 'richtext' }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await saveRichContent({
        filename,
        content
      })
      
      setCurrentPdfUrl(response.pdf_url)
      
      toast({
        title: "Content saved",
        description: "Your whitepaper has been updated and regenerated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to save changes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPdf = async () => {
    setIsExporting(true)
    try {
      const response = await exportDocument({
        filename,
        format: 'pdf',
        content
      })
      
      // Download the file
      const link = document.createElement('a')
      link.href = response.download_url
      link.download = response.filename
      link.click()
      
      toast({
        title: "PDF exported",
        description: "Your whitepaper has been exported as PDF.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportWord = async () => {
    setIsExporting(true)
    try {
      const response = await exportDocument({
        filename,
        format: 'word',
        content
      })
      
      // Download the file
      const link = document.createElement('a')
      link.href = response.download_url
      link.download = response.filename
      link.click()
      
      toast({
        title: "Word document exported",
        description: "Your whitepaper has been exported as Word document.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export Word document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const updateContent = (key: keyof RichPdfContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  const handleConversionComplete = (wordContent: string) => {
    // Update the abstract with converted content as an example
    setContent(prev => ({ 
      ...prev, 
      abstract: wordContent 
    }))
    setIsEditing(true)
    setActiveTab("convert")
  }

  const handleConvertedContentUpdate = (updatedContent: string) => {
    // Update content when user edits the converted document
    setContent(prev => ({
      ...prev,
      abstract: updatedContent
    }))
  }

  const customFilename = `${content.title.replace(/\s+/g, '_')}_whitepaper.pdf`

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Generated Whitepaper</h3>
            <p className="text-sm text-muted-foreground">{filename}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {isEditing ? "Editing" : "Preview"}
          </Badge>
          
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save & Regenerate
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editing Toolbar */}
      {isEditing && (
        <EditingToolbar
          onSave={handleSave}
          onExportPdf={handleExportPdf}
          onExportWord={handleExportWord}
          isSaving={isSaving || isExporting}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full justify-start px-4 pt-4">
            <TabsTrigger value="content">Edit Content</TabsTrigger>
            <TabsTrigger value="preview">PDF Preview</TabsTrigger>
            <TabsTrigger value="convert">Document Conversion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="p-4 space-y-6">
            {sections.map((section) => (
              <Card key={section.key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    section.type === 'input' ? (
                      <Input
                        value={content[section.key as keyof RichPdfContent] as string}
                        onChange={(e) => updateContent(section.key as keyof RichPdfContent, e.target.value)}
                        className="text-base"
                      />
                    ) : (
                      <RichTextEditor
                        value={content[section.key as keyof RichPdfContent] as string}
                        onChange={(value) => updateContent(section.key as keyof RichPdfContent, value)}
                        height="200px"
                      />
                    )
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: content[section.key as keyof RichPdfContent] as string
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <div className="pt-4">
              <PdfActions
                pdfUrl={currentPdfUrl}
                filename={filename}
                customFilename={customFilename}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="p-4">
            <PdfViewer 
              pdfUrl={currentPdfUrl}
              className="h-full"
            />
          </TabsContent>

          <TabsContent value="convert" className="p-4">
            <DocumentConverter
              pdfUrl={currentPdfUrl}
              filename={filename}
              onConversionComplete={handleConversionComplete}
              onContentUpdate={handleConvertedContentUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
