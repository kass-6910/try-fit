require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Try Fit" });
});

app.get("/api", (_req, res) => {
  res.json({ message: "Bienvenue sur Try Fit API" });
});

app.listen(PORT, () => {
  console.log(`Try Fit API running on http://localhost:${PORT}`);
});
