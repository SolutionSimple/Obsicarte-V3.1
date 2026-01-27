import { motion } from 'framer-motion';
import { Wifi, QrCode } from 'lucide-react';
import { useState } from 'react';

export const BlackCard3D = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full max-w-md mx-auto h-[500px]"
      style={{ perspective: '1500px' }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="absolute inset-0 rounded-3xl shadow-gold-glow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border-2 border-gold-600/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-spotlight opacity-50" />

            <div className="relative h-full p-8 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-gold-500 font-bold text-2xl tracking-wider">
                    OBSI
                  </div>
                  <div className="text-warmGray-400 text-xs uppercase tracking-widest">
                    Premium Card
                  </div>
                </div>
                <Wifi className="w-8 h-8 text-gold-500 animate-pulse" />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 opacity-20 blur-3xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow">
                      <span className="text-black font-bold text-2xl">NFC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-white text-2xl font-bold tracking-tight">
                    Votre Nom
                  </h3>
                  <p className="text-warmGray-300 text-sm">
                    Votre Titre Professionnel
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                  <div className="text-warmGray-400 text-xs">
                    Carte Noire Premium
                  </div>
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gold-500"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl border-2 border-gold-500/10 pointer-events-none" />
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-3xl shadow-gold-glow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-neutral-950 via-black to-neutral-900 border-2 border-gold-600/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-spotlight opacity-30" />

            <div className="relative h-full p-8 flex flex-col">
              <div className="w-full h-16 bg-gradient-to-r from-neutral-800 to-neutral-900 -mx-8 mb-8" />

              <div className="flex-1 flex items-center justify-center">
                <div className="space-y-6 w-full">
                  <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-gold-glow">
                    <QrCode className="w-full h-full text-black" />
                  </div>

                  <div className="text-center">
                    <p className="text-warmGray-400 text-sm">
                      Scannez pour voir le profil
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-warmGray-500 text-xs">
                <Wifi className="w-4 h-4" />
                <span>NFC Enabled</span>
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl border-2 border-gold-500/10 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-warmGray-400 text-sm">
        Cliquez pour retourner la carte
      </div>
    </div>
  );
};
