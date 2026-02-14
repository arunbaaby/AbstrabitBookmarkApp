'use client'

import { createClient } from '@/utils/supabase/client'
import { X } from 'lucide-react'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Branding */}
                <div className="w-full md:w-1/2 bg-[#FBFBFB] p-12 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Dot Pattern Decoration */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <img src="/images/logo5.png" alt="Smart Bookmark" className="h-10 mb-8" />
                        <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">
                            Organize <br />
                            it all <span className="inline-block w-4 h-4 rounded-full bg-[#0083FF]"></span>
                        </h2>
                    </div>
                </div>

                {/* Right Side: Login */}
                <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center bg-white">
                    <div className="w-full max-w-xs space-y-8">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">Welcome Back</h3>
                            <p className="text-sm text-gray-500">Sign in to sync your bookmarks</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-[#0083FF] hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full transition-all shadow-md active:scale-[0.98]"
                        >
                            <div className="bg-white p-1 rounded-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-[17px]">Continue with Google</span>
                                <span className="text-[10px] font-normal opacity-80 uppercase tracking-wider">Secured log-in</span>
                            </div>
                        </button>

                        <div className="pt-8 text-center text-[11px] text-gray-400">
                            By using Smart Bookmark you accept our <br />
                            <a href="#" className="underline hover:text-[#0083FF]">Terms of Service</a> and <a href="#" className="underline hover:text-[#0083FF]">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
