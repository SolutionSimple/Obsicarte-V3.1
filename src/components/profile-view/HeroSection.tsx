import { motion } from 'framer-motion';
import { StatusBadge } from '../StatusBadge';
import { LocalTimeDisplay } from '../LocalTimeDisplay';

interface HeroSectionProps {
  fullName: string;
  title?: string;
  tagline?: string;
  profilePhotoUrl?: string;
  isOnline: boolean;
  locationCity?: string;
  timezone?: string;
  showLocalTime: boolean;
}

export function HeroSection({
  fullName,
  title,
  tagline,
  profilePhotoUrl,
  isOnline,
  locationCity,
  timezone,
  showLocalTime,
}: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-t-2xl overflow-hidden border-b border-neutral-100">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
        }}
      />

      <div className="relative px-8 py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block mb-6"
        >
          {profilePhotoUrl ? (
            <img
              src={profilePhotoUrl}
              alt={fullName}
              className="w-32 h-32 rounded-full border-4 border-amber-500 object-cover shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-amber rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              {fullName.charAt(0)}
            </div>
          )}
          <StatusBadge isOnline={isOnline} size="lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-neutral-900 mb-2"
        >
          {fullName}
        </motion.h1>

        {title && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-amber-600 mb-4 font-medium"
          >
            {title}
          </motion.p>
        )}

        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-neutral-600 max-w-2xl mx-auto mb-6"
          >
            {tagline}
          </motion.p>
        )}

        {showLocalTime && locationCity && timezone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <LocalTimeDisplay timezone={timezone} city={locationCity} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
