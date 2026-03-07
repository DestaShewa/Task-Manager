import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Import all our components
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import SearchBar from "./components/SearchBar";
import SortControl from "./components/SortControl";
import EditTaskModal from "./components/EditTaskModal";
import ConfirmationModal from "./components/ConfirmationModal";
import ThemeToggle from "./components/ThemeToggle";
import ProgressTracker from "./components/ProgressTracker";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import confetti from "canvas-confetti";
import NotificationManager from "./components/NotificationManager";

// The URL for our simplified backend
const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({ isOpen: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please ensure the backend server is running.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // --- API Functions ---
  const addTask = async (newTaskData) => {
    try {
      const response = await axios.post(API_URL, newTaskData);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { completed: !completed });

      // Celebration effect when completing a task
      if (!completed) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b']
        });
      }

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
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setConfirmation({ isOpen: false });
  };

  const updateTask = async (id, updatedTaskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTaskData);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      closeEditModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
    setConfirmation({ isOpen: false });
  };

  // --- Confirmation Handlers ---
  const handleDeleteRequest = (id) => {
    setConfirmation({
      isOpen: true,
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      onConfirm: () => deleteTask(id),
    });
  };

  const handleUpdateRequest = (id, updatedData) => {
    setConfirmation({
      isOpen: true,
      title: "Confirm Changes",
      message: "Are you sure you want to save these changes?",
      onConfirm: () => updateTask(id, updatedData),
      confirmText: "Save Changes",
    });
  };

  // --- Modal Control ---
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  // --- Drag and Drop Handler ---
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  // --- Filtering and Sorting ---
  const filteredAndSortedTasks = useMemo(() => {
    const priorityValues = { Low: 1, Medium: 2, High: 3 };
    let result = tasks
      .filter((task) => {
        if (currentFilter === "Active") return !task.completed;
        if (currentFilter === "Completed") return task.completed;
        return true;
      })
      .filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (sortBy === "dueDate") {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "priority") {
      result.sort(
        (a, b) => priorityValues[b.priority] - priorityValues[a.priority]
      );
    }
    return result;
  }, [tasks, currentFilter, searchTerm, sortBy]);

  return (
    <div className="min-h-screen font-sans pb-12">
      <div className="container mx-auto max-w-5xl p-4 sm:p-6 animate-fade-in">
        <Header>
          <ThemeToggle />
        </Header>

        <main className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="card-premium border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Connection Error</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-8 py-3"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              <Dashboard tasks={tasks} />

              <div className="card-premium">
                <TaskForm onAddTask={addTask} />
                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <div className="flex items-center gap-4">
                      <TaskFilter
                        currentFilter={currentFilter}
                        setCurrentFilter={setCurrentFilter}
                      />
                      <SortControl setSortBy={setSortBy} />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <TaskList
                    tasks={filteredAndSortedTasks}
                    onToggleComplete={toggleComplete}
                    onDeleteTask={handleDeleteRequest}
                    onEditTask={openEditModal}
                    onDragEnd={handleOnDragEnd}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {isEditModalOpen && (
        <EditTaskModal
          task={taskToEdit}
          onConfirmUpdate={handleUpdateRequest}
          onClose={closeEditModal}
        />
      )}

      {confirmation.isOpen && (
        <ConfirmationModal
          {...confirmation}
          onCancel={() => setConfirmation({ isOpen: false })}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
