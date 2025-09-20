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
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id, task.completed)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span
            className={`ml-4 text-lg font-medium ${
              task.completed ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {task.title}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Edit Button */}
          <button
            onClick={() => onEditTask(task)}
            className="text-blue-500 hover:text-blue-700"
            aria-label={`Edit task: ${task.title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Delete Button */}
          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-red-500 hover:text-red-700"
            aria-label={`Delete task: ${task.title}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3 ml-9 pl-1 flex items-center space-x-4 text-sm text-gray-500">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        {task.category && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
            {task.category}
          </span>
        )}
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default TaskItem;
