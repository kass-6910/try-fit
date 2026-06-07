import { useEffect, useState } from "react";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import WorkoutBuilder from "./WorkoutBuilder";
import WorkoutPage from "./WorkoutPage";
import { setToken, clearToken, getToken, setUnauthorizedHandler } from "./api";
import { hasRequiredWarmups } from "./data/workouts";

const STORAGE_KEY = "tryfit_user";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");

  // Restaure la session uniquement si user ET token sont présents
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const token = getToken();
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        return;
      } catch {
        /* données corrompues → on nettoie ci-dessous */
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    clearToken();
  }, []);

  // Déconnexion automatique si le backend renvoie 401 (token expiré/invalide)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearToken();
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setView("home");
    });
  }, []);

  const handleAuthSuccess = ({ token, user: userData }) => {
    setToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setView("home");
  };

  const runSession = (data) => {
    if (!hasRequiredWarmups(data)) return;
    localStorage.setItem("tryfit_session", JSON.stringify(data));
    setView("runner");
  };

  if (user) {
    if (view === "builder") {
      return (
        <WorkoutBuilder onBack={() => setView("home")} onCreate={runSession} />
      );
    }

    if (view === "runner") {
      return <WorkoutPage onBack={() => setView("home")} />;
    }

    return (
      <HomePage
        user={user}
        onLogout={handleLogout}
        onOpenWorkout={() => setView("builder")}
        onRun={runSession}
      />
    );
  }

  return <AuthPage onAuthSuccess={handleAuthSuccess} />;
}

export default App;
