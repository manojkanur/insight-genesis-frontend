import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { SiteHeader } from '@/components/SiteHeader'
import { AppSidebar } from '@/components/AppSidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { UploadPage } from '@/pages/UploadPage'
import { NormalizationResult } from '@/pages/NormalizationResult'
import { PdfEditorPage } from '@/pages/PdfEditorPage'
import { QueryClient } from '@/lib/queryClient'
import WhitepaperEditor from '@/pages/WhitepaperEditor'

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/normalization-result" element={<NormalizationResult />} />
            <Route path="/pdf-editor/:filename" element={<PdfEditorPage />} />
            <Route path="/whitepaper-editor" element={<WhitepaperEditor />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClient>
  )
}

export default App
