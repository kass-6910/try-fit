import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [apiMessage, setApiMessage] = useState("Connexion au backend…");
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setApiMessage(data.message))
      .catch(() => setApiMessage("Backend indisponible"));

    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <main className="app">
      <h1>Try Fit</h1>
      <p className="subtitle">React + Node.js</p>
      <div className="card">
        <p>{apiMessage}</p>
        <p className="status">
          API : <strong>{apiStatus ?? "…"}</strong>
        </p>
      </div>
    </main>
  );
}

export default App;
