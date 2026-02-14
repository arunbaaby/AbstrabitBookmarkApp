'use client'

import { useState, useMemo } from 'react'
import BookmarkItem, { Bookmark } from './BookmarkItem'
import { Search, ArrowUpDown, Calendar, Type } from 'lucide-react'

export default function SearchableBookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    const filteredAndSortedBookmarks = useMemo(() => {
        let result = [...initialBookmarks]

        // Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(b =>
                b.title?.toLowerCase().includes(query) ||
                b.url.toLowerCase().includes(query)
            )
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.created_at).getTime()
                const dateB = new Date(b.created_at).getTime()
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
            } else {
                const titleA = (a.title || a.url).toLowerCase()
                const titleB = (b.title || b.url).toLowerCase()
                return sortOrder === 'desc'
                    ? titleB.localeCompare(titleA)
                    : titleA.localeCompare(titleB)
            }
        })

        return result
    }, [initialBookmarks, searchQuery, sortBy, sortOrder])

    return (
        <div className="space-y-10">
            {/* SEARCH & SORT CONTROLS */}
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/60 shadow-xl shadow-blue-900/5">
                <div className="relative w-full xl:max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0083FF] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search your collection..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-5 py-3 bg-white/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-[#0083FF] focus:ring-[10px] focus:ring-blue-500/5 outline-none transition-all font-bold text-sm text-black placeholder:text-gray-300"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full xl:w-auto">
                    <div className="flex bg-white/50 p-1.5 rounded-[20px] border border-white/60 backdrop-blur-sm shadow-inner">
                        <button
                            onClick={() => {
                                if (sortBy === 'date') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
                                setSortBy('date')
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${sortBy === 'date'
                                ? 'bg-white text-[#0083FF] shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Calendar size={13} />
                            Date
                            {sortBy === 'date' && (
                                <ArrowUpDown size={12} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                if (sortBy === 'title') setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
                                setSortBy('title')
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${sortBy === 'title'
                                ? 'bg-white text-[#0083FF] shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Type size={13} />
                            Title
                            {sortBy === 'title' && (
                                <ArrowUpDown size={12} className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* RESULTS */}
            <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {filteredAndSortedBookmarks.length > 0 ? (
                    filteredAndSortedBookmarks.map((bookmark) => (
                        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                    ))
                ) : (
                    <div className="text-center py-24 bg-white/30 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-white/60">
                        <div className="flex justify-center mb-5 opacity-15">
                            <Search size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-black text-black mb-1.5 tracking-tight">No matches found</h3>
                        <p className="text-gray-400 font-medium text-sm">Try different keywords or filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
