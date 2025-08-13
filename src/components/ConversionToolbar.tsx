
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  RefreshCw, 
  Download, 
  Save,
  FileEdit,
  ArrowLeft
} from 'lucide-react'

interface ConversionToolbarProps {
  isConverted: boolean
  isConverting: boolean
  viewMode: 'pdf' | 'word'
  hasUnsavedChanges: boolean
  isSaving: boolean
  isExporting: boolean
  onConvert: () => void
  onSave: () => void
  onDownloadPdf: () => void
  onDownloadWord: () => void
  onToggleView: () => void
  filename: string
}

export function ConversionToolbar({
  isConverted,
  isConverting,
  viewMode,
  hasUnsavedChanges,
  isSaving,
  isExporting,
  onConvert,
  onSave,
  onDownloadPdf,
  onDownloadWord,
  onToggleView,
  filename
}: ConversionToolbarProps) {
  return (
    <Card className="mb-4">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          {/* Left: File Info & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium">{filename}</span>
            </div>
            
            {isConverted && (
              <Badge variant="secondary" className="gap-1">
                <FileEdit className="w-3 h-3" />
                Converted to Word
              </Badge>
            )}
            
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
            
            {viewMode === 'word' && (
              <Badge variant="outline" className="text-xs">
                Editing Mode
              </Badge>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {!isConverted ? (
              <Button
                onClick={onConvert}
                disabled={isConverting}
                className="gap-2"
              >
                {isConverting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileEdit className="w-4 h-4" />
                )}
                {isConverting ? 'Converting...' : 'Convert to Word'}
              </Button>
            ) : (
              <>
                {/* View Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleView}
                  className="gap-2"
                >
                  {viewMode === 'pdf' ? (
                    <>
                      <FileEdit className="w-4 h-4" />
                      Edit Word
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      View PDF
                    </>
                  )}
                </Button>

                {/* Save Button (only in word mode) */}
                {viewMode === 'word' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                )}

                {/* Download Buttons */}
                <Button
                  size="sm"
                  onClick={onDownloadPdf}
                  disabled={isExporting}
                  className="gap-2"
                >
                  {isExporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PDF
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownloadWord}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Word
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
