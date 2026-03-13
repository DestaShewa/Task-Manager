import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TASK_CATEGORIES } from "../config/constants"; // Import the categories

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState(TASK_CATEGORIES[0]); // Default to the first category
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert("Please provide a title and a due date.");
      return;
    }
    const newTask = {
      title,
      priority,
      dueDate,
      category,
      completed: false,
      subtasks: subtasks.map(s => ({ ...s, completed: false }))
    };
    onAddTask(newTask);
    // Reset form
    setTitle("");
    setPriority("Medium");
    setDueDate("");
    setCategory(TASK_CATEGORIES[0]);
    setSubtasks([]);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now(), text: newSubtask }]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Task Title
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Due Date & Time
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
          >
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtasks Section */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Subtasks (Optional)
        </label>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
            className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="p-2.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {subtasks.length > 0 && (
          <div className="space-y-2 mb-4">
            {subtasks.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg group animate-fade-in">
                <span className="text-sm text-slate-600 dark:text-slate-300">{sub.text}</span>
                <button
                  type="button"
                  onClick={() => removeSubtask(sub.id)}
                  className="p-1 text-slate-400 hover:text-accent sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary w-full py-4 text-base font-bold tracking-wide">
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
