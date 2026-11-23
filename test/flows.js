// Mockup « feedback · version test » (24 nov, OPT-1208) : les 8 écrans de la v0, d'après le document app-test.
// Même mécanique que le mockup v6 : hot = texte visible -> action ("back", "toast:…", "a>b", "cond:drapeau:si:sinon",
// ou un croisement { x, l, m } vers l'autre côté). Drapeaux : sent (une demande est partie), fb (le retour est livré).
const TABS_P = { "Demandes": "p2", "Élèves": "p4", "Réglages": "p1" };
const TABS_E = { "Mes retours": "cond:fb:e4b:e4", "Filmer": "e2" };
window.STATES = [
  ["p1", "t-p-reglages", 0, "8 · Réglages et invitation"],
  ["p2", "t-p-demandes", 0, "6 · Demandes"],
  ["p3", "t-p-corriger", 0, "7 · Corriger à la voix"],
  ["p3b", "t-p-relire", 0, "7 · Relire et envoyer"],
  ["p3c", "t-p-envoye", 0, "7 · Retour envoyé"],
  ["p4", "t-p-eleves", 0, "8 · Élèves et commission"],
  ["e1", "t-e-invitation", 0, "1 · Le lien de Mike"],
  ["e1b", "t-e-lien", 0, "1 · Lien de connexion"],
  ["e2", "t-e-filmer", 0, "2 · Filmer"],
  ["e2b", "t-e-revoir", 0, "2 · Revoir, garder ou refaire"],
  ["e3", "t-e-demander", 0, "3 · Demander un retour"],
  ["e3s", "t-e-stripe", 0, "3 · Page Stripe de Mike"],
  ["e3ok", "t-e-envoyee", 0, "3 · Envoyée"],
  ["e4", "t-e-retours", 0, "4 · Mes retours, en cours"],
  ["en", "t-e-mail", 0, "4 · L'e-mail de livraison"],
  ["e4b", "t-e-retours-livre", 0, "4 · Mes retours, livré"],
  ["e5", "t-e-retour", 0, "5 · Le retour de Mike"],
];
window.FLOWS = {
  // ---------------------------------------------------------------- PROF
  p1: { hot: {
    "Prix d'un retour": "toast:Mike fixe son prix. L'élève le voit avant de payer.",
    "Mon lien de paiement Stripe": "toast:Mike colle le Payment Link créé dans son propre compte Stripe (3 minutes).",
    "Délai annoncé": "toast:24, 48 ou 72 h : l'élève le voit avant de payer.",
    "Partager mon lien d'invitation": { x: "e1", l: "Côté élève", m: "Mardi soir, après le cours. Alexis ouvre le lien que Mike a envoyé sur WhatsApp.", prof: { x: "p2", l: "Le lendemain", m: "Mer. 25 nov, 18:30. Deux demandes à corriger." } },
    ...TABS_P } },
  p2: { hot: { "Alexis · 0:34": "p3", "Sami · 0:51": "toast:Même écran de correction, avec la vidéo de Sami.", "Léo · 0:40": "toast:Léo a été prévenu : sa demande attend qu'il repaie.", ...TABS_P } },
  p3: { hot: { "Relâche pour poser le vocal": "p3b", "Texte": "toast:Le clavier s'ouvre : le texte se pose à 0:08, comme un vocal.", "‹": "back" } },
  p3b: { hot: { "Envoyer à Alexis": "p3c", "Paiement non reçu": "toast:La demande repart chez Alexis : « Mike n'a pas trouvé ton paiement ». Elle ne compte pas dans la commission.", "‹": "back" } },
  p3c: { set: "fb", hot: {
    "Corriger Sami": { x: "en", l: "Côté élève", m: "Mer. 25 nov, 18:43. Le téléphone d'Alexis est posé, écran verrouillé.", prof: { x: "p4", l: "Plus tard", m: "Mike regarde ses élèves et sa commission du mois." } },
    "Revoir le retour envoyé": "toast:Ton retour, tel qu'Alexis le reçoit." } },
  p4: { hot: { "Alexis B.": "toast:Ses vidéos et tes retours, du plus récent au plus ancien.", "Sami": "toast:Ses vidéos et tes retours.", "Léo": "toast:Ses vidéos et tes retours.", ...TABS_P } },
  // ---------------------------------------------------------------- ÉLÈVE
  e1: { hot: { "Recevoir mon lien de connexion": "e1b" } },
  e1b: { hot: { "J'ai ouvert le lien": "toast:Connecté. Tu es rattaché à Mike.>e2", "Renvoyer le lien": "toast:Un nouveau lien part. L'ancien ne marche plus." } },
  e2: { any: "e2b", hot: { "×": "cond:fb:e4b:e4", "Filmer": "e2b", "Choisir une vidéo": "toast:Ta galerie s'ouvre : une vidéo d'une minute au plus.>e2b" } },
  e2b: { hot: { "Garder et demander un retour": "cond:fb:toast:Ta nouvelle vidéo part chez Mike, comme la première. Le test mesure ce moment : refilmer après un retour.>e3", "Refaire": "e2", "‹": "back" } },
  e3: { hot: { "Payer 15 € à Mike": "e3s", "‹": "back" } },
  e3s: { hot: { "Payer": "toast:Paiement accepté par Stripe. Retour vers l'app.>e3ok" } },
  e3ok: { set: "sent", hot: { "Voir mes retours": "e4" } },
  e4: { hot: { "Ta vidéo du 24 nov": { x: "p2", l: "Côté prof", m: "Mer. 25 nov, 18:30. Mike ouvre ses demandes.", eleve: { x: "en", l: "Le lendemain", m: "Mer. 25 nov, 18:43. Mike a répondu." } },
    ...TABS_E }, any: { x: "p2", l: "Côté prof", m: "Mer. 25 nov, 18:30. Mike ouvre ses demandes.", eleve: { x: "en", l: "Le lendemain", m: "Mer. 25 nov, 18:43. Mike a répondu." } } },
  en: { set: "fb", any: "e5", hot: { "Mike a répondu à ta vidéo": "e5" } },
  e4b: { hot: { "Retour de Mike · vidéo du 24 nov": "e5", "Retour de Mike · vidéo du 10 nov": "toast:Ton retour précédent, même écran.", ...TABS_E } },
  e5: { hot: { "Refilmer": "e2", "Réécouter": "toast:La vidéo repart de 0:00 : le vocal se lance à 0:08, le texte s'affiche à 0:21.", "à 0:08": "toast:Le vocal de Mike, à l'instant où il l'a posé.", "‹": "e4b" } },
};
