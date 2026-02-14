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
    - Go to **Database** -> **Replication** -> **supabase_realtime** publication.
    - Toggle **ON** the switch for the `bookmarks` table.
    - Click **Save**.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## How This Project Meets the Requirements

### 1\. Google Sign-In (No Email/Password)
-   **Frontend**: The `LoginButton.tsx` component triggers `supabase.auth.signInWithOAuth({ provider: 'google' })`.
-   **Backend**: The `src/app/auth/callback/route.ts` handler processes the OAuth code from Google and exchanges it for a user session.
-   **Middleware**: `src/middleware.ts` maintains this session.

### 2\. Creating Bookmarks
-   **Frontend**: `BookmarkForm.tsx` captures user input.
-   **Backend**: Submits to Supabase via `supabase.from('bookmarks').insert(...)`.
-   **Security**: RLS policies ensure only authenticated users can insert.

### 3\. Private Bookmarks (RLS)
-   **Database**: The `bookmarks` table includes a `user_id` column.
-   **Security**: A Row Level Security policy (`Users can see their own bookmarks`) enforces strict data isolation. Even if a user tries to query all data, the database only returns their own rows.

### 4\. Real-time Updates
-   **Tech**: Uses Supabase Realtime (PostgreSQL Replication).
-   **Implementation**: `BookmarkList.tsx` subscribes to the `bookmarks` table using `supabase.channel(...)`.
-   **result**: When a bookmark is added/deleted in one tab, Supabase pushes the change to all other connected clients instantly.

### 5\. Deleting Bookmarks
-   **Frontend**: `BookmarkItem.tsx` provides a delete button.
-   **Backend**: Executes `supabase.from('bookmarks').delete().eq('id', ...)`.
-   **Security**: RLS policy (`Users can delete their own bookmarks`) prevents users from deleting others' data.

### 6\. Deployment (Vercel)
-   The project is deployed on Vercel.
-   Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are configured in the Vercel dashboard.

---

## Technical Challenges & Solutions

### Challenge 1: Visual Hierarchy & Horizontal Alignment
**Problem**: In the initial dashboard design, the "Workspace" heading was inside the same grid as the "Quick Add" form and "Recent Activity" feed. On different screen sizes, this caused the functional components to start at different vertical heights, breaking the professional "horizontal baseline."
**Solution**: I decoupled the "Workspace" header from the grid layout entirely. By placing it in its own container above the grid, I ensured that the sidebar (stats) and the main content area (form) always start at the exact same pixel-perfect vertical baseline across all resolutions.

### Challenge 2: Mobile-First UX (Persistence vs. Clutter)
**Problem**: A standard navigation header is often too small or hidden behind a hamburger menu on mobile, making the primary "Add Bookmark" action inaccessible.
**Solution**: I implemented a persistent, Any.do-style sticky bottom bar specifically for mobile devices. This bar contains the brand identity and a prominent "Get Started" button that is always within thumb-reach. To keep it clean, I used conditional rendering (`hidden md:flex`) to ensure this mobile bar never interferes with the desktop layout, which retains a traditional top-nav header.

### Challenge 3: Strategic Call-to-Action (CTA) Logic
**Problem**: The "Get Started" button needs to be intelligent. It shouldn't just be a link; it needs to check if a user is logged in and either show a Login Modal or redirect to the Dashboard seamlessly.
**Solution**: I built a unified `handleGetStarted` logic. It uses the Supabase client to check the current session. If no session exists, it triggers a sophisticated glassmorphism modal; if the user is authenticated, it performs a smooth client-side transition to `/dashboard`. This minimizes friction and keeps the user in the "flow."

### Challenge 4: Real-time subscriptions vs. Server-Side Rendering
**Problem**: Next.js App Router uses Server Components by default, but Supabase Realtime requires a persistent WebSocket connection, which must happen on the client.
**Solution**: I separated the logic. The initial data fetch happens on the server (in `page.tsx`) for SEO and fast initial load. The real-time subscription logic is placed in a client component (`BookmarkList.tsx`) that hydrates with the initial data. This gives the best of both worlds: fast first paint + real-time interactivity.

### Challenge 5: RLS Security & Data Integrity
**Problem**: Ensuring User A cannot delete User B's bookmarks even if they send a malicious API request.
**Solution**: I implemented Row Level Security (RLS) policies in the database. `using (auth.uid() = user_id)` ensures that even if someone tries to fetch or delete another user's bookmark ID, the database itself rejects the query at the engine level.
