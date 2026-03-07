import React from "react";

// A helper function to get the color for the priority badge

import {
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";

const getPriorityStyles = (priority) => {
  switch (priority) {
    case "High":
      return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    case "Medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Low":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  }
};

const MotionDiv = motion.div;

function TaskItem({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  dragHandleProps,
}) {
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const progress =
    subtasksCount > 0
      ? Math.round((completedSubtasks / subtasksCount) * 100)
      : null;

  return (
    <MotionDiv
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900 transitional-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 mb-4 flex items-center gap-3"
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400 dark:text-slate-700 dark:hover:text-slate-600 transition-colors"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex items-start justify-between gap-4 flex-1">
        <div className="flex items-start flex-1 gap-4">
          <div className="mt-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id, task.completed)}
              className="h-6 w-6 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
            />
          </div>
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold transition-all ${task.completed
                ? "text-slate-400 dark:text-slate-600 line-through"
                : "text-slate-800 dark:text-white"
                }`}
            >
              {task.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs uppercase tracking-wider font-bold ${getPriorityStyles(task.priority)}`}
              >
                {task.priority}
              </span>

              <div className="flex items-center gap-1.5">
                <TagIcon className="w-4 h-4" />
                <span>{task.category || "General"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Subtasks Progress */}
            {subtasksCount > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                    Subtasks: {completedSubtasks}/{subtasksCount}
                  </span>
                  <span className="text-xs font-bold text-primary-600">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditTask(task)}
            className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
            aria-label="Edit task"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
            aria-label="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </MotionDiv>
  );
}

export default TaskItem;
