import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-green-800" />
      <p className="mt-4 text-lg text-green-800">Loading Ayurvedic wisdom...</p>
    </div>
  )
}
