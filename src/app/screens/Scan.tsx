import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function Scan() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    // Auto-start scanning
    const startTimer = setTimeout(() => {
      setIsScanning(true);
    }, 500);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              navigate('/meal-detail');
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isScanning, scanProgress, navigate]);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Camera preview placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />

        {/* Mock food image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <div className="text-8xl">🍕</div>
        </div>

        {/* Scanning overlay */}
        <AnimatePresence>
          {isScanning && (
            <>
              {/* Corner brackets */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 m-16"
              >
                <div className="relative w-full h-full">
                  {/* Top-left */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#2ECC71] rounded-tl-2xl" />
                  {/* Top-right */}
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#2ECC71] rounded-tr-2xl" />
                  {/* Bottom-left */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#2ECC71] rounded-bl-2xl" />
                  {/* Bottom-right */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#2ECC71] rounded-br-2xl" />
                </div>
              </motion.div>

              {/* Scanning line */}
              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: '90%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute left-16 right-16 h-0.5 bg-gradient-to-r from-transparent via-[#2ECC71] to-transparent shadow-[0_0_20px_rgba(46,204,113,0.8)]"
              />

              {/* Scanning particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 500 - 250,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="absolute"
                >
                  <Sparkles className="w-4 h-4 text-[#2ECC71]" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <button
            onClick={() => navigate('/home')}
            className="bg-black/30 backdrop-blur-sm rounded-full p-3"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">AI Scanning...</span>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-8 left-0 right-0 px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#2ECC71]" />
              <span className="text-white font-semibold">Analyzing your meal...</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60]"
              />
            </div>

            <p className="text-white/70 text-sm mt-3 text-center">
              {scanProgress < 30 ? 'Detecting food items...' :
               scanProgress < 60 ? 'Calculating nutritional values...' :
               scanProgress < 90 ? 'Finalizing analysis...' :
               'Complete!'}
            </p>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}



