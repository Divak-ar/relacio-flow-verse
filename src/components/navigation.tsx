import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Heart, Home, MessageCircle, Users, User, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import logo from "@/assets/relacio-logo.png"

export function Navigation() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState(3) // Mock notification count

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Meet", href: "/meet", icon: Heart },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Profile", href: "/profile", icon: User },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Relacio" className="h-8 w-8" />
          <span className="text-xl font-bold bg-love-gradient bg-clip-text text-transparent">
            Relacio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-love"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right side - Notifications & Theme */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <NotificationDropdown />

          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="love-ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-love"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}