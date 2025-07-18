
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Undo,
  Redo,
  Save,
  Download,
  FileText
} from 'lucide-react'

interface EditingToolbarProps {
  onSave?: () => void
  onExportPdf?: () => void
  onExportWord?: () => void
  isSaving?: boolean
}

export function EditingToolbar({ 
  onSave, 
  onExportPdf, 
  onExportWord, 
  isSaving = false 
}: EditingToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      {/* File Operations */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-1"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Export Options */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportPdf}
          className="gap-1"
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportWord}
          className="gap-1"
        >
          <Download className="w-4 h-4" />
          Export Word
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Quick Format Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
