'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function BookmarkForm() {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!url.trim()) {
            setError('URL is required')
            toast.error('URL is required')
            setLoading(false)
            return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to add bookmarks')
            toast.error('You must be logged in to add bookmarks')
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase
            .from('bookmarks')
            .insert([
                { url, title: title || url, user_id: user.id },
            ])

        if (insertError) {
            console.error('Error adding bookmark:', insertError)
            setError(insertError.message || 'Failed to add bookmark')
            toast.error(insertError.message || 'Failed to add bookmark')
        } else {
            setUrl('')
            setTitle('')
            toast.success('Bookmark added successfully!')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-white/40 backdrop-blur-xl rounded-[32px] shadow-xl shadow-blue-900/5 border border-white/60 group">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-xl bg-[#0083FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <span className="text-lg font-black">+</span>
                </div>
                <h3 className="text-xl font-black text-black tracking-tighter">Quick Add</h3>
            </div>

            <div className="flex flex-col gap-6">
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-80">URL Destination</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full rounded-[18px] border-gray-200 bg-white focus:border-[#0083FF] focus:ring-[12px] focus:ring-blue-500/10 p-4 border-2 transition-all outline-none font-bold text-sm text-black placeholder:text-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-80">Friendly Name</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Portfolio Inspo"
                            className="w-full rounded-[18px] border-gray-200 bg-white focus:border-[#0083FF] focus:ring-[12px] focus:ring-blue-500/10 p-4 border-2 transition-all outline-none font-bold text-sm text-black placeholder:text-gray-300 shadow-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50/50 backdrop-blur-sm text-red-500 p-3.5 rounded-2xl text-[11px] font-black border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto self-end px-7 py-3.5 bg-black hover:bg-[#0083FF] text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/5 hover:shadow-blue-500/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
                >
                    {loading ? 'Archiving...' : 'Add to Collection'}
                    {!loading && <span className="group-hover/btn:translate-x-1 transition-transform">→</span>}
                </button>
            </div>
        </form>
    )
}
