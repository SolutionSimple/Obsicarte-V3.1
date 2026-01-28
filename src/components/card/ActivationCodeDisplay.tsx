import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ActivationCodeDisplayProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ActivationCodeDisplay({ code, size = 'md' }: ActivationCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeClasses = {
    sm: 'text-lg px-4 py-2',
    md: 'text-2xl px-6 py-3',
    lg: 'text-4xl px-8 py-4',
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`bg-gray-900 text-white rounded-lg font-mono tracking-wider ${sizeClasses[size]} border-2 border-gray-700`}
      >
        {code}
      </div>
      <button
        onClick={handleCopy}
        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Copier le code"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
}
