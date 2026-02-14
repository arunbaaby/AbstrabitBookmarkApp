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
                className="px-4 py-1.5 md:px-6 md:py-2 text-[12px] md:text-sm font-black text-red-500 bg-red-50 border border-red-100 rounded-full hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-wider"
                disabled={loading}
            >
                {loading ? '...' : 'Sign Out'}
            </button>
        )
    }

    return (
        <button
            onClick={handleLogin}
            className="px-6 py-2 text-sm font-bold text-white bg-[#0083FF] rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
            disabled={loading}
        >
            {loading ? '...' : 'Sign In'}
        </button>
    )
}
