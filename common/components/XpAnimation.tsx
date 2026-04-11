
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface XpAnimationProps {
  xp: number;
  top: number;
  left: number;
  onComplete: () => void;
}

const XpAnimation: React.FC<XpAnimationProps> = ({ xp, top, left, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1500); // Animation duration ~1.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -50 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          className="fixed z-50 text-green-500 font-bold text-lg pointer-events-none"
          style={{ top: top, left: left }}
        >
          +{xp} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XpAnimation;
