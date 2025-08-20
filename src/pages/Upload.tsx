
import { WhitepaperNormalizer } from '@/components/WhitepaperNormalizer'

export default function Upload() {
  const handleNormalizationComplete = (result: any) => {
    console.log('Normalization completed:', result)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Upload & Normalize Document</h1>
        <p className="text-muted-foreground">
          Upload your document to normalize it into a structured whitepaper format
        </p>
      </div>

      <WhitepaperNormalizer onComplete={handleNormalizationComplete} />
    </div>
  )
}
