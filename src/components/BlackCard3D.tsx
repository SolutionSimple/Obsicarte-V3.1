import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import obsiLogo from '../assets/or_avec_texte_no_bk.png';

export const BlackCard3D = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full max-w-lg mx-auto h-[340px] font-montserrat"
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
          className="absolute inset-0 rounded-2xl shadow-gold-glow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border-2 border-gold-600/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-spotlight opacity-50" />

            <div className="relative h-full p-6 flex flex-col">
              <div className="flex justify-end items-start">
                <Wifi className="w-7 h-7 text-gold-500 animate-pulse" />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="bg-white p-4 rounded-xl shadow-gold-glow">
                  <QRCode
                    value="https://obsi.digitalproconseil.fr"
                    size={140}
                    level="H"
                  />
                </div>

                <h3 className="text-white text-2xl font-bold tracking-tight text-center">
                  Prénom Nom
                </h3>
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl border-2 border-gold-500/10 pointer-events-none" />
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl shadow-gold-glow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-neutral-950 via-black to-neutral-900 border-2 border-gold-600/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-spotlight opacity-50" />

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at center, rgba(202, 138, 4, 0.15) 0%, transparent 60%)'
              }}
            />

            <div className="relative h-full p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 blur-2xl opacity-60"
                    style={{
                      background: 'radial-gradient(circle, rgba(202, 138, 4, 0.4) 0%, transparent 70%)',
                      transform: 'scale(1.2)'
                    }}
                  />
                  <img
                    src={obsiLogo}
                    alt="OBSI - une Carte, un Geste, un Lien"
                    className="w-64 h-auto object-contain relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(202, 138, 4, 0.5)) drop-shadow(0 0 40px rgba(202, 138, 4, 0.3))'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-warmGray-500 text-xs">
                <Wifi className="w-4 h-4" />
                <span>NFC Enabled</span>
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl border-2 border-gold-500/10 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-warmGray-400 text-sm">
        Cliquez pour retourner la carte
      </div>
    </div>
  );
};
