import React from "react";

// The filters available
const FILTERS = ["All", "Active", "Completed"];

function TaskFilter({ currentFilter, setCurrentFilter }) {
  const handleClick = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  return (
    <div className="flex justify-center space-x-4">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => handleClick(filter)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors
            ${
              currentFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
