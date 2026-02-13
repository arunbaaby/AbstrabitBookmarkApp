'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginButton({ user }: { user: any }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Error logging in:', error)
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error logging out:', error)
        }
        router.refresh()
        setLoading(false)
    }

    if (user) {
        return (
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Logging out...' : 'Sign Out'}
            </button>
        )
    }

    return (
        <button
            onClick={handleLogin}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
        >
            {loading ? 'Logging in...' : 'Sign in with Google'}
        </button>
    )
}
