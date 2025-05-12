"use client"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Namaste 🙏 I'm your Ayurvedic Assistant. I can help with natural remedies, lifestyle recommendations, and holistic wellness based on Ayurvedic principles. How can I assist you today?",
      },
    ],
    api: "/api/chat",
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Focus input on mount
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isMounted])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  return (
    <Card className="flex flex-col h-[75vh] shadow-lg border-green-100">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 rounded-lg p-4",
                message.role === "user"
                  ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                  : "mr-auto max-w-[80%] bg-muted",
              )}
            >
              {/* Always show avatar first for both user and assistant */}
              {message.role === "user" ? (
                <Avatar className="h-8 w-8 border bg-white">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 border bg-white">
                  <AvatarFallback className="text-green-800">🌿</AvatarFallback>
                </Avatar>
              )}

              <div className="text-sm">
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center h-8 my-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about Ayurvedic remedies, doshas, or wellness practices..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </Card>
  )
}
