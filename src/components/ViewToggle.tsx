
import { Button } from '@/components/ui/button'
import { FileText, FileEdit } from 'lucide-react'

interface ViewToggleProps {
  viewMode: 'pdf' | 'word'
  onToggle: () => void
  disabled?: boolean
}

export function ViewToggle({ viewMode, onToggle, disabled = false }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={viewMode === 'pdf' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => viewMode === 'word' && onToggle()}
        disabled={disabled}
        className="gap-2"
      >
        <FileText className="w-4 h-4" />
        PDF View
      </Button>
      <Button
        variant={viewMode === 'word' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => viewMode === 'pdf' && onToggle()}
        disabled={disabled}
        className="gap-2"
      >
        <FileEdit className="w-4 h-4" />
        Word Edit
      </Button>
    </div>
  )
}
