import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PdfActionsProps {
  pdfUrl: string
  filename: string
  customFilename?: string
}

export function PdfActions({ pdfUrl, filename, customFilename }: PdfActionsProps) {
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      setDownloading(true)
      
      const response = await fetch(pdfUrl)
      if (!response.ok) throw new Error('Failed to fetch PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = customFilename || filename
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Download started",
        description: "Your PDF is being downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDownloading(false)
    }
  }

  const handlePreview = () => {
    try {
      window.open(pdfUrl, '_blank')
    } catch (error) {
      toast({
        title: "Preview failed",
        description: "Unable to open the PDF. Please try downloading instead.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        size="lg" 
        variant="success" 
        className="gap-2" 
        onClick={handleDownload} 
        disabled={downloading}
      >
        {downloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {downloading ? 'Downloading...' : 'Download PDF'}
      </Button>
      
      <Button 
        size="lg" 
        variant="outline" 
        className="gap-2" 
        onClick={handlePreview}
      >
        <Eye className="w-5 h-5" />
        Preview
      </Button>
    </div>
  )
}