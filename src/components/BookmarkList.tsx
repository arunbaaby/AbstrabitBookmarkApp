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
            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p>No bookmarks yet. Add one above! 👆</p>
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
