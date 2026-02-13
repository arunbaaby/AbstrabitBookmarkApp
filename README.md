# Smart Bookmark App

A simple, real-time bookmark manager built with **Next.js (App Router)**, **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**.

## Features

- **Google OAuth Login**: Sign up and log in securely using Google.
- **Private Bookmarks**: Bookmarks are linked to your account and only visible to you (secured via RLS).
- **Real-time Updates**: Add or delete a bookmark in one tab, and watch it update instantly in another tab without refreshing.
- **Responsive Design**: Built with Tailwind CSS for a clean, mobile-friendly interface.

## Setup Instructions

### 1. Project Configuration

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Copy the example environment file:
    ```bash
    cp .env.local.example .env.local
    ```
    *(Note: if `.env.local.example` doesn't exist, just create `.env.local` based on the template below)*

4.  Update `.env.local` with your Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

### 2. Supabase Setup

1.  **Create a Project**: Go to [database.new](https://database.new) and create a new project.
2.  **Database Schema**: Run the SQL commands found in `schema.sql` in the **SQL Editor** of your Supabase dashboard.
3.  **Google OAuth**:
    - Go to **Authentication** -> **Providers** -> **Google**.
    - Enable it and paste your **Client ID** and **Client Secret** (from Google Cloud Console).
    - *Note: These keys are stored in Supabase. Your Next.js app does NOT need them in its `.env.local` file.*
    - Add `https://<your-project-ref>.supabase.co/auth/v1/callback` to your Google Cloud Console "Authorized redirect URIs".
4.  **Redirect URLs**:
    - Go to **Authentication** -> **URL Configuration**.
    - Add `http://localhost:3000/auth/callback` to **Redirect URLs**.
    - (After deployment) Add `https://<your-vercel-project>.vercel.app/auth/callback` as well.
4.  **Realtime**:
    - Go to **Database** -> **Replication**.
    - Toggle **ON** for the `bookmarks` table (click the generic `postgres_changes` checkbox or specifically for the table).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Technical Challenges & Solutions

### Challenge 1: Real-time subscriptions in Server Components vs Client Components
**Problem**: Next.js App Router uses Server Components by default, but Supabase Realtime requires a persistent WebSocket connection, which must happen on the client.
**Solution**: I separated the logic. The initial data fetch happens on the server (in `page.tsx`) for SEO and fast initial load. The real-time subscription logic is placed in a client component (`BookmarkList.tsx`) that hydrates with the initial data. This gives the best of both worlds: fast first paint + real-time interactivity.

### Challenge 2: Handling Authentication State
**Problem**: Syncing auth state between server (cookies) and client (local storage/memory) can be tricky in Next.js.
**Solution**: I used the `@supabase/ssr` package which simplifies cookie-based auth. I implemented `middleware.ts` to refresh sessions and ensure the server always has the latest auth token.

### Challenge 3: RLS Security
**Problem**: Ensuring User A cannot delete User B's bookmarks even if they send a malicious API request.
**Solution**: I implemented Row Level Security (RLS) policies in the database. `using (auth.uid() = user_id)` ensures that even if someone tries to fetch or delete another user's bookmark ID, the database itself rejects the query.
