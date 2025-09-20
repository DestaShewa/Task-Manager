import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import SearchBar from "./components/SearchBar";
import SortControl from "./components/SortControl";
import EditTaskModal from "./components/EditTaskModal";

const API_URL = "http://localhost:5000/tasks";

function App() {
  // State for data and UI controls
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // State for the edit modal
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // --- API Communication Functions ---
  const addTask = async (newTaskData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData),
      });
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (id, updatedTaskData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT", // PUT replaces the entire object
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaskData),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      closeEditModal(); // Close modal on successful update
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // --- Modal Control Functions ---
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedTasks = useMemo(() => {
    const priorityValues = { Low: 1, Medium: 2, High: 3 };

    let result = tasks
      // Filter by status (All, Active, Completed)
      .filter((task) => {
        if (currentFilter === "Active") return !task.completed;
        if (currentFilter === "Completed") return task.completed;
        return true;
      })
      // Filter by search term (case-insensitive)
      .filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Sort the results
    switch (sortBy) {
      case "dueDate":
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case "priority":
        result.sort(
          (a, b) => priorityValues[b.priority] - priorityValues[a.priority]
        );
        break;
      default:
        // No additional sorting, maintain default order
        break;
    }

    return result;
  }, [tasks, currentFilter, searchTerm, sortBy]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <Header />
        <main className="bg-white rounded-lg shadow-xl p-6 mt-6">
          <TaskForm onAddTask={addTask} />

          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <div className="flex items-center gap-4">
                <TaskFilter
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                />
                <SortControl setSortBy={setSortBy} />
              </div>
            </div>

            <TaskList
              tasks={filteredAndSortedTasks}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onEditTask={openEditModal}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <EditTaskModal
          task={taskToEdit}
          onUpdateTask={updateTask}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

export default App;
