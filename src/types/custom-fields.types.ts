export type CustomFieldType = 'text' | 'textarea' | 'url' | 'email' | 'phone' | 'date';

export interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  value: string;
  required: boolean;
  order: number;
  isPublic: boolean;
  rows?: number;
}

export interface ProfileTemplate {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  default_fields: CustomField[];
  is_active: boolean;
  created_at: string;
}

export interface SavedTemplate {
  id: string;
  user_id: string;
  name: string;
  base_template: string;
  custom_configuration: CustomField[];
  created_at: string;
}

export const FIELD_LIMITS = {
  free: 3,
  premium: 10,
  premium_plus: Infinity,
} as const;

export const SAVED_TEMPLATE_LIMITS = {
  free: 1,
  premium: 5,
  premium_plus: Infinity,
} as const;
