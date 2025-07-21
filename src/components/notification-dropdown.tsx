import React, { useState } from "react"
import { Bell, Heart, MessageCircle, Users, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'match' | 'message' | 'like' | 'view'
  title: string
  message: string
  avatar?: string
  timestamp: Date
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "New Match!",
    message: "You and Sarah liked each other",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    read: false
  },
  {
    id: "2", 
    type: "message",
    title: "New Message",
    message: "Emma sent you a message",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    read: false
  },
  {
    id: "3",
    type: "like",
    title: "Someone liked you!",
    message: "You have a new admirer",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false
  },
  {
    id: "4",
    type: "view",
    title: "Profile Views",
    message: "5 people viewed your profile today",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    read: true
  }
]

interface NotificationDropdownProps {
  notifications?: Notification[]
  onNotificationRead?: (id: string) => void
  onClearAll?: () => void
}

export function NotificationDropdown({ 
  notifications = mockNotifications,
  onNotificationRead,
  onClearAll 
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)

  const unreadCount = notificationList.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match': return <Heart className="h-4 w-4 text-success" />
      case 'message': return <MessageCircle className="h-4 w-4 text-primary" />
      case 'like': return <Heart className="h-4 w-4 text-destructive" />
      case 'view': return <Users className="h-4 w-4 text-muted-foreground" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    onNotificationRead?.(id)
  }

  const clearAll = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
    onClearAll?.()
  }

  return (
    <div className="relative">
      <Button 
        variant="love-ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-destructive text-destructive-foreground rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="notification-dropdown animate-fade-in">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} unread notifications
            </p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notificationList.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-b border-border/30 hover:bg-accent/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>
                            {notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {getIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notificationList.length > 0 && (
            <div className="p-3 border-t border-border/50">
              <Button 
                variant="ghost" 
                className="w-full text-sm" 
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}