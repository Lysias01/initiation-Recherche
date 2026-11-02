/* Cas pratiques : explication pas à pas, puis entraînement « comme au devoir ».
   Étape : { t: titre, b: HTML }.  Exercice : liste de questions (mêmes types que la banque + "write" et "grid").
   write { q, model (HTML), checklist:[...] }  → tu rédiges, puis tu t'auto-corriges avec la grille.
   grid  { q, cols:[...], rows:[{label, vals:[...]}] } → tableau à compléter. */
(function () {
  const L = (t, ...k) => ({ t, k });
  RQ.cas = [
  /* ─────────────────────────── 1 ─────────────────────────── */
  { id: "problematique", ch: "c1", src: "TD", title: "De l'observation à la problématique",
    sub: "Transformer un constat en question de recherche, en 4 étapes.", min: 10,
    steps: [
      { t: "Pars d'une observation objective", b: `
        <p>Le point de départ du TD (exercice 11) :</p>
        <blockquote>Dans une promotion d'étudiants, certains réussissent de façon excellente en informatique, tandis que d'autres, malgré leurs efforts, rencontrent des difficultés persistantes.</blockquote>
        <p>Vérifie d'abord que c'est une <b>bonne observation</b> (mémo <b>OR-PP</b>) : elle est <mark>objective</mark> (pas de « ils sont paresseux »), <mark>pertinente</mark> et <mark>précise</mark>. On a un <b>constat descriptif</b>, pas encore une question.</p>` },
      { t: "Étape 1 · Identifie la situation", b: `
        <p>Quel est le <b>phénomène préoccupant</b> et dans quel <b>domaine</b> se situe-t-il ?</p>
        <ul><li>Phénomène : des écarts de réussite entre étudiants qui fournissent pourtant des efforts.</li><li>Domaine : la réussite académique en informatique (pédagogie, apprentissage).</li></ul>` },
      { t: "Étape 2 · Définis le contexte et les limites", b: `
        <p>On délimite l'étude et on regarde ce qu'on sait déjà (<b>état de l'art</b>).</p>
        <ul><li>Limites : <mark>une promotion</mark>, <mark>un établissement</mark>, <mark>les cours d'informatique</mark>.</li><li>Ce que disent les travaux existants : la réussite dépend souvent des prérequis en mathématiques, de la motivation, des méthodes d'apprentissage, de l'accès à un ordinateur…</li></ul>` },
      { t: "Étape 3 · Repère la contradiction ou le manque", b: `
        <p>C'est le cœur de la problématique : <b>où est l'écart entre ce qu'on sait et ce qu'on devrait savoir ?</b></p>
        <div class="tip">Ici, la contradiction saute aux yeux : <b>l'effort ne suffit pas</b> à expliquer la réussite. Il existe donc d'autres facteurs, encore mal identifiés pour cette promotion.</div>` },
      { t: "Étape 4 · Formule la question centrale", b: `
        <p>On écrit une <b>question</b> (avec un point d'interrogation), claire, délimitée, qui vise l'explication :</p>
        <blockquote class="answer">Quels sont les facteurs individuels, pédagogiques et environnementaux qui expliquent les différences de réussite en informatique entre les étudiants d'une même promotion ?</blockquote>
        <p>Puis les <b>sous-questions</b> :</p>
        <ul><li>Le niveau en mathématiques influence-t-il la réussite en programmation ?</li><li>Les méthodes de travail (exercices pratiques, travail en groupe) font-elles la différence ?</li><li>L'accès à un ordinateur personnel joue-t-il un rôle ?</li></ul>` },
      { t: "Contrôle qualité : la grille D-O-S + C-F-J", b: `
        <table class="mini"><tr><th>Critère</th><th>Vérifié ?</th></tr>
        <tr><td><b>D</b>élimitée (une promotion, l'informatique)</td><td>✔</td></tr>
        <tr><td><b>O</b>rientée (on devine la méthode : enquête, analyse statistique)</td><td>✔</td></tr>
        <tr><td><b>S</b>tructurée (question centrale + sous-questions)</td><td>✔</td></tr>
        <tr><td><b>C</b>ontexte précis</td><td>✔</td></tr>
        <tr><td><b>F</b>ormulation claire et concise</td><td>✔</td></tr>
        <tr><td><b>J</b>ustification (améliorer l'accompagnement des étudiants)</td><td>✔</td></tr></table>
        <div class="tip warn">Erreurs qui coûtent des points : écrire une affirmation au lieu d'une question, poser une question trop large (« Pourquoi les étudiants échouent-ils ? »), ou un jugement (« Les étudiants faibles ne travaillent pas assez »).</div>` }
    ],
    exercise: [
      { t: "qcm", q: "Laquelle de ces problématiques est la mieux formulée ?",
        c: ["Quels facteurs liés à l'ergonomie et aux notifications expliquent l'abandon rapide de l'application X par ses utilisateurs ?", "L'informatique et les étudiants.", "Pourquoi les gens n'aiment-ils pas les applications ?", "L'application X est mal conçue."], a: 0,
        exp: "B n'est pas une question ; C est trop large et vague ; D est une affirmation et un jugement de valeur." },
      { t: "write", q: "Observation : sur le campus, la connexion Wi-Fi devient très lente entre 10 h et 12 h, alors que le nombre de points d'accès a doublé l'an dernier. Rédige une problématique et deux sous-questions.",
        model: `<p><b>Problématique :</b> Quels facteurs (nombre d'utilisateurs simultanés, types d'usage, configuration des points d'accès) expliquent la dégradation des performances du réseau Wi-Fi du campus aux heures de pointe, malgré le doublement des points d'accès ?</p><p><b>Sous-questions :</b> Le nombre de connexions simultanées dépasse-t-il la capacité des points d'accès ? Les usages gourmands (vidéo, téléchargements) saturent-ils la bande passante ? La répartition et le paramétrage des canaux créent-ils des interférences ?</p>`,
        checklist: ["C'est une question (point d'interrogation)", "Le phénomène est nommé (lenteur du Wi-Fi)", "Le contexte est délimité (campus, 10 h-12 h)", "La contradiction apparaît (plus de points d'accès mais plus lent)", "Elle vise des causes ou facteurs", "Deux sous-questions qui découlent de la question centrale"] },
      { t: "write", q: "Observation : une application mobile de santé est téléchargée par beaucoup de personnes, mais 70 % des utilisateurs l'abandonnent après une semaine. Rédige une problématique.",
        model: `<p>Quels facteurs liés à l'expérience utilisateur (ergonomie, notifications, utilité perçue) expliquent l'abandon de l'application de santé X par 70 % de ses utilisateurs dès la première semaine ?</p>`,
        checklist: ["C'est une question", "Le phénomène est précis (abandon après une semaine, 70 %)", "Elle reste délimitée (une application, une période)", "Elle vise des facteurs explicatifs", "Pas de jugement de valeur"] }
    ] },

  /* ─────────────────────────── 2 ─────────────────────────── */
  { id: "parcours", ch: "c1", src: "TD", title: "Le parcours complet : de l'observation à la conclusion",
    sub: "Exercice 9 du TD : problématique, hypothèse, méthode, résultats, conclusion.", min: 12,
    steps: [
      { t: "L'observation", b: `<blockquote>Sur une période, on observe que <b>les étudiants dorment peu avant les examens</b>.</blockquote><p>Le devoir te demande : une problématique, une hypothèse, une méthode, des résultats et une conclusion. Suivons la chaîne du processus de recherche.</p>
        <div class="flow"><span>Observation</span><span>Problématique</span><span>Hypothèse</span><span>Objectifs</span><span>Méthode</span><span>Résultats</span><span>Conclusion</span></div>` },
      { t: "La problématique", b: `<p>On transforme le constat en question qui cherche un lien :</p><blockquote class="answer">Le manque de sommeil influence-t-il les performances aux examens ?</blockquote><p>On a un phénomène (manque de sommeil) et un effet possible (performances).</p>` },
      { t: "L'hypothèse (et son contraire H0)", b: `<p>Une réponse <b>provisoire</b>, testable, claire et prédictive (V-C-P-P) :</p>
        <blockquote class="answer">H1 : Les étudiants qui dorment au moins 8 h réussissent mieux leurs examens.</blockquote>
        <p>Elle donne un sens (« mieux ») : c'est une hypothèse <b>directionnelle</b>. On écrit aussi l'hypothèse nulle :</p>
        <blockquote>H0 : La durée de sommeil n'a aucun effet sur les notes.</blockquote>` },
      { t: "Les variables et les objectifs", b: `<ul><li><b>VI</b> (ce qu'on observe ou fait varier) : la durée de sommeil.</li><li><b>VD</b> (ce qu'on mesure) : les notes aux examens.</li><li><b>Variables contrôlées</b> : même filière, même niveau, mêmes examens.</li></ul>
        <p><b>Objectif général :</b> mesurer l'effet du sommeil sur les performances aux examens.<br><b>Objectifs spécifiques :</b> mesurer la durée de sommeil ; recueillir les notes ; analyser le lien entre les deux.</p>` },
      { t: "La méthode", b: `<blockquote class="answer">Enquête par questionnaire auprès de 300 étudiants (durée de sommeil la semaine des examens), puis collecte des notes et analyse statistique (corrélation).</blockquote>
        <p>Une bonne méthode précise : la <mark>population et l'échantillon</mark> (300 étudiants), l'<mark>outil de collecte</mark> (questionnaire) et la <mark>procédure d'analyse</mark> (statistique).</p>` },
      { t: "Les résultats (sans interprétation)", b: `<p>On présente des faits, par exemple :</p>
        <table class="mini"><tr><th>Sommeil moyen</th><th>Effectif</th><th>Note moyenne</th></tr><tr><td>moins de 6 h</td><td>110</td><td>10,2</td></tr><tr><td>6 à 8 h</td><td>120</td><td>11,8</td></tr><tr><td>8 h et plus</td><td>70</td><td>13,1</td></tr></table>
        <blockquote class="answer">Résultat : corrélation positive entre la durée de sommeil et les notes.</blockquote><p class="small">Chiffres d'illustration, inventés pour l'exemple.</p>` },
      { t: "La conclusion (et les limites)", b: `<blockquote class="answer">Conclusion : l'hypothèse est confirmée.</blockquote>
        <p>Pour aller plus loin (discussion) : une corrélation ne prouve pas à elle seule une cause ; la durée de sommeil est déclarée par les étudiants ; on peut proposer une étude expérimentale comme perspective.</p>
        <div class="tip">Au devoir, cinq lignes courtes et justes valent mieux qu'un long paragraphe : une ligne par élément demandé.</div>` }
    ],
    exercise: [
      { t: "write", q: "Observation : les étudiants qui passent beaucoup de temps sur les réseaux sociaux semblent avoir des notes plus faibles. Rédige : une problématique, une hypothèse (H1 et H0), une méthode, des résultats possibles et une conclusion.",
        model: `<p><b>Problématique :</b> Le temps passé sur les réseaux sociaux influence-t-il les résultats académiques des étudiants ?</p><p><b>H1 :</b> Plus un étudiant passe de temps sur les réseaux sociaux, plus ses notes sont faibles (directionnelle).<br><b>H0 :</b> Le temps passé sur les réseaux sociaux n'a aucun effet sur les notes.</p><p><b>Méthode :</b> questionnaire auprès de 200 étudiants (temps quotidien sur les réseaux, relevé via l'application de suivi du téléphone), collecte des moyennes semestrielles, analyse statistique de corrélation.</p><p><b>Résultats possibles :</b> corrélation négative entre temps d'écran et moyenne.</p><p><b>Conclusion :</b> l'hypothèse H1 est confirmée (H0 rejetée) ; limite : corrélation ne veut pas dire causalité.</p>`,
        checklist: ["La problématique est une question qui relie deux variables", "H1 est testable et donne (ou non) un sens clairement", "H0 dit « aucun effet / aucune relation »", "La méthode cite une population ou un échantillon", "La méthode cite l'outil de collecte et l'analyse", "Les résultats sont factuels (pas d'interprétation)", "La conclusion dit si l'hypothèse est confirmée ou infirmée"] },
      { t: "qcm", q: "Dans cette étude, « le temps passé sur les réseaux sociaux » est…",
        c: ["la variable indépendante", "la variable dépendante", "une variable contrôlée", "l'hypothèse nulle"], a: 0 },
      { t: "qcm", q: "Dans quelle partie du mémoire écrit-on « une corrélation ne prouve pas une cause » ?",
        c: ["La discussion", "Les résultats", "Le résumé", "Le titre"], a: 0, exp: "Les résultats restent objectifs. Les limites et l'interprétation vont dans la discussion." }
    ] },

  /* ─────────────────────────── 3 ─────────────────────────── */
  { id: "hypotheses", ch: "c1", title: "Formuler et classer des hypothèses",
    sub: "H0, H1, directionnelle, non-directionnelle : la méthode en 5 temps.", min: 8,
    steps: [
      { t: "Repère les deux variables", b: `<p>Exemple : une équipe veut savoir si un <b>cache</b> (comme Redis) change le <b>temps de réponse</b> d'une API.</p><ul><li>VI : utilisation ou non du cache.</li><li>VD : temps de réponse (en millisecondes).</li></ul><div class="tip">Toute hypothèse relie au moins deux variables. Si tu n'en trouves qu'une, ce n'est pas encore une hypothèse.</div>` },
      { t: "Écris H1 : il existe une relation", b: `<blockquote class="answer">H1 : L'utilisation d'un cache a un effet sur le temps de réponse de l'API.</blockquote><p>Cette version ne dit pas si le temps augmente ou baisse : elle est <b>non-directionnelle</b>.</p>` },
      { t: "Rends-la directionnelle", b: `<p>On précise le <b>sens</b> de la relation :</p><blockquote class="answer">H1 directionnelle : L'utilisation d'un cache <mark>réduit</mark> le temps de réponse de l'API.</blockquote><p>Mots qui signalent une direction : <i>augmente, réduit, améliore, plus… plus, moins… moins</i>.</p>` },
      { t: "Écris H0 : aucune relation", b: `<blockquote class="answer">H0 : L'utilisation d'un cache n'a <mark>aucun effet</mark> sur le temps de réponse de l'API.</blockquote><p>H0 est ce que le test statistique cherche à rejeter. Mémo : <b>H0 = zéro relation</b>.</p>` },
      { t: "Vérifie avec V-C-P-P", b: `<table class="mini"><tr><th>Critère</th><th>Ici</th></tr><tr><td>Vérifiable / testable</td><td>On mesure le temps avec et sans cache</td></tr><tr><td>Claire et précise</td><td>Variables nommées, unité connue</td></tr><tr><td>Pertinente</td><td>Basée sur la théorie des caches</td></tr><tr><td>Prédictive</td><td>Annonce un résultat attendu</td></tr></table>` }
    ],
    exercise: [
      { t: "qcm", q: "« Les étudiants utilisant des cartes mentales mémorisent mieux que ceux utilisant des résumés classiques. »",
        c: ["Hypothèse directionnelle (H1)", "Hypothèse nulle (H0)", "Hypothèse non-directionnelle", "Ce n'est pas une hypothèse"], a: 0 },
      { t: "qcm", q: "« Le langage de programmation enseigné en première année n'a aucun lien avec la réussite en deuxième année. »",
        c: ["Hypothèse nulle (H0)", "Hypothèse directionnelle", "Hypothèse non-directionnelle", "Problématique"], a: 0 },
      { t: "qcm", q: "« Le travail en binôme influence la qualité du code produit. »",
        c: ["Hypothèse non-directionnelle", "Hypothèse directionnelle", "Hypothèse nulle", "Objectif spécifique"], a: 0 },
      { t: "qcm", q: "« Comment améliorer la sécurité des mots de passe ? »",
        c: ["Ce n'est pas une hypothèse (c'est une question)", "Hypothèse nulle", "Hypothèse directionnelle", "Hypothèse non-directionnelle"], a: 0 },
      { t: "write", q: "Pour l'étude « Effet de la compression des images sur le temps de chargement d'une page web », écris H1 directionnelle, H1 non-directionnelle et H0.",
        model: `<p><b>H1 directionnelle :</b> La compression des images réduit le temps de chargement de la page.<br><b>H1 non-directionnelle :</b> La compression des images a un effet sur le temps de chargement de la page.<br><b>H0 :</b> La compression des images n'a aucun effet sur le temps de chargement de la page.</p>`,
        checklist: ["Les deux variables sont présentes dans chaque hypothèse", "La directionnelle indique un sens (réduit, augmente…)", "La non-directionnelle n'indique pas de sens", "H0 exprime l'absence d'effet ou de relation"] }
    ] },

  /* ─────────────────────────── 4 ─────────────────────────── */
  { id: "cadre", ch: "c1", title: "Construire un cadre conceptuel",
    sub: "Concepts, variables, relations, schéma : les 4 étapes du cours.", min: 10,
    steps: [
      { t: "Le sujet de départ", b: `<blockquote>« L'utilisation régulière des outils numériques améliore la performance académique des étudiants. » (exemple d'hypothèse du TD)</blockquote><p>Le cadre conceptuel est la <b>carte</b> de l'étude : il montre quels concepts on relie et comment.</p>` },
      { t: "Étape 1 · Identifie les concepts clés", b: `<ul><li><b>Outils numériques</b> (plateformes, logiciels, internet).</li><li><b>Performance académique</b> (réussite aux évaluations).</li></ul>` },
      { t: "Étape 2 · Définis les variables", b: `<p>On rend chaque concept <b>mesurable</b> :</p><table class="mini"><tr><th>Rôle</th><th>Variable</th><th>Mesure</th></tr><tr><td>Indépendante (VI)</td><td>Fréquence d'utilisation des outils numériques</td><td>heures / semaine</td></tr><tr><td>Dépendante (VD)</td><td>Performance académique</td><td>moyenne sur 20</td></tr><tr><td>Modératrice</td><td>Qualité de l'accès à internet</td><td>bon / moyen / faible</td></tr><tr><td>Contrôlée</td><td>Filière, niveau d'études</td><td>identiques</td></tr></table>` },
      { t: "Étape 3 · Détermine les relations attendues", b: `<p>Relation attendue : <b>VI → VD, positive</b> (plus d'usage, meilleure moyenne). La variable modératrice peut <b>renforcer ou affaiblir</b> ce lien : avec un accès internet faible, l'effet est sans doute plus petit.</p>` },
      { t: "Étape 4 · Illustre par un schéma", b: `<figure class="diagram"><svg viewBox="0 0 560 230" role="img" aria-label="Schéma du cadre conceptuel">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="svg-ink"/></marker></defs>
        <rect x="10" y="120" width="190" height="70" rx="8" class="svg-box"/><text x="105" y="148" class="svg-t">VI</text><text x="105" y="170" class="svg-s">Usage des outils numériques</text>
        <rect x="360" y="120" width="190" height="70" rx="8" class="svg-box"/><text x="455" y="148" class="svg-t">VD</text><text x="455" y="170" class="svg-s">Performance académique</text>
        <line x1="200" y1="155" x2="356" y2="155" class="svg-line" marker-end="url(#ah)"/><text x="278" y="146" class="svg-s">relation +</text>
        <rect x="185" y="14" width="190" height="56" rx="28" class="svg-box alt"/><text x="280" y="38" class="svg-t">Modératrice</text><text x="280" y="58" class="svg-s">Accès à internet</text>
        <line x1="280" y1="70" x2="280" y2="150" class="svg-line dash" marker-end="url(#ah)"/>
        <text x="280" y="218" class="svg-s">Contrôlées : filière, niveau</text></svg></figure>
        <p>Ce schéma suffit au devoir : deux boîtes (VI, VD), une flèche avec le sens attendu, la modératrice qui pointe sur la flèche.</p>` }
    ],
    exercise: [
      { t: "match", q: "Étude : « Effet d'une formation à la cybersécurité sur le nombre d'incidents d'hameçonnage dans une entreprise ». Associe chaque élément à son rôle.",
        pairs: [["Participation à la formation", "Variable indépendante"], ["Nombre d'incidents d'hameçonnage", "Variable dépendante"], ["Ancienneté des employés", "Variable modératrice"], ["Même période d'observation", "Variable contrôlée"]] },
      { t: "qcm", q: "Quelle relation attend-on entre la formation et les incidents ?",
        c: ["Négative : plus de formation, moins d'incidents", "Positive : plus de formation, plus d'incidents", "Aucune relation", "On ne peut rien attendre"], a: 0 },
      { t: "order", q: "Remets dans l'ordre les étapes d'élaboration d'un cadre conceptuel.",
        items: ["Identifier les concepts clés", "Définir les variables", "Déterminer les relations attendues", "Illustrer par un schéma"] }
    ] },

  /* ─────────────────────────── 5 ─────────────────────────── */
  { id: "experience", ch: "c2", title: "Concevoir une expérience : comparer deux algorithmes",
    sub: "Les 6 étapes de la méthode expérimentale appliquées à un cas réel.", min: 12,
    steps: [
      { t: "La question", b: `<p>Le tri rapide (quicksort) est-il plus rapide que le tri fusion (mergesort) sur de grands tableaux ? On suit le mémo <b>H-V-C-R-A-I</b>.</p>` },
      { t: "1 · Formuler l'hypothèse", b: `<blockquote class="answer">H1 : Sur des tableaux aléatoires d'un million d'entiers, le tri rapide s'exécute plus vite que le tri fusion.</blockquote><p>Simple, précise, testable. H0 : il n'y a pas de différence de temps.</p>` },
      { t: "2 · Choisir les variables", b: `<table class="mini"><tr><th>Type</th><th>Ici</th></tr><tr><td>VI (manipulée)</td><td>L'algorithme : tri rapide ou tri fusion</td></tr><tr><td>VD (mesurée)</td><td>Temps d'exécution (ms), mémoire utilisée</td></tr><tr><td>Contrôlées</td><td>Même machine, même langage, mêmes données, même taille</td></tr><tr><td>Parasites à neutraliser</td><td>Autres programmes en cours, température du processeur</td></tr></table>` },
      { t: "3 · Concevoir l'expérience", b: `<ul><li>Trois jeux de données : aléatoire, déjà trié, trié à l'envers.</li><li>30 répétitions par algorithme et par jeu, pour lisser le hasard.</li><li>Type : <b>expérience de laboratoire</b> (conditions strictement contrôlées).</li></ul>` },
      { t: "4 · Réaliser l'expérience", b: `<p>On exécute exactement le protocole, sans le modifier en cours de route, et on enregistre chaque mesure (traces d'exécution, logs).</p>` },
      { t: "5 · Analyser les données", b: `<table class="mini"><tr><th>Jeu</th><th>Tri rapide (ms)</th><th>Tri fusion (ms)</th></tr><tr><td>Aléatoire</td><td>82 ± 4</td><td>101 ± 3</td></tr><tr><td>Trié</td><td>95 ± 6</td><td>88 ± 2</td></tr><tr><td>Inversé</td><td>97 ± 5</td><td>90 ± 3</td></tr></table>
        <p>Moyenne ± écart-type sur 30 essais (chiffres d'illustration). Un <b>test t</b> dit si l'écart est significatif.</p>` },
      { t: "6 · Interpréter", b: `<p>Sur données aléatoires, l'hypothèse est <b>confirmée</b>. Sur données déjà triées, elle est <b>infirmée</b> : la réponse dépend du jeu de données. C'est un bon exemple de <b>robustesse</b> à discuter.</p><div class="tip">Les limites de la méthode expérimentale à citer : variables difficiles à manipuler, conditions artificielles, éthique.</div>` }
    ],
    exercise: [
      { t: "order", q: "Une équipe veut tester si un cache améliore le temps de réponse d'une API. Remets ses étapes dans l'ordre.",
        items: ["Formuler : « Le cache réduit le temps de réponse »", "Choisir VI (cache oui/non), VD (temps), variables contrôlées", "Concevoir le protocole (1 000 requêtes, même serveur)", "Lancer les requêtes selon le protocole", "Calculer moyennes et écarts-types, faire un test t", "Conclure : hypothèse confirmée ou infirmée"] },
      { t: "match", q: "Pour cette expérience sur le cache, associe chaque élément à son rôle.",
        pairs: [["Cache activé ou non", "Variable indépendante"], ["Temps de réponse en ms", "Variable dépendante"], ["Même serveur et même réseau", "Variable contrôlée"], ["Une mise à jour système pendant le test", "Variable parasite"]] },
      { t: "qcm", q: "Le test se fait sur le vrai site, avec de vrais utilisateurs, sans contrôle total du trafic. Quel type d'expérience ?",
        c: ["Expérience de terrain", "Expérience de laboratoire", "Méthode déductive", "Revue systématique"], a: 0 },
      { t: "write", q: "Rédige le protocole de cette expérience en 4 à 6 lignes (hypothèse, variables, conception, analyse).",
        model: `<p><b>Hypothèse :</b> l'activation du cache réduit le temps de réponse moyen de l'API.<br><b>VI :</b> cache activé / désactivé. <b>VD :</b> temps de réponse (ms). <b>Contrôlées :</b> même serveur, même réseau, mêmes requêtes.<br><b>Conception :</b> 1 000 requêtes identiques par condition, répétées 10 fois, en laboratoire.<br><b>Analyse :</b> moyenne et écart-type par condition, test t pour la significativité, puis conclusion.</p>`,
        checklist: ["Une hypothèse testable", "VI et VD nommées", "Au moins une variable contrôlée", "Des répétitions prévues", "Une méthode d'analyse (statistiques, test)"] }
    ] },

  /* ─────────────────────────── 6 ─────────────────────────── */
  { id: "statistiques", ch: "c2", src: "TD", title: "Statistiques descriptives pas à pas",
    sub: "Moyenne, médiane, mode, étendue, variance, écart-type, quartiles : calcul guidé puis séries aléatoires.", min: 15, special: "stats",
    steps: [
      { t: "La série", b: `<p>Temps d'exécution d'un programme, mesuré 8 fois (en ms) :</p><p class="series">12 · 15 · 11 · 15 · 18 · 14 · 15 · 20</p><p><b>Premier réflexe : ranger dans l'ordre croissant.</b></p><p class="series">11 · 12 · 14 · 15 · 15 · 15 · 18 · 20</p><p>Effectif : n = 8.</p>` },
      { t: "Moyenne", b: `<p>Moyenne = somme des valeurs ÷ nombre de valeurs.</p><p class="calc">11 + 12 + 14 + 15 + 15 + 15 + 18 + 20 = 120<br>120 ÷ 8 = <b>15 ms</b></p>` },
      { t: "Médiane", b: `<p>La valeur centrale de la série <b>rangée</b>.</p><ul><li>n impair : la valeur du milieu.</li><li>n pair : la moyenne des deux valeurs du milieu.</li></ul><p class="calc">n = 8 (pair) → 4ᵉ et 5ᵉ valeurs : 15 et 15<br>Médiane = (15 + 15) ÷ 2 = <b>15 ms</b></p>` },
      { t: "Mode", b: `<p>La valeur la plus fréquente.</p><p class="calc">15 apparaît 3 fois → mode = <b>15 ms</b></p>` },
      { t: "Étendue", b: `<p>Étendue = maximum − minimum.</p><p class="calc">20 − 11 = <b>9 ms</b></p>` },
      { t: "Variance et écart-type", b: `<p>On mesure la dispersion autour de la moyenne (15).</p>
        <table class="mini num"><tr><th>xᵢ</th><td>11</td><td>12</td><td>14</td><td>15</td><td>15</td><td>15</td><td>18</td><td>20</td></tr><tr><th>xᵢ − 15</th><td>−4</td><td>−3</td><td>−1</td><td>0</td><td>0</td><td>0</td><td>3</td><td>5</td></tr><tr><th>(xᵢ − 15)²</th><td>16</td><td>9</td><td>1</td><td>0</td><td>0</td><td>0</td><td>9</td><td>25</td></tr></table>
        <p class="calc">Somme des carrés = 60<br>Variance = 60 ÷ 8 = <b>7,5</b><br>Écart-type = √7,5 ≈ <b>2,74 ms</b></p>
        <div class="tip">Le TD dit : variance = carré de l'écart-type. On divise ici par n (variance de la population). Certains profs divisent par n − 1 pour un échantillon : 60 ÷ 7 ≈ 8,57 et écart-type ≈ 2,93. Suis la convention de ton enseignant.</div>` },
      { t: "Quartiles et IQR", b: `<p>Méthode simple : couper la série rangée en deux moitiés, puis prendre la médiane de chaque moitié.</p><p class="calc">Moitié basse : 11 · 12 · 14 · 15 → Q1 = (12 + 14) ÷ 2 = <b>13</b><br>Moitié haute : 15 · 15 · 18 · 20 → Q3 = (15 + 18) ÷ 2 = <b>16,5</b><br>IQR = Q3 − Q1 = <b>3,5 ms</b></p><p>Avec n impair, on exclut la médiane des deux moitiés. Ces valeurs servent à tracer un <b>boxplot</b>.</p>` },
      { t: "À toi : séries aléatoires", b: `<p>En bas de la page, une nouvelle série est générée à chaque fois. Calcule à la main (brouillon autorisé, calculatrice aussi), saisis tes réponses, puis regarde la correction détaillée.</p>` }
    ],
    exercise: [] },

  /* ─────────────────────────── 7 ─────────────────────────── */
  { id: "complexite", ch: "c2", src: "TD", title: "Comparer des algorithmes : complexité et critères",
    sub: "Lire une complexité, estimer un coût, choisir selon les critères T-M-P-R.", min: 10,
    steps: [
      { t: "Ce que mesure la complexité", b: `<p>La complexité donne l'<b>ordre de grandeur</b> du nombre d'opérations en fonction de la taille n des données.</p><table class="mini num"><tr><th>n</th><th>O(log₂ n)</th><th>O(n)</th><th>O(n log₂ n)</th><th>O(n²)</th></tr><tr><td>10</td><td>≈ 3</td><td>10</td><td>≈ 33</td><td>100</td></tr><tr><td>1 000</td><td>≈ 10</td><td>1 000</td><td>≈ 10 000</td><td>1 000 000</td></tr><tr><td>1 000 000</td><td>≈ 20</td><td>10⁶</td><td>≈ 2 × 10⁷</td><td>10¹²</td></tr></table>
        <div class="tip">Astuce de calcul : 2¹⁰ = 1 024 ≈ 1 000, donc log₂(1 000) ≈ 10 et log₂(1 000 000) ≈ 20.</div>` },
      { t: "Classer les complexités", b: `<p class="calc">O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²)</p><p>Exemples classiques : recherche dichotomique en O(log n), parcours d'un tableau en O(n), tri fusion en O(n log n), tri à bulles en O(n²).</p>` },
      { t: "Analyse théorique + expérimentale", b: `<p>Le cours cite trois méthodes de comparaison :</p><ul><li><b>Analyse théorique</b> : complexité, pire cas, meilleur cas.</li><li><b>Analyse expérimentale</b> : tests sur plusieurs jeux de données.</li><li><b>Tests statistiques</b> : test t, ANOVA, tests non paramétriques.</li></ul>` },
      { t: "Choisir selon T-M-P-R", b: `<p>Trois algorithmes de détection de spam, testés sur le même jeu de données :</p><table class="mini"><tr><th></th><th>Temps</th><th>Mémoire</th><th>Précision</th><th>Robustesse</th></tr><tr><td>A</td><td>12 ms</td><td>500 Mo</td><td>97 %</td><td>stable</td></tr><tr><td>B</td><td>3 ms</td><td>40 Mo</td><td>91 %</td><td>stable</td></tr><tr><td>C</td><td>5 ms</td><td>60 Mo</td><td>95 %</td><td>instable</td></tr></table>
        <p>Il n'y a pas de « meilleur » absolu : <b>sur un serveur puissant</b> où la précision compte, A. <b>Sur un téléphone</b> (peu de mémoire), B. C est écarté pour son instabilité.</p><p class="small">Chiffres d'illustration.</p>` },
      { t: "Présenter la comparaison", b: `<p>On visualise avec un <b>graphique en barres ou en lignes</b> et un <b>tableau synthétique</b>, puis on justifie le choix par les critères.</p>` }
    ],
    exercise: [
      { t: "num", q: "Pour n = 1 000 000, combien d'opérations environ pour un algorithme en O(log₂ n) ?", a: 20, tol: 1 },
      { t: "num", q: "Pour n = 10 000, combien d'opérations pour un algorithme en O(n²) ? (écris le nombre entier)", a: 100000000, tol: 0 },
      { t: "order", q: "Classe du plus rapide au plus lent pour n grand : tri à bulles, recherche dichotomique, parcours linéaire, tri fusion.",
        items: ["Recherche dichotomique — O(log n)", "Parcours linéaire — O(n)", "Tri fusion — O(n log n)", "Tri à bulles — O(n²)"] },
      { t: "qcm", q: "Avec le tableau A/B/C ci-dessus, quel algorithme choisir pour un objet connecté disposant de 64 Mo de mémoire ?",
        c: ["B : il tient en mémoire, il est rapide et stable", "A : il est le plus précis", "C : il est instable mais précis", "Aucun"], a: 0 },
      { t: "list", q: "Cite les 4 critères de comparaison d'algorithmes.", items: [L("Temps d'exécution", "temps"), L("Consommation mémoire", "memoire"), L("Précision / exactitude", "precision", "exactitude"), L("Robustesse / stabilité", "robust", "stabil")], need: 4 }
    ] },

  /* ─────────────────────────── 8 ─────────────────────────── */
  { id: "plagiat", ch: "c3", src: "C25", title: "Plagiat : reconnaître et corriger",
    sub: "Quatre versions d'un même passage, pour voir la différence entre plagier, citer et paraphraser.", min: 10,
    steps: [
      { t: "Le texte source", b: `<p>Imaginons un article (source [1]) qui écrit :</p><blockquote>« Les systèmes de recommandation exploitent l'historique des utilisateurs pour prédire leurs préférences futures. »</blockquote>` },
      { t: "Version 1 · Plagiat direct", b: `<blockquote class="bad">Les systèmes de recommandation exploitent l'historique des utilisateurs pour prédire leurs préférences futures.</blockquote><p>Copié-collé, sans guillemets ni source. C'est du <b>plagiat direct</b>.</p>` },
      { t: "Version 2 · Plagiat mosaïque", b: `<blockquote class="bad">Les outils de recommandation exploitent l'historique des clients afin de deviner leurs préférences futures.</blockquote><p>Quelques mots changés, la structure et des morceaux gardés, aucune source : <b>plagiat mosaïque</b>.</p>` },
      { t: "Version 3 · Plagiat d'idées", b: `<blockquote class="bad">Notre étude montre que l'historique d'un utilisateur permet de prévoir ce qu'il aimera.</blockquote><p>Les mots sont nouveaux, mais l'idée (le résultat) est présentée comme la sienne : <b>plagiat d'idées</b>.</p>` },
      { t: "Version correcte · Citation", b: `<blockquote class="good">Selon [1], « les systèmes de recommandation exploitent l'historique des utilisateurs pour prédire leurs préférences futures ».</blockquote><ul><li>Guillemets.</li><li>Texte exact, ponctuation comprise.</li><li>Numéro de renvoi, référence complète en bibliographie.</li></ul>` },
      { t: "Version correcte · Paraphrase", b: `<blockquote class="good">Les moteurs de recommandation s'appuient sur les actions passées d'un utilisateur pour anticiper ce qu'il appréciera [1].</blockquote><p>Idée reformulée avec ses propres mots <b>et</b> source indiquée. Et l'<b>auto-plagiat</b> ? Reprendre un de ses propres articles déjà publiés sans le citer, ou envoyer le même article à plusieurs revues.</p>` }
    ],
    exercise: [
      { t: "qcm", q: "Awa reprend un tableau de résultats d'une thèse, change les couleurs, et ne cite pas la thèse.", c: ["Plagiat d'idées (résultats d'autrui)", "Auto-plagiat", "Citation correcte", "Paraphrase correcte"], a: 0 },
      { t: "qcm", q: "Ibrahim soumet le même article à deux conférences en même temps.", c: ["Auto-plagiat", "Plagiat direct", "Plagiat mosaïque", "Pratique normale"], a: 0 },
      { t: "qcm", q: "Fatim alterne ses phrases et des phrases copiées d'un blog, sans le citer.", c: ["Plagiat mosaïque", "Plagiat direct", "Auto-plagiat", "Citation"], a: 0 },
      { t: "qcm", q: "Moussa met une phrase entre guillemets, garde même une faute d'orthographe de l'original, et ajoute [3].", c: ["Citation correcte", "Plagiat direct", "Plagiat d'idées", "Auto-plagiat"], a: 0, exp: "Le cours demande bien de conserver ponctuation, majuscules et même fautes d'orthographe de l'original." },
      { t: "write", q: "Source [2] : « Le chiffrement de bout en bout empêche l'opérateur de lire le contenu des messages. » Écris une citation correcte, puis une paraphrase correcte.",
        model: `<p><b>Citation :</b> D'après [2], « le chiffrement de bout en bout empêche l'opérateur de lire le contenu des messages ».</p><p><b>Paraphrase :</b> Avec un chiffrement de bout en bout, même le fournisseur du service ne peut pas accéder au contenu des échanges [2].</p>`,
        checklist: ["La citation est entre guillemets", "La citation reprend le texte exact", "La paraphrase utilise d'autres mots", "Les deux indiquent la source [2]"] },
      { t: "grid", q: "Complète le tableau des sanctions (contrôle 2025).", cols: ["Sanction 1", "Sanction 2"], anyOrder: true,
        rows: [{ label: "Académique", vals: ["Rétractation d'articles", "Perte de crédits ou diplômes"] }, { label: "Professionnel", vals: ["Atteinte à la réputation", "Exclusion de projets ou financements"] }, { label: "Légal", vals: ["Violation du droit d'auteur", "Poursuites judiciaires"] }] }
    ] },

  /* ─────────────────────────── 9 ─────────────────────────── */
  { id: "bibliographie", ch: "c3", title: "Rédiger et classer une bibliographie",
    sub: "Les formats du cours et la règle de classement alphabétique puis chronologique.", min: 8,
    steps: [
      { t: "Les trois formats du cours", b: `<ul><li><b>Article / livre :</b> Auteur(s), Prénoms (date), <i>Titre</i>, Lieu d'édition : Éditeur, nombre de pages.</li><li><b>Chapitre de livre :</b> Auteur(s), Prénoms (date), « Titre du chapitre », dans <i>Titre du livre</i>. Lieu : Éditeur, p. 0-1.</li><li><b>Section de site web :</b> Auteur(s), Prénoms (date), Titre de la section, sur le site Nom du site. Consulté le (date), adresse web.</li></ul>` },
      { t: "Exemple rédigé", b: `<p class="ref">Traoré, Aminata (2021), <i>Introduction aux réseaux de capteurs</i>, Ouagadougou : Presses universitaires, 214 p.</p><p class="ref">Ouédraogo, Paul (2019), « Sécurité des objets connectés », dans <i>Informatique et société</i>. Paris : Éditions Savoirs, p. 45-67.</p><p class="small">Références inventées pour l'exercice.</p>` },
      { t: "La règle de classement", b: `<p>En sciences et techniques : <b>ordre alphabétique</b> des auteurs, puis <b>année croissante</b> quand un même auteur apparaît plusieurs fois.</p><p class="calc">Kaboré 2018 → Kaboré 2022 → Sawadogo 2015 → Zongo 2010</p>` },
      { t: "Styles et outils", b: `<p>On respecte un style : <b>APA</b> (Auteur, année), <b>IEEE</b> ([1], [2]), <b>ACM</b>, <b>Vancouver</b>. On génère la liste automatiquement avec <b>Zotero</b>, <b>Mendeley</b>, <b>EndNote</b> ou LaTeX.</p>` }
    ],
    exercise: [
      { t: "order", q: "Classe ces références selon la règle du cours.",
        items: ["Compaoré, Jean (2017)", "Compaoré, Jean (2023)", "Diallo, Mariam (2020)", "Nikiéma, Issa (2016)", "Zerbo, Alice (2019)"] },
      { t: "qcm", q: "Quel est le bon format pour un chapitre de livre ?",
        c: ["Sanou, Léa (2020), « Big Data et santé », dans Données et société. Bobo-Dioulasso : Éditions Horizon, p. 12-30.", "Big Data et santé, Sanou, Éditions Horizon", "Sanou (2020), Éditions Horizon, 230 pages, Big Data", "www.horizon.bf/bigdata"], a: 0 },
      { t: "qcm", q: "Que doit-on absolument ajouter quand on cite une section de site web ?",
        c: ["La date de consultation et l'adresse web", "Le nombre de pages", "Le prix du site", "Le nom de l'hébergeur"], a: 0 }
    ] },

  /* ─────────────────────────── 10 ─────────────────────────── */
  { id: "types-recherche", ch: "c1", src: "C25", title: "Réussir la question « types de recherche » (12 points)",
    sub: "La question du contrôle 2025 : définition + exemple + outils pour chaque type.", min: 10,
    steps: [
      { t: "Lire la consigne comme un correcteur", b: `<blockquote>Citer les différents types de recherche. Pour chaque type : une définition, un exemple, des outils de recherche adaptés. (12 pts = 3 × 4 pts)</blockquote><p>Il y a donc <b>9 cases à remplir</b>. Une réponse en tableau est claire et rapide à corriger.</p>` },
      { t: "Recherche fondamentale", b: `<p><b>Définition :</b> <mark>exploration théorique</mark> visant à générer de <mark>nouvelles connaissances</mark> <mark>sans application immédiate</mark>.</p><p><b>Exemple :</b> algorithmes de l'IA, cryptographie, structures de données.</p><p><b>Outils :</b> ce sont les outils des <b>méthodes théoriques</b> (R-C-M-A) : revue de littérature, conceptualisation, modélisation théorique, analyse logique et critique.</p>` },
      { t: "Recherche appliquée", b: `<p><b>Définition :</b> vise à <mark>résoudre des problèmes concrets</mark> en utilisant des <mark>connaissances théoriques</mark> ; se nourrit de la recherche fondamentale.</p><p><b>Exemple :</b> optimisation de réseaux, logiciels éducatifs.</p><p><b>Outils :</b> ceux des <b>méthodes appliquées</b> (E-Q-Q) : expérimentales (observations, tests, simulations), quantitatives (statistiques, modélisation, analyse de données), qualitatives (études de cas, entretiens, questionnaires, observation participante).</p>` },
      { t: "Recherche développement expérimental", b: `<p><b>Définition :</b> <mark>conception et expérimentation de prototypes</mark> ou de systèmes pour tester des solutions ; vise à <mark>valider la faisabilité et l'efficacité</mark>.</p><p><b>Exemple :</b> développement logiciel, algorithmes de compression.</p><p><b>Outils :</b> ceux des <b>méthodes expérimentales</b> : expérience de laboratoire (strictement contrôlée), de terrain (conditions naturelles), quasi-expérimentale (contrôle partiel).</p>` },
      { t: "La clé pour retenir", b: `<table class="mini"><tr><th>Type</th><th>Méthodes du ch. 2</th><th>Mémo</th></tr><tr><td>Fondamentale</td><td>Théoriques</td><td>R-C-M-A</td></tr><tr><td>Appliquée</td><td>Appliquées</td><td>E-Q-Q</td></tr><tr><td>Développement expérimental</td><td>Expérimentales</td><td>Labo / Terrain / Quasi</td></tr></table><div class="tip">Le chapitre 1 donne les définitions et exemples, le chapitre 2 donne les outils. Le contrôle croisait les deux.</div>` }
    ],
    exercise: [
      { t: "qcm", q: "Projet : prouver une nouvelle borne de complexité pour un problème de graphes.", c: ["Fondamentale", "Appliquée", "Développement expérimental"], a: 0 },
      { t: "qcm", q: "Projet : adapter un algorithme de routage existant pour réduire la congestion du réseau d'une université.", c: ["Appliquée", "Fondamentale", "Développement expérimental"], a: 0 },
      { t: "qcm", q: "Projet : construire et tester un prototype d'application de paiement mobile hors ligne, par itérations.", c: ["Développement expérimental", "Fondamentale", "Appliquée"], a: 0 },
      { t: "qcm", q: "Quels outils sont adaptés à la recherche fondamentale ?", c: ["Revue de littérature, conceptualisation, modélisation théorique, analyse logique et critique", "Expérience de laboratoire, de terrain, quasi-expérimentale", "Études de cas, entretiens, questionnaires", "Soutenance, poster, colloque"], a: 0 },
      { t: "grid", q: "Complète le tableau comme au contrôle.", cols: ["Exemple", "Outils adaptés"],
        rows: [{ label: "Fondamentale", vals: ["Cryptographie, structures de données", "Revue de littérature, modélisation théorique"] }, { label: "Appliquée", vals: ["Optimisation de réseaux, logiciels éducatifs", "Méthodes expérimentales, quantitatives, qualitatives"] }, { label: "Développement expérimental", vals: ["Développement logiciel, compression", "Expériences de laboratoire, de terrain, quasi-expérimentales"] }] }
    ] },

  /* ─────────────────────────── 11 ─────────────────────────── */
  { id: "redaction", ch: "c3", src: "C25", title: "Rendre un texte clair et concis",
    sub: "Réécrire une phrase lourde en appliquant les règles du cours, étape par étape.", min: 8,
    steps: [
      { t: "La phrase de départ", b: `<blockquote class="bad">Il est important de noter que, dans le cadre de cette étude qui a été réalisée par nous, une analyse des données a été effectuée de manière approfondie afin de pouvoir déterminer si oui ou non l'algorithme proposé était en mesure d'améliorer les performances.</blockquote><p>45 mots. Le cours vise <b>15 à 20 mots</b> par phrase.</p>` },
      { t: "1 · Supprimer les redondances (concision)", b: `<p>On barre ce qui n'apporte rien :</p><p><s>Il est important de noter que,</s> <s>dans le cadre de cette étude qui a été réalisée par nous,</s> une analyse… <s>si oui ou non</s> → <b>si</b>.</p>` },
      { t: "2 · Remplacer les expressions longues (concision)", b: `<ul><li>« de manière approfondie » → <b>en profondeur</b></li><li>« afin de pouvoir déterminer » → <b>pour déterminer</b></li><li>« était en mesure d'améliorer » → <b>améliore</b></li></ul>` },
      { t: "3 · Passer à la voix active (concision)", b: `<p>« une analyse des données a été effectuée » → <b>« Nous avons analysé les données »</b>. Le sujet fait l'action, la phrase commence par le sujet et le verbe.</p>` },
      { t: "4 · Vérifier la clarté", b: `<blockquote class="good">Nous avons analysé les données en profondeur pour déterminer si l'algorithme proposé améliore les performances.</blockquote><p>15 mots. Vocabulaire simple, phrase courte et directe, idée unique, pas de jargon.</p><div class="tip">Clarté (4) : vocabulaire simple · phrases courtes · structure logique · pas de jargon. Concision (3) : redondances · mots simples · voix active.</div>` }
    ],
    exercise: [
      { t: "write", q: "Réécris de façon claire et concise : « Au niveau de la méthodologie qui a été adoptée, il a été procédé à la mise en place d'un questionnaire qui a été distribué à un ensemble de 120 étudiants dans le but de recueillir leurs avis. »",
        model: `<p>Nous avons distribué un questionnaire à 120 étudiants pour recueillir leurs avis.</p>`,
        checklist: ["Voix active (« Nous avons… »)", "Plus de « il a été procédé à la mise en place de »", "« dans le but de » remplacé par « pour »", "Une seule phrase de 15 mots environ ou moins", "Le sens est conservé (questionnaire, 120 étudiants, avis)"] },
      { t: "write", q: "Réécris : « Il convient de souligner le fait que les résultats obtenus par le biais de notre expérimentation sont susceptibles de pouvoir être généralisés. »",
        model: `<p>Nos résultats expérimentaux peuvent être généralisés.</p><p class="small">ou, en voix active : « On peut généraliser nos résultats expérimentaux. »</p>`,
        checklist: ["« Il convient de souligner le fait que » supprimé", "« par le biais de » supprimé ou remplacé", "« sont susceptibles de pouvoir » simplifié", "Phrase courte"] },
      { t: "qcm", q: "Remplacer « procéder à l'analyse de » par « analyser » relève de…", c: ["La concision (expressions longues → mots simples)", "La clarté (jargon)", "La structure du mémoire", "La bibliographie"], a: 0 },
      { t: "qcm", q: "Expliquer le terme « latence » la première fois qu'on l'utilise relève de…", c: ["La clarté (pas de terme technique non expliqué)", "La concision", "La paraphrase", "L'auto-plagiat"], a: 0 }
    ] },

  /* ─────────────────────────── 12 ─────────────────────────── */
  { id: "structure", ch: "c3", src: "C25", title: "Le tableau de structure du mémoire",
    sub: "Exercice 3 du contrôle 2025 : section, contenu clé, critère d'analyse.", min: 12,
    steps: [
      { t: "La consigne", b: `<p>Le contrôle donnait la colonne « Structure / Section » et demandait de compléter « Contenu clé » et « Analyse ». Retiens les sections dans l'ordre :</p><div class="flow"><span>Titre</span><span>Résumé</span><span>Introduction</span><span>Travaux liés</span><span>Méthodologie</span><span>Développement</span><span>Résultats</span><span>Discussion</span><span>Conclusion</span><span>Bibliographie</span><span>Annexes</span></div>` },
      { t: "Titre, résumé, introduction", b: `<table class="mini"><tr><th>Section</th><th>Contenu clé</th><th>Analyse</th></tr><tr><td>Titre</td><td>Sujet principal</td><td><b>Pertinence</b> : clair, précis, informatif, reflète l'objectif, pas de termes vagues</td></tr><tr><td>Résumé</td><td>Approche, résultats</td><td><b>Pertinence et impact</b> : synthèse (contexte, objectifs, méthodo, résultats)</td></tr><tr><td>Introduction</td><td>Contexte, problématique, objectifs, plan</td><td><b>Originalité et justification</b></td></tr></table>` },
      { t: "Travaux liés, méthodologie, développement", b: `<table class="mini"><tr><th>Section</th><th>Contenu clé</th><th>Analyse</th></tr><tr><td>Travaux liés</td><td>État de l'art</td><td><b>Intérêt et importance</b> : complétude, actualité</td></tr><tr><td>Méthodologie</td><td>Algorithmes, modèles, données, outils</td><td><b>Pertinence et reproductibilité</b></td></tr><tr><td>Développement</td><td>Méthodologie, résultats, discussion</td><td><b>Clarté et concision</b> de la rédaction</td></tr></table>` },
      { t: "Résultats, discussion, conclusion", b: `<table class="mini"><tr><th>Section</th><th>Contenu clé</th><th>Analyse</th></tr><tr><td>Résultats</td><td>Tests, benchmarks, mesures</td><td><b>Rigueur, comparaisons, visualisation</b></td></tr><tr><td>Discussion</td><td>Interprétation, implications</td><td><b>Cohérence et validité</b></td></tr><tr><td>Conclusion</td><td>Résumé, contributions, perspectives</td><td><b>Clarté, limites, travaux futurs</b></td></tr></table>` },
      { t: "Bibliographie, annexes", b: `<table class="mini"><tr><th>Section</th><th>Contenu clé</th><th>Analyse</th></tr><tr><td>Bibliographie</td><td>Sources citées</td><td><b>Pertinence, qualité des sources</b> (Zotero, Mendeley, EndNote, LaTeX)</td></tr><tr><td>Annexes</td><td>Complément informatif</td><td><b>Pertinence, qualité</b> : croquis, tableaux, questionnaires, données brutes</td></tr></table>
        <div class="tip">Truc : le critère d'analyse répond à « qu'est-ce que le jury vérifie dans cette section ? ». Méthodologie → peut-on la refaire (reproductibilité) ? Discussion → les conclusions tiennent-elles (cohérence, validité) ?</div>` }
    ],
    exercise: [
      { t: "grid", q: "Complète le tableau du contrôle 2025.", cols: ["Contenu clé", "Analyse"],
        rows: [
          { label: "Titre", vals: ["Sujet principal", "Pertinence"] },
          { label: "Résumé", vals: ["Approche, résultats", "Pertinence et impact"] },
          { label: "Introduction", vals: ["Contexte, problématique, objectifs, plan", "Originalité et justification"] },
          { label: "Travaux liés", vals: ["État de l'art", "Intérêt et importance"] },
          { label: "Méthodologie", vals: ["Algorithmes, modèles, données, outils", "Pertinence et reproductibilité"] },
          { label: "Résultats", vals: ["Tests, benchmarks, mesures", "Rigueur, comparaisons, visualisation"] },
          { label: "Discussion", vals: ["Interprétation, implications", "Cohérence et validité"] },
          { label: "Conclusion", vals: ["Résumé, contributions, perspectives", "Clarté, limites, travaux futurs"] },
          { label: "Bibliographie", vals: ["Sources citées", "Pertinence, qualité des sources"] }
        ] }
    ] }
  ];
})();
