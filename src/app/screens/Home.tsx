import { motion } from 'motion/react';
import { Camera, Upload, TrendingUp, Flame, Target } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export function Home() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Calories', value: '1,420', max: '2,000', icon: Flame, color: '#E67E22' },
    { label: 'Protein', value: '85g', max: '150g', icon: TrendingUp, color: '#2ECC71' },
    { label: 'Daily Goal', value: '71%', max: '100%', icon: Target, color: '#3498DB' },
  ];

  const recentMeals = [
    { name: 'Grilled Chicken Salad', calories: 420, time: '12:30 PM', emoji: '🥗' },
    { name: 'Oatmeal with Berries', calories: 320, time: '8:00 AM', emoji: '🥣' },
    { name: 'Green Smoothie', calories: 180, time: '6:30 AM', emoji: '🥤' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-white text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-white/90 text-sm">Track your nutrition journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mt-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Icon className="w-5 h-5 text-white mb-2" />
                <div className="text-white text-xl font-bold">{stat.value}</div>
                <div className="text-white/80 text-xs mt-1">of {stat.max}</div>
                <div className="text-white/70 text-xs font-light">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center gap-3"
          >
            <Camera className="w-10 h-10 text-white" strokeWidth={2} />
            <span className="text-white font-semibold">Scan Meal</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-[#E67E22] to-[#D35400] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center gap-3"
          >
            <Upload className="w-10 h-10 text-white" strokeWidth={2} />
            <span className="text-white font-semibold">Upload Photo</span>
          </motion.button>
        </div>

        <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Recent Meals</h2>

        <div className="space-y-3">
          {recentMeals.map((meal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/meal-detail')}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer"
            >
              <div className="text-4xl">{meal.emoji}</div>
              <div className="flex-1">
                <h3 className="text-[#2C3E50] font-semibold">{meal.name}</h3>
                <p className="text-[#7F8C8D] text-sm">{meal.time}</p>
              </div>
              <div className="text-right">
                <div className="text-[#E67E22] font-bold text-lg">{meal.calories}</div>
                <div className="text-[#7F8C8D] text-xs">calories</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}



