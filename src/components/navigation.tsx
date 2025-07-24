import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Heart, Home, MessageCircle, Users, User, Bell, Menu, X, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "@/assets/relacio-logo.png"

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const navigation = [
    { name: "Home", href: "/", icon: Home, requireAuth: false },
    { name: "Meet", href: "/meet", icon: Heart, requireAuth: true },
    { name: "Chat", href: "/chat", icon: MessageCircle, requireAuth: true },
    { name: "Profile", href: "/profile", icon: User, requireAuth: true },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleMeetClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/login')
    }
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
            const shouldShow = !item.requireAuth || isAuthenticated

            if (!shouldShow && item.name !== "Meet") return null

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={item.name === "Meet" ? handleMeetClick : undefined}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-love"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  item.requireAuth && !isAuthenticated && "opacity-60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right side - Auth, Notifications & Theme */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="love-ghost"
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button
                variant="love"
                onClick={() => navigate('/register')}
                className="hidden sm:flex"
              >
                Join Now
              </Button>
            </div>
          )}

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
              const shouldShow = !item.requireAuth || isAuthenticated

              if (!shouldShow && item.name !== "Meet") return null

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => {
                    if (item.name === "Meet") handleMeetClick(e)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-300",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-love"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    item.requireAuth && !isAuthenticated && "opacity-60"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {!isAuthenticated && (
              <div className="pt-4 space-y-2">
                <Button
                  variant="love-outline"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/login')
                    setIsOpen(false)
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  variant="love"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/register')
                    setIsOpen(false)
                  }}
                >
                  Join Now
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}