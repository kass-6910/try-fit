// =============================================================
// TryFit — Tableau de bord Admin (Web)
// React (compatible Vite / Create React App)
//
// Dépendances : npm install lucide-react
// Polices : chargées via Google Fonts dans le <style> ci-dessous
//   ⚙️ Exo 2     → titres, sous-titres, boutons, corps de texte
//   ⚙️ Rajdhani  → chiffres et statistiques
// =============================================================

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  DoorOpen,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Flame,
  QrCode,
} from 'lucide-react';

// ----- Données mockées (à remplacer par l'API du back) -----
const KPIS = [
  {
    id: 'membres',
    label: 'Membres actifs',
    value: '248',
    trend: '+12 ce mois',
    trendUp: true,
    icon: Users,
  },
  {
    id: 'presents',
    label: 'Présents actuellement',
    value: '32',
    trend: 'Pic à 18h hier',
    trendUp: true,
    icon: Flame,
  },
  {
    id: 'revenus',
    label: 'Revenus du mois',
    value: '12 480 €',
    trend: '+8,2 % vs mai',
    trendUp: true,
    icon: CreditCard,
  },
  {
    id: 'cours',
    label: "Cours aujourd'hui",
    value: '8',
    trend: '2 complets',
    trendUp: false,
    icon: CalendarDays,
  },
];

// Fréquentation par tranche horaire (aujourd'hui)
const FREQUENTATION = [
  { heure: '6h', valeur: 8 },
  { heure: '8h', valeur: 22 },
  { heure: '10h', valeur: 15 },
  { heure: '12h', valeur: 28 },
  { heure: '14h', valeur: 12 },
  { heure: '16h', valeur: 19 },
  { heure: '18h', valeur: 42 },
  { heure: '20h', valeur: 31 },
  { heure: '22h', valeur: 9 },
];

// Derniers passages au scanner QR (déverrouillage portes)
const DERNIERS_ACCES = [
  { nom: 'Gouacem B.', heure: '14:12', porte: 'Entrée principale', ok: true },
  { nom: 'Sarah L.', heure: '14:05', porte: 'Entrée principale', ok: true },
  { nom: 'Karim D.', heure: '13:58', porte: 'Studio cours', ok: true },
  { nom: 'Julie M.', heure: '13:51', porte: 'Entrée principale', ok: false },
  { nom: 'Thomas R.', heure: '13:47', porte: 'Entrée principale', ok: true },
];

