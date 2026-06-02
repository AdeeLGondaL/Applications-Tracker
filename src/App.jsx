import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import SharePage from "@/pages/SharePage";
import PrivacyPage from "@/pages/PrivacyPage";

function AuthedApp() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // loading splash

  if (session) return <Dashboard session={session} />;
  if (showAuth) return <AuthPage mode={authMode} onModeChange={setAuthMode} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />;
  return <LandingPage onGetStarted={() => { setShowAuth(true); setAuthMode("signin"); }} />;
}

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith("/share/")) {
    const token = path.replace("/share/", "").replace(/\/$/, "");
    return <SharePage token={token} />;
  }
  if (path === "/privacy" || path === "/privacy/") {
    return <PrivacyPage />;
  }
  return <AuthedApp />;
}
