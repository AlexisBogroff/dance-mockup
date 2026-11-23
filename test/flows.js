// Mockup « feedback · version test » (24 nov, OPT-1208), en Liquid Glass épuré : les 8 écrans de la v0.
// hot = texte visible -> action ("back", "toast:…", "a>b", "cond:drapeau:si:sinon", ou un croisement { x, l, m }).
// Drapeaux : sent (une demande est partie), fb (le retour est livré).
const TABS_P = { "Demandes": "p2", "Élèves": "p4", "Réglages": "p1" };
const TABS_E = { "Retours": "cond:fb:e4b:e4", "Filmer": "e2" };
window.STATES = [
  ["p1", "t-p-reglages", 0, "8 · Réglages"],
  ["p2", "t-p-demandes", 0, "6 · Demandes"],
  ["p3", "t-p-corriger", 0, "7 · Corriger à la voix"],
  ["p3b", "t-p-relire", 0, "7 · Relire et envoyer"],
  ["p3c", "t-p-envoye", 0, "7 · Envoyé"],
  ["p4", "t-p-eleves", 0, "8 · Élèves"],
  ["e1", "t-e-invitation", 0, "1 · L'invitation de Mike"],
  ["e1b", "t-e-lien", 0, "1 · Lien de connexion"],
  ["e2", "t-e-filmer", 0, "2 · Filmer"],
  ["e2b", "t-e-revoir", 0, "2 · Revoir"],
  ["e3", "t-e-demander", 0, "3 · Demander un retour"],
  ["e3s", "t-e-stripe", 0, "3 · Page Stripe de Mike"],
  ["e3ok", "t-e-envoyee", 0, "3 · Envoyé"],
  ["e4", "t-e-retours", 0, "4 · Retours, en cours"],
  ["en", "t-e-mail", 0, "4 · La notification"],
  ["e4b", "t-e-retours-livre", 0, "4 · Retours, livré"],
  ["e5", "t-e-retour", 0, "5 · Le retour de Mike"],
];
window.FLOWS = {
  // ---------------------------------------------------------------- PROF
  p1: { hot: {
    "Prix": "toast:Le prix que l'élève voit avant de payer.",
    "Lien Stripe": "toast:Le Payment Link créé dans le Stripe de Mike.",
    "Délai": "toast:24, 48 ou 72 h.",
    "Commission": "toast:10 % par retour livré, comptés ici, facturés à l'immatriculation.",
    "Inviter mes élèves": { x: "e1", l: "Côté élève", m: "Mardi soir. Alexis ouvre le lien que Mike a envoyé.", prof: { x: "p2", l: "Le lendemain", m: "Mer. 25 nov, 18:30. Deux demandes." } },
    ...TABS_P } },
  p2: { hot: { "Alexis": "p3", "Sami": "toast:Même écran, avec la vidéo de Sami.", "Léo": "toast:Léo doit repayer.", ...TABS_P } },
  p3: { hot: { "Micro": "p3b", "Relâche pour poser à 0:08": "p3b", "Texte": "toast:Le clavier s'ouvre : le texte se pose à 0:08.", "‹": "back" } },
  p3b: { hot: { "Envoyer à Alexis": "p3c", "Paiement non reçu": "toast:La demande repart chez Alexis. Hors commission.", "0:14": "toast:Ton vocal, posé à 0:08.", "‹": "back" } },
  p3c: { set: "fb", hot: {
    "Corriger Sami": { x: "en", l: "Côté élève", m: "Mer. 25 nov, 18:43. Le téléphone d'Alexis est verrouillé.", prof: { x: "p4", l: "Plus tard", m: "Mike regarde ses élèves." } },
    "Revoir": "toast:Ton retour, tel qu'Alexis le reçoit." } },
  p4: { hot: { "Alexis B.": "toast:Ses vidéos et tes retours.", "Sami": "toast:Ses vidéos et tes retours.", "Léo": "toast:Ses vidéos et tes retours.", ...TABS_P } },
  // ---------------------------------------------------------------- ÉLÈVE
  e1: { hot: { "Continuer": "e1b" } },
  e1b: { hot: { "J'ai ouvert le lien": "toast:Connecté. Tu es rattaché à Mike.>e2", "Renvoyer": "toast:Nouveau lien envoyé." } },
  e2: { any: "e2b", hot: { "×": "cond:fb:e4b:e4", "Filmer": "e2b", "Galerie": "toast:Ta galerie : une minute au plus.>e2b" } },
  e2b: { hot: { "Continuer": "cond:fb:toast:Ta nouvelle vidéo part chez Mike.>e3", "Refaire": "e2", "‹": "back" } },
  e3: { hot: { "Payer 15 €": "e3s", "Mon genou monte trop tard ?": "toast:Ta question, facultative.", "‹": "back" } },
  e3s: { hot: { "Payer": "toast:Payé. Retour vers l'app.>e3ok" } },
  e3ok: { set: "sent", hot: { "Mes retours": "e4" } },
  e4: { hot: { "24 nov": { x: "p2", l: "Côté prof", m: "Mer. 25 nov, 18:30. Mike ouvre ses demandes.", eleve: { x: "en", l: "Le lendemain", m: "Mer. 25 nov, 18:43." } },
    ...TABS_E }, any: { x: "p2", l: "Côté prof", m: "Mer. 25 nov, 18:30. Mike ouvre ses demandes.", eleve: { x: "en", l: "Le lendemain", m: "Mer. 25 nov, 18:43." } } },
  en: { set: "fb", any: "e5", hot: { "Mike a répondu": "e5" } },
  e4b: { hot: { "24 nov": "e5", "10 nov": "toast:Ton retour précédent.", ...TABS_E } },
  e5: { hot: { "Refilmer": "e2", "Réécouter": "toast:Depuis 0:00 : le vocal à 0:08, le texte à 0:21.", "0:14": "toast:Le vocal de Mike, à l'instant où il l'a posé.", "‹": "e4b" } },
};
