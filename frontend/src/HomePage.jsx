import { useEffect, useState } from "react";
import "./HomePage.css";
import { apiFetch } from "./api";
import { hasRequiredWarmups } from "./data/workouts";

function HomePage({ onLogout, onOpenWorkout, onRun }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [runError, setRunError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch("/api/workouts")
      .then((res) => (res.ok ? res.json() : { workouts: [] }))
      .then((data) => {
        if (active) setWorkouts(data.workouts || []);
      })
      .catch(() => {
        if (active) setError("Impossible de charger tes séances");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRun = (data) => {
    if (!hasRequiredWarmups(data)) {
      setRunError("Cette séance n'a pas d'échauffement. Recrée-la avec au moins 1 exercice d'échauffement.");
      return;
    }
    setRunError("");
    onRun(data);
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiFetch(`/api/workouts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setWorkouts((list) => list.filter((w) => w.id !== id));
      }
    } catch {
      /* on garde la séance affichée si la suppression échoue */
    }
  };

  return (
    <main className="home-page">
      <header className="home-header">
        <h1>Try Fit</h1>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <button type="button" className="kassim-btn" onClick={onOpenWorkout}>
        + Créer une séance
      </button>

      <section className="saved">
        <h2 className="saved-title">Mes séances</h2>

        {loading && <p className="saved-empty">Chargement…</p>}
        {!loading && error && <p className="saved-empty">{error}</p>}
        {!loading && !error && workouts.length === 0 && (
          <p className="saved-empty">
            Aucune séance enregistrée pour l'instant. Crée ta première séance 💪
          </p>
        )}
        {runError && <p className="saved-empty saved-error">{runError}</p>}

        <div className="saved-list">
          {workouts.map((w) => (
            <div key={w.id} className="saved-card">
              <button
                type="button"
                className="saved-main"
                onClick={() => handleRun(w.data)}
              >
                <span className="saved-name">{w.name}</span>
                <span className="saved-meta">
                  {w.data?.title} · {w.data?.warmups?.length || 0} échauff. ·{" "}
                  {w.data?.exercises?.length || 0} exos · {w.data?.rounds || 1} rounds
                </span>
              </button>
              <button
                type="button"
                className="saved-del"
                onClick={() => handleDelete(w.id)}
                aria-label={`Supprimer ${w.name}`}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
