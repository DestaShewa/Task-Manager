import React from "react";
import { motion } from "framer-motion";

function ProgressTracker({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Generate ASCII progress bar
  const totalBars = 15;
  const filledBars = Math.round((percentage / 100) * totalBars);
  const asciiBar = "█".repeat(filledBars) + "░".repeat(Math.max(0, totalBars - filledBars));

  return (
    <div className="card-premium mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Project Progress
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* ASCII Bar */}
      <div className="mb-4 font-mono text-xl tracking-tighter text-primary-500 dark:text-primary-400 overflow-hidden whitespace-nowrap">
        {asciiBar}
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-primary-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        ></motion.div>
      </div>
    </div>
  );
}

export default ProgressTracker;
