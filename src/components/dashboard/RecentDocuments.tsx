
import { FileText, MoreHorizontal, Download, Eye, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const documents = [
  {
    id: 1,
    name: "AI in Healthcare Analysis",
    type: "Whitepaper",
    size: "2.4 MB",
    date: "2 hours ago",
    status: "complete" as const,
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Financial Report Q4",
    type: "PDF",
    size: "1.8 MB",
    date: "1 day ago",
    status: "processing" as const,
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Market Research Document",
    type: "DOCX",
    size: "3.2 MB",
    date: "2 days ago",
    status: "complete" as const,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop"
  },
  {
    id: 4,
    name: "Technology Trends 2024",
    type: "Whitepaper",
    size: "4.1 MB",
    date: "3 days ago",
    status: "complete" as const,
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=200&h=150&fit=crop"
  },
  {
    id: 5,
    name: "Product Requirements",
    type: "PDF",
    size: "1.2 MB",
    date: "1 week ago",
    status: "error" as const,
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=200&h=150&fit=crop"
  },
  {
    id: 6,
    name: "User Research Findings",
    type: "DOCX",
    size: "2.8 MB",
    date: "1 week ago",
    status: "complete" as const,
    thumbnail: "https://images.unsplash.com/photo-1553028826-f4804151e0b2?w=200&h=150&fit=crop"
  }
]

export function RecentDocuments() {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="group relative overflow-hidden rounded-lg border border-border hover:border-accent/50 transition-all duration-200 hover-lift"
            >
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img 
                  src={doc.thumbnail} 
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                <div className="absolute top-2 right-2">
                  <StatusBadge 
                    variant={
                      doc.status === "complete" ? "success" : 
                      doc.status === "processing" ? "processing" : 
                      doc.status === "error" ? "destructive" : "default"
                    }
                    size="sm"
                  >
                    {doc.status === "complete" ? "Complete" : 
                     doc.status === "processing" ? "Processing" : 
                     doc.status === "error" ? "Error" : "Unknown"}
                  </StatusBadge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate mb-1">
                      {doc.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{doc.date}</p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
