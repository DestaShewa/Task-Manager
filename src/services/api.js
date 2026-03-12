import axios from "axios";

const API_URL = "http://localhost:5000/tasks";
const STORAGE_KEY = "task_manager_tasks";

// Helper to get tasks from localStorage
const getLocalTasks = () => {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
};

// Helper to save tasks to localStorage
const saveLocalTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// State to track if we are in "Demo Mode" (using localStorage)
let isDemoMode = false;

const api = {
    getTasks: async () => {
        try {
            const response = await axios.get(API_URL);
            isDemoMode = false;
            saveLocalTasks(response.data);
            return response.data;
        } catch (error) {
            console.warn("API Error, falling back to localStorage");
            isDemoMode = true;
            return getLocalTasks();
        }
    },

    addTask: async (task) => {
        if (isDemoMode) {
            const tasks = getLocalTasks();
            const newTask = { ...task, id: Date.now() };
            tasks.push(newTask);
            saveLocalTasks(tasks);
            return newTask;
        }
        try {
            const response = await axios.post(API_URL, task);
            return response.data;
        } catch (error) {
            console.warn("Post failed, switching to Demo Mode");
            isDemoMode = true;
            return api.addTask(task);
        }
    },

    updateTask: async (id, updates) => {
        if (isDemoMode) {
            const tasks = getLocalTasks();
            const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
            saveLocalTasks(updatedTasks);
            return updatedTasks.find((t) => t.id === id);
        }
        try {
            const response = await axios.patch(`${API_URL}/${id}`, updates);
            return response.data;
        } catch (error) {
            isDemoMode = true;
            return api.updateTask(id, updates);
        }
    },

    replaceTask: async (id, task) => {
        if (isDemoMode) {
            const tasks = getLocalTasks();
            const updatedTasks = tasks.map((t) => {
                // Handle potential ID type mismatch (string vs number)
                if (String(t.id) === String(id)) {
                    return { ...task, id: t.id };
                }
                return t;
            });
            saveLocalTasks(updatedTasks);
            return { ...task, id };
        }
        try {
            const response = await axios.put(`${API_URL}/${id}`, task);
            return response.data;
        } catch (error) {
            isDemoMode = true;
            return api.replaceTask(id, task);
        }
    },

    deleteTask: async (id) => {
        if (isDemoMode) {
            const tasks = getLocalTasks();
            const filteredTasks = tasks.filter((t) => String(t.id) !== String(id));
            saveLocalTasks(filteredTasks);
            return true;
        }
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            isDemoMode = true;
            return api.deleteTask(id);
        }
    },

    isDemoMode: () => isDemoMode
};

export default api;
