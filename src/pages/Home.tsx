import React from "react"
import { Link } from "react-router-dom"
import { Heart, Users, MessageCircle, Shield, Sparkles, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import heroImage from "@/assets/hero-love.jpg"

export default function Home() {
  const features = [
    {
      icon: Heart,
      title: "Smart Matching",
      description: "Advanced AI algorithm finds your perfect match based on deep compatibility analysis."
    },
    {
      icon: Users,
      title: "Vertical Discovery",
      description: "Unique vertical scrolling experience that feels natural and engaging."
    },
    {
      icon: MessageCircle,
      title: "Video Calls",
      description: "Seamless video calling integrated right into your chat experience."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your privacy and safety are our top priority with advanced security features."
    },
    {
      icon: Sparkles,
      title: "Real-time Sync",
      description: "Everything happens in real-time - messages, matches, and notifications."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      age: 28,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "I found my soulmate on Relacio! The vertical scrolling made browsing so much more fun.",
      rating: 5
    },
    {
      name: "Mike Chen",
      age: 32,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The video call feature is amazing. I could really get to know someone before meeting.",
      rating: 5
    },
    {
      name: "Emma Davis",
      age: 26,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Best dating app I've used! The interface is beautiful and so easy to navigate.",
      rating: 5
    }
  ]

  const stats = [
    { label: "Active Users", value: "2M+" },
    { label: "Matches Made", value: "50K+" },
    { label: "Success Stories", value: "12K+" },
    { label: "Countries", value: "25+" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  ✨ The Future of Dating
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                    Perfect Match
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Experience dating like never before with our revolutionary vertical discovery,
                  AI-powered matching, and seamless video integration.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" variant="floating" className="group">
                  <Link to="/meet">
                    Start Matching
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="love-outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                  <Link to="/profile">
                    Create Profile
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Relacio Hero"
                  className="rounded-2xl shadow-float float-animation"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 animate-love-bounce">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 animate-love-bounce" style={{ animationDelay: '1s' }}>
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="border-primary text-primary">
              Why Choose Relacio
            </Badge>
            <h2 className="text-4xl font-bold">Features That Make Love Happen</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover what makes Relacio the most advanced and user-friendly dating platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="card-glass border-0 hover:shadow-love transition-all duration-500 group">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-love-gradient rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-gradient">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-white/20 text-white border-white/30">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-white">What Our Users Say</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Real stories from real people who found love on Relacio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-glass border-border hover:shadow-love transition-all duration-500">
                <CardContent className="p-8 space-y-6">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground/90 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-foreground font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">Age {testimonial.age}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Find Your Soulmate?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join millions of users who have found meaningful connections on Relacio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="love" className="animate-glow-pulse">
              <Link to="/meet">
                Start Your Journey
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="love-outline">
              <Link to="/profile">
                Create Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}