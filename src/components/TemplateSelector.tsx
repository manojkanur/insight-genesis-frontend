
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Layers, CheckCircle } from "lucide-react"

export interface PdfTemplate {
  id: string
  name: string
  description: string
  preview: string
  type: "business" | "technical"
}

const templates: PdfTemplate[] = [
  {
    id: "business-executive",
    name: "Executive Summary",
    description: "Professional template for C-suite and business stakeholders",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=250&fit=crop&crop=center",
    type: "business"
  },
  {
    id: "technical-detailed",
    name: "Technical Deep Dive",
    description: "Comprehensive template with technical specifications and diagrams",
    preview: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=250&fit=crop&crop=center",
    type: "technical"
  }
]

interface TemplateSelectorProps {
  selectedTemplate: string | null
  onTemplateSelect: (templateId: string) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="w-80 border-l border-border bg-background p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          PDF Templates
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a template for your whitepaper
        </p>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {template.name}
                    {selectedTemplate === template.id && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </CardTitle>
                  <Badge 
                    variant={template.type === "business" ? "default" : "secondary"}
                    className="mt-1 text-xs"
                  >
                    {template.type}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="w-full h-32 bg-muted rounded-md overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              
              <Button 
                variant={selectedTemplate === template.id ? "default" : "outline"}
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation()
                  onTemplateSelect(template.id)
                }}
              >
                {selectedTemplate === template.id ? "Selected" : "Select Template"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
