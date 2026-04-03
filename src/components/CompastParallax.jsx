import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Users,
  Settings as SettingsIcon,
  Compass,
  ShoppingBag,
  Target,
  TrendingUp,
  UsersRound
} from 'lucide-react';

export default function CompastParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const modules = [
    { letter: "C", name: "Customer Success", icon: Users, delay: 0 },
    { letter: "O", name: "Operations", icon: SettingsIcon, delay: 0.1 },
    { letter: "M", name: "Market", icon: Compass, delay: 0.2 },
    { letter: "P", name: "Product/Service", icon: ShoppingBag, delay: 0.3 },
    { letter: "A", name: "Alignment", icon: Target, delay: 0.4 },
    { letter: "S", name: "Sales", icon: TrendingUp, delay: 0.5 },
    { letter: "T", name: "Team", icon: UsersRound, delay: 0.6 }
  ];

  const createParallaxTransform = (speed) => {
    return useTransform(scrollYProgress, [0, 1], [0, speed]);
  };

  return (
    <div ref={ref} className="py-12 px-4">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4 max-w-5xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {modules.map((module, idx) => {
          const Icon = module.icon;
          const y = createParallaxTransform(50 - idx * 10);

          return (
            <motion.div
              key={idx}
              style={{ y }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: module.delay }}
              whileHover={{ scale: 1.05, y: 0 }}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 text-center hover:border-gray-400 hover:shadow-md transition-all">
                <div className="flex justify-center mb-2">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-gray-900 transition" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{module.letter}</div>
                <div className="text-xs lg:text-sm font-medium text-gray-700">{module.name}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center text-sm lg:text-base text-gray-600 max-w-2xl mx-auto"
      >
        Une structure complète pour opérer et scaler intelligemment
      </motion.p>
    </div>
  );
}