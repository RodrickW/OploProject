import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function PullToRefresh({ children, onRefresh, isLoading = false }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const scrollTop = contentRef.current?.scrollTop || 0;
      if (scrollTop === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      const scrollTop = contentRef.current?.scrollTop || 0;
      if (scrollTop !== 0) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(distance);
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && !isRefreshing && !isLoading) {
        setIsRefreshing(true);
        await onRefresh?.();
        setIsRefreshing(false);
      }
      setPullDistance(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, false);
      container.addEventListener('touchmove', handleTouchMove, false);
      container.addEventListener('touchend', handleTouchEnd, false);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [pullDistance, startY, isRefreshing, isLoading, onRefresh]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRefreshing || pullDistance > 0 ? 1 : 0 }}
        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10 pointer-events-none"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
        >
          <RotateCcw className="w-5 h-5 text-violet-600" />
        </motion.div>
      </motion.div>

      <motion.div
        ref={contentRef}
        style={{
          y: Math.min(pullDistance, 80),
          transition: isRefreshing || pullDistance === 0 ? 'none' : 'y 0.3s ease-out'
        }}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}