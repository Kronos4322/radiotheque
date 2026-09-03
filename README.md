# Radiothèque 📻

Bibliothèque personnelle pour **trier ses écoutes** de podcasts et d'émissions
(France Culture / Radio France, YouTube, Spotify, ArteRadio…). On colle un lien,
on classe : statut, thème, tags, note /5, commentaire. L'appli sert à
**organiser et retrouver** — la lecture s'ouvre dans le navigateur ou l'appli
Radio France.

C'est une page HTML autonome, sans dépendance de build. Tout tient dans
[`index.html`](index.html).

## Fonctions

- Ajout par lien, avec devinette automatique du titre et de l'émission depuis l'URL
- Statut : **À écouter → En cours → Écouté**
- Thèmes (un par fiche) + tags libres ; cliquer un thème/tag filtre la liste
- Note /5 et commentaire personnel
- ★ « Prochaine écoute » : épingle les fiches en haut (file d'attente)
- Recherche plein texte + tris (récent, mieux notés, A→Z par titre ou émission)
- Thème clair / sombre automatique

## Où sont enregistrées les données

Deux hébergements possibles, avec un stockage différent :

| Hébergement | Stockage | Synchro entre appareils |
|---|---|---|
| **Artifact Claude** (`claude.ai`) | base de données de l'artifact | ✅ oui, via le compte Claude |
| **GitHub Pages / fichier local** | `localStorage` du navigateur | ❌ non, local à l'appareil |

Le même `index.html` détecte l'environnement : sur `claude.ai` il utilise la
capacité `db` ; ailleurs il bascule automatiquement sur `localStorage`. L'état de
synchro est indiqué en bas de l'écran.

> ⚠️ En mode `localStorage`, vider les données du site ou changer de navigateur
> efface la bibliothèque. Pense à ré-exporter tes liens ailleurs si c'est
> important.

## Installer sur un téléphone (GitHub Pages)

1. Ouvrir l'URL GitHub Pages du dépôt dans **Chrome** (Android) ou **Safari** (iPhone).
2. Menu du navigateur → **« Ajouter à l'écran d'accueil »**.
3. L'appli s'ouvre en plein écran, fonctionne hors-ligne (service worker), icône 📻.

## Développement

Aucune étape de build. Servir le dossier avec n'importe quel serveur statique :

```bash
npx serve .
# ou
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

- `index.html` — toute l'appli (markup + CSS + JS)
- `manifest.webmanifest` — métadonnées PWA
- `sw.js` — cache hors-ligne de la coquille d'appli
- `icon-*.png`, `apple-touch-icon.png` — icônes générées

### Régénérer les icônes

```bash
node genicons.js .
```

## Limite connue : pas de lecture intégrée

Les sources externes (Radio France, YouTube…) ne sont pas lues dans l'appli :
le bouton **« ▶ Ouvrir »** ouvre l'épisode dans un nouvel onglet. Sur `claude.ai`
c'est une contrainte du bac à sable ; en hébergement autonome, ce serait
possible mais volontairement laissé de côté pour garder l'appli simple et
centrée sur le tri.

## Licence

Usage personnel. Fais-en ce que tu veux.
