import React, { useState } from "react"
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Info, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SwipeableCard } from "@/components/swipeable-card"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  occupation: string
  education: string
  bio: string
  interests: string[]
  images: string[]
  compatibility: number
}

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sarah",
    age: 28,
    location: "San Francisco, CA",
    occupation: "UX Designer",
    education: "Stanford University",
    bio: "Love exploring new cafes, hiking on weekends, and creating beautiful designs. Looking for someone who shares my passion for adventure and creativity.",
    interests: ["Design", "Hiking", "Coffee", "Travel", "Photography"],
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face"
    ],
    compatibility: 94
  },
  {
    id: "2", 
    name: "Emma",
    age: 26,
    location: "New York, NY",
    occupation: "Marketing Manager",
    education: "Columbia University",
    bio: "Yoga enthusiast, foodie, and dog lover. Always up for trying new restaurants or planning the next adventure. Looking for genuine connections.",
    interests: ["Yoga", "Food", "Dogs", "Books", "Wine"],
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
    ],
    compatibility: 89
  },
  {
    id: "3",
    name: "Jessica",
    age: 30,
    location: "Los Angeles, CA", 
    occupation: "Software Engineer",
    education: "MIT",
    bio: "Tech geek by day, artist by night. Love coding, painting, and discovering new music. Seeking someone who appreciates both logic and creativity.",
    interests: ["Technology", "Art", "Music", "Gaming", "Cooking"],
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop&crop=face"
    ],
    compatibility: 92
  }
]

export default function Meet() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeHistory, setSwipeHistory] = useState<{ index: number; direction: 'left' | 'right' }[]>([])
  const [showUndoButton, setShowUndoButton] = useState(false)

  const currentProfile = mockProfiles[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    // Save to history for undo functionality
    setSwipeHistory(prev => [...prev, { index: currentIndex, direction }])
    setShowUndoButton(true)
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockProfiles.length)
      setIsAnimating(false)
      
      // Hide undo button after 3 seconds
      setTimeout(() => setShowUndoButton(false), 3000)
    }, 300)
  }

  const handleUndo = () => {
    if (swipeHistory.length === 0) return
    
    const lastSwipe = swipeHistory[swipeHistory.length - 1]
    setCurrentIndex(lastSwipe.index)
    setSwipeHistory(prev => prev.slice(0, -1))
    setShowUndoButton(false)
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative">
      {/* Undo Button */}
      {showUndoButton && (
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="floating"
            onClick={handleUndo}
            className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg animate-bounce-in"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Undo
          </Button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto relative">
        {/* Enhanced Swipeable Profile Card */}
        <SwipeableCard
          profile={currentProfile}
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          onUndo={swipeHistory.length > 0 ? handleUndo : undefined}
        />

        {/* Profile Counter */}
        <div className="text-center mt-6">
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1} of {mockProfiles.length}
          </span>
        </div>
      </div>
    </div>
  )
}