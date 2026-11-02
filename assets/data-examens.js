/* Sujets d'examen chronométrés. Chaque question porte un barème (pts).
   La correction n'apparaît qu'à la remise de la copie. */
(function () {
  const L = (t, ...k) => ({ t, k });
  RQ.examens = [
  { id: "controle-2025", title: "Contrôle d'octobre 2025", tag: "Sujet officiel", min: 120,
    info: "UJKZ / IBAM — Master Informatique. Aucun document autorisé. Barème d'origine : 32 points, ramené sur 20.",
    parts: [
      { title: "Exercice 1 · Types de recherche (12 pts)", qs: [
        { t: "list", pts: 1.5, q: "Cite les différents types de recherche.", items: [L("Recherche fondamentale", "fondament"), L("Recherche appliquée", "appliq"), L("Recherche développement expérimental", "developpement")], need: 3 },
        { t: "open", pts: 1.5, q: "Recherche fondamentale : donne une définition.", a: "Exploration théorique visant à générer de nouvelles connaissances sans application immédiate.", kw: [["theori", "exploration"], ["connaissance"], ["sans application", "application immediate"]], min: 3 },
        { t: "open", pts: 0.5, q: "Recherche fondamentale : donne un exemple.", a: "Algorithmes de l'IA, cryptographie, structures de données.", kw: [["intelligence artificielle", "=ia", "crypto", "structure", "algorithm", "complexite"]], min: 1 },
        { t: "list", pts: 1.5, q: "Recherche fondamentale : cite des outils de recherche adaptés.", items: [L("Revue de littérature", "revue", "litterature"), L("Conceptualisation", "conceptualis"), L("Modélisation théorique", "modelis"), L("Analyse logique et critique", "logique", "critique")], need: 3 },
        { t: "open", pts: 1.5, q: "Recherche appliquée : donne une définition.", a: "Vise à résoudre des problèmes concrets en utilisant des connaissances théoriques ; se nourrit de la recherche fondamentale et propose des solutions pratiques.", kw: [["resoudre", "solution"], ["concret", "pratique"], ["theori", "connaissance", "fondamental"]], min: 3 },
        { t: "open", pts: 0.5, q: "Recherche appliquée : donne un exemple.", a: "Optimisation de réseaux, logiciels éducatifs.", kw: [["reseau", "logiciel", "educati", "optimis"]], min: 1 },
        { t: "list", pts: 1.5, q: "Recherche appliquée : cite des outils de recherche adaptés.", items: [L("Méthodes expérimentales : observations, tests, simulations", "experiment", "observation", "test", "simulation"), L("Méthodes quantitatives : statistiques, modélisation, analyse de données", "quantitati", "statisti", "analyse de donnees"), L("Méthodes qualitatives : études de cas, entretiens, questionnaires", "qualitati", "etude de cas", "entretien", "questionnaire")], need: 3 },
        { t: "open", pts: 1.5, q: "Recherche développement expérimental : donne une définition.", a: "Conception et expérimentation de prototypes ou de systèmes pour tester des solutions et technologies ; vise à valider la faisabilité et l'efficacité des solutions.", kw: [["conception", "concevoir"], ["prototype", "systeme"], ["experiment", "tester"], ["faisabilite", "efficacite", "valider"]], min: 4 },
        { t: "open", pts: 0.5, q: "Recherche développement expérimental : donne un exemple.", a: "Développement logiciel, algorithmes de compression.", kw: [["logiciel", "compression", "prototype", "application"]], min: 1 },
        { t: "list", pts: 1.5, q: "Recherche développement expérimental : cite des outils de recherche adaptés.", items: [L("Expérience de laboratoire (conditions contrôlées)", "laboratoire", "labo"), L("Expérience de terrain (conditions naturelles)", "terrain"), L("Expérience quasi-expérimentale (contrôle partiel)", "quasi")], need: 3 }
      ] },
      { title: "Exercice 2 · Rédaction scientifique et plagiat (10 pts)", qs: [
        { t: "list", pts: 1.5, q: "La rédaction doit être claire et concise. Donne quatre principales caractéristiques de la clarté.", items: [L("Vocabulaire simple et approprié", "vocabul"), L("Phrases courtes et directes", "phrase"), L("Structuration logique des idées", "structur", "logique"), L("Pas de jargon inutile ni de termes non expliqués", "jargon")], need: 4 },
        { t: "list", pts: 1.5, q: "Donne trois principales caractéristiques de la concision.", items: [L("Supprimer redondances et répétitions", "redondan", "repetition"), L("Remplacer les expressions longues par des mots simples", "expression", "remplac", "simple"), L("Voix active plutôt que passive", "active", "voix")], need: 3 },
        { t: "match", pts: 4, q: "On distingue quatre types de plagiat. Associe chaque type à sa description.", pairs: [["Plagiat direct", "Copier-coller le texte d'autrui sans le citer"], ["Plagiat mosaïque", "Mélanger ses mots avec ceux d'autrui sans le citer"], ["Plagiat d'idées", "S'approprier des idées ou résultats d'autrui"], ["Auto-plagiat", "Réutiliser ses propres publications"]] },
        { t: "grid", pts: 3, q: "La détection du plagiat a des conséquences sur plusieurs plans. Complète le tableau (au moins 2 sanctions par plan).", cols: ["Sanction 1", "Sanction 2"], anyOrder: true,
          rows: [{ label: "Académique", vals: ["Rétractation d'articles", "Sanctions universitaires"] }, { label: "Professionnel", vals: ["Atteinte à la réputation", "Exclusion de projets ou financements"] }, { label: "Légal", vals: ["Violation du droit d'auteur", "Poursuites judiciaires"] }] }
      ] },
      { title: "Exercice 3 · Structure d'un mémoire (10 pts)", qs: [
        { t: "grid", pts: 10, q: "Pour un mémoire / une thèse / un article en recherche informatique, complète le tableau.", cols: ["Contenu clé", "Analyse"],
          rows: [
            { label: "Titre", vals: ["Sujet principal", "Pertinence"] },
            { label: "Résumé", vals: ["Approche, résultats", "Pertinence et impact"] },
            { label: "Introduction", vals: ["Contexte, problématique, objectifs, plan", "Originalité et justification"] },
            { label: "Travaux liés", vals: ["État de l'art", "Intérêt et importance"] },
            { label: "Méthodologie", vals: ["Algorithmes, modèles, données, outils", "Pertinence et reproductibilité"] },
            { label: "Développement", vals: ["Méthodologie, résultats, discussion", "Clarté et concision de la rédaction"] },
            { label: "Résultats", vals: ["Tests, benchmarks, mesures", "Rigueur, comparaisons, visualisation"] },
            { label: "Discussion", vals: ["Interprétation, implications", "Cohérence et validité"] },
            { label: "Conclusion", vals: ["Résumé, contributions, perspectives", "Clarté, limites, travaux futurs"] },
            { label: "Bibliographie", vals: ["Sources citées", "Pertinence, qualité des sources"] },
            { label: "Annexes", vals: ["Complément informatif", "Pertinence, qualité"] }
          ] }
      ] }
    ] },

  { id: "blanc-a", title: "Sujet blanc A · Démarche et méthodes", tag: "Entraînement", min: 120,
    info: "Sujet inédit construit sur les chapitres 1 et 2 et le TD. Noté sur 20.",
    parts: [
      { title: "Exercice 1 · Démarche scientifique (6 pts)", qs: [
        { t: "open", pts: 1, q: "Définis la problématique.", a: "La question centrale à laquelle le chercheur cherche une solution ; soutenue par un contexte précis, une formulation claire et concise et une justification.", kw: [["question"], ["centrale", "principale"], ["solution", "repond", "cherche"]], min: 2 },
        { t: "list", pts: 1.5, q: "Donne les caractéristiques d'une bonne observation.", items: [L("Objectivité", "objectiv"), L("Rationalité / systématicité", "rational", "systemat"), L("Pertinence", "pertinen"), L("Précision", "precis")], need: 4 },
        { t: "list", pts: 1.5, q: "Quelles qualités doivent avoir les objectifs de recherche ?", items: [L("Clairs et précis", "clair", "precis"), L("Mesurables", "mesurab"), L("Atteignables", "atteignab", "realis"), L("Pertinents", "pertinen")], need: 4 },
        { t: "match", pts: 2, q: "Associe chaque type d'hypothèse à sa définition.", pairs: [["H0", "Pas de relation entre les variables"], ["H1", "Il existe une relation entre les variables"], ["Directionnelle", "Précise le sens de la relation"], ["Non-directionnelle", "Relation sans préciser le sens"]] }
      ] },
      { title: "Exercice 2 · Étude de cas (7 pts)", intro: "Dans une école d'ingénieurs, les étudiants qui utilisent régulièrement un assistant d'IA pour programmer rendent leurs projets plus vite, mais certains enseignants pensent qu'ils comprennent moins bien leur code.", qs: [
        { t: "write", pts: 2, q: "Formule une problématique liée à cette observation.", model: "<p>L'utilisation régulière d'un assistant d'IA pour programmer influence-t-elle la compréhension du code par les étudiants ingénieurs, au-delà du gain de rapidité ?</p>", checklist: ["C'est une question", "Elle relie l'usage de l'IA et la compréhension du code", "Le contexte est délimité (étudiants ingénieurs, programmation)", "Elle fait apparaître la tension rapidité / compréhension"] },
        { t: "write", pts: 2, q: "Propose une hypothèse H1 et l'hypothèse nulle H0 correspondante.", model: "<p><b>H1 :</b> Les étudiants qui utilisent régulièrement un assistant d'IA obtiennent de moins bons scores aux tests de compréhension de leur propre code que ceux qui n'en utilisent pas.<br><b>H0 :</b> L'utilisation d'un assistant d'IA n'a aucun effet sur la compréhension du code.</p>", checklist: ["H1 relie deux variables mesurables", "H1 est testable", "H0 exprime l'absence d'effet", "Formulation claire et précise"] },
        { t: "write", pts: 1, q: "Donne l'objectif général et deux objectifs spécifiques.", model: "<p><b>Général :</b> évaluer l'effet de l'usage d'un assistant d'IA sur la compréhension du code.<br><b>Spécifiques :</b> mesurer la fréquence d'usage de l'IA ; mesurer la compréhension (test d'explication du code) ; comparer les deux groupes.</p>", checklist: ["Un objectif général (but principal)", "Deux objectifs spécifiques (étapes intermédiaires)", "Objectifs mesurables"] },
        { t: "write", pts: 2, q: "Décris une méthode pour vérifier l'hypothèse (population, outils de collecte, analyse).", model: "<p>Population : 120 étudiants de 2ᵉ année. Deux groupes : utilisateurs réguliers de l'IA / non-utilisateurs (questionnaire). Collecte : chaque étudiant explique oralement un extrait de son projet, noté sur 20 avec une grille. Analyse : moyennes et écarts-types par groupe, test t. Variables contrôlées : même projet, même niveau.</p>", checklist: ["Population ou échantillon chiffré", "Outil de collecte précis (questionnaire, test…)", "Méthode d'analyse (statistiques, test)", "Au moins une variable contrôlée"] }
      ] },
      { title: "Exercice 3 · Méthodes et analyse (7 pts)", qs: [
        { t: "match", pts: 2, q: "Associe chaque méthode à son principe.", pairs: [["Déductive", "Du général (théorie) vers le particulier"], ["Inductive", "Du particulier (observations) vers le général"], ["Hypothético-déductive", "Hypothèses testées puis théorie ajustée"], ["Analytique", "Décomposer un problème en composantes"]] },
        { t: "order", pts: 2, q: "Remets dans l'ordre les étapes de la méthode expérimentale.", items: ["Formuler l'hypothèse", "Choisir les variables", "Concevoir l'expérience", "Réaliser l'expérience", "Analyser les données", "Interpréter"] },
        { t: "num", pts: 1, q: "Série de temps de réponse (ms) : 8 · 10 · 10 · 12 · 15. Calcule la moyenne.", a: 11, tol: 0.01 },
        { t: "num", pts: 1, q: "Même série : quelle est la médiane ?", a: 10, tol: 0.01 },
        { t: "num", pts: 1, q: "Même série : quelle est l'étendue ?", a: 7, tol: 0.01 }
      ] }
    ] },

  { id: "blanc-b", title: "Sujet blanc B · Rédaction et intégrité", tag: "Entraînement", min: 120,
    info: "Sujet inédit centré sur le chapitre 3, avec des rappels du chapitre 2. Noté sur 20.",
    parts: [
      { title: "Exercice 1 · Structure et rédaction (7 pts)", qs: [
        { t: "order", pts: 2, q: "Remets dans l'ordre la structure synthétique d'un mémoire.", items: ["Titre", "Résumé", "Introduction", "Méthodologie", "Résultats", "Discussion", "Conclusion", "Références", "Annexes"] },
        { t: "qcm", pts: 1, q: "Longueur du résumé d'un mémoire ou d'une thèse :", c: ["200 à 500 mots", "150 à 300 mots", "50 à 100 mots", "1 000 mots"], a: 0 },
        { t: "list", pts: 2, q: "Cite quatre éléments que doit contenir la discussion.", items: [L("Interprétation des résultats", "interpret"), L("Importance des résultats", "importance"), L("Comparaison avec les travaux antérieurs", "compar", "anterieur"), L("Limites et généralisations", "limite", "generalis"), L("Recherches futures", "futur", "perspective", "suggestion"), L("Théories et pratiques utilisées", "theori", "pratique")], need: 4 },
        { t: "write", pts: 2, q: "Explique la différence entre une citation et une paraphrase, et ce qu'elles ont en commun.", model: "<p>La <b>citation</b> reprend le texte exact de l'auteur, entre guillemets. La <b>paraphrase</b> reformule la pensée de l'auteur avec d'autres mots. Dans les deux cas, la source doit obligatoirement être indiquée (note ou renvoi, puis bibliographie).</p>", checklist: ["Citation = texte exact", "Citation entre guillemets", "Paraphrase = idée reformulée avec d'autres mots", "Les deux doivent être sourcées"] }
      ] },
      { title: "Exercice 2 · Intégrité scientifique (6 pts)", qs: [
        { t: "qcm", pts: 1, q: "Salif reprend son propre article publié l'an dernier dans son mémoire, sans le citer.", c: ["Auto-plagiat", "Plagiat direct", "Plagiat mosaïque", "Pratique autorisée"], a: 0 },
        { t: "qcm", pts: 1, q: "Rasmata présente comme siens les résultats d'une enquête publiée par un autre laboratoire.", c: ["Plagiat d'idées", "Auto-plagiat", "Paraphrase correcte", "Citation"], a: 0 },
        { t: "qcm", pts: 1, q: "Karim mélange des phrases d'un rapport en ligne avec les siennes, sans source.", c: ["Plagiat mosaïque", "Plagiat direct", "Auto-plagiat", "Citation"], a: 0 },
        { t: "list", pts: 3, q: "Cite quatre bonnes pratiques pour éviter le plagiat.", items: [L("Citer la source selon une norme (APA, IEEE…)", "source", "norme", "apa", "ieee", "referenc"), L("Guillemets pour les citations", "guillemet"), L("Reproduire le texte exact", "exact"), L("Signaler les coupures par (...)", "(...)", "coupure", "alter"), L("Note de bas de page, bibliographie", "bas de page", "note", "bibliograph"), L("Logiciel anti-plagiat", "anti", "logiciel"), L("Codes d'intégrité (UNESCO, COPE)", "unesco", "cope", "code")], need: 4 }
      ] },
      { title: "Exercice 3 · Rappels du chapitre 2 (7 pts)", qs: [
        { t: "list", pts: 2, q: "Cite quatre caractéristiques de la recherche en informatique (chapitre 2).", items: [L("Interdisciplinarité", "interdisciplin", "croisee"), L("Théorie et pratique", "theorie"), L("Modélisation et simulation", "modelis", "simul"), L("Caractère expérimental", "experiment"), L("Évolution rapide", "evolu", "rapide"), L("Collaborative", "collabor"), L("Validation", "validation")], need: 4 },
        { t: "list", pts: 2, q: "Cite quatre types de données en informatique.", items: [L("Logs", "log"), L("Traces d'exécution", "trace"), L("Bases de données", "base"), L("Corpus textuels", "corpus"), L("Images", "image"), L("Audio / vidéo", "audio", "video"), L("Capteurs", "capteur"), L("Données scientifiques", "scientifique")], need: 4 },
        { t: "list", pts: 2, q: "Cite les quatre critères de comparaison d'algorithmes.", items: [L("Temps d'exécution", "temps"), L("Mémoire", "memoire"), L("Précision", "precision", "exactitude"), L("Robustesse", "robust", "stabil")], need: 4 },
        { t: "qcm", pts: 1, q: "Jury minimum pour un mémoire de Master :", c: ["4 membres", "3 membres", "5 membres", "2 membres"], a: 0 }
      ] }
    ] },

  { id: "eclair", title: "Examen éclair", tag: "Tirage aléatoire", min: 20, random: 15,
    info: "15 questions tirées au hasard dans toute la banque, 1 point chacune. Idéal la veille du devoir." }
  ];
})();
