import React, { useState } from "react"
import { Send, Phone, Video, MoreVertical, Image, Smile, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image'
}

interface ChatUser {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: Date
}

const mockUsers: ChatUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "2", 
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: "3",
    name: "Jessica Wilson",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  }
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "1",
    content: "Hey! How's your day going? 😊",
    timestamp: new Date(Date.now() - 7200000),
    type: 'text'
  },
  {
    id: "2",
    senderId: "current",
    content: "Hi Sarah! It's been great, thanks for asking. Just finished a morning hike. How about you?",
    timestamp: new Date(Date.now() - 7000000),
    type: 'text'
  },
  {
    id: "3",
    senderId: "1",
    content: "That sounds amazing! I love hiking too. Where did you go?",
    timestamp: new Date(Date.now() - 6800000),
    type: 'text'
  },
  {
    id: "4",
    senderId: "current",
    content: "I went to the local trail by the lake. The sunrise was absolutely beautiful! Maybe we could go together sometime? 🌅",
    timestamp: new Date(Date.now() - 6600000),
    type: 'text'
  },
  {
    id: "5",
    senderId: "1",
    content: "I'd love that! That sounds like a perfect date idea. 💕",
    timestamp: new Date(Date.now() - 6400000),
    type: 'text'
  }
]

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<ChatUser>(mockUsers[0])
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: "current",
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r bg-card">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          
          <div className="overflow-y-auto">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center p-4 cursor-pointer hover:bg-accent transition-colors",
                  selectedUser.id === user.id && "bg-accent"
                )}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-background"></div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {user.isOnline ? 'Online' : user.lastSeen && formatLastSeen(user.lastSeen)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.isOnline ? 'Active now' : 'Tap to chat'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-card flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.isOnline ? (
                    <span className="flex items-center">
                      <div className="h-2 w-2 bg-success rounded-full mr-2"></div>
                      Online
                    </span>
                  ) : (
                    selectedUser.lastSeen && `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="love-ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                variant="love-ghost" 
                size="icon"
                onClick={() => setIsVideoCallActive(!isVideoCallActive)}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="love-ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Video Call Window */}
          {isVideoCallActive && (
            <div className="relative h-64 bg-black border-b">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                  <p className="text-lg font-semibold">Video call with {selectedUser.name}</p>
                  <p className="text-sm opacity-90">Connecting...</p>
                </div>
              </div>
              
              {/* Local video preview */}
              <div className="absolute bottom-4 right-4 w-24 h-18 bg-muted rounded-lg border-2 border-white/50 flex items-center justify-center">
                <div className="text-xs text-muted-foreground">You</div>
              </div>
              
              {/* Call controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button variant="floating" size="icon" className="bg-destructive hover:bg-destructive/90">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button 
                  variant="floating" 
                  size="icon" 
                  onClick={() => setIsVideoCallActive(false)}
                  className="bg-white/20 hover:bg-white/30"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.senderId === "current" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                    message.senderId === "current"
                      ? "bg-love-gradient text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.senderId === "current" ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-card">
            <div className="flex items-center space-x-2">
              <Button variant="love-ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="love-ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="pr-12"
                />
                <Button 
                  variant="love-ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="love" 
                size="icon"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}