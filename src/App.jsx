import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import Login from "./components/Login";
import Register from "./components/Register";
import UnifiedAuth from "./components/UnifiedAuth";
import AdminDashboard from "./components/AdminDashboard";
import FriendDashboard from "./components/FriendDashboard";
import confetti from "canvas-confetti";
import NotificationManager from "./components/NotificationManager";

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grouped'
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({ isOpen: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API on component mount or when user changes
  const fetchTasks = async (silent = false) => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTasks(user.id);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (!silent) setError("Failed to fetch tasks. Please ensure the backend server is running.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Multi-device synchronization polling
    const pollInterval = setInterval(() => {
      fetchTasks(true);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [user]);

  // --- API Functions ---
  const addTask = async (newTaskData) => {
    try {
      const data = await api.addTask({ ...newTaskData, userId: user.id });
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

  const handleLike = async (id) => {
    try {
      const updatedTask = await api.likeTask(id, user.id);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error("Error liking task:", error);
    }
  };

  const handleAddComment = async (id, currentComments, commentText) => {
    try {
      const updatedTask = await api.addComment(id, currentComments, {
        text: commentText,
        author: user.name,
        authorId: user.id
      });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
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

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading authentication...</div>;

  return (
    <div className="min-h-screen font-sans pb-12 relative overflow-hidden">
      <div className="bg-mesh-gradient">
        <div className="mesh-ball mesh-ball-1 opacity-[0.07] dark:opacity-[0.03]"></div>
        <div className="mesh-ball mesh-ball-2 opacity-[0.07] dark:opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto max-w-5xl p-4 sm:p-6 animate-fade-in relative z-10">
        <Header>
          <ThemeToggle />
        </Header>

        <main className="mt-8">
          <Routes>
            <Route path="/login" element={!user ? <UnifiedAuth /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />
            <Route path="/register" element={!user ? <UnifiedAuth /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />
            <Route path="/auth" element={!user ? <UnifiedAuth /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} />
            <Route path="/dashboard" element={user ? (
              <>
                <Dashboard tasks={tasks} />
                <div className="card-premium">
                  <TaskForm onAddTask={addTask} />
                  <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="w-full sm:w-auto">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                      </div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            List
                          </button>
                          <button
                            onClick={() => setViewMode('grouped')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grouped' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            Collected
                          </button>
                        </div>
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
                      viewMode={viewMode}
                      onToggleComplete={toggleComplete}
                      onDeleteTask={handleDeleteRequest}
                      onEditTask={openEditModal}
                      onLike={handleLike}
                      onAddComment={handleAddComment}
                      onDragEnd={handleOnDragEnd}
                    />
                  </div>
                </div>
              </>
            ) : <Navigate to="/auth" />} />
            <Route path="/friends" element={user ? (
              <FriendDashboard
                onLike={handleLike}
                onAddComment={handleAddComment}
                onToggleComplete={toggleComplete}
              />
            ) : <Navigate to="/auth" />} />
            <Route path="/admin" element={user?.role === 'admin' ? (
              <AdminDashboard
                onLike={handleLike}
                onAddComment={handleAddComment}
                onToggleComplete={toggleComplete}
                onDeleteTask={deleteTask}
              />
            ) : <Navigate to="/dashboard" />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <NotificationManager />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
