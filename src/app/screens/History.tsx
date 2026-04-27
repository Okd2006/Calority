import { motion } from 'motion/react';
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function History() {
  const weekData = [
    { day: 'Mon', calories: 1850, goal: 2000 },
    { day: 'Tue', calories: 2100, goal: 2000 },
    { day: 'Wed', calories: 1920, goal: 2000 },
    { day: 'Thu', calories: 1780, goal: 2000 },
    { day: 'Fri', calories: 2050, goal: 2000 },
    { day: 'Sat', calories: 2200, goal: 2000 },
    { day: 'Today', calories: 1420, goal: 2000 },
  ];

  const mealHistory = [
    {
      date: 'Today',
      meals: [
        { name: 'Grilled Chicken Salad', time: '12:30 PM', calories: 420, emoji: '🥗' },
        { name: 'Oatmeal with Berries', time: '8:00 AM', calories: 320, emoji: '🥣' },
        { name: 'Green Smoothie', time: '6:30 AM', calories: 180, emoji: '🥤' },
      ]
    },
    {
      date: 'Yesterday',
      meals: [
        { name: 'Grilled Salmon', time: '7:00 PM', calories: 520, emoji: '🐟' },
        { name: 'Greek Yogurt Parfait', time: '3:00 PM', calories: 280, emoji: '🥛' },
        { name: 'Veggie Wrap', time: '12:00 PM', calories: 380, emoji: '🌯' },
        { name: 'Protein Shake', time: '7:30 AM', calories: 250, emoji: '🥤' },
      ]
    },
  ];

  const maxCalories = Math.max(...weekData.map(d => d.calories));

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-gradient-to-br from-[#3498DB] to-[#2980B9] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-white text-3xl font-bold mb-2">History</h1>
          <p className="text-white/90 text-sm">Track your nutrition progress</p>
        </motion.div>
      </div>

      <div className="px-6 py-6">
        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2C3E50] text-xl font-semibold">This Week</h2>
            <Calendar className="w-5 h-5 text-[#7F8C8D]" />
          </div>

          <div className="flex items-end justify-between gap-2 h-32 mb-2">
            {weekData.map((day, index) => {
              const height = (day.calories / maxCalories) * 100;
              const isOverGoal = day.calories > day.goal;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`w-full rounded-t-lg ${
                      isOverGoal
                        ? 'bg-gradient-to-t from-[#E67E22] to-[#F39C12]'
                        : 'bg-gradient-to-t from-[#2ECC71] to-[#27AE60]'
                    }`}
                  />
                  <span className="text-xs text-[#7F8C8D] font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#2ECC71]" />
              <span className="text-sm text-[#7F8C8D]">Avg: 1,920 cal</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#E67E22]" />
              <span className="text-sm text-[#7F8C8D]">Goal: 2,000 cal</span>
            </div>
          </div>
        </motion.div>

        {/* Meal history */}
        {mealHistory.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + sectionIndex * 0.1 }}
            className="mb-6"
          >
            <h3 className="text-[#2C3E50] font-semibold mb-3 px-2">{section.date}</h3>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {section.meals.map((meal, mealIndex) => (
                <div
                  key={mealIndex}
                  className={`p-4 flex items-center gap-4 ${
                    mealIndex !== section.meals.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="text-3xl">{meal.emoji}</div>
                  <div className="flex-1">
                    <h4 className="text-[#2C3E50] font-semibold">{meal.name}</h4>
                    <p className="text-[#7F8C8D] text-sm">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E67E22] font-bold">{meal.calories}</div>
                    <div className="text-[#7F8C8D] text-xs">cal</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}



