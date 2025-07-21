import React, { useState } from "react"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, RotateCcw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SwipeableCardProps {
  profile: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onUndo?: () => void
  className?: string
}

export function SwipeableCard({ 
  profile, 
  onSwipeLeft, 
  onSwipeRight, 
  onUndo,
  className 
}: SwipeableCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left')
      setTimeout(() => {
        onSwipeLeft()
        setSwipeDirection(null)
        setCurrentImageIndex(0)
        setShowInfo(false)
      }, 300)
    },
    onSwipedRight: () => {
      setSwipeDirection('right')
      setTimeout(() => {
        onSwipeRight()
        setSwipeDirection(null)
        setCurrentImageIndex(0)
        setShowInfo(false)
      }, 300)
    },
    onSwipeStart: () => setIsDragging(true),
    onSwiped: () => setIsDragging(false),
    trackMouse: true
  })

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profile.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length)
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        {...handlers}
        key={profile.id}
        initial={{ scale: 0.8, opacity: 0, y: 100 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
          x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0
        }}
        exit={{ 
          scale: 0.8, 
          opacity: 0, 
          y: 100 
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300 
        }}
        className={cn("relative w-full max-w-md mx-auto", className)}
        style={{ touchAction: 'pan-y' }}
      >
        <Card className="card-glass border-white/20 overflow-hidden h-[70vh] min-h-[600px] relative">
          {/* Swipe Indicators */}
          {isDragging && (
            <>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                <div className="bg-destructive/80 text-white p-3 rounded-full">
                  <X className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                <div className="bg-success/80 text-white p-3 rounded-full">
                  <Heart className="h-8 w-8" />
                </div>
              </div>
            </>
          )}

          {/* Image Section */}
          <div className="relative h-3/5 overflow-hidden">
            <motion.img
              key={currentImageIndex}
              src={profile.images[currentImageIndex]}
              alt={profile.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Image Navigation Dots */}
            <div className="absolute top-4 left-4 right-4 flex space-x-2">
              {profile.images.map((_, index) => (
                <motion.div 
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all duration-300",
                    index === currentImageIndex ? "bg-white" : "bg-white/30"
                  )}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>

            {/* Image Navigation Areas */}
            <div className="absolute inset-0 flex">
              <motion.button 
                className="flex-1" 
                onClick={prevImage}
                whileTap={{ scale: 0.95 }}
              />
              <motion.button 
                className="flex-1" 
                onClick={nextImage}
                whileTap={{ scale: 0.95 }}
              />
            </div>

            {/* Compatibility Score */}
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Badge className="bg-success text-white font-semibold text-sm px-3 py-1">
                {profile.compatibility}% Match
              </Badge>
            </motion.div>

            {/* Info Toggle */}
            <motion.div
              className="absolute bottom-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="floating"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              >
                <Info className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Content Section */}
          <CardContent className="p-6 h-2/5 overflow-y-auto">
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Basic Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {profile.name}, {profile.age}
                  </h2>
                  <div className="flex items-center text-white/80">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⭐
                    </motion.div>
                    <span className="text-sm ml-1">4.9</span>
                  </div>
                </div>
                
                <div className="flex items-center text-white/80 text-sm">
                  📍 {profile.location}
                </div>
              </div>

              {/* Additional Info (Collapsible) */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div 
                    className="space-y-3"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center text-white/80 text-sm">
                      💼 {profile.occupation}
                    </div>
                    
                    <div className="flex items-center text-white/80 text-sm">
                      🎓 {profile.education}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bio */}
              <p className="text-white/90 text-sm leading-relaxed">
                {profile.bio}
              </p>

              {/* Interests */}
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {profile.interests.map((interest: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge 
                      variant="outline"
                      className="border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-300"
                    >
                      {interest}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center space-x-8 mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {onUndo && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="floating"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/20 hover:bg-yellow-500 transition-all duration-300"
                onClick={onUndo}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="floating"
              size="icon"
              className="h-16 w-16 rounded-full bg-white/20 hover:bg-destructive hover:shadow-2xl transition-all duration-300"
              onClick={onSwipeLeft}
            >
              <X className="h-8 w-8" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="floating"
              size="icon"
              className="h-20 w-20 rounded-full bg-white/20 hover:bg-success hover:shadow-2xl transition-all duration-300 animate-glow-pulse"
              onClick={onSwipeRight}
            >
              <Heart className="h-10 w-10" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}