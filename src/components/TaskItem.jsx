import React from "react";

// A helper function to get the color for the priority badge
const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-yellow-500 text-white";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }) {
  return (
    // ADDED DARK MODE CLASSES
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id, task.completed)}
            className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          />
          <span
            className={`ml-4 text-lg font-medium ${
              task.completed
                ? "text-gray-400 dark:text-gray-500 line-through"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEditTask(task)}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            aria-label={`Edit task: ${task.title}`}
          >
            {/* ... SVG ... */}
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            aria-label={`Delete task: ${task.title}`}
          >
            {/* ... SVG ... */}
          </button>
        </div>
      </div>
      <div className="mt-3 ml-9 pl-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        {task.category && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
            {task.category}
          </span>
        )}
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default TaskItem;
