'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'

const LandingPage = ({ initialUser }: { initialUser: any }) => {
    const router = useRouter()
    const [user, setUser] = useState(initialUser)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [showStickyCTA, setShowStickyCTA] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setUser(currentUser)
        }
        getUser()
    }, [supabase.auth])

    const handleGetStarted = () => {
        if (user) {
            router.push("/dashboard")
        } else {
            setIsLoginModalOpen(true)
        }
    }

    const handleLogin = () => {
        setIsLoginModalOpen(true)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowStickyCTA(true)
            } else {
                setShowStickyCTA(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white pt-10 md:pt-10  lg:pt-20">

            {/* HEADER */}
            <header className="fixed top-0 left-0 z-30 w-full bg-white">
                <div className="mx-4 md:mx-8 lg:mx-36">
                    <nav className="flex items-center justify-between py-4">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/images/logo5.png"
                                alt="smartbookmark Logo"
                                className="h-8 md:h-10 w-auto object-contain"
                            />
                        </Link>

                        <ul className="hidden lg:flex gap-6 items-center">
                            {user ? (
                                <>
                                    <li>
                                        <Link href="/dashboard" className="font-medium text-gray-700 hover:text-[#0083FF]">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => supabase.auth.signOut().then(() => router.refresh())}
                                            className="font-medium text-gray-700 hover:text-red-600"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button
                                        onClick={handleLogin}
                                        className="px-6 py-2 text-lg font-semibold border border-[#0083FF] text-[#0083FF] rounded-full hover:bg-blue-50 transition"
                                    >
                                        Login
                                    </button>
                                </li>
                            )}
                        </ul>

                        <div className="lg:hidden flex items-center">
                            {user ? (
                                <Link href="/dashboard" className="px-5 py-2 text-sm font-bold bg-gray-50 text-gray-700 rounded-full border border-gray-100">
                                    Dashboard
                                </Link>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="px-5 py-2 text-sm font-bold bg-[#0083FF] text-white rounded-full shadow-sm"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="w-full bg-white pt-24 md:pt-28 pb-12 md:pb-16">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-[34px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-extrabold text-black leading-[1.1] tracking-tight [word-spacing:-0.1em]">
                        A simple way to organize <br />
                        <span className="relative inline-block mt-1 text-black">
                            your bookmarks
                            <svg className="absolute left-0 -bottom-2 md:-bottom-3 w-full" height="8" viewBox="0 0 200 12" preserveAspectRatio="none">
                                <path d="M5 10 Q100 4 195 10" stroke="#0083FF" strokeWidth="12" strokeLinecap="round" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="mt-5 md:mt-6 text-[16px] md:text-[24px] text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Easily save your favorite links, manage your collection,
                        and access them from anywhere.
                    </p>

                    <div className="hidden md:flex justify-center mt-10">
                        <button
                            onClick={handleGetStarted}
                            className="bg-[#0083FF] hover:bg-blue-600 text-white font-semibold text-[20px] px-14 py-4 rounded-full shadow-lg transition active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            {/* PREVIEW IMAGE SECTION */}
            <section className="bg-white pb-14 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 flex justify-center">
                    <div className="w-full max-w-4xl rounded-3xl overflow-hidden">
                        <img
                            src="/images/heroImgBookmark.png"
                            alt="App Dashboard Preview"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="pb-8 md:pb-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="space-y-4 md:space-y-6">
                        {/* Feature 1 */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-center md:text-left">
                            <div>
                                <h3 className="text-2xl md:text-5xl font-extrabold mt-2 text-black leading-tight">
                                    Instant Organization
                                </h3>
                                <p className="mt-4 md:mt-6 text-gray-600 text-[18px] md:text-2xl leading-relaxed">
                                    Browse your saved links based on categories,
                                    tags, and search terms. Keep your digital
                                    life organized and clutter-free.
                                </p>
                            </div>
                            <div className="w-full max-w-md mx-auto aspect-square rounded-3xl flex items-center justify-center overflow-hidden">
                                <img
                                    src="/images/Bookmarks-pana.png"
                                    alt="Instant Organization"
                                    className="w-full h-full object-contain p-4 md:p-8"
                                />
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-center md:text-left">
                            <div className="w-full max-w-md mx-auto aspect-square rounded-3xl flex items-center justify-center overflow-hidden order-last md:order-first">
                                <img
                                    src="/images/Real-time Sync-rafiki.png"
                                    alt="Real-time Sync"
                                    className="w-full h-full object-contain p-4 md:p-8"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-5xl font-extrabold mt-2 text-black leading-tight">
                                    Real-time Sync
                                </h3>
                                <p className="mt-4 md:mt-6 text-gray-600 text-[18px] md:text-2xl leading-relaxed">
                                    Add a bookmark from any device and see it
                                    instantly everywhere else. Our sync engine
                                    is built for zero-latency updates.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-center md:text-left">
                            <div>
                                <h3 className="text-2xl md:text-5xl font-extrabold mt-2 text-black leading-tight">
                                    Privacy First
                                </h3>
                                <p className="mt-4 md:mt-6 text-gray-600 text-[18px] md:text-2xl leading-relaxed">
                                    Your data is your own. We use enterprise-grade
                                    security to ensure your collection remains
                                    private and accessible only to you.
                                </p>
                            </div>
                            <div className="w-full max-w-md mx-auto aspect-square rounded-3xl flex items-center justify-center overflow-hidden">
                                <img
                                    src="/images/Privacy policy-pana.png"
                                    alt="Privacy First"
                                    className="w-full h-full object-contain p-4 md:p-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-14 md:py-28 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
                        <h2 className="text-3xl md:text-6xl font-extrabold text-black">
                            How It Works
                        </h2>
                        <p className="mt-4 md:mt-6 text-gray-600 text-[18px] md:text-2xl leading-relaxed text-balance">
                            Save your favorites in just three simple steps.
                            Fast, secure, and hassle-free.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-12">
                        {[
                            { title: "Create Account", desc: "Register quickly using Google to access your dashboard.", image: "/images/Sign up-rafiki (1).png" },
                            { title: "Save Bookmarks", desc: "Add any URL instantly and manage your collection with ease.", image: "/images/Bookmarks-cuate.png" },
                            { title: "Sync Everywhere", desc: "Access your dashboard from any device in real-time.", image: "/images/Sync-rafiki.png" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl transition text-center border border-gray-100 flex flex-col items-center hover:border-[#0083FF]/30">
                                <div className="mb-4 md:mb-8 h-48 md:h-60 flex items-center justify-center">
                                    <img src={item.image} alt={item.title} className="h-full w-auto object-contain" />
                                </div>
                                <h3 className="font-extrabold text-xl md:text-3xl mb-2 md:mb-4 text-black">
                                    {i + 1}. {item.title}
                                </h3>
                                <p className="text-gray-600 text-base md:text-xl leading-relaxed px-2">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* FOOTER */}
            <footer className="bg-white border-t border-gray-200 pt-20 pb-10 text-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid gap-12 md:grid-cols-3 mb-16">
                        <div>
                            <h3 className="text-2xl font-extrabold text-black mb-4">
                                Smart Bookmark System
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                A smart and secure platform to manage your bookmarks,
                                organize your research, and stay connected with what
                                matters to you on the web.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-black mb-4">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><button onClick={handleGetStarted} className="hover:text-[#0083FF] transition text-left">Dashboard</button></li>
                                <li><button onClick={handleLogin} className="hover:text-[#0083FF] transition text-left">Get Started</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-black mb-4">Support</h4>
                            <p className="text-gray-600 mb-2">📧 support@smartbookmark.com</p>
                            <p className="text-gray-600 italic">Built for the modern web.</p>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-100 text-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                        © 2024 SmartBookmark. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* MOBILE STICKY CTA - Always Visible */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 backdrop-blur-md border-t border-gray-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button
                    onClick={handleGetStarted}
                    className="w-full bg-[#0083FF] text-white py-3 rounded-full font-black text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
                >
                    Get Started
                </button>
            </div>

            {/* DESKTOP STICKY BUTTON - Scroll Dependent */}
            {showStickyCTA && (
                <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:flex flex-col items-center gap-2 pb-8 pointer-events-none">
                    <button
                        onClick={handleGetStarted}
                        className="bg-[#0083FF] hover:bg-blue-600 text-white font-semibold text-[20px] px-14 py-4 rounded-full shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 pointer-events-auto"
                    >
                        Get Started. Right NOW →
                    </button>
                    <p className="text-sm text-gray-500 text-center font-medium uppercase tracking-tight">
                        ORGANIZE YOUR WEB. IN UNDER A MINUTE
                    </p>
                </div>
            )}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    )
}

export default LandingPage
