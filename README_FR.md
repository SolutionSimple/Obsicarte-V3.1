# CarteDigitale - Application de carte de visite numérique

Une application moderne et riche en fonctionnalités pour créer des cartes de visite numériques avec QR codes et cartes NFC pré-configurées. Développée avec React, TypeScript, Tailwind CSS et Supabase.

## Fonctionnalités

### Fonctionnalités principales
- **Cartes de visite numériques**: Créez et personnalisez votre carte de visite professionnelle numérique
- **Génération de QR Code**: QR codes auto-générés pour un partage facile et impression
- **Cartes NFC pré-configurées**: Cartes NFC physiques livrées prêtes à l'emploi avec votre profil
- **Téléchargement vCard**: Les visiteurs peuvent enregistrer instantanément votre contact sur leur téléphone
- **Aperçu en direct**: Prévisualisation en temps réel lors de l'édition de votre profil
- **Suivi analytique**: Suivez les vues, les téléchargements de contacts et les clics sur les liens
- **Design responsive**: Expérience parfaite sur mobile, tablette et ordinateur
- **Support PWA**: Installation comme application avec capacités hors ligne

### Parcours utilisateur
1. **Inscription** - Créez un compte en quelques secondes (email/mot de passe)
2. **Configuration rapide** - Remplissez vos informations de base (< 60 secondes)
3. **Personnalisation du profil** - Ajoutez photo, bio, liens sociaux, vidéos
4. **Commande carte NFC** - Recevez votre carte NFC pré-configurée prête à utiliser
5. **Partage et suivi** - Partagez via QR code, carte NFC ou lien direct et suivez les statistiques

## Stack technique

- **Frontend**: React 18 + TypeScript
- **Styles**: Tailwind CSS
- **Routage**: React Router v7
- **Backend**: Supabase (Auth, Base de données, Storage)
- **Icônes**: Lucide React
- **QR Codes**: react-qr-code
- **Outil de build**: Vite

## Schéma de base de données

L'application utilise 4 tables principales :

1. **profiles** - Données de profil utilisateur et paramètres
2. **profile_analytics** - Suivi des vues et interactions
3. **profile_leads** - Contacts collectés via les formulaires de prospects (fonctionnalité premium)
4. **subscriptions** - Niveaux d'abonnement des utilisateurs

## Démarrage

### Prérequis
- Node.js 18+ et npm
- Compte et projet Supabase

### Installation

1. Clonez le dépôt
2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement dans `.env` :
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

4. Configurez la base de données :
   - Ouvrez votre tableau de bord Supabase
   - Allez dans "SQL Editor"
   - Exécutez le SQL de migration depuis `DATABASE_SETUP.md`

5. Démarrez le serveur de développement :
```bash
npm run dev
```

6. Build pour la production :
```bash
npm run build
```

## Structure du projet

```
src/
├── components/        # Composants UI réutilisables
│   ├── Button.tsx
│   └── Input.tsx
├── contexts/          # Contextes React
│   └── AuthContext.tsx
├── hooks/             # Hooks React personnalisés
│   └── useProfile.ts
├── lib/               # Bibliothèques principales
│   └── supabase.ts
├── pages/             # Pages de routes
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── ProfileEditor.tsx
│   └── ProfileView.tsx
├── types/             # Types TypeScript
│   └── database.types.ts
├── utils/             # Fonctions utilitaires
│   ├── analytics.ts
│   └── vcard.ts
└── App.tsx            # Composant principal de l'application
```

## Fonctionnalités clés expliquées

### Authentification
- Authentification email/mot de passe via Supabase Auth
- Routes protégées pour les utilisateurs authentifiés
- Logique de redirection automatique basée sur l'état d'authentification

### Gestion de profil
- Fonctionnalité d'enregistrement automatique (sauvegarde après 1 seconde sans saisie)
- Support pour photo de profil, vidéo et liens sociaux
- Nom d'utilisateur unique pour des URLs propres (app.com/nomutilisateur)

### QR Code
- Généré dynamiquement basé sur l'URL du profil
- Téléchargeable en format PNG
- Niveau de correction d'erreur élevé pour la fiabilité

### Génération vCard
- Format vCard 3.0 standard
- Inclut tous les détails de contact et liens sociaux
- Compatible avec les applications de contacts iOS et Android

### Analytiques
- Suit les vues de pages, téléchargements vCard et clics sur les liens
- Détection du type d'appareil (mobile/tablette/ordinateur)
- Axé sur la confidentialité (les adresses IP sont hachées)

## Fonctionnalités planifiées (Phase 2)

- [ ] Tableau de bord analytique avec graphiques
- [ ] Formulaires de collecte de prospects (premium)
- [ ] Mode networking (échange mutuel de contacts)
- [ ] Intégration Stripe pour les abonnements
- [ ] Support de domaine personnalisé
- [ ] Modèles de cartes multiples
- [ ] Notifications email pour les prospects
- [ ] Export CSV des contacts
- [ ] Intégration e-commerce pour cartes NFC physiques

## Traduction

L'application est entièrement traduite en français :
- ✅ Page d'accueil
- ✅ Pages d'authentification (Connexion, Inscription, Configuration)
- ✅ Tableau de bord
- ✅ Éditeur de profil
- ✅ Vue publique du profil
- ✅ Composants UI
- ✅ Meta-tags et manifest PWA

## Licence

MIT

## Support

Pour les problèmes et questions, veuillez ouvrir un ticket GitHub.
