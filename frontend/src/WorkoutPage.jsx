import "./WorkoutPage.css";
import Logo from "./Logo";

function WorkoutPage({ onBack }) {
  return (
    <div className="workout-page">
      <header className="workout-top">
        <Logo size="sm" className="logo--wb" />
        <button type="button" className="workout-back-btn" onClick={onBack}>
          ← Retour
        </button>
      </header>
      <iframe
        className="workout-frame"
        src="/seance-haut-du-corps.html"
        title="Circuit Haut du Corps"
      />
    </div>
  );
}

export default WorkoutPage;
