import "./WorkoutPage.css";

function WorkoutPage({ onBack }) {
  return (
    <div className="workout-page">
      <button type="button" className="workout-back-btn" onClick={onBack}>
        ← Retour
      </button>
      <iframe
        className="workout-frame"
        src="/seance-haut-du-corps.html"
        title="Circuit Haut du Corps"
      />
    </div>
  );
}

export default WorkoutPage;
