
import { useState } from 'react'
import { WhitepaperNormalizer } from '@/components/WhitepaperNormalizer'
import { TemplateSelector } from '@/components/TemplateSelector'

export default function Upload() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleNormalizationComplete = (result: any) => {
    console.log('Normalization completed:', result)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Upload & Normalize Document</h1>
        <p className="text-muted-foreground">
          Upload your document to normalize it into a structured whitepaper format
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <WhitepaperNormalizer 
            onComplete={handleNormalizationComplete}
            selectedTemplate={selectedTemplate}
          />
        </div>
        
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    </div>
  )
}
