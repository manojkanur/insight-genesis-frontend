
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Check, Edit, Download, RefreshCw, AlertCircle } from 'lucide-react'
import { useWhitepaperNormalization } from '@/hooks/useWhitepaperNormalization'
import { RichTextEditor } from '@/components/RichTextEditor'
import { PdfViewer } from '@/components/PdfViewer'

export default function NormalizationResult() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pdf')

  const {
    isNormalized,
    normalizedData,
    isConverting,
    isConverted,
    wordContent,
    editedContent,
    hasUnsavedChanges,
    conversionProgress,
    convertToWordForEditing,
    updateContent,
    exportToPdf,
    exportToWord,
    resetNormalization
  } = useWhitepaperNormalization()

  // Get data from URL params or redirect if missing
  const pdfUrl = searchParams.get('pdfUrl')
  const sectorsDetected = searchParams.get('sectors')?.split(',') || []
  const mode = searchParams.get('mode') || 'llm'
  const title = searchParams.get('title') || 'Normalized Whitepaper'

  useEffect(() => {
    if (!pdfUrl) {
      navigate('/upload')
    }
  }, [pdfUrl, navigate])

  const handleConvertToWord = async () => {
    if (!pdfUrl) return

    try {
      await convertToWordForEditing(pdfUrl)
      setActiveTab('edit')
    } catch (error) {
      console.error('Conversion failed:', error)
    }
  }

  const handleExportPdf = async () => {
    if (!editedContent) return

    try {
      await exportToPdf(
        `${title.replace(/\s+/g, '_')}_edited.pdf`,
        editedContent
      )
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const handleExportWord = async () => {
    if (!editedContent) return

    try {
      await exportToWord(
        `${title.replace(/\s+/g, '_')}_edited`,
        editedContent
      )
    } catch (error) {
      console.error('Word export failed:', error)
    }
  }

  const handleBackToUpload = () => {
    resetNormalization()
    navigate('/upload')
  }

  if (!pdfUrl) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handleBackToUpload}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Check className="w-8 h-8 text-green-600" />
            Normalization Complete
          </h1>
          <p className="text-muted-foreground mt-1">{title}</p>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {sectorsDetected.length} sectors detected
              </Badge>
              <Badge variant="outline" className="text-lg px-3 py-1">
                Mode: {mode.toUpperCase()}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600 text-lg px-3 py-1">
                  Unsaved changes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isConverted && (
                <Button
                  onClick={handleConvertToWord}
                  disabled={isConverting}
                  size="lg"
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Convert to Editable Format
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => window.open(pdfUrl, '_blank')}
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Original PDF
              </Button>

              {isConverted && editedContent && (
                <>
                  <Button
                    onClick={handleExportPdf}
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={handleExportWord}
                    size="lg"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Word
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Conversion Progress */}
          {isConverting && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting to editable format...</span>
                <span>{conversionProgress}%</span>
              </div>
              <Progress value={conversionProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content - Updated PDF viewer height */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf" className="text-lg py-3">
            PDF View
          </TabsTrigger>
          <TabsTrigger 
            value="edit" 
            disabled={!isConverted}
            className="text-lg py-3"
          >
            Edit Content
            {!isConverted && (
              <span className="ml-2 text-xs opacity-60">(Convert first)</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf" className="space-y-0">
          <Card>
            <CardContent className="p-0">
              <PdfViewer pdfUrl={pdfUrl} className="h-[80vh] min-h-[720px]" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="space-y-0">
          {isConverted && wordContent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Document Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={editedContent}
                  onChange={updateContent}
                  height="calc(100vh-400px)"
                  placeholder="Edit your normalized whitepaper content here..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Convert to Edit</h3>
                    <p className="text-muted-foreground">
                      Convert the PDF to editable format to start editing the content.
                    </p>
                  </div>
                  <Button onClick={handleConvertToWord} disabled={isConverting}>
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Convert Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
