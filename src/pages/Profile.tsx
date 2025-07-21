import React, { useState } from "react"
import { Camera, Edit3, MapPin, Briefcase, GraduationCap, Heart, Star, Settings, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface UserProfile {
  id: string
  name: string
  age: number
  location: string
  occupation: string
  education: string
  bio: string
  interests: string[]
  photos: string[]
  preferences: {
    ageRange: [number, number]
    distance: number
    lookingFor: string
  }
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const [profile, setProfile] = useState<UserProfile>({
    id: "current",
    name: "Alex Johnson",
    age: 28,
    location: "San Francisco, CA",
    occupation: "Software Engineer",
    education: "Stanford University",
    bio: "Passionate about technology, love hiking, and always up for trying new restaurants. Looking for someone who shares my love for adventure and good conversations.",
    interests: ["Technology", "Hiking", "Food", "Travel", "Photography", "Music"],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=face"
    ],
    preferences: {
      ageRange: [22, 35],
      distance: 25,
      lookingFor: "Long-term relationship"
    }
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to backend
  }

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your dating profile and preferences</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="love" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="love" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Photos & Basic Info */}
          <div className="space-y-6">
            {/* Profile Photos */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos ({profile.photos.length}/6)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {profile.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Profile ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {isEditing && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Photo Button */}
                  {isEditing && profile.photos.length < 6 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <Plus className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="card-glass">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">94%</div>
                    <div className="text-sm text-muted-foreground">Profile Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Profile Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">23</div>
                    <div className="text-sm text-muted-foreground">Likes Today</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Matches</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="p-2">{profile.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      />
                    ) : (
                      <p className="p-2">{profile.age}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  ) : (
                    <p className="p-2">{profile.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="occupation">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Occupation
                  </Label>
                  {isEditing ? (
                    <Input
                      id="occupation"
                      value={profile.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                    />
                  ) : (
                    <p className="p-2">{profile.occupation}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="education">
                    <GraduationCap className="h-4 w-4 inline mr-1" />
                    Education
                  </Label>
                  {isEditing ? (
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                    />
                  ) : (
                    <p className="p-2">{profile.education}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell people about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="leading-relaxed">{profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground relative group"
                    >
                      {interest}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeInterest(interest)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest..."
                      onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                    />
                    <Button variant="love" onClick={addInterest}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dating Preferences */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>
                  <Settings className="h-5 w-5 mr-2 inline" />
                  Dating Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Looking For</Label>
                  {isEditing ? (
                    <Select
                      value={profile.preferences.lookingFor}
                      onValueChange={(value) => 
                        setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, lookingFor: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Long-term relationship">Long-term relationship</SelectItem>
                        <SelectItem value="Something casual">Something casual</SelectItem>
                        <SelectItem value="Friendship">Friendship</SelectItem>
                        <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2">{profile.preferences.lookingFor}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age Range</Label>
                    <p className="p-2">{profile.preferences.ageRange[0]} - {profile.preferences.ageRange[1]} years</p>
                  </div>
                  
                  <div>
                    <Label>Max Distance</Label>
                    <p className="p-2">{profile.preferences.distance} miles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}