import { createClient } from '@/utils/supabase/server'
import LoginButton from '@/components/LoginButton'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark } from '@/components/BookmarkItem'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Fetch total count
    const { count: totalCount } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Fetch recent 5 for display
    const { data: recentData } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch count of links added today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: addedToday } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())

    const bookmarks = (recentData || []) as Bookmark[]

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
            {/* AMBIENT BACKGROUND DECOR */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            {/* DASHBOARD HEADER */}
            <header className="fixed top-0 left-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <nav className="flex items-center justify-between py-4">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/images/logo5.png"
                                alt="smartbookmark Logo"
                                className="h-6 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        </Link>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-black leading-none">
                                    {user.email?.split('@')[0]}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Free Account
                                </span>
                            </div>
                            <LoginButton user={user} />
                        </div>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-16">
                <div className="max-w-[1300px] mx-auto px-6 md:px-10">
                    {/* WORKSPACE HEADER - Moved outside grid for alignment */}
                    <header className="mb-10 text-center lg:text-left">
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none mt-4 md:mt-0">
                                Workspace
                            </h1>
                            <p className="text-gray-500 font-medium text-sm opacity-60">Manage your collection efficiently.</p>
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">

                        {/* LEFT SIDEBAR / STATS */}
                        <aside className="space-y-6 hidden lg:block sticky top-24">
                            <div className="bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-xl shadow-blue-900/5">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 px-1 opacity-60 text-center">Statistics</h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-white rounded-[24px] shadow-sm border border-gray-100/50 group hover:border-[#0083FF]/30 transition-all cursor-default text-center">
                                        <div className="text-3xl font-black text-black group-hover:text-[#0083FF] transition-colors leading-none tracking-tight">{totalCount || 0}</div>
                                        <div className="text-[9px] font-black text-gray-400 mt-1.5 uppercase tracking-widest">Total Links</div>
                                    </div>
                                    <div className="p-5 bg-white rounded-[24px] shadow-sm border border-gray-100/50 group hover:border-[#0083FF]/30 transition-all cursor-default text-center">
                                        <div className="text-3xl font-black text-black group-hover:text-[#0083FF] transition-colors leading-none tracking-tight">{addedToday || 0}</div>
                                        <div className="text-[9px] font-black text-gray-400 mt-1.5 uppercase tracking-widest">Added Today</div>
                                    </div>
                                    <Link
                                        href="/bookmarks"
                                        className="inline-flex items-center justify-center gap-3 w-full py-3.5 px-6 bg-black text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10 group/lib"
                                    >
                                        <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center group-hover/lib:rotate-12 transition-transform">
                                            <Search size={14} />
                                        </div>
                                        Manage Library
                                    </Link>
                                </div>
                            </div>

                            <div className="px-5 py-4 bg-[#0083FF]/5 rounded-[24px] border border-[#0083FF]/10 backdrop-blur-sm">
                                <p className="text-[9px] font-black uppercase tracking-wider text-[#0083FF]/60 leading-relaxed text-center">
                                    {totalCount && totalCount > 10 ? 'Collection growing fast!' : 'Start building your library'}
                                </p>
                            </div>
                        </aside>

                        {/* MAIN CONTENT AREA */}
                        <div className="space-y-10">
                            <section className="scroll-mt-24">
                                <BookmarkForm />
                            </section>

                            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-xl font-black text-black flex items-center gap-2.5">
                                        Recent Activity
                                        <span className="text-[9px] font-black uppercase text-[#0083FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
                                            Top 5
                                        </span>
                                    </h2>
                                    <Link
                                        href="/bookmarks"
                                        className="hidden md:flex text-[11px] font-black uppercase tracking-widest text-[#0083FF] hover:text-blue-700 items-center gap-1 group transition-colors"
                                    >
                                        View Library
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                                <BookmarkList initialBookmarks={bookmarks} />
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
