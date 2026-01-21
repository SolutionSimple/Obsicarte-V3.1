export function validateURL(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateEmail(email: string): boolean {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true;
  const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
  return phoneRegex.test(phone);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function getValidationError(type: string, value: string, required: boolean): string | null {
  if (required && !validateRequired(value)) {
    return 'Ce champ est requis';
  }

  if (!value) return null;

  switch (type) {
    case 'url':
      return validateURL(value) ? null : 'URL invalide';
    case 'email':
      return validateEmail(value) ? null : 'Email invalide';
    case 'phone':
      return validatePhone(value) ? null : 'Numéro de téléphone invalide';
    default:
      return null;
  }
}
