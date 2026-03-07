import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TASK_CATEGORIES } from "../config/constants";

function EditTaskModal({ task, onConfirmUpdate, onClose }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setCategory(task.category);
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    const updatedTask = { ...task, title, priority, dueDate, category, subtasks };
    onConfirmUpdate(task.id, updatedTask);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now(), text: newSubtask, completed: false }]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (id) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Task</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Edit Subtasks */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Subtasks
            </label>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addSubtask}
                className="p-2.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-lg group">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => toggleSubtask(sub.id)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className={`flex-1 text-sm ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                    {sub.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(sub.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
