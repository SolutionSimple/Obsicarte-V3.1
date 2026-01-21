import type { CustomField } from '../types/custom-fields.types';
import { Mail, Phone, Globe, Calendar } from 'lucide-react';

interface CustomFieldDisplayProps {
  field: CustomField;
}

export function CustomFieldDisplay({ field }: CustomFieldDisplayProps) {
  if (!field.value || !field.isPublic) {
    return null;
  }

  const getIcon = () => {
    switch (field.type) {
      case 'email':
        return <Mail className="w-4 h-4 text-gold-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-gold-400" />;
      case 'url':
        return <Globe className="w-4 h-4 text-gold-400" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-gold-400" />;
      default:
        return null;
    }
  };

  const renderValue = () => {
    switch (field.type) {
      case 'url':
        return (
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 hover:underline break-all"
          >
            {field.value}
          </a>
        );
      case 'email':
        return (
          <a href={`mailto:${field.value}`} className="text-gold-400 hover:text-gold-300 hover:underline">
            {field.value}
          </a>
        );
      case 'phone':
        return (
          <a href={`tel:${field.value}`} className="text-gold-400 hover:text-gold-300 hover:underline">
            {field.value}
          </a>
        );
      case 'textarea':
        return (
          <p className="text-warmGray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
            {field.value}
          </p>
        );
      default:
        return <p className="text-warmGray-300 break-words">{field.value}</p>;
    }
  };

  if (field.type === 'textarea') {
    return (
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gold-400 uppercase tracking-wide mb-2">
          {field.label}
        </h3>
        {renderValue()}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-navy-700/30 hover:bg-navy-700/50 rounded-lg transition-colors border border-gold-500/20">
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-warmGray-400 mb-1">{field.label}</p>
        <div className="text-sm sm:text-base">{renderValue()}</div>
      </div>
    </div>
  );
}
