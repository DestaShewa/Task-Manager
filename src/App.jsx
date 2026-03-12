import React, { useState, useEffect, useMemo } from "react";
import api from "./services/api";

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
// API service handles URLs and fallbacks
// const API_URL = "http://localhost:5000/tasks";

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
        const data = await api.getTasks();
        setTasks(data);
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
      const data = await api.addTask(newTaskData);
      setTasks([...tasks, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await api.updateTask(id, { completed: !completed });

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
      await api.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setConfirmation({ isOpen: false });
  };

  const updateTask = async (id, updatedTaskData) => {
    try {
      const data = await api.replaceTask(id, updatedTaskData);
      setTasks(tasks.map((task) => (task.id === id ? data : task)));
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
