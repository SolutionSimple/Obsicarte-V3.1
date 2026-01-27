import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', href: '/signup' },
      { label: 'Templates', href: '/signup' },
      { label: 'Cartes NFC', href: '/signup' },
      { label: 'Exemples', href: '/#examples' },
    ],
    resources: [
      { label: 'Guide de démarrage', href: '/signup' },
      { label: 'Documentation', href: '/signup' },
      { label: 'Support', href: '/signup' },
      { label: 'FAQ', href: '/#faq' },
    ],
    company: [
      { label: 'À propos', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Blog', href: '/#blog' },
    ],
    legal: [
      { label: 'Confidentialité', href: '/#privacy' },
      { label: 'Conditions', href: '/#terms' },
      { label: 'Mentions légales', href: '/#legal' },
    ],
  };

  return (
    <footer className="bg-neutral-900 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <motion.h2
                className="text-2xl font-bold bg-gradient-gold-shimmer bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Obsi
              </motion.h2>
            </Link>
            <p className="text-warmGray-400 text-sm mb-4">
              Carte de visite noire premium avec QR code et carte NFC pré-configurée.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:contact@obsi.fr"
                className="flex items-center gap-2 text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                contact@obsi.fr
              </a>
              <a
                href="tel:+33123456789"
                className="flex items-center gap-2 text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </a>
              <div className="flex items-center gap-2 text-warmGray-400 text-sm">
                <MapPin className="w-4 h-4" />
                Paris, France
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={`product-${index}`}>
                  <Link
                    to={link.href}
                    className="text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={`resources-${index}`}>
                  <Link
                    to={link.href}
                    className="text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${index}`}>
                  <Link
                    to={link.href}
                    className="text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={`legal-${index}`}>
                  <Link
                    to={link.href}
                    className="text-warmGray-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-warmGray-500 text-sm text-center md:text-left">
            © 2025 Obsi. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/#"
              className="text-warmGray-500 hover:text-gold-400 transition-colors text-sm"
            >
              Politique de confidentialité
            </Link>
            <span className="text-gold-500/30">•</span>
            <Link
              to="/#"
              className="text-warmGray-500 hover:text-gold-400 transition-colors text-sm"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
