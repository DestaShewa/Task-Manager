import React from "react";

function Header({ children }) {
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Task Manager
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Stay organized and boost your productivity.
        </p>
      </div>
      {children}
    </header>
  );
}

export default Header;
