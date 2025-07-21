import React, { useState, useRef } from "react"
import { Smile, Image, Paperclip, Clock, CheckCheck } from "lucide-react"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EmojiPickerComponentProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
}

export function EmojiPickerComponent({ onEmojiSelect, isOpen, onClose }: EmojiPickerComponentProps) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute bottom-12 right-0 z-50">
      <div className="relative">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width={300}
          height={400}
          previewConfig={{ showPreview: false }}
        />
        <div 
          className="fixed inset-0 -z-10" 
          onClick={onClose}
        />
      </div>
    </div>
  )
}

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  children: React.ReactNode
}

export function FileUpload({ onFileSelect, accept = "image/*", children }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <div onClick={() => fileInputRef.current?.click()}>
        {children}
      </div>
    </div>
  )
}

interface DisappearingMessageProps {
  content: string
  timestamp: Date
  isOwn: boolean
  isDisappearing?: boolean
  disappearTime?: number // in hours
}

export function DisappearingMessage({ 
  content, 
  timestamp, 
  isOwn, 
  isDisappearing = false,
  disappearTime = 24 
}: DisappearingMessageProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  React.useEffect(() => {
    if (!isDisappearing) return

    const updateTimer = () => {
      const now = new Date()
      const expiryTime = new Date(timestamp.getTime() + (disappearTime * 60 * 60 * 1000))
      const diff = expiryTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Expired")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTimeLeft(`${hours}h ${minutes}m`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timestamp, disappearTime, isDisappearing])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div
      className={cn(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative",
        isOwn
          ? "bg-love-gradient text-white"
          : "bg-muted text-foreground",
        isDisappearing && "border border-orange-300 dark:border-orange-600"
      )}
    >
      {isDisappearing && (
        <div className="absolute -top-2 -right-2">
          <Badge 
            variant="outline" 
            className="text-xs bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-600"
          >
            <Clock className="h-3 w-3 mr-1" />
            {timeLeft}
          </Badge>
        </div>
      )}
      
      <p className="text-sm">{content}</p>
      
      <div className="flex items-center justify-between mt-1">
        <p className={cn(
          "text-xs",
          isOwn ? "text-white/80" : "text-muted-foreground"
        )}>
          {formatTime(timestamp)}
        </p>
        
        {isOwn && (
          <CheckCheck className="h-3 w-3 text-white/80" />
        )}
      </div>
    </div>
  )
}

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onEmojiSelect: (emoji: string) => void
  onFileSelect: (file: File) => void
  isDisappearingMode?: boolean
  onToggleDisappearing?: () => void
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onEmojiSelect, 
  onFileSelect,
  isDisappearingMode = false,
  onToggleDisappearing 
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji)
    onEmojiSelect(emoji)
  }

  return (
    <div className="p-4 border-t bg-card">
      {isDisappearingMode && (
        <div className="mb-3 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-sm text-orange-800 dark:text-orange-200 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Disappearing messages enabled - messages will disappear in 24 hours
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <FileUpload onFileSelect={onFileSelect} accept="*/*">
          <Button variant="love-ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
        </FileUpload>
        
        <FileUpload onFileSelect={onFileSelect}>
          <Button variant="love-ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>
        </FileUpload>
        
        {onToggleDisappearing && (
          <Button 
            variant={isDisappearingMode ? "love" : "love-ghost"} 
            size="icon"
            onClick={onToggleDisappearing}
            title="Toggle disappearing messages"
          >
            <Clock className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="pr-12"
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <Button 
              variant="love-ghost" 
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <EmojiPickerComponent
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        </div>
        
        <Button 
          variant="love" 
          size="icon"
          onClick={onSend}
          disabled={!value.trim()}
          className="animate-heart-beat"
        >
          ❤️
        </Button>
      </div>
    </div>
  )
}