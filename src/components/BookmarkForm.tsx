'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
            setLoading(false)
            return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to add bookmarks')
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
        } else {
            setUrl('')
            setTitle('')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Bookmark</h3>
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Site"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                >
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </div>
        </form>
    )
}
