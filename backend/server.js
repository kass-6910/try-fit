require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-in-prod";

app.use(cors());
app.use(express.json());

function signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

// Middleware : exige un token valide et expose req.userId
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Session expirée, reconnecte-toi" });
  }
}

async function ensureUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function ensureWorkoutsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workouts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const safeUser = { id: user.id, email: user.email };
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Enregistrer une séance
app.post("/api/workouts", authRequired, async (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) {
    return res.status(400).json({ error: "Nom et données requis" });
  }
  if (!Array.isArray(data.warmups) || data.warmups.length < 1) {
    return res.status(400).json({ error: "Au moins un échauffement est requis" });
  }
  if (!Array.isArray(data.exercises) || data.exercises.length < 1) {
    return res.status(400).json({ error: "Au moins un exercice est requis" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO workouts (user_id, name, data) VALUES ($1, $2, $3) RETURNING id, name, data, created_at",
      [req.userId, name, data]
    );
    res.status(201).json({ workout: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Lister les séances de l'utilisateur connecté
app.get("/api/workouts", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, data, created_at FROM workouts WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json({ workouts: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Supprimer une séance (seulement la sienne)
app.delete("/api/workouts/:id", authRequired, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Séance introuvable" });
    }
    res.json({ deleted: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", app: "Try Fit", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", app: "Try Fit", db: "unavailable" });
  }
});

app.get("/api", (_req, res) => {
  res.json({ message: "Bienvenue sur Try Fit API" });
});

ensureUsersTable()
  .then(ensureWorkoutsTable)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Bonjour jaawd");
      console.log(`Try Fit API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Impossible d'initialiser la base de données :", error.message);
    process.exit(1);
  });
