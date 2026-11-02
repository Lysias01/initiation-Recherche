# Carnet de recherche

Site de révision pour le cours **Initiation à la recherche** (Master Informatique, UJKZ / IBAM).

En ligne : **https://lysias01.github.io/initiation-Recherche/**

- **Fiches mémo** : 80 définitions courtes avec moyens mnémotechniques (mode liste ou cartes à retourner).
- **Quiz** : 216 questions de cours (QCM, vrai/faux, associations, remise en ordre, réponses écrites et énumérations corrigées par mots-clés). Filtre « déjà tombé au contrôle 2025 », révision intelligente des points faibles.
- **Cas pratiques** : 12 cas expliqués étape par étape, avec lecture guidée à voix haute, puis exercices « comme au devoir » (dont un générateur de séries statistiques).
- **Examens** : le contrôle d'octobre 2025, deux sujets blancs et un examen éclair, chronométrés et notés sur 20.
- Fonctionne hors ligne une fois ouvert (installable sur téléphone), progression enregistrée dans le navigateur.

## Mettre en ligne sur GitHub Pages

1. Crée un dépôt sur GitHub (par exemple `carnet-recherche`), public.
2. Envoie **le contenu de ce dossier** à la racine du dépôt (bouton *Add file → Upload files*, glisse tous les fichiers et le dossier `assets`, puis *Commit changes*).
3. Dans le dépôt : *Settings → Pages → Build and deployment → Source : Deploy from a branch*, branche `main`, dossier `/ (root)`, *Save*.
4. Après une minute, le site est en ligne à l'adresse `https://<ton-pseudo>.github.io/carnet-recherche/`.

Sur téléphone, ouvre l'adresse puis *Ajouter à l'écran d'accueil* : l'application s'ouvre alors comme une appli et marche sans connexion.

## Tester en local

Ouvre `index.html` directement dans un navigateur, ou lance `python3 -m http.server` dans ce dossier puis va sur http://localhost:8000.

## Modifier le contenu

Tout le contenu est dans `assets/` :

| Fichier | Contenu |
|---|---|
| `data-fiches.js` | les fiches de définitions |
| `data-questions.js` | la banque de questions (format expliqué en haut du fichier) |
| `data-cas.js` | les cas pratiques pas à pas |
| `data-examens.js` | les sujets d'examen et leur barème |

Après une modification, change le numéro de version dans `sw.js` (par exemple `carnet-recherche-v2` → `v3`) pour que les téléphones récupèrent la nouvelle version.
