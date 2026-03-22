import { useRef, useState } from 'react';
import { Camera, Upload, PlusCircle, X, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { resizeImage } from '../utils/imageUtils';

const RECENT_MEALS = [
  { id: 1, name: 'Chicken Biryani', calories: 450, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
  { id: 2, name: 'Caesar Salad', calories: 320, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
  { id: 3, name: 'Avocado Toast', calories: 280, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400' },
];

const PHOTO_TIPS = [
  { icon: '📸', tip: 'Shoot from directly above (top-down view)' },
  { icon: '🍴', tip: 'Include a fork or hand for portion reference' },
  { icon: '💡', tip: 'Good lighting — avoid shadows on the food' },
  { icon: '🔍', tip: 'Keep the food in focus, no blur' },
];

const CONTEXT_OPTIONS = [
  'Home cooked', 'Restaurant portion', 'Fast food', 'Small snack', 'Large portion', 'Takeaway'
];

export function HomeScreen() {
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [showTips, setShowTips] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [showContextSheet, setShowContextSheet] = useState(false);

  const handleImageSelected = async (file: File) => {
    setPendingFile(file);
    setShowContextSheet(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelected(file);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!pendingFile) return;
    setShowContextSheet(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      try {
        const { dataUrl, mimeType } = await resizeImage(raw, 1024);
        const portionContext = customContext || context;
        navigate('/scan', { state: { imageDataUrl: dataUrl, mimeType, portionContext } });
      } catch {
        navigate('/scan', { state: { imageDataUrl: raw, mimeType: pendingFile.type, portionContext: customContext || context } });
      }
    };
    reader.readAsDataURL(pendingFile);
  };

  return (
    <div className="min-h-screen bg-white pb-safe" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hidden file inputs */}
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="pt-safe px-6 pb-6">
        <h1 className="text-3xl tracking-tight" style={{ fontWeight: 600, color: '#1F2937' }}>
          What are you eating today?
        </h1>
      </div>

      {/* Photo tips banner */}
      <div className="px-6 mb-6">
        <button
          onClick={() => setShowTips(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl border border-yellow-200 bg-yellow-50"
        >
          <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <span className="text-sm text-yellow-700" style={{ fontWeight: 500 }}>
            Tips for better AI accuracy — tap to see
          </span>
        </button>
      </div>

      {/* Main CTA */}
      <div className="px-6 flex flex-col items-center gap-4 mb-10">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-48 h-48 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-3 transition-transform active:scale-95"
          style={{ backgroundColor: 'var(--main-green)' }}
        >
          <Camera className="w-16 h-16 text-white" strokeWidth={2} />
          <span className="text-white text-lg" style={{ fontWeight: 600 }}>Scan Meal</span>
        </button>

        <button
          onClick={() => uploadInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all active:scale-95"
          style={{ borderColor: 'var(--main-green)', color: 'var(--main-green)' }}
        >
          <Upload className="w-5 h-5" />
          <span style={{ fontWeight: 600 }}>Upload image</span>
        </button>

        <button
          onClick={() => navigate('/add-meal')}
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all active:scale-95"
          style={{ borderColor: '#3498DB', color: '#3498DB' }}
        >
          <PlusCircle className="w-5 h-5" />
          <span style={{ fontWeight: 600 }}>Add Meal (multi-scan)</span>
        </button>
      </div>

      {/* Recent Meals */}
      <div className="px-6">
        <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#374151' }}>Recent Meals</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {RECENT_MEALS.map((meal) => (
            <div key={meal.id} className="flex-shrink-0 w-28 cursor-pointer">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-2 shadow-md" style={{ backgroundColor: '#F3F4F6' }}>
                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-600 truncate">{meal.name}</p>
              <p className="text-xs" style={{ color: 'var(--main-green)', fontWeight: 600 }}>{meal.calories} kcal</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />

      {/* Photo Tips Sheet */}
      {showTips && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Tips for best results</h2>
              <button onClick={() => setShowTips(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 mb-6">
              {PHOTO_TIPS.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <p className="text-sm text-gray-700 pt-1">{t.tip}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTips(false)}
              className="w-full py-3 rounded-full text-white"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Portion Context Sheet */}
      {showContextSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Describe the portion</h2>
              <button onClick={() => setShowContextSheet(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">This helps AI estimate the right amount</p>

            {/* Quick options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setContext(opt)}
                  className="px-4 py-2 rounded-full text-sm border-2 transition-all"
                  style={{
                    borderColor: context === opt ? 'var(--main-green)' : '#E5E7EB',
                    backgroundColor: context === opt ? '#F0FDF4' : 'white',
                    color: context === opt ? 'var(--main-green)' : '#374151',
                    fontWeight: context === opt ? 600 : 400,
                  }}
                >
                  {context === opt && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                  {opt}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <input
              type="text"
              placeholder="Or describe it yourself (e.g. 'half plate of pasta')"
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none mb-5"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />

            <button
              onClick={handleAnalyze}
              className="w-full py-4 rounded-full text-white"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >
              Analyze Meal
            </button>
            <button
              onClick={() => { setContext(''); setCustomContext(''); handleAnalyze(); }}
              className="w-full py-3 text-sm text-gray-400 mt-2"
            >
              Skip — analyze without context
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


