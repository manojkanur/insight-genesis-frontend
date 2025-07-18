
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Edit3, 
  Save,
  FileText,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PdfContent, saveWhitepaperContent } from "@/lib/api"
import { PdfViewer } from "./PdfViewer"
import { PdfActions } from "./PdfActions"

interface PdfEditorProps {
  pdfUrl: string
  filename: string
  initialContent?: PdfContent
  title: string
}

export function PdfEditor({ pdfUrl, filename, initialContent, title }: PdfEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfUrl)
  const [content, setContent] = useState<PdfContent>(
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
    { key: 'abstract', label: 'Abstract', type: 'textarea' },
    { key: 'introduction', label: 'Introduction', type: 'textarea' },
    { key: 'methodology', label: 'Methodology', type: 'textarea' },
    { key: 'results', label: 'Results', type: 'textarea' },
    { key: 'conclusion', label: 'Conclusion', type: 'textarea' }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await saveWhitepaperContent({
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

  const updateContent = (key: keyof PdfContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
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

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="w-full justify-start px-4 pt-4">
            <TabsTrigger value="content">Edit Content</TabsTrigger>
            <TabsTrigger value="preview">PDF Preview</TabsTrigger>
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
                        value={content[section.key as keyof PdfContent] as string}
                        onChange={(e) => updateContent(section.key as keyof PdfContent, e.target.value)}
                        className="text-base"
                      />
                    ) : (
                      <Textarea
                        value={content[section.key as keyof PdfContent] as string}
                        onChange={(e) => updateContent(section.key as keyof PdfContent, e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    )
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">
                        {content[section.key as keyof PdfContent] as string}
                      </p>
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
        </Tabs>
      </div>
    </div>
  )
}
