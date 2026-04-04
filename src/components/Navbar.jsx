import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/translations';

export default function Navbar() {
  const [isSolutionsOpen, setIsSolutionsOpen] = React.useState(false);
  const [isPlatformeOpen, setIsPlatformeOpen] = React.useState(false);
  const [isRessourcesOpen, setIsRessourcesOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;

  const solutions = [
    {
      id: 'general_managers',
      title: t.navbar.solutions_list.generalManagers,
      icon: '🎯',
      description: t.navbar.solutions_list.generalManagersDesc,
    },
    {
      id: 'revenue_managers',
      title: t.navbar.solutions_list.revenueManagers,
      icon: '💰',
      description: t.navbar.solutions_list.revenueManagersDesc,
    },
    {
      id: 'it_managers',
      title: t.navbar.solutions_list.itManagers,
      icon: '⚙️',
      description: t.navbar.solutions_list.itManagersDesc,
    },
    {
      id: 'fb_managers',
      title: t.navbar.solutions_list.fbManagers,
      icon: '🍽️',
      description: t.navbar.solutions_list.fbManagersDesc,
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="40" width="75" height="130" rx="18" transform="rotate(-20 60 105)" fill="#3B82F6" opacity="0.6"/>
              <rect x="90" y="30" width="75" height="130" rx="18" transform="rotate(20 127 95)" fill="#2563EB"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Oplo.ai</h1>
              <p className="hidden md:block text-[9px] text-gray-500 uppercase tracking-widest">Restaurant Intelligence</p>
            </div>
          </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <div 
            className="relative"
            onMouseLeave={() => !isMobile && setIsSolutionsOpen(false)}
          >
            <button 
              onMouseEnter={() => !isMobile && setIsSolutionsOpen(true)}
              onClick={() => isMobile && setIsSolutionsOpen(!isSolutionsOpen)}
              className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
            >
              Solutions
              <ChevronDown className="w-4 h-4" />
            </button>

            {isSolutionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 p-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  {solutions.map((solution, idx) => (
                    solution.id === 'item' || solution.id === 'check' || solution.id === 'dash' || solution.id === 'margin' ? (
                      <motion.a
                        key={solution.id}
                        href={solution.id === 'item' ? 'https://passionate-resto-stock-pro.base44.app/Home' : solution.id === 'check' ? 'https://restaurant-pay-easy.base44.app/Home' : solution.id === 'dash' ? 'https://dish-cost-calc.base44.app/Home' : 'https://dish-cost-pro.base44.app/Home'}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="rounded-lg border border-gray-100 p-3 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group"
                      >
                        <div className="text-2xl mb-1">{solution.icon}</div>
                        <h3 className="text-sm font-bold text-gray-900">{solution.title}</h3>
                        <p className="text-xs text-gray-600 leading-tight">{solution.description}</p>
                      </motion.a>
                    ) : (
                      <motion.div
                        key={solution.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="rounded-lg border border-gray-100 p-3 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group"
                      >
                        <div className="text-2xl mb-1">{solution.icon}</div>
                        <h3 className="text-sm font-bold text-gray-900">{solution.title}</h3>
                        <p className="text-xs text-gray-600 leading-tight">{solution.description}</p>
                      </motion.div>
                    )
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          <div 
            className="relative"
            onMouseLeave={() => !isMobile && setIsPlatformeOpen(false)}
          >
            <button 
              onMouseEnter={() => !isMobile && setIsPlatformeOpen(true)}
              onClick={() => isMobile && setIsPlatformeOpen(!isPlatformeOpen)}
              className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
            >
              {t.navbar.platform}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isPlatformeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full -left-48 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[900px] p-8"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Produits */}
                  <div>
                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm mb-4">
                      <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">{t.navbar.products}</h4>
                      <div className="space-y-2">
                        {t.navbar.platform_products.map((item, idx) => ({...item, page: "Solutions"})).map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                          >
                            <Link
                              to={createPageUrl(item.page)}
                              onClick={() => setIsPlatformeOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">{t.navbar.platform}</h4>
                      <div className="space-y-2">
                        {t.navbar.platform_integrations.map((item, idx) => ({...item, page: "IntegrationsOplo"})).map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.09 + idx * 0.03 }}
                          >
                            <Link
                              to={createPageUrl(item.page)}
                              onClick={() => setIsPlatformeOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">{t.navbar.overview}</h4>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                    >
                      <div className="text-lg font-bold text-gray-900 mb-2">Oplo.ai PMS</div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{t.navbar.pmsDesc}</p>
                      <h5 className="text-xs font-bold text-gray-700 mb-4">{t.navbar.features}</h5>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: "StaffFlow", icon: "📅", url: "https://staff-kitchen-flow.base44.app/Home" },
                          { name: "Nüvo", icon: "🔑", url: "https://nuvo-serve-smart.base44.app/Home" },
                          { name: "LiveFlow", icon: "💳", url: "https://live-flow-waiter.base44.app/Home" },
                          { name: "TeamHub", icon: "📱", url: "https://team-hub-pro.base44.app/Home" },
                          { name: "Swift", icon: "🧹", url: "https://solemn-queue-flow-pro.base44.app/Home" },
                          { name: "PrepWise", icon: "💬", url: "https://prep-wise-stock.base44.app/Home" }
                        ].map((feature, idx) => (
                          feature.url ? (
                            <motion.a
                              key={idx}
                              href={feature.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.03 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white hover:shadow-md transition text-xs text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{feature.icon}</span>
                              <span className="text-left flex-1">{feature.name}</span>
                            </motion.a>
                          ) : (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.03 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white hover:shadow-md transition text-xs text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{feature.icon}</span>
                              <span className="text-left flex-1">{feature.name}</span>
                            </motion.button>
                          )
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div 
            className="relative"
            onMouseLeave={() => !isMobile && setIsRessourcesOpen(false)}
          >
            <button 
              onMouseEnter={() => !isMobile && setIsRessourcesOpen(true)}
              onClick={() => isMobile && setIsRessourcesOpen(!isRessourcesOpen)}
              className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
            >
              {t.navbar.resources}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isRessourcesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full -left-20 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[700px] p-8"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Explorer */}
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">{t.navbar.explore}</h4>
                    <div className="space-y-2">
                      {t.navbar.resources_explore.map((item, idx) => (
                        item.page ? (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                          >
                            <Link
                              to={createPageUrl(item.page)}
                              onClick={() => setIsRessourcesOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </Link>
                          </motion.div>
                        ) : (
                          <motion.a
                            key={idx}
                            href="#"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium"
                          >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                          </motion.a>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Entreprise */}
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">{t.navbar.company}</h4>
                      <div className="space-y-1.5">
                        {t.navbar.company_links.map((item, idx) => (
                          item.page ? (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.03 }}
                            >
                              <Link
                                to={createPageUrl(item.page)}
                                onClick={(e) => {
                                  setIsRessourcesOpen(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium group"
                              >
                                <span className="text-lg">{item.icon}</span>
                                <span className="flex-1">{item.name}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition group-hover:translate-x-0.5" />
                              </Link>
                            </motion.div>
                          ) : (
                            <motion.a
                              key={idx}
                              href="#"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.03 }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium"
                            >
                              <span className="text-lg">{item.icon}</span>
                              {item.name}
                            </motion.a>
                          )
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.a
                      href="#"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      onClick={(e) => {
                        e.preventDefault();
                        base44.auth.redirectToLogin();
                      }}
                      className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 transition cursor-pointer group"
                    >
                      <span className="font-medium">{t.navbar.discoverPlatform}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <Link to={createPageUrl('AboutOplo')} className="text-sm text-gray-600 hover:text-gray-900 transition">
            {t.navbar.about}
          </Link>

          <Link to={createPageUrl('PricingPage')} className="text-sm text-gray-600 hover:text-gray-900 transition">
            {t.navbar.pricing}
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => base44.auth.redirectToLogin()}
          >
            {t.navbar.login}
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.href = createPageUrl('QuoteQualification')}
          >
            {t.navbar.requestDemo}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              <Link
                to={createPageUrl('Home')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {t.navbar.home}
              </Link>
              <Link
                to={createPageUrl('AboutOplo')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {t.navbar.about}
              </Link>
              <Link
                to={createPageUrl('PricingPage')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {t.navbar.pricing}
              </Link>
              <Link
                to={createPageUrl('Contact')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {t.navbar.contact}
              </Link>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setIsMobileMenuOpen(false); base44.auth.redirectToLogin(); }}
                >
                  {t.navbar.login}
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => { setIsMobileMenuOpen(false); window.location.href = createPageUrl('QuoteQualification'); }}
                >
                  {t.navbar.requestDemo}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="pt-2">
                <LanguageSelector />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}