
import { 
  Upload, 
  FileText, 
  Home
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navigation = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
  },
  { 
    title: "Upload", 
    url: "/upload", 
    icon: Upload,
  },
  { 
    title: "Generate", 
    url: "/generate", 
    icon: FileText,
  },
  { 
    title: "Chat", 
    url: "/chat", 
    icon: FileText,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
            <FileText className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">WhitePaper AI</h2>
              <p className="text-xs text-muted-foreground">Generate & Analyze</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 py-4">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`rounded-lg transition-all duration-200 ${
                      isActive(item.url) 
                        ? "bg-foreground text-background font-medium" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
