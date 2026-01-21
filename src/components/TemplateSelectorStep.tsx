import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ProfileTemplate } from '../types/custom-fields.types';
import { Landmark, Building2, User, Palette, Settings, Check, GraduationCap } from 'lucide-react';
import { Button } from './Button';

interface TemplateSelectorStepProps {
  onSelect: (template: ProfileTemplate) => void;
  selectedTemplate?: ProfileTemplate | null;
}

const iconMap: Record<string, any> = {
  landmark: Landmark,
  'building-2': Building2,
  'graduation-cap': GraduationCap,
  user: User,
  palette: Palette,
  settings: Settings,
};

export function TemplateSelectorStep({ onSelect, selectedTemplate }: TemplateSelectorStepProps) {
  const [templates, setTemplates] = useState<ProfileTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from('profile_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-warmGray-900 mb-2">Choisissez votre secteur</h2>
        <p className="text-warmGray-600">Sélectionnez le template qui correspond le mieux à votre activité</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const Icon = iconMap[template.icon] || Settings;
          const isSelected = selectedTemplate?.id === template.id;
          const isRecommended = template.name === 'politique';

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-gold-600 bg-gold-50'
                  : 'border-warmGray-200 hover:border-gold-300 bg-white hover:bg-warmGray-50'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-gold text-navy-900 text-xs font-semibold rounded-full">
                  Recommandé
                </div>
              )}

              {isSelected && (
                <div className="absolute -top-3 right-4 w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-navy-900" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? 'bg-gold-100' : 'bg-warmGray-100'}`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-gold-600' : 'text-warmGray-600'}`} />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">{template.label}</h3>
                  <p className="text-sm text-warmGray-600 mb-3">{template.description}</p>

                  {template.default_fields && template.default_fields.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-warmGray-500">Champs inclus :</p>
                      <div className="flex flex-wrap gap-1">
                        {template.default_fields.slice(0, 3).map((field: any) => (
                          <span
                            key={field.id}
                            className="inline-block px-2 py-0.5 bg-warmGray-100 text-warmGray-700 rounded text-xs"
                          >
                            {field.label}
                          </span>
                        ))}
                        {template.default_fields.length > 3 && (
                          <span className="inline-block px-2 py-0.5 text-warmGray-500 text-xs">
                            +{template.default_fields.length - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Plan gratuit :</span> 3 champs personnalisés supplémentaires inclus
        </p>
      </div>
    </div>
  );
}
