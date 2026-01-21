import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileActionsProps {
  onDownloadContact: () => void;
}

export function ProfileActions({ onDownloadContact }: ProfileActionsProps) {
  return (
    <div className="flex justify-center px-6 py-6">
      <motion.button
        onClick={onDownloadContact}
        className="px-8 py-4 bg-gradient-amber text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download className="w-5 h-5" />
        Enregistrer dans les contacts
      </motion.button>
    </div>
  );
}
