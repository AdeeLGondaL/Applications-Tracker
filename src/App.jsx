import { lazy, Suspense, useEffect, useState } from "react";
import LandingPage from "@/pages/LandingPage";

const AuthPage = lazy(() => import("@/pages/AuthPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SharePage = lazy(() => import("@/pages/SharePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));

function RouteLoader() {
  return <div className="min-h-screen bg-[#F6FBFA]" aria-label="Loading" />;
}

function AuthedApp() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    let subscription;
    let active = true;

    const authTimeout = window.setTimeout(() => {
      if (active) setSession((current) => current === undefined ? null : current);
    }, 5000);

    import("@/lib/supabaseClient").then(({ supabase }) => {
      if (!active) return;
      supabase.auth.getSession().then(({ data }) => {
        window.clearTimeout(authTimeout);
        if (active) setSession(data.session ?? null);
      }).catch(() => {
        window.clearTimeout(authTimeout);
        if (active) setSession(null);
      });
      const authState = supabase.auth.onAuthStateChange((_, nextSession) => {
        if (active) setSession(nextSession);
      });
      subscription = authState.data.subscription;
    }).catch(() => {
      window.clearTimeout(authTimeout);
      if (active) setSession(null);
    });

    return () => {
      active = false;
      window.clearTimeout(authTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  if (session === undefined) return null; // loading splash

  if (session) return <Dashboard session={session} />;
  if (showAuth) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />
    );
  }
  return <LandingPage onGetStarted={() => { setShowAuth(true); setAuthMode("signin"); }} />;
}

export default function App() {
  const path = window.location.pathname;
  return (
    <Suspense fallback={<RouteLoader />}>
      {path.startsWith("/share/") ? (
        <SharePage token={path.replace("/share/", "").replace(/\/$/, "")} />
      ) : path === "/privacy" || path === "/privacy/" ? (
        <PrivacyPage />
      ) : (
        <AuthedApp />
      )}
    </Suspense>
  );
}
