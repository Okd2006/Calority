import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

const SUPABASE_URL = 'https://sywfobkulzwbzvdzyvon.supabase.co/functions/v1/make-server-be9d8453';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5d2ZvYmt1bHp3Ynp2ZHp5dm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDIyNTQsImV4cCI6MjA5NzY3ODI1NH0.Nw8O4u2msG66kNZgjtAMk7bqhiSmljcX8BZ8r10Jlsg';

const QUICK_EXAMPLES = [
  'Bowl of oatmeal with banana',
  '2 boiled eggs with toast',
  'Chicken biryani, 1 plate',
  'Dal rice with ghee',
  'Protein shake with milk',
  'Paneer butter masala with naan',
];

async function analyzeTextWithGemini(foodName: string, description: string) {
  const res = await fetch(`${SUPABASE_URL}/analyze-meal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      imageBase64: null,
      mimeType: 'text/plain',
      portionContext: `Food: ${foodName}. ${description ? 'Details: ' + description : ''}. There is no image — estimate nutrition based on the text description only. Use standard portion sizes if not specified.`,
      textOnly: true,
      foodName,
      description,
    }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export function TextMealScreen() {
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!foodName.trim()) return;
    setLoading(true);
    setError('');

    try {
      const mealData = await analyzeTextWithGemini(foodName.trim(), description.trim());
      if (mealData.error) throw new Error(mealData.error);
      navigate('/result', { state: { mealData, imageDataUrl: null } });
    } catch (err) {
      setError('Could not analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pb-safe"
      style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(to bottom, #A8E6B0 0%, #F0FAF1 100%)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 rounded-b-sm flex items-center gap-3"
        style={{ backgroundColor: '#2ECC71', paddingTop: 'max(1.00rem, env(safe-area-inset-top))' }}
      >
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl" style={{ fontWeight: 600, color: 'white' }}>Describe Your Meal</h1>
      </div>

      <div className="px-6 pt-6 space-y-5">

        {/* Info banner */}
        <div className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2ECC71' }} />
          <p className="text-sm text-gray-600">
            No photo? Just describe what you ate — AI will estimate all the macros and nutrients for you.
          </p>
        </div>

        {/* Food name */}
        <div>
          <label className="text-sm text-gray-500 mb-1.5 block" style={{ fontWeight: 600 }}>
            Food Name <span style={{ color: '#2ECC71' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Chicken Biryani, Oatmeal, Dal Rice..."
            value={foodName}
            onChange={e => setFoodName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border-2 outline-none text-sm bg-white"
            style={{
              fontFamily: 'Poppins, sans-serif',
              borderColor: foodName ? '#2ECC71' : '#E5E7EB',
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-500 mb-1.5 block" style={{ fontWeight: 600 }}>
            Description <span className="text-gray-300 font-normal">(optional but helps accuracy)</span>
          </label>
          <textarea
            placeholder="e.g. 1 large plate, home cooked, with extra ghee and raita on the side..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl border-2 outline-none text-sm bg-white resize-none"
            style={{
              fontFamily: 'Poppins, sans-serif',
              borderColor: description ? '#2ECC71' : '#E5E7EB',
            }}
          />
        </div>

        {/* Quick examples */}
        <div>
          <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>QUICK EXAMPLES</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => setFoodName(ex)}
                className="px-3 py-1.5 rounded-full text-xs bg-white border border-gray-200 text-gray-600 active:bg-green-50 transition-colors"
                style={{ fontWeight: 500 }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!foodName.trim() || loading}
          className="w-full py-4 rounded-full text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: '#2ECC71', fontWeight: 600 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze with AI
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
