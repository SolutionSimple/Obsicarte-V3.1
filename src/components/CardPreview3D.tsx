import { useState } from 'react';
import { motion } from 'framer-motion';
import { Nfc } from 'lucide-react';
import QRCode from 'react-qr-code';

interface CardPreview3DProps {
  profile: {
    full_name?: string;
    username: string;
  };
  className?: string;
}

export function CardPreview3D({ profile, className = '' }: CardPreview3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const profileUrl = `${window.location.origin}/${profile.username}`;

  return (
    <div className={className} style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        <motion.div
          className="relative w-full aspect-[1.5/1] sm:aspect-[1.7/1] rounded-2xl shadow-premium-lg"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(96, 165, 250, 0.1) 10px, rgba(96, 165, 250, 0.1) 11px)',
              }}
            />

            <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <motion.div
                  className="inline-block bg-blue-400 rounded-lg px-3 py-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-xs sm:text-sm font-bold text-blue-900">PREMIUM</span>
                </motion.div>

                <motion.div
                  className="bg-blue-400 p-2 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(96, 165, 250, 0.4)',
                      '0 0 0 10px rgba(96, 165, 250, 0)',
                      '0 0 0 0 rgba(96, 165, 250, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Nfc className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" />
                </motion.div>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 gap-2 sm:gap-3">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-center tracking-tight">
                  {profile.full_name || 'Votre Nom'}
                </h3>

                <motion.div
                  className="bg-white p-2 sm:p-3 rounded-xl flex-shrink-0 shadow-2xl"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                    <QRCode
                      value={profileUrl}
                      size={112}
                      level="H"
                      fgColor="#1e3a8a"
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </motion.div>

                <motion.p
                  className="text-blue-200 text-xs sm:text-sm font-medium text-center px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Scannez le code QR pour accéder au profil
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full aspect-[1.5/1] sm:aspect-[1.7/1] rounded-2xl shadow-premium-lg"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            rotateY: 180,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl overflow-hidden border border-blue-500/20">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(96, 165, 250, 0.1) 20px, rgba(96, 165, 250, 0.1) 21px)',
              }}
            />

            <div className="relative h-full flex flex-col items-center justify-center p-8">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-900">LOGO</span>
                </div>
                <p className="text-white text-sm sm:text-base font-semibold">
                  Votre Service Premium
                </p>
                <p className="text-blue-200 text-xs sm:text-sm">
                  {profileUrl}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-900/90 backdrop-blur-sm px-4 py-2 rounded-full whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-blue-200 text-xs font-medium">
            {isFlipped ? 'Verso' : 'Recto'} • Cliquez pour retourner
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
