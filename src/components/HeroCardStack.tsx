import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Building2, GraduationCap, Landmark, Nfc, Mail, Phone, Globe } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  type: 'professional' | 'student' | 'political';
  gradient: string;
  icon: any;
  iconBg: string;
}

const cards: Card[] = [
  {
    id: '1',
    name: 'Sophie Durand',
    title: 'CEO & Founder',
    company: 'TechVision Solutions',
    email: 'sophie@techvision.fr',
    phone: '+33 6 12 34 56 78',
    website: 'techvision.fr',
    type: 'professional',
    gradient: 'from-navy-800 via-navy-700 to-navy-800',
    icon: Building2,
    iconBg: 'from-gold-500 to-gold-600',
  },
  {
    id: '2',
    name: 'Alex Martin',
    title: 'Étudiant en Marketing Digital',
    company: 'ESSEC Business School',
    email: 'alex.martin@essec.edu',
    phone: '+33 7 23 45 67 89',
    website: 'alexmartin.fr',
    type: 'student',
    gradient: 'from-blue-900 via-blue-800 to-blue-900',
    icon: GraduationCap,
    iconBg: 'from-blue-500 to-blue-600',
  },
  {
    id: '3',
    name: 'Jean Dubois',
    title: 'Député • Circonscription 5',
    company: 'Assemblée Nationale',
    email: 'contact@jeandubois.fr',
    phone: '+33 1 40 63 60 00',
    website: 'jeandubois.fr',
    type: 'political',
    gradient: 'from-red-900 via-red-800 to-red-900',
    icon: Landmark,
    iconBg: 'from-red-500 to-red-600',
  },
];

export function HeroCardStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) / rect.width;
    const offsetY = (e.clientY - centerY) / rect.height;

    mouseX.set(offsetX * 20);
    mouseY.set(offsetY * 20);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full max-w-md aspect-[1.6/1]" style={{ perspective: '1200px' }}>
        {cards.map((card, index) => {
          const offset = (index - currentIndex + cards.length) % cards.length;
          const isActive = offset === 0;

          const rotateY = useTransform(mouseXSpring, [-20, 20], [5, -5]);
          const rotateX = useTransform(mouseYSpring, [-20, 20], [-5, 5]);

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                zIndex: cards.length - offset,
              }}
              initial={{
                rotateY: 0,
                rotateX: 0,
                y: -100,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                rotateY: offset * 8,
                rotateX: offset * -2,
                y: offset * 12,
                x: offset * 8,
                scale: 1 - offset * 0.08,
                opacity: 1 - offset * 0.3,
              }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <motion.div
                className="w-full h-full rounded-2xl shadow-premium-xl overflow-hidden"
                style={{
                  rotateY: isActive && !isMobile ? rotateY : 0,
                  rotateX: isActive && !isMobile ? rotateX : 0,
                  transformStyle: 'preserve-3d',
                }}
                whileHover={isActive && !isMobile ? { scale: 1.02 } : {}}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`relative w-full h-full bg-gradient-to-br ${card.gradient} border border-gold-500/30`}>
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200, 155, 60, 0.1) 10px, rgba(200, 155, 60, 0.1) 11px)',
                    }}
                  />

                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: 'linear',
                      }}
                    />
                  )}

                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                      <motion.div
                        className={`bg-gradient-to-br ${card.iconBg} p-2.5 rounded-xl shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <card.icon className="w-5 h-5 text-white" />
                      </motion.div>

                      <motion.div
                        className="bg-gold-400/90 backdrop-blur-sm p-2 rounded-lg"
                        animate={{
                          boxShadow: [
                            '0 0 0 0 rgba(200, 155, 60, 0.4)',
                            '0 0 0 8px rgba(200, 155, 60, 0)',
                            '0 0 0 0 rgba(200, 155, 60, 0)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Nfc className="w-4 h-4 text-navy-900" />
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <motion.h3
                          className="text-2xl font-bold text-white mb-1 tracking-tight"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {card.name}
                        </motion.h3>
                        <motion.p
                          className="text-gold-300 text-sm font-medium"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {card.title}
                        </motion.p>
                        <motion.p
                          className="text-warmGray-400 text-xs mt-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {card.company}
                        </motion.p>
                      </div>

                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 text-warmGray-300 text-xs">
                          <Mail className="w-3.5 h-3.5 text-gold-400" />
                          <span>{card.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-warmGray-300 text-xs">
                          <Phone className="w-3.5 h-3.5 text-gold-400" />
                          <span>{card.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-warmGray-300 text-xs">
                          <Globe className="w-3.5 h-3.5 text-gold-400" />
                          <span>{card.website}</span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="inline-flex items-center gap-2 bg-gold-400/10 backdrop-blur-sm border border-gold-400/30 rounded-full px-3 py-1">
                          <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                          <span className="text-gold-300 text-xs font-medium">Premium</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute -inset-4 bg-gold-400/20 rounded-3xl blur-3xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-gold-400 w-8'
                : 'bg-warmGray-600 hover:bg-warmGray-500'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {!isMobile && (
        <div className="absolute -z-10 inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
