import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCardActivation } from '../hooks/useCardActivation';
import { validateActivationCode } from '../utils/card-utils';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function ActivateCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activateCard, loading, error } = useCardActivation();

  const [formData, setFormData] = useState({
    activationCode: searchParams.get('code') || '',
    email: searchParams.get('email') || '',
  });
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    const code = formData.activationCode.trim().toUpperCase();
    if (!code) {
      errors.activationCode = 'Le code d\'activation est requis';
    } else if (!validateActivationCode(code)) {
      errors.activationCode = 'Format de code invalide (ex: ABCD-1234)';
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await activateCard(
      formData.activationCode.trim().toUpperCase(),
      formData.email.trim()
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        if (result.shouldOnboard) {
          navigate(`/onboarding?email=${encodeURIComponent(formData.email)}`);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activation réussie !</h2>
          <p className="text-gray-600 mb-6">
            Votre carte Obsi a été activée avec succès. Vous allez être redirigé...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activez votre carte Obsi</h1>
          <p className="text-gray-600">
            Entrez votre code d'activation et votre email pour commencer
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Erreur d'activation</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Code d'activation
            </label>
            <Input
              id="activationCode"
              name="activationCode"
              type="text"
              value={formData.activationCode}
              onChange={handleChange}
              placeholder="ABCD-1234"
              className="text-center font-mono tracking-wider text-lg uppercase"
              error={validationErrors.activationCode}
            />
            {validationErrors.activationCode && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.activationCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
              error={validationErrors.email}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Activation en cours...' : 'Activer ma carte'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
