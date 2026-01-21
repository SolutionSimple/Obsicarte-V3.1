import { useState, useEffect } from 'react';
import type { CustomField } from '../types/custom-fields.types';
import { getValidationError } from '../utils/field-validators';
import { Input } from './Input';

interface CustomFieldInputProps {
  field: CustomField;
  onChange: (value: string) => void;
}

export function CustomFieldInput({ field, onChange }: CustomFieldInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) {
      const validationError = getValidationError(field.type, field.value, field.required);
      setError(validationError);
    }
  }, [field.value, field.type, field.required, touched]);

  const handleChange = (value: string) => {
    setTouched(true);
    onChange(value);
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = getValidationError(field.type, field.value, field.required);
    setError(validationError);
  };

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-warmGray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
          {!field.isPublic && (
            <span className="ml-2 text-xs text-warmGray-500 bg-warmGray-100 px-2 py-0.5 rounded">
              Privé
            </span>
          )}
        </label>
        <textarea
          value={field.value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          rows={field.rows || 4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
            error ? 'border-red-300' : 'border-warmGray-300'
          }`}
          placeholder={`Entrez ${field.label.toLowerCase()}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <Input
        label={field.label}
        type={field.type === 'text' ? 'text' : field.type}
        value={field.value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        required={field.required}
        helperText={!field.isPublic ? 'Champ privé - visible uniquement pour vous' : undefined}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
