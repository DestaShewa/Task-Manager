import React from "react";

function ProgressTracker({ tasks = [] }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="my-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Progress
        </h3>
        <span className="font-bold text-gray-800 dark:text-gray-100">
          {completedTasks} / {totalTasks} Completed
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressTracker;
