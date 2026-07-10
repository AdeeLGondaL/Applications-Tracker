import { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import LandingPage from "@/pages/LandingPage";
import { trackEvent } from "@/utils/analytics";

const AuthPage = lazy(() => import("@/pages/AuthPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SharePage = lazy(() => import("@/pages/SharePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));

function RouteLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F6FBFA]" role="status" aria-label="Loading Applume">
      <div className="flex animate-pulse items-center gap-3">
        <img src="/Logo.png" alt="" className="h-12 w-12 object-contain" style={{ mixBlendMode: "multiply" }} />
        <span className="text-2xl font-black tracking-tight">
          <span className="text-[#17312E]">App</span><span className="text-[#009966]">lume</span>
        </span>
      </div>
    </div>
  );
}

// Synchronous first guess so anonymous visitors get the landing page
// immediately (and the server renders it during prerendering) instead of
// waiting up to 5 s for the auth check. A stored Supabase token means
// "probably signed in" -> show the splash while the session is verified.
function initialSessionState() {
  if (typeof window === "undefined") return null; // prerender as signed-out
  try {
    const hasToken = Object.keys(window.localStorage).some(
      (key) => key.startsWith("sb-") && key.includes("-auth-token")
    );
    return hasToken ? undefined : null;
  } catch {
    return undefined;
  }
}

function useSession() {
  const [session, setSession] = useState(initialSessionState); // undefined = loading

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

  return session;
}

function AuthRoute({ mode, session }) {
  const [, navigate] = useLocation();
  if (session === undefined) return <RouteLoader />;
  if (session) return <Redirect to="/app" replace />;
  return (
    <AuthPage
      mode={mode}
      onModeChange={(next) => navigate(next === "signup" ? "/signup" : "/signin", { replace: true })}
      onClose={() => navigate("/")}
    />
  );
}

export default function App() {
  const session = useSession();
  const [location, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Suspense fallback={<RouteLoader />}>
      <Switch>
        <Route path="/share/:token">{(params) => <SharePage token={params.token} />}</Route>
        <Route path="/privacy"><PrivacyPage /></Route>
        <Route path="/terms"><TermsPage /></Route>
        <Route path="/reset"><ResetPasswordPage /></Route>
        <Route path="/signin"><AuthRoute mode="signin" session={session} /></Route>
        <Route path="/signup"><AuthRoute mode="signup" session={session} /></Route>
        <Route path="/app">
          {session === undefined ? (
            <RouteLoader />
          ) : session ? (
            <Dashboard session={session} />
          ) : (
            <Redirect to="/signin" replace />
          )}
        </Route>
        <Route path="/">
          {session === undefined ? (
            <RouteLoader />
          ) : session ? (
            <Redirect to="/app" replace />
          ) : (
            <LandingPage onGetStarted={() => { trackEvent("cta_get_started_clicked"); navigate("/signup"); }} />
          )}
        </Route>
        <Route><Redirect to="/" replace /></Route>
      </Switch>
    </Suspense>
  );
}
