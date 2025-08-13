
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  Upload, 
  FileText, 
  Bot, 
  User,
  Sparkles,
  Brain,
  Plus,
  Paperclip
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  error?: boolean
}

const sampleQuestions = [
  "What are the key themes in my uploaded documents?",
  "Summarize the main arguments presented",
  "What evidence supports the conclusions?",
  "How can this research be applied in practice?"
]

const uploadedDocuments = [
  { id: '1', name: 'Market_Analysis_2024.pdf', status: 'ready' },
  { id: '2', name: 'Technical_Specifications.docx', status: 'ready' },
  { id: '3', name: 'Industry_Report.pdf', status: 'ready' }
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (userMessage: string): string => {
    const responses = [
      "Based on your uploaded documents, I can see several key patterns and insights. Let me analyze the specific aspects you're asking about...",
      "That's an excellent question. Looking at the data in your documents, there are three main points to consider...",
      "From my analysis of your documents, I've identified some important trends that relate to your question...",
      "I can provide detailed insights on that topic. The documents you've uploaded contain relevant information that suggests...",
      "Great question! Let me break down what I found in your documents regarding this topic..."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " The analysis shows compelling evidence that supports several key conclusions. " +
           "Would you like me to dive deeper into any specific aspect?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInputValue(question)
  }

  const startNewChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <Button 
            onClick={startNewChat}
            className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        {/* Document Context */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Documents</h3>
          <div className="space-y-2">
            {uploadedDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                  selectedDocument === doc.id 
                    ? 'bg-gray-700' 
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => setSelectedDocument(doc.id)}
              >
                <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate text-gray-200">{doc.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Examples</h3>
          <div className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => handleSampleQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  How can I help you today?
                </h1>
                <p className="text-gray-600">
                  Ask me anything about your documents
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <Avatar className={`w-8 h-8 ${message.sender === 'ai' ? 'bg-black' : 'bg-purple-600'}`}>
                    <AvatarFallback className={message.sender === 'ai' ? 'bg-black text-white' : 'bg-purple-600 text-white'}>
                      {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="font-medium text-gray-900">
                        {message.sender === 'ai' ? 'ChatGPT' : 'You'}
                      </span>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-800 leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4">
                  <Avatar className="w-8 h-8 bg-black">
                    <AvatarFallback className="bg-black text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="font-medium text-gray-900">ChatGPT</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus-within:shadow-md transition-shadow">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-gray-500 hover:text-gray-700"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message ChatGPT..."
                    className="border-0 bg-transparent p-0 focus-visible:ring-0 text-base"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="p-2 h-auto bg-black hover:bg-gray-800 text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {selectedDocument && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Chatting with: {uploadedDocuments.find(d => d.id === selectedDocument)?.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
