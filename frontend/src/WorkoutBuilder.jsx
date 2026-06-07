import { useState } from "react";
import "./WorkoutBuilder.css";
import Logo from "./Logo";
import { CATEGORIES, WARMUPS, EXERCISES, MIN_WARMUPS, hasRequiredWarmups } from "./data/workouts";
import { apiFetch } from "./api";

function ExerciseRow({ item, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`wb-row${selected ? " selected" : ""}`}
      onClick={onToggle}
    >
      <span className="wb-row-emoji">{item.emoji}</span>
      <span className="wb-row-info">
        <span className="wb-row-name">{item.name}</span>
        <span className="wb-row-detail">{item.detail}</span>
      </span>
      <span className="wb-row-check">{selected ? "✓" : "+"}</span>
    </button>
  );
}

function WorkoutBuilder({ onBack, onCreate }) {
  const [category, setCategory] = useState("haut");
  const [warmups, setWarmups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [rounds, setRounds] = useState(4);
  const [restBetween, setRestBetween] = useState(15);
  const [restRounds, setRestRounds] = useState(60);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const exerciseList = EXERCISES[category];

  const toggle = (list, setList, id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const changeCategory = (id) => {
    setCategory(id);
    setExercises([]); // le catalogue change selon la catégorie
  };

  const buildSession = () => {
    const cat = CATEGORIES.find((c) => c.id === category);
    return {
      title: cat.label,
      category,
      warmups: WARMUPS.filter((w) => warmups.includes(w.id)),
      exercises: exerciseList.filter((e) => exercises.includes(e.id)),
      rounds,
      restBetween,
      restRounds,
    };
  };

  const handleCreate = () => {
    if (exercises.length === 0 || !hasRequiredWarmups(buildSession())) return;
    onCreate(buildSession());
  };

  const handleSave = async () => {
    const session = buildSession();
    if (exercises.length === 0 || !name.trim() || !hasRequiredWarmups(session)) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/workouts", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          data: buildSession(),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setSaveMsg(`Erreur : ${d.error || "échec de l'enregistrement"}`);
      } else {
        setSaveMsg(`✓ « ${name.trim()} » enregistrée`);
        setName("");
      }
    } catch {
      setSaveMsg("Backend injoignable");
    } finally {
      setSaving(false);
    }
  };

  const hasExercises = exercises.length > 0;
  const hasWarmups = warmups.length >= MIN_WARMUPS;
  const canStart = hasExercises && hasWarmups;
  const canSave = canStart && name.trim().length > 0;

  const formatRest = (s) =>
    s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `${s}s`;

  return (
    <div className="wb">
      <header className="wb-header">
        <button type="button" className="wb-back" onClick={onBack}>
          ←
        </button>
        <Logo size="sm" className="logo--wb" />
        <h1>Crée ta séance</h1>
      </header>

      <div className="wb-scroll">
        <section className="wb-section">
          <p className="wb-section-title">Nom de la séance</p>
          <input
            className="wb-name"
            type="text"
            placeholder="Ex : Haut du corps lundi"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
          />
        </section>

        <section className="wb-section">
          <p className="wb-section-title">Type de séance</p>
          <div className="wb-cats">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`wb-cat${category === c.id ? " active" : ""}`}
                onClick={() => changeCategory(c.id)}
              >
                <span className="wb-cat-emoji">{c.emoji}</span>
                <span className="wb-cat-label">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="wb-section">
          <p className="wb-section-title">
            Échauffement
            <span className="wb-required">obligatoire</span>
            <span className="wb-count">{warmups.length}</span>
          </p>
          {!hasWarmups && (
            <p className="wb-hint">Choisis au moins {MIN_WARMUPS} exercice d&apos;échauffement.</p>
          )}
          <div className="wb-list">
            {WARMUPS.map((w) => (
              <ExerciseRow
                key={w.id}
                item={w}
                selected={warmups.includes(w.id)}
                onToggle={() => toggle(warmups, setWarmups, w.id)}
              />
            ))}
          </div>
        </section>

        <section className="wb-section">
          <p className="wb-section-title">
            Exercices
            <span className="wb-count">{exercises.length}</span>
          </p>
          <div className="wb-list">
            {exerciseList.map((e) => (
              <ExerciseRow
                key={e.id}
                item={e}
                selected={exercises.includes(e.id)}
                onToggle={() => toggle(exercises, setExercises, e.id)}
              />
            ))}
          </div>
        </section>

        <section className="wb-section">
          <p className="wb-section-title">Rounds (tours du circuit)</p>
          <div className="wb-stepper">
            <button
              type="button"
              className="wb-step-btn"
              onClick={() => setRounds((r) => Math.max(1, r - 1))}
            >
              –
            </button>
            <span className="wb-step-val">{rounds}</span>
            <button
              type="button"
              className="wb-step-btn"
              onClick={() => setRounds((r) => Math.min(8, r + 1))}
            >
              +
            </button>
          </div>
        </section>

        <section className="wb-section">
          <p className="wb-section-title">Temps de repos</p>
          <div className="wb-rest-row">
            <span className="wb-rest-label">Entre exercices</span>
            <div className="wb-stepper wb-stepper-sm">
              <button
                type="button"
                className="wb-step-btn"
                onClick={() => setRestBetween((s) => Math.max(0, s - 5))}
              >
                –
              </button>
              <span className="wb-step-val">{formatRest(restBetween)}</span>
              <button
                type="button"
                className="wb-step-btn"
                onClick={() => setRestBetween((s) => Math.min(120, s + 5))}
              >
                +
              </button>
            </div>
          </div>
          <div className="wb-rest-row">
            <span className="wb-rest-label">Entre rounds</span>
            <div className="wb-stepper wb-stepper-sm">
              <button
                type="button"
                className="wb-step-btn"
                onClick={() => setRestRounds((s) => Math.max(0, s - 15))}
              >
                –
              </button>
              <span className="wb-step-val">{formatRest(restRounds)}</span>
              <button
                type="button"
                className="wb-step-btn"
                onClick={() => setRestRounds((s) => Math.min(300, s + 15))}
              >
                +
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="wb-footer">
        {saveMsg && <p className="wb-savemsg">{saveMsg}</p>}
        <div className="wb-actions">
          <button
            type="button"
            className="wb-save"
            disabled={!canSave || saving}
            onClick={handleSave}
          >
            {saving ? "…" : "Enregistrer"}
          </button>
          <button
            type="button"
            className="wb-create"
            disabled={!canStart}
            onClick={handleCreate}
          >
            {!hasWarmups
              ? "Ajoute un échauffement"
              : !hasExercises
                ? "Choisis un exercice"
                : `Démarrer · ${warmups.length} échauff. · ${exercises.length} exo${exercises.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default WorkoutBuilder;
