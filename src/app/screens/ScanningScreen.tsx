import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';

const SUPABASE_URL = 'https://vlcmcyzpgsywvtjlsqqy.supabase.co/functions/v1/make-server-be9d8453';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsY21jeXpwZ3N5d3Z0amxzcXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjI2MzIsImV4cCI6MjA4OTI5ODYzMn0.1Y7ULHx1QQJIPpI47k-arad4mFiZqL7-ZGUbl4tcjp8';

export function ScanningScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFired = useRef(false);

  const { imageDataUrl, mimeType = 'image/jpeg', portionContext = '' } = (location.state as any) ?? {};

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    if (!imageDataUrl) {
      navigate('/home', { replace: true });
      return;
    }

    const analyze = async () => {
      try {
        const base64 = imageDataUrl.split(',')[1];

        const res = await fetch(`${SUPABASE_URL}/analyze-meal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ imageBase64: base64, mimeType, portionContext }),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const mealData = await res.json();
        navigate('/result', { state: { mealData, imageDataUrl }, replace: true });
      } catch (err) {
        console.error('Analysis failed:', err);
        navigate('/result', {
          state: { error: 'Could not analyze the image. Please try again.', imageDataUrl },
          replace: true,
        });
      }
    };

    analyze();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(to bottom, #FFFFFF 0%, #F9FAFB 100%)' }}
    >
      <div className="relative mb-8">
        <div className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
          {imageDataUrl
            ? <img src={imageDataUrl} alt="Meal being analyzed" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
        </div>

        {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
          <motion.div
            key={corner}
            className={`absolute w-12 h-12 ${
              corner === 'tl' ? 'top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl' :
              corner === 'tr' ? 'top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl' :
              corner === 'bl' ? 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl' :
              'bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl'
            }`}
            style={{ borderColor: 'var(--energy-orange)' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        <motion.div
          className="absolute left-0 right-0 h-0.5 mx-4"
          style={{ background: 'linear-gradient(to right, transparent, var(--energy-orange), transparent)' }}
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {portionContext ? (
        <div className="mb-3 px-4 py-2 rounded-full bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">Context: <span style={{ fontWeight: 600 }}>{portionContext}</span></p>
        </div>
      ) : null}

      <motion.div className="text-center" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
        <h2 className="text-2xl mb-2" style={{ fontWeight: 600, color: '#1F2937' }}>Analyzing your meal...</h2>
        <p className="text-base text-gray-500">Calculating macros with AI</p>
      </motion.div>

      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: 'var(--energy-orange)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}


