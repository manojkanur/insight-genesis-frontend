import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Home,
  LayoutDashboard,
  FileText,
  Upload,
  MessageSquare,
  Settings,
  HelpCircle,
  Plus,
  FolderPlus,
  File,
  LucideIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  children?: Omit<NavItem, 'icon' | 'children'>[]
}

export function AppSidebar() {
  const location = useLocation()

  const navigation = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "New Whitepaper",
      url: "/upload",
      icon: Upload,
    },
    {
      title: "My Whitepapers",
      url: "/documents",
      icon: File,
    },
    {
      title: "Whitepaper Generator",
      url: "/generator",
      icon: Plus,
    },
    {
      title: "Whitepaper Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Whitepaper Editor",
      url: "/whitepaper-editor",
      icon: FileText,
    },
  ]

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 pb-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <LayoutDashboard className="w-6 h-6" />
          <span>AI Whitepapers</span>
        </Link>
      </div>

      <Accordion type="multiple" className="flex-1 space-y-1">
        {navigation.map((item) => (
          item.children ? (
            <AccordionItem value={item.title} key={item.title}>
              <AccordionTrigger className="text-base font-medium">{item.title}</AccordionTrigger>
              <AccordionContent className="pl-4">
                {item.children.map((child) => (
                  <Link
                    key={child.title}
                    to={child.url}
                    className={cn(
                      "flex items-center space-x-2 py-2 text-sm font-medium hover:underline",
                      location.pathname === child.url ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {child.title}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          ) : (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center space-x-2 py-2 px-4 text-base font-medium hover:underline",
                location.pathname === item.url ? "bg-secondary text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          )
        ))}
      </Accordion>

      <div className="mt-auto px-4">
        <Link to="/settings" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline text-muted-foreground">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <Link to="/help" className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </Link>
      </div>
    </div>
  )
}
