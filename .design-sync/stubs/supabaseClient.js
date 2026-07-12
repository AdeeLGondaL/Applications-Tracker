// design-sync stub for @/lib/supabaseClient.
// The real client throws at module load when VITE_SUPABASE_* env vars are
// absent (they never are in the design-preview bundle) and drags @supabase/
// supabase-js (~196KB) into every component bundle. Design previews never talk
// to Supabase, so this no-op stand-in keeps the graph loadable and lean.
// Methods return empty/inert results so any code path reached at render is safe.
const noSession = async () => ({ data: { session: null }, error: null });
const noUser = async () => ({ data: { user: null }, error: null });

export const supabase = {
  auth: {
    getSession: noSession,
    getUser: noUser,
    signInWithPassword: async () => ({ data: {}, error: null }),
    signUp: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
  },
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: [], error: null }),
    update: async () => ({ data: [], error: null }),
    delete: async () => ({ data: [], error: null }),
  }),
};
