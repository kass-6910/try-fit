// Catalogue d'exercices pour le constructeur de séance.
// duration (en secondes) = exercice chronométré ; sans duration = au nombre de reps.

export const CATEGORIES = [
  { id: "haut", label: "Haut du corps", emoji: "💪" },
  { id: "bas", label: "Bas du corps", emoji: "🦵" },
  { id: "full", label: "Full body", emoji: "🔥" },
];

export const WARMUPS = [
  { id: "deadhang", name: "Dead Hang", emoji: "🤸", detail: "Tenu · 30 sec", duration: 30 },
  { id: "epaules", name: "Rotation épaules", emoji: "🔄", detail: "30 sec", duration: 30 },
  { id: "jumpingjacks", name: "Jumping Jacks", emoji: "🤾", detail: "30 sec", duration: 30 },
  { id: "hanches", name: "Mobilité hanches", emoji: "🦵", detail: "30 sec", duration: 30 },
  { id: "catcow", name: "Cat-Cow (dos)", emoji: "🐈", detail: "30 sec", duration: 30 },
  { id: "poignets", name: "Échauffement poignets", emoji: "✋", detail: "20 sec", duration: 20 },
  { id: "corde", name: "Corde à sauter", emoji: "🪢", detail: "45 sec", duration: 45 },
];

export const EXERCISES = {
  haut: [
    { id: "tractions", name: "Tractions", emoji: "🏋️", detail: "Prise pronation · max reps" },
    { id: "dips", name: "Dips", emoji: "💪", detail: "Barres parallèles · max reps" },
    { id: "pompes", name: "Pompes classiques", emoji: "🫷", detail: "Dos droit · max reps" },
    { id: "diamant", name: "Pompes diamant", emoji: "💎", detail: "Index + pouces · max reps" },
    { id: "inclinees", name: "Pompes inclinées", emoji: "📐", detail: "Mains surélevées · max reps" },
    { id: "australiennes", name: "Australiennes", emoji: "🦅", detail: "Corps incliné · max reps" },
    { id: "pike", name: "Pike Push-ups", emoji: "🔺", detail: "Épaules · max reps" },
    { id: "gainage", name: "Gainage / Planche", emoji: "🧱", detail: "Tenu · 45 sec", duration: 45 },
    { id: "developpe-couche", name: "Développé couché", emoji: "🛋️", detail: "Barre/haltères · pectoraux" },
    { id: "developpe-incline", name: "Développé incliné", emoji: "📈", detail: "Haut des pectoraux" },
    { id: "developpe-militaire", name: "Développé militaire", emoji: "🎖️", detail: "Épaules · debout/assis" },
    { id: "elevations-laterales", name: "Élévations latérales", emoji: "🪽", detail: "Largeur d'épaules" },
    { id: "pompes-declinees", name: "Pompes déclinées", emoji: "📉", detail: "Pieds surélevés · haut pecs" },
    { id: "rowing-barre", name: "Rowing barre", emoji: "🚣", detail: "Épaisseur du dos" },
    { id: "rowing-haltere", name: "Rowing haltère", emoji: "🛶", detail: "Un bras · grand dorsal" },
    { id: "tirage-poitrine", name: "Tirage poitrine", emoji: "🔽", detail: "Poulie haute · dos" },
    { id: "rowing-poulie", name: "Rowing assis poulie", emoji: "↩️", detail: "Milieu du dos" },
    { id: "face-pull", name: "Oiseau / Face pull", emoji: "🎯", detail: "Deltoïde postérieur" },
    { id: "curl-biceps", name: "Curl biceps", emoji: "🦾", detail: "Barre EZ/haltères · biceps" },
  ],
  bas: [
    { id: "squats", name: "Squats", emoji: "🦵", detail: "max reps" },
    { id: "fentes", name: "Fentes", emoji: "🚶", detail: "Alternées · max reps" },
    { id: "squatssautes", name: "Squats sautés", emoji: "🐰", detail: "Explosif · max reps" },
    { id: "bulgares", name: "Fentes bulgares", emoji: "🍐", detail: "Par jambe · max reps" },
    { id: "pont", name: "Pont fessier", emoji: "🌉", detail: "max reps" },
    { id: "mollets", name: "Mollets debout", emoji: "🦶", detail: "max reps" },
    { id: "montees", name: "Montées (step-up)", emoji: "📦", detail: "max reps" },
    { id: "chaise", name: "Chaise (wall sit)", emoji: "🪑", detail: "Tenu · 45 sec", duration: 45 },
    { id: "presse-cuisses", name: "Presse à cuisses", emoji: "🦿", detail: "Quadriceps · machine" },
    { id: "souleve-terre", name: "Soulevé de terre", emoji: "🏋️", detail: "Chaîne postérieure complète" },
    { id: "rdl", name: "Soulevé de terre roumain", emoji: "🧎", detail: "Ischios + fessiers" },
    { id: "hip-thrust", name: "Hip Thrust", emoji: "🍑", detail: "Fessiers · banc" },
    { id: "leg-curl", name: "Leg Curl", emoji: "🦵", detail: "Ischios · machine" },
  ],
  full: [
    { id: "burpees", name: "Burpees", emoji: "🔥", detail: "Explosif · max reps" },
    { id: "mountain", name: "Mountain Climbers", emoji: "⛰️", detail: "30 sec", duration: 30 },
    { id: "tractions", name: "Tractions", emoji: "🏋️", detail: "max reps" },
    { id: "pompes", name: "Pompes", emoji: "🫷", detail: "max reps" },
    { id: "squats", name: "Squats", emoji: "🦵", detail: "max reps" },
    { id: "dips", name: "Dips", emoji: "💪", detail: "max reps" },
    { id: "fentes", name: "Fentes", emoji: "🚶", detail: "max reps" },
    { id: "gainage", name: "Gainage / Planche", emoji: "🧱", detail: "Tenu · 45 sec", duration: 45 },
    { id: "clean-press", name: "Clean and Press", emoji: "🏋️", detail: "Épaulé-jeté · complet" },
    { id: "thrusters", name: "Thrusters", emoji: "⚡", detail: "Squat + développé · cardio" },
    { id: "kb-swings", name: "Kettlebell Swings", emoji: "🔔", detail: "Charnière de hanche explosive" },
    { id: "farmer-walk", name: "Marche du fermier", emoji: "🧳", detail: "Charges lourdes · 40 sec", duration: 40 },
    { id: "man-makers", name: "Man Makers", emoji: "🤸", detail: "Pompe + rowing + squat + press" },
    { id: "db-squat-press", name: "Squat + presse haltères", emoji: "🏋️", detail: "Version contrôlée du thruster" },
  ],
};

export const MIN_WARMUPS = 1;

export function hasRequiredWarmups(session) {
  return Array.isArray(session?.warmups) && session.warmups.length >= MIN_WARMUPS;
}
