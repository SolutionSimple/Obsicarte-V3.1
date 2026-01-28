import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useTierPermissions } from '../hooks/useTierPermissions';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TemplateSelectorStep } from '../components/TemplateSelectorStep';
import { TierBadge } from '../components/TierBadge';
import type { ProfileTemplate } from '../types/custom-fields.types';
import { Sparkles, ArrowLeft, CheckCircle, Crown } from 'lucide-react';
import { TierType, getTierConfig } from '../config/tier-config';

export function Onboarding() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ProfileTemplate | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromActivation, setFromActivation] = useState(false);
  const [userTier, setUserTier] = useState<TierType | null>(null);
  const { createProfile } = useProfile();
  const { tier, config } = useTierPermissions();
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const phoneParam = searchParams.get('phone');
    const tierParam = searchParams.get('tier') as TierType | null;

    if (emailParam) {
      setEmail(emailParam);
      setFromActivation(true);
    }
    if (nameParam) {
      setFullName(nameParam);
    }
    if (phoneParam) {
      setPhone(phoneParam);
    }

    if (tierParam && ['roc', 'saphir', 'emeraude'].includes(tierParam)) {
      setUserTier(tierParam);
    } else if (tier) {
      setUserTier(tier);
    } else {
      setUserTier('roc');
    }
  }, [searchParams, tier]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Nettoyer le username: remplacer espaces par tirets, supprimer caractères spéciaux
    const cleanUsername = username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')  // Remplacer espaces par tirets
      .replace(/[^a-z0-9-]/g, '')  // Supprimer caractères spéciaux
      .replace(/-+/g, '-')  // Éviter tirets multiples
      .replace(/^-|-$/g, '');  // Supprimer tirets en début/fin

    if (cleanUsername.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      setLoading(false);
      return;
    }

    const { error } = await createProfile({
      username: cleanUsername,
      full_name: fullName,
      title,
      email,
      phone,
      sector: selectedTemplate?.name || 'personnalise',
      custom_fields: selectedTemplate?.default_fields || [],
    });

    if (error) {
      if (error.includes('unique')) {
        setError('Nom d\'utilisateur déjà pris. Veuillez en choisir un autre.');
      } else {
        setError(error);
      }
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  }

  if (step === 'template') {
    const tierConfig = userTier ? getTierConfig(userTier) : null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-warmGray-100 px-4 py-12">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
          {userTier && tierConfig && (
            <div className="mb-6 p-6 bg-gradient-to-br from-gold-50 to-amber-50 border border-gold-200 rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-gold-600" />
                <h2 className="text-xl font-bold text-warmGray-900">Bienvenue dans votre</h2>
                <TierBadge tier={userTier} variant="large" />
              </div>
              <p className="text-center text-warmGray-700 text-sm">
                Vous avez accès à toutes les fonctionnalités premium de votre pack
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {tierConfig.description.slice(0, 3).map((feature, index) => (
                  <span key={index} className="text-xs bg-white px-3 py-1 rounded-full text-warmGray-600 border border-gold-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-warmGray-900">Créez votre carte numérique</h1>
            <p className="text-warmGray-600 mt-2">Étape 1 sur 2</p>
          </div>

          <TemplateSelectorStep
            onSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setStep('details')}
              disabled={!selectedTemplate}
              size="lg"
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-warmGray-100 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <button
            onClick={() => setStep('template')}
            className="flex items-center gap-2 text-warmGray-600 hover:text-warmGray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        {fromActivation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Carte activée avec succès !</p>
              <p className="text-sm text-green-700 mt-1">Complétez votre profil pour finaliser la configuration</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-warmGray-900">Vos informations</h1>
          <p className="text-warmGray-600 mt-2">Étape 2 sur 2 - Cela prend moins de 60 secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jean Dupont"
              required
            />

            <Input
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jeandupont"
              helperText="Votre URL unique : app.com/votre-nom"
              required
            />
          </div>

          <Input
            label="Titre / Profession"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Responsable Marketing, Designer Freelance"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@exemple.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Créer ma carte
          </Button>

          <p className="text-center text-sm text-warmGray-500">
            Vous pourrez ajouter plus de détails et personnaliser votre carte plus tard
          </p>
        </form>
      </div>
    </div>
  );
}
