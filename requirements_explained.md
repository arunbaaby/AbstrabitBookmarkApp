# How This Project Meets the Requirements

This document explains, step-by-step, how the **Smart Bookmark App** architecture and code fulfill each of the requirements provided.

## 1. Requirement: "User can sign up and log in using Google (no email/password — Google OAuth only)"

### Implementation:
-   **Frontend**: The **`src/components/LoginButton.tsx`** component uses `supabase.auth.signInWithOAuth({ provider: 'google' })`. This triggers a browser redirect to Google's sign-in page.
-   **Backend**: When Google redirects back, the request hits **`src/app/auth/callback/route.ts`**. This route handler takes the `code` from the URL, exchanges it for a secure user session, and sets a cookie.
-   **Middleware**: **`src/middleware.ts`** runs on every request to refresh this session, keeping the user logged in as they navigate.

## 2. Requirement: "A logged-in user can add a bookmark (URL + title)"

### Implementation:
-   **Frontend**: The **`src/components/BookmarkForm.tsx`** component contains the input fields.
-   **Logic**: When the user clicks "Add", the component calls `supabase.from('bookmarks').insert(...)`.
-   **Security**: Before sending, the component checks if a user is logged in. The database also enforces this via Row Level Security (RLS) policies.

## 3. Requirement: "Bookmarks are private to each user (User A cannot see User B's bookmarks)"

### Implementation:
-   **Database Schema**: The `bookmarks` table has a **`user_id`** column that links every bookmark to a specific user.
-   **Row Level Security (RLS)**: We enabled RLS on the table and added this specific policy:
    ```sql
    create policy "Users can see their own bookmarks"
    on bookmarks for select
    using ( auth.uid() = user_id );
    ```
    This means the database itself filters the data. Even if the frontend code tried to fetch "all bookmarks", the database would only return rows belonging to the current user.

## 4. Requirement: "Bookmark list updates in real-time without page refresh"

### Implementation:
-   **Feature**: We use **Supabase Realtime**.
-   **Frontend**: The **`src/components/BookmarkList.tsx`** component sets up a subscription:
    ```typescript
    supabase.channel('realtime bookmarks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, ...)
      .subscribe()
    ```
-   **Flow**:
    1.  User adds a bookmark in Tab A.
    2.  Supabase Database detects the `INSERT`.
    3.  Supabase pushes a notification to Tab B.
    4.  Tab B updates its state instantly to show the new bookmark.

## 5. Requirement: "User can delete their own bookmarks"

### Implementation:
-   **Frontend**: The **`src/components/BookmarkItem.tsx`** component has a delete button (trash icon).
-   **Logic**: Clicking it calls `supabase.from('bookmarks').delete().eq('id', bookmark.id)`.
-   **Security**: The RLS policy `Users can delete their own bookmarks` ensures a user can only delete rows where `user_id` matches their own ID.

## 6. Requirement: "App must be deployed on Vercel with a working live URL"

### Implementation:
-   **Deploy Ready**: The codebase is standard Next.js, fully compatible with Vercel.
-   **Configuration**: The app relies on environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) which are configured in the Vercel dashboard during deployment.

## 7. Tech Stack used

-   **Next.js (App Router)**: We used the `src/app` directory structure, `page.tsx` for pages, and `route.ts` for API routes.
-   **Supabase**: Used for Auth (Google), Database (Postgres), and Realtime subscriptions.
-   **Tailwind CSS**: Used for all styling (utility classes like `flex`, `p-4`, `bg-blue-600` in the components).
