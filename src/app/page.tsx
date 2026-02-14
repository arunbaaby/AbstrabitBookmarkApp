import { createClient } from '@/utils/supabase/server'
import LandingPage from '@/components/LandingPage'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If already logged in, we can either redirect to dashboard or show landing
  // Usually, landing pages redirect logged-in users to the dashboard.
  if (user) {
    redirect('/dashboard')
  }

  return <LandingPage initialUser={user} />
}
