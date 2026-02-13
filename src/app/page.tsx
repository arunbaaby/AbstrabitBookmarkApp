import { createClient } from '@/utils/supabase/server'
import LoginButton from '@/components/LoginButton'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark } from '@/components/BookmarkItem'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let bookmarks: Bookmark[] = []

  if (user) {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      bookmarks = data as Bookmark[]
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📑 Smart Bookmarks
          </h1>
          <LoginButton user={user} />
        </div>

        {user ? (
          <div className="space-y-8">
            <BookmarkForm />
            <BookmarkList initialBookmarks={bookmarks} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2">Welcome to your personal bookmark manager</h2>
            <p className="text-gray-600 mb-6">Sign in to start saving your favorite links.</p>
            {/* The login button is already in the header, but could be repeated here or just guide users */}
            <p className="text-sm text-gray-400">Secure, private, and real-time.</p>
          </div>
        )}
      </div>
    </main>
  )
}
