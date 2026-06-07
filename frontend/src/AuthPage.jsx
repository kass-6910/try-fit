import { useState } from "react";
import "./AuthPage.css";
import Logo from "./Logo";

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("...");

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(`Erreur : ${data.error}`);
      } else {
        onAuthSuccess(data);
      }
    } catch (error) {
      setMessage("Backend injoignable");
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setMessage("");
  };

  return (
    <main className="auth-page">
      <Logo size="xl" className="logo--auth" />
      <h1>{mode === "login" ? "Connexion" : "Inscription"}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email@exemple.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">
          {mode === "login" ? "SE CONNECTER !!!" : "S'INSCRIRE !!!"}
        </button>
      </form>
      <button type="button" className="auth-toggle" onClick={toggleMode}>
        {mode === "login" ? "Pas de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
      </button>
      {message && <p className="auth-message">{message}</p>}
    </main>
  );
}

export default AuthPage;
