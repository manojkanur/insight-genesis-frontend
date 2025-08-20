
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle, ZoomIn, ZoomOut, Maximize2, RectangleHorizontal } from "lucide-react"

interface PdfViewerProps {
  pdfUrl: string
  className?: string
}

type ViewMode = 'fit-page' | 'fit-width' | 'custom'

export function PdfViewer({ pdfUrl, className = "" }: PdfViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [viewMode, setViewMode] = useState<ViewMode>('fit-page')

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  const handleZoomIn = () => {
    setViewMode('custom')
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setViewMode('custom')
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleFitToPage = () => {
    setViewMode('fit-page')
    setZoom(100)
  }

  const handleFitToWidth = () => {
    setViewMode('fit-width')
    setZoom(100)
  }

  const getPdfUrl = () => {
    let url = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`
    
    switch (viewMode) {
      case 'fit-page':
        url += '&zoom=page-fit'
        break
      case 'fit-width':
        url += '&zoom=page-width'
        break
      case 'custom':
        url += `&zoom=${zoom}`
        break
      default:
        url += '&zoom=page-fit'
    }
    
    return url
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load PDF. The file might be unavailable or corrupted.
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                Open in new tab
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} flex flex-col h-full`}>
      <div className="flex items-center justify-between p-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[50px] text-center">
            {viewMode === 'custom' ? `${zoom}%` : viewMode === 'fit-page' ? 'Fit' : 'Width'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'fit-page' ? 'default' : 'outline'}
            size="sm"
            onClick={handleFitToPage}
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            Fit Page
          </Button>
          <Button
            variant={viewMode === 'fit-width' ? 'default' : 'outline'}
            size="sm"
            onClick={handleFitToWidth}
          >
            <RectangleHorizontal className="h-4 w-4 mr-1" />
            Fit Width
          </Button>
        </div>
      </div>
      
      <CardContent className="p-0 relative flex-1 overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading PDF...</span>
            </div>
          </div>
        )}
        
        <iframe
          src={getPdfUrl()}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          title="PDF Preview"
          style={{
            minHeight: '100%',
            backgroundColor: '#f8f9fa'
          }}
        />
      </CardContent>
    </Card>
  )
}
