import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SearchableBookmarkList from '@/components/SearchableBookmarkList'
import LoginButton from '@/components/LoginButton'
import { ChevronLeft } from 'lucide-react'

export default async function BookmarksPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
            {/* AMBIENT BACKGROUND DECOR */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />

            {/* HEADER */}
            <header className="fixed top-0 left-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <nav className="flex items-center justify-between py-4">
                        <Link href="/dashboard" className="flex items-center gap-3 group text-gray-500 hover:text-black transition-all">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-active:scale-90 transition-all">
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="font-black text-sm uppercase tracking-widest px-1">Exit Library</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-black leading-none">
                                    {user.email?.split('@')[0]}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Active Session
                                </span>
                            </div>
                            <LoginButton user={user} />
                        </div>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 pt-28 pb-16">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="mb-12 text-center">
                        <div className="inline-block px-3 py-1 bg-blue-50 text-[#0083FF] rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-blue-100/50 mb-5 animate-bounce">
                            Manage Collection
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
                            Personal Library
                        </h1>
                        <p className="text-gray-500 font-medium text-base mt-2 max-w-xl mx-auto italic opacity-70">
                            &ldquo;Information is the currency of the modern age. Keep it organized.&rdquo;
                        </p>
                    </div>

                    <SearchableBookmarkList initialBookmarks={bookmarks || []} />
                </div>
            </main>
        </div>
    )
}
