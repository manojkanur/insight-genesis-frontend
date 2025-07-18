
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Card } from '@/components/ui/card'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  readOnly?: boolean
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...", 
  height = "200px",
  readOnly = false 
}: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value)

  useEffect(() => {
    setEditorValue(value)
  }, [value])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ],
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'align'
  ]

  const handleChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  return (
    <Card className="overflow-hidden">
      <div className="quill-wrapper" style={{ height }}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{ height: 'calc(100% - 42px)' }}
        />
      </div>
    </Card>
  )
}
