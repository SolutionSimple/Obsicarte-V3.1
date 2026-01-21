# DigitalCard - Digital Business Card App

A modern, feature-rich digital business card application with QR codes and pre-configured NFC cards. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Core Functionality
- **Digital Business Cards**: Create and customize your professional digital business card
- **QR Code Generation**: Auto-generated QR codes for easy sharing and printing
- **Pre-configured NFC Cards**: Physical NFC cards delivered ready to use with your profile
- **vCard Download**: Visitors can instantly save your contact to their phone
- **Live Preview**: Real-time preview while editing your profile
- **Analytics Tracking**: Track views, contact downloads, and link clicks
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **PWA Support**: Install as an app with offline capabilities

### User Journey
1. **Sign Up** - Create account in seconds (email/password)
2. **Quick Onboarding** - Fill in basic info (< 60 seconds)
3. **Customize Profile** - Add photo, bio, social links, videos
4. **Order NFC Card** - Receive your pre-configured NFC card ready to use
5. **Share & Track** - Share via QR code, NFC card, or direct link and monitor analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **Build Tool**: Vite

## Database Schema

The app uses 4 main tables:

1. **profiles** - User profile data and settings
2. **profile_analytics** - Track views and interactions
3. **profile_leads** - Collected contacts from lead forms (premium feature)
4. **subscriptions** - User subscription tiers

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Open your Supabase Dashboard
   - Go to SQL Editor
   - Run the migration SQL from `DATABASE_SETUP.md`

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Button.tsx
│   └── Input.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
│   └── useProfile.ts
├── lib/               # Core libraries
│   └── supabase.ts
├── pages/             # Route pages
│   ├── LandingPage.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── ProfileEditor.tsx
│   └── ProfileView.tsx
├── types/             # TypeScript types
│   └── database.types.ts
├── utils/             # Utility functions
│   ├── analytics.ts
│   └── vcard.ts
└── App.tsx            # Main app component
```

## Key Features Explained

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes for authenticated users
- Auto-redirect logic based on auth state

### Profile Management
- Auto-save functionality (saves changes after 1 second of no typing)
- Support for profile photo, video, and social links
- Unique username for clean URLs (app.com/username)

### QR Code
- Dynamically generated based on profile URL
- Downloadable in PNG format
- High error correction level for reliability

### vCard Generation
- Standard vCard 3.0 format
- Includes all contact details and social links
- Compatible with iOS and Android contacts apps

### Analytics
- Tracks page views, vCard downloads, and link clicks
- Device type detection (mobile/tablet/desktop)
- Privacy-focused (IP addresses are hashed)

## Planned Features (Phase 2)

- [ ] Analytics dashboard with charts
- [ ] Lead collection forms (premium)
- [ ] Networking mode (mutual contact exchange)
- [ ] Stripe integration for subscriptions
- [ ] Custom domain support
- [ ] Multiple card templates
- [ ] Email notifications for leads
- [ ] CSV export for contacts
- [ ] Physical NFC card e-commerce integration

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
