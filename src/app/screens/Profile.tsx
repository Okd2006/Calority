import { motion } from 'motion/react';
import { User, Target, TrendingUp, Award, Settings, ChevronRight } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function Profile() {
  const stats = [
    { label: 'Current Streak', value: '12 days', icon: TrendingUp, color: '#2ECC71' },
    { label: 'Total Meals', value: '347', icon: Award, color: '#E67E22' },
    { label: 'Avg Calories', value: '1,920', icon: Target, color: '#3498DB' },
  ];

  const goals = [
    { label: 'Daily Calorie Target', value: '2,000 cal', current: 1420 },
    { label: 'Protein Goal', value: '150g', current: 85 },
    { label: 'Water Intake', value: '2.5L', current: 1.8 },
  ];

  const settings = [
    { label: 'Edit Profile', icon: User },
    { label: 'Nutrition Goals', icon: Target },
    { label: 'App Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="w-12 h-12 text-[#9B59B6]" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">John Doe</h1>
          <p className="text-white/90 text-sm">Health Enthusiast</p>
        </motion.div>
      </div>

      <div className="px-6 py-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center"
              >
                <Icon
                  className="w-6 h-6 mb-2"
                  style={{ color: stat.color }}
                />
                <div className="text-[#2C3E50] text-lg font-bold">{stat.value}</div>
                <div className="text-[#7F8C8D] text-xs text-center mt-1">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-[#2C3E50] text-xl font-semibold mb-4">Daily Goals</h2>

          <div className="space-y-4">
            {goals.map((goal, index) => {
              const percentage = (goal.current / parseInt(goal.value)) * 100;

              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#2C3E50] text-sm">{goal.label}</span>
                    <span className="text-[#7F8C8D] text-sm">{goal.value}</span>
                  </div>
                  <div className="w-full bg-[#ECF0F1] rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#2ECC71] to-[#27AE60]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 flex items-center gap-4 ${
                  index !== settings.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-10 h-10 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#7F8C8D]" />
                </div>
                <span className="flex-1 text-left text-[#2C3E50] font-medium">
                  {setting.label}
                </span>
                <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Sign out button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#E74C3C] text-white font-semibold py-4 rounded-2xl shadow-lg mt-6"
        >
          Sign Out
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}



