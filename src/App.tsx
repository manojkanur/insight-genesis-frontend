
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NormalizationResult from '@/pages/NormalizationResult'
import WhitepaperEditor from '@/pages/WhitepaperEditor'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Welcome to AI Whitepapers</h1></div>} />
            <Route path="/normalization-result" element={<NormalizationResult />} />
            <Route path="/whitepaper-editor" element={<WhitepaperEditor />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
