import React from "react";

function SortControl({ setSortBy }) {
  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="text-gray-600 mr-2 font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        onChange={(e) => setSortBy(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="default">Default</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}

export default SortControl;
