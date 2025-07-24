import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    hasCompletedProfile?: boolean
}

export interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const userData = localStorage.getItem('relacio_user')
                if (userData) {
                    const parsedUser = JSON.parse(userData)
                    setUser(parsedUser)
                }
            } catch (error) {
                console.error('Error loading user data:', error)
                localStorage.removeItem('relacio_user')
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true)

        try {
            // Simulate API call - you'll replace this with actual API call later
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock user data - replace with actual API response
            const mockUser: User = {
                id: '1',
                email,
                name: email.split('@')[0], // Extract name from email for now
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                hasCompletedProfile: false
            }

            setUser(mockUser)
            localStorage.setItem('relacio_user', JSON.stringify(mockUser))

            return { success: true }
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' }
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true)

        try {
            // Simulate API call - you'll replace this with actual API call later
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock user data - replace with actual API response
            const mockUser: User = {
                id: Date.now().toString(),
                email,
                name,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                hasCompletedProfile: false
            }

            setUser(mockUser)
            localStorage.setItem('relacio_user', JSON.stringify(mockUser))

            return { success: true }
        } catch (error) {
            return { success: false, error: 'Registration failed. Please try again.' }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('relacio_user')
    }

    const updateUserProfile = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem('relacio_user', JSON.stringify(updatedUser))
        }
    }

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


