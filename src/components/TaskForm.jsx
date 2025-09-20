import React, { useState } from "react";
import { TASK_CATEGORIES } from "../config/constants"; // Import the categories

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState(TASK_CATEGORIES[0]); // Default to the first category

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert("Please provide a title and a due date.");
      return;
    }
    const newTask = { title, priority, dueDate, category, completed: false };
    onAddTask(newTask);
    // Reset form
    setTitle("");
    setPriority("Medium");
    setDueDate("");
    setCategory(TASK_CATEGORIES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border">
      <input
        type="text"
        placeholder="Add a new task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        {/* MODIFIED: Category is now a dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
