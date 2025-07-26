import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/services/authService'
import socketService from '@/services/socketService'

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
            const response = await authAPI.login({ email, password })
            
            if (response.success) {
                const user: User = {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    name: response.data.user.name,
                    avatar: '', // Will be loaded from profile
                    hasCompletedProfile: response.data.user.hasCompletedProfile
                }

                setUser(user)
                localStorage.setItem('relacio_user', JSON.stringify(user))
                localStorage.setItem('authToken', response.data.token)

                // Initialize socket connection
                socketService.initialize(response.data.token)

                return { success: true }
            } else {
                return { success: false, error: response.error || 'Login failed' }
            }
        } catch (error: unknown) {
            console.error('Login error:', error)
            
            // Handle different types of errors
            const axiosError = error as { response?: { status?: number; data?: { message?: string; errors?: { msg: string }[] } }; message?: string }
            
            if (axiosError?.response?.status === 429) {
                return { success: false, error: 'Too many login attempts. Please wait a few minutes before trying again.' }
            } else if (axiosError?.response?.status === 401) {
                return { success: false, error: 'Invalid email or password. Please check your credentials.' }
            } else if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.errors?.[0]?.msg
                return { success: false, error: errorMessage || 'Please check your input and try again.' }
            } else if (axiosError?.response?.data?.message) {
                return { success: false, error: axiosError.response.data.message }
            } else if (axiosError?.message) {
                return { success: false, error: axiosError.message }
            }
            
            return { success: false, error: 'Login failed. Please try again.' }
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true)

        try {
            const response = await authAPI.register({ 
                email, 
                password, 
                confirmPassword: password,
                name 
            })
            
            if (response.success) {
                const user: User = {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    name: response.data.user.name,
                    avatar: '',
                    hasCompletedProfile: response.data.user.hasCompletedProfile
                }

                setUser(user)
                localStorage.setItem('relacio_user', JSON.stringify(user))
                localStorage.setItem('authToken', response.data.token)

                // Initialize socket connection
                socketService.initialize(response.data.token)

                return { success: true }
            } else {
                return { success: false, error: response.error || 'Registration failed' }
            }
        } catch (error: unknown) {
            console.error('Registration error:', error)
            
            // Handle different types of errors
            const axiosError = error as { response?: { status?: number; data?: { message?: string; errors?: { msg: string }[] } }; message?: string }
            
            if (axiosError?.response?.status === 429) {
                return { success: false, error: 'Too many registration attempts. Please wait a few minutes before trying again.' }
            } else if (axiosError?.response?.status === 409) {
                return { success: false, error: 'An account with this email already exists. Please try logging in instead.' }
            } else if (axiosError?.response?.status === 400) {
                const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.errors?.[0]?.msg
                return { success: false, error: errorMessage || 'Please check your input and try again.' }
            } else if (axiosError?.response?.data?.message) {
                return { success: false, error: axiosError.response.data.message }
            } else if (axiosError?.message) {
                return { success: false, error: axiosError.message }
            }
            
            return { success: false, error: 'Registration failed. Please try again.' }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('relacio_user')
        localStorage.removeItem('authToken')
        socketService.disconnect()
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