const PROCHAINS_COURS = [
  { nom: 'CrossFit', heure: '15:00', coach: 'Mehdi', places: '12/15' },
  { nom: 'Yoga Flow', heure: '17:00', coach: 'Claire', places: '8/12' },
  { nom: 'Boxe', heure: '18:30', coach: 'Karim', places: '15/15' },
  { nom: 'HIIT', heure: '20:00', coach: 'Mehdi', places: '9/20' },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'membres', label: 'Membres', icon: Users },
  { id: 'cours', label: 'Cours & Planning', icon: CalendarDays },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'acces', label: 'Accès & Portes', icon: DoorOpen },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const maxFreq = Math.max(...FREQUENTATION.map((f) => f.valeur));

  return (
    <div className="tf-root">
      <style>{css}</style>

      {/* ---------- Sidebar ---------- */}
      <aside className="tf-sidebar">
        <div className="tf-logo">
          <span className="tf-logo-try">TRY</span>
          <span className="tf-logo-fit">FIT</span>
          <span className="tf-logo-badge">Admin</span>
        </div>

        <nav className="tf-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                className={`tf-nav-item ${active ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="tf-sidebar-footer">
          <div className="tf-door-status">
            <span className="tf-dot" />
            Portes : système en ligne
          </div>
        </div>
      </aside>

      {/* ---------- Contenu principal ---------- */}
      <main className="tf-main">
        {/* Topbar */}
        <header className="tf-topbar">
          <div>
            <h1>Tableau de bord</h1>
            <p className="tf-date">Jeudi 11 juin 2026</p>
          </div>
          <div className="tf-topbar-right">
            <div className="tf-search">
              <Search size={16} />
              <input placeholder="Rechercher un membre…" />
            </div>
            <button className="tf-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="tf-badge-dot" />
            </button>
            <div className="tf-avatar">G</div>
          </div>
        </header>

        {/* KPI cards */}
        <section className="tf-kpis">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            const Trend = kpi.trendUp ? TrendingUp : TrendingDown;
            return (
              <div key={kpi.id} className="tf-card tf-kpi">
                <div className="tf-kpi-head">
                  <span className="tf-kpi-icon">
                    <Icon size={18} />
                  </span>
                  <span className={`tf-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                    <Trend size={13} />
                    {kpi.trend}
                  </span>
                </div>
                <div className="tf-kpi-value">{kpi.value}</div>
                <div className="tf-kpi-label">{kpi.label}</div>
              </div>
            );
          })}
        </section>

        {/* Ligne : graphique + colonnes latérales */}
        <section className="tf-grid">
          {/* Graphique fréquentation */}
          <div className="tf-card tf-chart-card">
            <div className="tf-card-head">
              <h2>Fréquentation aujourd'hui</h2>
              <span className="tf-card-sub">Passages par tranche horaire</span>
            </div>
            <div className="tf-chart">
              {FREQUENTATION.map((f) => (
                <div key={f.heure} className="tf-bar-col">
                  <span className="tf-bar-value">{f.valeur}</span>
                  <div
                    className={`tf-bar ${f.valeur === maxFreq ? 'max' : ''}`}
                    style={{ height: `${(f.valeur / maxFreq) * 100}%` }}
                  />
                  <span className="tf-bar-label">{f.heure}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derniers accès QR */}
          <div className="tf-card">
            <div className="tf-card-head">
              <h2>
                <QrCode size={16} className="tf-h2-icon" />
                Derniers accès
              </h2>
              <span className="tf-card-sub">Scanner QR — temps réel</span>
            </div>
            <ul className="tf-list">
              {DERNIERS_ACCES.map((a, i) => (
                <li key={i} className="tf-list-row">
                  <div>
                    <div className="tf-list-name">{a.nom}</div>
                    <div className="tf-list-sub">{a.porte}</div>
                  </div>
                  <div className="tf-list-right">
                    <span className="tf-list-time">{a.heure}</span>
                    <span className={`tf-pill ${a.ok ? 'ok' : 'ko'}`}>
                      {a.ok ? 'Autorisé' : 'Refusé'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Prochains cours */}
          <div className="tf-card">
            <div className="tf-card-head">
              <h2>Prochains cours</h2>
              <span className="tf-card-sub">Aujourd'hui</span>
            </div>
            <ul className="tf-list">
              {PROCHAINS_COURS.map((c, i) => {
                const complet = c.places.split('/')[0] === c.places.split('/')[1];
                return (
                  <li key={i} className="tf-list-row">
                    <div>
                      <div className="tf-list-name">{c.nom}</div>
                      <div className="tf-list-sub">
                        {c.heure} · Coach {c.coach}
                      </div>
                    </div>
                    <span className={`tf-pill ${complet ? 'ko' : 'ok'}`}>
                      {complet ? 'Complet' : c.places}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button className="tf-btn-primary">Gérer le planning</button>
          </div>
        </section>
      </main>
    </div>
  );
}

// ----- Styles (charte TryFit) -----
const css = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap');

:root {
  --tf-bg: #0A0A0A;
  --tf-card: #161616;
  --tf-border: #222222;
  --tf-green: #22C55E;
  --tf-green-soft: rgba(34, 197, 94, 0.12);
  --tf-red: #EF4444;
  --tf-red-soft: rgba(239, 68, 68, 0.12);
  --tf-text: #FFFFFF;
  --tf-muted: #9CA3AF;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.tf-root {
  display: flex;
  min-height: 100vh;
  background: var(--tf-bg);
  color: var(--tf-text);
  font-family: 'Exo 2', sans-serif;
}

/* ---------- Sidebar ---------- */
.tf-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #0D0D0D;
  border-right: 1px solid var(--tf-border);
  display: flex;
  flex-direction: column;
  padding: 24px 14px;
}
.tf-logo {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  font-size: 22px;
  font-style: italic;
  letter-spacing: 0.5px;
  padding: 0 10px 24px;
  display: flex;
  align-items: center;
  gap: 2px;
}
.tf-logo-try { color: var(--tf-text); }
.tf-logo-fit { color: var(--tf-green); }
.tf-logo-badge {
  font-style: normal;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--tf-green);
  background: var(--tf-green-soft);
  border-radius: 6px;
  padding: 3px 7px;
  margin-left: 8px;
}
.tf-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.tf-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--tf-muted);
  font-family: 'Exo 2', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}
.tf-nav-item:hover { background: #161616; color: var(--tf-text); }
.tf-nav-item.active { background: var(--tf-green-soft); color: var(--tf-green); }
.tf-sidebar-footer { padding: 12px 10px 0; border-top: 1px solid var(--tf-border); }
.tf-door-status {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--tf-muted);
}
.tf-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--tf-green);
  box-shadow: 0 0 8px var(--tf-green);
}

/* ---------- Main ---------- */
.tf-main { flex: 1; padding: 28px 32px; min-width: 0; }

.tf-topbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 28px;
}
.tf-topbar h1 { font-size: 24px; font-weight: 700; }
.tf-date { color: var(--tf-muted); font-size: 13px; margin-top: 2px; }
.tf-topbar-right { display: flex; align-items: center; gap: 14px; }
.tf-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--tf-card);
  border: 1px solid var(--tf-border);
  border-radius: 10px;
  padding: 9px 14px;
  color: var(--tf-muted);
}
.tf-search input {
  background: transparent; border: none; outline: none;
  color: var(--tf-text);
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  width: 180px;
}
.tf-icon-btn {
  position: relative;
  background: var(--tf-card);
  border: 1px solid var(--tf-border);
  border-radius: 10px;
  padding: 9px;
  color: var(--tf-text);
  cursor: pointer;
  display: flex;
}
.tf-badge-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--tf-red);
}
.tf-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--tf-green);
  color: #0A0A0A;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

/* ---------- Cards ---------- */
.tf-card {
  background: var(--tf-card);
  border: 1px solid var(--tf-border);
  border-radius: 16px;
  padding: 20px;
}
.tf-card-head { margin-bottom: 16px; }
.tf-card-head h2 {
  font-size: 15px; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
}
.tf-h2-icon { color: var(--tf-green); }
.tf-card-sub { font-size: 12px; color: var(--tf-muted); }

/* KPIs */
.tf-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.tf-kpi-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.tf-kpi-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--tf-green-soft);
  color: var(--tf-green);
  display: flex; align-items: center; justify-content: center;
}
.tf-trend {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600;
}
.tf-trend.up { color: var(--tf-green); }
.tf-trend.down { color: var(--tf-muted); }
.tf-kpi-value {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 1;
}
.tf-kpi-label { color: var(--tf-muted); font-size: 13px; margin-top: 6px; }

/* Grille principale */
.tf-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 16px;
  align-items: start;
}

/* Graphique en barres */
.tf-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 220px;
  padding-top: 10px;
}
.tf-bar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.tf-bar-value {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--tf-muted);
}
.tf-bar {
  width: 100%;
  max-width: 36px;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, rgba(34,197,94,0.55), rgba(34,197,94,0.15));
  transition: height 0.4s ease;
}
.tf-bar.max {
  background: linear-gradient(180deg, #22C55E, rgba(34,197,94,0.35));
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.35);
}
.tf-bar-label { font-size: 12px; color: var(--tf-muted); }

/* Listes */
.tf-list { list-style: none; display: flex; flex-direction: column; }
.tf-list-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px solid var(--tf-border);
  gap: 8px;
}
.tf-list-row:last-child { border-bottom: none; }
.tf-list-name { font-size: 14px; font-weight: 600; }
.tf-list-sub { font-size: 12px; color: var(--tf-muted); margin-top: 2px; }
.tf-list-right { display: flex; align-items: center; gap: 10px; }
.tf-list-time {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--tf-muted);
}
.tf-pill {
  font-size: 11px; font-weight: 600;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}
.tf-pill.ok { color: var(--tf-green); background: var(--tf-green-soft); }
.tf-pill.ko { color: var(--tf-red); background: var(--tf-red-soft); }

.tf-btn-primary {
  width: 100%;
  margin-top: 16px;
  padding: 11px;
  border: none;
  border-radius: 10px;
  background: var(--tf-green);
  color: #0A0A0A;
  font-family: 'Exo 2', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.15s;
}
.tf-btn-primary:hover { filter: brightness(1.1); }

/* Responsive */
@media (max-width: 1200px) {
  .tf-grid { grid-template-columns: 1fr 1fr; }
  .tf-chart-card { grid-column: span 2; }
  .tf-kpis { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 800px) {
  .tf-sidebar { display: none; }
  .tf-grid, .tf-kpis { grid-template-columns: 1fr; }
  .tf-chart-card { grid-column: span 1; }
}
`;