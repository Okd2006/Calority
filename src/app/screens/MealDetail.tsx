import { motion } from 'motion/react';
import { ArrowLeft, Clock, Flame, TrendingUp, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function MealDetail() {
  const navigate = useNavigate();

  const macroData = [
    { name: 'Protein', value: 45, color: '#2ECC71', grams: 28 },
    { name: 'Carbs', value: 35, color: '#3498DB', grams: 22 },
    { name: 'Fats', value: 20, color: '#E67E22', grams: 12 },
  ];

  const nutritionDetails = [
    { label: 'Calories', value: '580', icon: Flame, color: '#E67E22' },
    { label: 'Protein', value: '28g', icon: TrendingUp, color: '#2ECC71' },
    { label: 'Carbs', value: '22g', icon: Droplet, color: '#3498DB' },
    { label: 'Fats', value: '12g', icon: Droplet, color: '#F39C12' },
  ];

  const ingredients = [
    'Grilled Chicken Breast (150g)',
    'Mixed Greens (100g)',
    'Cherry Tomatoes (50g)',
    'Olive Oil Dressing (15ml)',
    'Avocado (50g)',
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header with image */}
      <div className="relative h-64 bg-gradient-to-br from-[#2ECC71] to-[#27AE60]">
        <button
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 bg-black/30 backdrop-blur-sm rounded-full p-3 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Mock food image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-9xl">🥗</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h1 className="text-white text-2xl font-bold">Grilled Chicken Salad</h1>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm">Logged at 12:30 PM</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Macro breakdown card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Macro Breakdown</h2>

          <div className="flex items-center justify-between">
            {/* Pie chart */}
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {macroData.map((macro, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-[#2C3E50] text-sm">{macro.name}</span>
                  </div>
                  <span className="text-[#2C3E50] font-semibold">{macro.grams}g</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Nutrition details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Nutrition Details</h2>

          <div className="grid grid-cols-2 gap-4">
            {nutritionDetails.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F8F9FA] rounded-xl p-4"
                >
                  <Icon
                    className="w-5 h-5 mb-2"
                    style={{ color: item.color }}
                  />
                  <div className="text-2xl font-bold text-[#2C3E50]">{item.value}</div>
                  <div className="text-[#7F8C8D] text-sm mt-1">{item.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Detected Ingredients</h2>

          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                <span className="text-[#2C3E50]">{ingredient}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white font-semibold py-4 rounded-2xl shadow-lg mt-6"
        >
          Save to History
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}



