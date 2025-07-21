import React, { useState } from "react"
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const currentProfile = mockProfiles[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const cardElement = document.getElementById('profile-card')
    if (cardElement) {
      cardElement.classList.add(direction === 'left' ? 'animate-swipe-left' : 'animate-swipe-right')
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockProfiles.length)
      setCurrentImageIndex(0)
      setShowInfo(false)
      if (cardElement) {
        cardElement.classList.remove('animate-swipe-left', 'animate-swipe-right')
      }
      setIsAnimating(false)
    }, 600)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProfile.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentProfile.images.length) % currentProfile.images.length)
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto relative">
        {/* Profile Card */}
        <Card 
          id="profile-card"
          className="card-glass border-white/20 overflow-hidden swipe-card relative h-[70vh] min-h-[600px]"
        >
          {/* Image Section */}
          <div className="relative h-3/5 overflow-hidden">
            <img
              src={currentProfile.images[currentImageIndex]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            <div className="absolute top-4 left-4 right-4 flex space-x-2">
              {currentProfile.images.map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all duration-300",
                    index === currentImageIndex ? "bg-white" : "bg-white/30"
                  )}
                />
              ))}
            </div>

            {/* Image Controls */}
            <div className="absolute inset-0 flex">
              <button 
                className="flex-1" 
                onClick={prevImage}
                disabled={isAnimating}
              />
              <button 
                className="flex-1" 
                onClick={nextImage}
                disabled={isAnimating}
              />
            </div>

            {/* Compatibility Score */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-success text-white font-semibold">
                {currentProfile.compatibility}% Match
              </Badge>
            </div>

            {/* Info Toggle */}
            <Button
              variant="floating"
              size="icon"
              className="absolute bottom-4 right-4"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Section */}
          <CardContent className="p-6 h-2/5 overflow-y-auto">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <div className="flex items-center text-white/80">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.9</span>
                  </div>
                </div>
                
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentProfile.location}
                </div>
              </div>

              {/* Additional Info (Collapsible) */}
              {showInfo && (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="flex items-center text-white/80 text-sm">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {currentProfile.occupation}
                  </div>
                  
                  <div className="flex items-center text-white/80 text-sm">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {currentProfile.education}
                  </div>
                </div>
              )}

              {/* Bio */}
              <p className="text-white/90 text-sm leading-relaxed">
                {currentProfile.bio}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 mt-8">
          <Button
            variant="floating"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/20 hover:bg-destructive hover:scale-110 transition-all duration-300"
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
          >
            <X className="h-8 w-8" />
          </Button>
          
          <Button
            variant="floating"
            size="icon"
            className="h-20 w-20 rounded-full bg-white/20 hover:bg-success hover:scale-110 transition-all duration-300 animate-heart-beat"
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
          >
            <Heart className="h-10 w-10" />
          </Button>
        </div>

        {/* Profile Counter */}
        <div className="text-center mt-6">
          <span className="text-white/80 text-sm">
            {currentIndex + 1} of {mockProfiles.length}
          </span>
        </div>
      </div>
    </div>
  )
}