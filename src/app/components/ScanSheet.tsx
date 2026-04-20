import { useRef, useState } from 'react';
import { X, Camera, Upload, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { resizeImage } from '../utils/imageUtils';

const CONTEXT_OPTIONS = [
  'Home cooked', 'Restaurant', 'Fast food', 'Small snack', 'Large portion', 'Takeaway',
];

interface Props {
  onClose: () => void;
}

export function ScanSheet({ onClose }: Props) {
  const navigate = useNavigate();
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [step, setStep] = useState<'options' | 'context'>('options');

  const handleFile = (file: File) => {
    setPendingFile(file);
    setStep('context');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!pendingFile) return;
    onClose();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      try {
        const { dataUrl, mimeType } = await resizeImage(raw, 1600);
        navigate('/scan', { state: { imageDataUrl: dataUrl, mimeType, portionContext: customContext || context } });
      } catch {
        navigate('/scan', { state: { imageDataUrl: raw, mimeType: pendingFile.type, portionContext: customContext || context } });
      }
    };
    reader.readAsDataURL(pendingFile);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:max-w-[390px] md:mx-auto bg-white rounded-t-3xl"
        style={{ fontFamily: 'Poppins, sans-serif', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Hidden inputs */}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {step === 'options' ? (
          <div className="px-6 pt-3 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg" style={{ fontWeight: 600, color: '#1C1917' }}>Scan Meal</h2>
              <button onClick={onClose} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary — Camera */}
            <button
              onClick={() => cameraRef.current?.click()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 active:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--main-green)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-white text-base" style={{ fontWeight: 600 }}>Take a Photo</p>
                <p className="text-white/70 text-xs">Open camera and snap your meal</p>
              </div>
            </button>

            {/* Upload */}
            <button
              onClick={() => uploadRef.current?.click()}
              className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F2EE' }}>
                <Upload className="w-6 h-6" style={{ color: 'var(--main-green)' }} strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ fontWeight: 600, color: '#1C1917' }}>Upload from Gallery</p>
                <p className="text-xs text-gray-400">Pick an existing photo</p>
              </div>
            </button>

            {/* Multi-scan */}
            <button
              onClick={() => { onClose(); navigate('/add-meal'); }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5F2EE' }}>
                <PlusCircle className="w-6 h-6" style={{ color: '#7C6F5B' }} strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ fontWeight: 600, color: '#1C1917' }}>Multi-scan Meal</p>
                <p className="text-xs text-gray-400">Scan multiple items together</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="px-6 pt-3 pb-6">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setStep('options')} className="text-sm text-gray-400">← Back</button>
              <button onClick={onClose} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <h2 className="text-lg mb-1" style={{ fontWeight: 600, color: '#1C1917' }}>Describe the portion</h2>
            <p className="text-sm text-gray-400 mb-4">Helps AI estimate the right amount</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setContext(c => c === opt ? '' : opt)}
                  className="px-3 py-1.5 rounded-full text-sm border-2 transition-all"
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

            <input
              type="text"
              placeholder="Or describe it (e.g. 'half plate of pasta')"
              value={customContext}
              onChange={e => setCustomContext(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />

            <button
              onClick={handleAnalyze}
              className="w-full py-4 rounded-full text-white mb-2"
              style={{ backgroundColor: 'var(--main-green)', fontWeight: 600 }}
            >
              Analyze Meal
            </button>
            <button
              onClick={() => { setContext(''); setCustomContext(''); handleAnalyze(); }}
              className="w-full py-2 text-sm text-gray-400"
            >
              Skip — analyze without context
            </button>
          </div>
        )}
      </div>
    </>
  );
}
