'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import BookmarkItem, { Bookmark } from './BookmarkItem'

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20 px-8 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-6 opacity-20">📑</div>
                <h3 className="text-xl font-bold text-black mb-2">No bookmarks yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                    Your collection is currently empty. Start by adding a new link above!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
        </div>
    )
}
