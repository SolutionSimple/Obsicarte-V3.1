import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { QrCode, Nfc } from 'lucide-react';

interface BusinessCardMockupProps {
  className?: string;
}

export function BusinessCardMockup({ className = '' }: BusinessCardMockupProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        <motion.div
          className="relative w-full aspect-[1.7/1] rounded-2xl shadow-premium-lg"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute inset-0 bg-gradient-institutional rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200, 155, 60, 0.1) 10px, rgba(200, 155, 60, 0.1) 11px)',
              }}
            />

            <div className="relative h-full flex flex-col justify-between p-8">
              <div>
                <motion.div
                  className="inline-block bg-gradient-gold rounded-lg px-3 py-1.5 mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-bold text-navy-900">PREMIUM</span>
                </motion.div>

                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  Jean Dupont
                </h3>
                <p className="text-gold-300 text-lg font-medium">Député • Entrepreneur</p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-warmGray-300 text-sm">jean.dupont@assemblee.fr</p>
                  <p className="text-warmGray-300 text-sm">+33 1 23 45 67 89</p>
                </div>

                <motion.div
                  className="bg-white p-3 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <QrCode className="w-16 h-16 text-navy-900" />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-gold-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 w-full aspect-[1.7/1] rounded-2xl shadow-premium-lg"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            rotateY: 180,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-warmGray-100 to-warmGray-200 rounded-2xl overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(10, 38, 71, 0.05) 20px, rgba(10, 38, 71, 0.05) 21px)',
              }}
            />

            <div className="relative h-full flex flex-col justify-between p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-navy-600 rounded-full" />
                    <p className="text-navy-800 text-sm">www.jeandupont.fr</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-navy-600 rounded-full" />
                    <p className="text-navy-800 text-sm">LinkedIn: /jeandupont</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-navy-600 rounded-full" />
                    <p className="text-navy-800 text-sm">Twitter: @jeandupont</p>
                  </div>
                </div>

                <motion.div
                  className="bg-gradient-gold p-2 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(200, 155, 60, 0.4)',
                      '0 0 0 10px rgba(200, 155, 60, 0)',
                      '0 0 0 0 rgba(200, 155, 60, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Nfc className="w-8 h-8 text-navy-900" />
                </motion.div>
              </div>

              <div className="border-t border-navy-200 pt-4">
                <p className="text-navy-600 text-xs leading-relaxed">
                  Assemblée Nationale • 126 Rue de l'Université
                  <br />
                  75007 Paris, France
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-navy-900/90 backdrop-blur-sm px-4 py-2 rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gold-300 text-xs font-medium">
            {isFlipped ? 'Verso' : 'Recto'} • Cliquez pour retourner
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
