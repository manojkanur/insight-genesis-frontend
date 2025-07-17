
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Edit3, 
  Download, 
  Save, 
  Eye,
  FileText,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PdfContent {
  title: string
  abstract: string
  introduction: string
  methodology: string
  results: string
  conclusion: string
  references: string[]
}

interface PdfEditorProps {
  pdfUrl: string
  filename: string
  onDownload: () => void
}

export function PdfEditor({ pdfUrl, filename, onDownload }: PdfEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState<PdfContent>({
    title: "Sample Whitepaper Title",
    abstract: "This is the abstract section of the whitepaper...",
    introduction: "Introduction section content...",
    methodology: "Methodology section content...",
    results: "Results and findings...",
    conclusion: "Conclusion and recommendations...",
    references: ["Reference 1", "Reference 2"]
  })
  const { toast } = useToast()

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
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Content saved",
        description: "Your whitepaper changes have been saved successfully.",
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
                Save
              </Button>
            </div>
          )}
          
          <Button
            variant="hero"
            size="sm"
            onClick={onDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="w-full justify-start px-4 pt-4">
            <TabsTrigger value="content">Content</TabsTrigger>
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
          </TabsContent>
          
          <TabsContent value="preview" className="p-4">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">PDF Preview</p>
                    <p className="text-sm text-muted-foreground">
                      Full PDF preview will be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
