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

  // Fetch tasks from API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
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
    <div className="min-h-screen font-sans">
      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <Header>
          <ThemeToggle />
        </Header>

        <main className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mt-6">
          <TaskForm onAddTask={addTask} />
          <ProgressTracker tasks={filteredAndSortedTasks} />

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex items-center gap-4">
              <TaskFilter
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
              />
              <SortControl setSortBy={setSortBy} />
            </div>
          </div>

          <div className="mt-6">
            <TaskList
              tasks={filteredAndSortedTasks}
              onToggleComplete={toggleComplete}
              onDeleteTask={handleDeleteRequest}
              onEditTask={openEditModal}
              onDragEnd={handleOnDragEnd}
            />
          </div>
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
    </div>
  );
}

export default App;
