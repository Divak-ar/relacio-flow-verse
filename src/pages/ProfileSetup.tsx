import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Upload, X, Plus, ArrowRight, User, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  age: z.number().min(18, 'You must be at least 18 years old').max(100, 'Please enter a valid age'),
  location: z.string().min(2, 'Please enter your location'),
  occupation: z.string().min(2, 'Please enter your occupation'),
  education: z.string().min(2, 'Please enter your education'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio must be less than 500 characters'),
  interests: z.array(z.string()).min(3, 'Please add at least 3 interests').max(10, 'You can add up to 10 interests')
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileImage {
  id: string
  file: File
  preview: string
}

export default function ProfileSetup() {
  const [images, setImages] = useState<ProfileImage[]>([])
  const [newInterest, setNewInterest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 25,
      location: '',
      occupation: '',
      education: '',
      bio: '',
      interests: []
    }
  })

  const interests = form.watch('interests')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (images.length >= 6) {
        toast({
          title: 'Too many images',
          description: 'You can upload up to 6 photos',
          variant: 'destructive'
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please upload images smaller than 5MB',
          variant: 'destructive'
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage: ProfileImage = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: e.target?.result as string
        }
        setImages(prev => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim()) && interests.length < 10) {
      form.setValue('interests', [...interests, newInterest.trim()])
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    form.setValue('interests', interests.filter(i => i !== interest))
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (images.length === 0) {
      toast({
        title: 'Add photos',
        description: 'Please add at least one photo to your profile',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call - you'll replace this with actual API call later
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would upload images and profile data to your backend
      console.log('Profile data:', values)
      console.log('Images:', images)

      // Update user profile completion status
      const updatedUser = { 
        ...user, 
        hasCompletedProfile: true,
        age: values.age,
        location: values.location,
        occupation: values.occupation,
        education: values.education,
        bio: values.bio,
        interests: values.interests
      }
      localStorage.setItem('relacio_user', JSON.stringify(updatedUser))

      toast({
        title: 'Profile completed!',
        description: 'Your profile has been set up successfully.',
      })

      navigate('/')
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="container max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-love-gradient bg-clip-text text-transparent">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-lg">
                Let's set up your profile to help you find amazing connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Add Photos</h3>
                  <span className="text-sm text-muted-foreground">({images.length}/6)</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <AnimatePresence>
                    {images.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square"
                      >
                        <img
                          src={image.preview}
                          alt={`Profile ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-primary/20"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {images.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="aspect-square h-full border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Plus className="h-6 w-6 text-primary" />
                        <span className="text-xs">Add Photo</span>
                      </div>
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Profile Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Age</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Location</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>Occupation</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Education</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Stanford University" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Heart className="h-4 w-4" />
                          <span>Bio</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself, your interests, and what you're looking for..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <span className="text-xs text-muted-foreground">
                            {field.value?.length || 0}/500
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Interests Section */}
                  <div className="space-y-4">
                    <FormLabel>Interests & Hobbies</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => removeInterest(interest)}
                        >
                          {interest}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an interest (e.g., hiking, cooking, music)"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInterest}
                        disabled={!newInterest.trim() || interests.length >= 10}
                      >
                        Add
                      </Button>
                    </div>
                    {form.formState.errors.interests && (
                      <p className="text-sm text-destructive">{form.formState.errors.interests.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="love"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Setting up your profile...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Complete Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
