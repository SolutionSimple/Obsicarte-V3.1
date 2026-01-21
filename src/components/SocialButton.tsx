import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Mail, Phone, Globe } from 'lucide-react';

type SocialPlatform = 'instagram' | 'twitter' | 'linkedin' | 'email' | 'phone' | 'website';

interface SocialButtonProps {
  platform: SocialPlatform;
  url: string;
  label?: string;
  variant?: 'default' | 'compact';
}

const platformConfig = {
  instagram: {
    icon: Instagram,
    bgColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
    hoverColor: 'hover:from-purple-700 hover:to-pink-700',
    defaultLabel: 'Follow on Instagram',
  },
  twitter: {
    icon: Twitter,
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    defaultLabel: 'Follow on Twitter',
  },
  linkedin: {
    icon: Linkedin,
    bgColor: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
    defaultLabel: 'Connect on LinkedIn',
  },
  email: {
    icon: Mail,
    bgColor: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    defaultLabel: 'Send Email',
  },
  phone: {
    icon: Phone,
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    defaultLabel: 'Call Me',
  },
  website: {
    icon: Globe,
    bgColor: 'bg-neutral-700',
    hoverColor: 'hover:bg-neutral-800',
    defaultLabel: 'Visit Website',
  },
};

export function SocialButton({ platform, url, label, variant = 'default' }: SocialButtonProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  if (variant === 'compact') {
    return (
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center w-12 h-12 ${config.bgColor} ${config.hoverColor} rounded-lg shadow-md transition-colors`}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.a>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center space-x-3 px-6 py-4 ${config.bgColor} ${config.hoverColor} rounded-xl shadow-md transition-colors`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5 text-white" />
      <span className="text-white font-medium">{displayLabel}</span>
    </motion.a>
  );
}
