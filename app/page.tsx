import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-green-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold text-green-800 flex items-center">
            <span className="mr-2">🌿</span> Ayurvedic Assistant
          </h1>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 md:py-12">
        <div className="mx-auto max-w-3xl">
          <Chat />
        </div>
      </main>
      <footer className="border-t py-4 bg-white/80">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Ayurvedic wisdom powered by AI. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  )
}
