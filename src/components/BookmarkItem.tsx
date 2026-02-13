'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return

        setDeleting(true)
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', bookmark.id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Failed to delete bookmark')
            setDeleting(false)
        } else {
            router.refresh()
        }
    }

    return (
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="overflow-hidden mr-4">
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 truncate block text-lg"
                >
                    {bookmark.title || bookmark.url}
                </a>
                <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
            </div>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}
