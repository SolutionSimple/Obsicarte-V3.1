import { useState } from 'react';
import type { CustomField, CustomFieldType } from '../types/custom-fields.types';
import { useSubscription } from '../hooks/useSubscription';
import { CustomFieldInput } from './CustomFieldInput';
import { Button } from './Button';
import { Plus, Trash2, Eye, EyeOff, Crown } from 'lucide-react';

interface CustomFieldsManagerProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  templateFields: CustomField[];
}

export function CustomFieldsManager({ fields, onChange, templateFields }: CustomFieldsManagerProps) {
  const { tier, maxCustomFields, canAddCustomField } = useSubscription();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');
  const [newFieldIsPublic, setNewFieldIsPublic] = useState(true);

  const customFields = fields.filter(f => !templateFields.find(tf => tf.id === f.id));
  const canAdd = canAddCustomField(customFields.length);

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: CustomField = {
      id: `custom_${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      value: '',
      required: false,
      order: fields.length,
      isPublic: newFieldIsPublic,
    };

    onChange([...fields, newField]);
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldIsPublic(true);
    setShowAddModal(false);
  };

  const handleRemoveField = (fieldId: string) => {
    onChange(fields.filter(f => f.id !== fieldId));
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    onChange(
      fields.map(f => (f.id === fieldId ? { ...f, value } : f))
    );
  };

  const toggleFieldVisibility = (fieldId: string) => {
    onChange(
      fields.map(f => (f.id === fieldId ? { ...f, isPublic: !f.isPublic } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-warmGray-900 mb-4">Champs du template</h3>
        <div className="space-y-4">
          {templateFields.map((field) => {
            const currentField = fields.find(f => f.id === field.id) || field;
            return (
              <div key={field.id} className="relative">
                <CustomFieldInput
                  field={currentField}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
                {!field.required && (
                  <button
                    onClick={() => toggleFieldVisibility(field.id)}
                    className="absolute top-8 right-3 text-warmGray-400 hover:text-warmGray-600"
                    title={currentField.isPublic ? 'Rendre privé' : 'Rendre public'}
                  >
                    {currentField.isPublic ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-warmGray-900">Champs personnalisés</h3>
            <p className="text-sm text-warmGray-500">
              {customFields.length} / {maxCustomFields === Infinity ? '∞' : maxCustomFields} champs utilisés
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            disabled={!canAdd}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un champ
          </Button>
        </div>

        {!canAdd && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Limite atteinte</p>
              <p className="text-amber-700">
                Passez à Premium pour ajouter jusqu'à 10 champs personnalisés
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {customFields.map((field) => (
            <div key={field.id} className="relative border border-warmGray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <CustomFieldInput
                    field={field}
                    onChange={(value) => handleFieldChange(field.id, value)}
                  />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleFieldVisibility(field.id)}
                    className="text-warmGray-400 hover:text-warmGray-600"
                    title={field.isPublic ? 'Rendre privé' : 'Rendre public'}
                  >
                    {field.isPublic ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="text-red-400 hover:text-red-600"
                    title="Supprimer ce champ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {customFields.length === 0 && (
          <div className="text-center py-8 text-warmGray-500">
            <p>Aucun champ personnalisé pour le moment</p>
            <p className="text-sm mt-1">Cliquez sur "Ajouter un champ" pour commencer</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-warmGray-900 mb-4">Ajouter un champ personnalisé</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Libellé du champ
                </label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-warmGray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Numéro de licence"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-warmGray-700 mb-1">
                  Type de champ
                </label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                  className="w-full px-4 py-2 border border-warmGray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Texte court</option>
                  <option value="textarea">Texte long</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                  <option value="phone">Téléphone</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newFieldIsPublic}
                  onChange={(e) => setNewFieldIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-warmGray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-warmGray-700">
                  Afficher ce champ sur le profil public
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                fullWidth
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddField}
                disabled={!newFieldLabel.trim()}
                fullWidth
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
