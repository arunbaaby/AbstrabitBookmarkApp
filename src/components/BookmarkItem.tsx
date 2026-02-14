'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

export interface Bookmark {
    id: string
    url: string
    title: string
    created_at: string
}

export default function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    const [deleting, setDeleting] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const performDelete = async () => {
        setDeleting(true)
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', bookmark.id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            toast.error('Failed to delete bookmark')
            setDeleting(false)
        } else {
            toast.success('Bookmark deleted successfully')
            router.refresh()
        }
    }

    const handleDelete = () => {
        toast('Remove this bookmark?', {
            description: bookmark.title || bookmark.url,
            action: {
                label: 'Remove',
                onClick: () => performDelete(),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { },
            },
        })
    }

    return (
        <div className="group flex justify-between items-center p-4 bg-white/60 backdrop-blur-md rounded-[24px] border border-white/60 hover:border-[#0083FF]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
            <div className="overflow-hidden mr-3 flex items-center gap-4">
                <div className="hidden sm:flex h-12 w-12 rounded-[18px] bg-white shadow-sm border border-gray-100/50 items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300">🔗</span>
                </div>
                <div className="min-w-0">
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-black text-black hover:text-[#0083FF] truncate block text-[17px] transition-colors mb-0.5 tracking-tight"
                    >
                        {bookmark.title || bookmark.url}
                    </a>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-[#0083FF]/40" />
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.1em] truncate opacity-60">
                            {new URL(bookmark.url).hostname.replace('www.', '')}
                        </p>
                    </div>
                </div>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-gray-400 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 transition-all active:scale-90 disabled:opacity-50 opacity-60 hover:opacity-100"
                title="Delete"
            >
                <X size={18} strokeWidth={2.5} />
            </button>
        </div>
    )
}
