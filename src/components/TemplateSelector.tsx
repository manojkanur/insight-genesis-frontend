
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Layers, CheckCircle, Building2, Code2 } from "lucide-react"

export interface PdfTemplate {
  id: string
  name: string
  description: string
  preview: string
  type: "business" | "technical"
  icon: React.ComponentType<{ className?: string }>
}

const templates: PdfTemplate[] = [
  {
    id: "business-executive",
    name: "Executive Summary",
    description: "Professional template for C-suite and business stakeholders",
    preview: "/api/placeholder/200/250",
    type: "business",
    icon: Building2
  },
  {
    id: "technical-detailed",
    name: "Technical Deep Dive",
    description: "Comprehensive template with technical specifications and diagrams",
    preview: "/api/placeholder/200/250", 
    type: "technical",
    icon: Code2
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
        {templates.map((template) => {
          const IconComponent = template.icon
          return (
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
                <div className="w-full h-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-md flex flex-col items-center justify-center border border-border/50">
                  <IconComponent className="w-8 h-8 text-primary mb-2" />
                  <div className="text-xs text-muted-foreground text-center">
                    {template.type === "business" ? "Executive Layout" : "Technical Layout"}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-primary/20 rounded-full"></div>
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
          )
        })}
      </div>
    </div>
  )
}
