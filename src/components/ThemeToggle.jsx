import React from "react";
import useDarkMode from "../hooks/useDarkMode";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // You might need to install heroicons: npm install @heroicons/react

function ThemeToggle() {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? (
        <MoonIcon className="h-6 w-6 text-gray-800" />
      ) : (
        <SunIcon className="h-6 w-6 text-yellow-400" />
      )}
    </button>
  );
}

export default ThemeToggle;
