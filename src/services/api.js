import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
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

const getLocalUsers = () => {
    const users = localStorage.getItem("task_manager_users");
    return users ? JSON.parse(users) : [];
};

const saveLocalUsers = (users) => {
    localStorage.setItem("task_manager_users", JSON.stringify(users));
};

// State to track if we are in "Demo Mode" (using localStorage)
let isDemoMode = false;

const api = {
    getUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            isDemoMode = false;
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.warn("API Error fetching users, falling back to LocalStorage");
            isDemoMode = true;
            return getLocalUsers();
        }
    },

    registerUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/users`, userData);
            return response.data;
        } catch (error) {
            console.warn("API Registration failed, saving to LocalStorage");
            isDemoMode = true;
            const users = getLocalUsers();
            const newUser = { ...userData, id: Date.now().toString() };
            users.push(newUser);
            saveLocalUsers(users);
            return newUser;
        }
    },

    updateUser: async (id, updates) => {
        try {
            const response = await axios.patch(`${API_URL}/users/${id}`, updates);
            return response.data;
        } catch (error) {
            isDemoMode = true;
            const users = getLocalUsers();
            const updatedUsers = users.map(u => String(u.id) === String(id) ? { ...u, ...updates } : u);
            saveLocalUsers(updatedUsers);
            return updatedUsers.find(u => String(u.id) === String(id));
        }
    },

    deleteUser: async (id) => {
        try {
            await axios.delete(`${API_URL}/users/${id}`);
            return true;
        } catch (error) {
            console.error("API Error deleting user:", error);
            throw error;
        }
    },

    getTasks: async (userId) => {
        try {
            const url = userId ? `${API_URL}/tasks?userId=${userId}` : `${API_URL}/tasks`;
            const response = await axios.get(url);
            isDemoMode = false;
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.warn("API Error, falling back to localStorage");
            isDemoMode = true;
            const local = getLocalTasks();
            return userId ? local.filter(t => t.userId === userId) : local;
        }
    },

    getTasksByGroup: async (groupId) => {
        try {
            // First get all users in the group
            const usersResponse = await axios.get(`${API_URL}/users?groupId=${groupId}`);
            const userIds = Array.isArray(usersResponse.data) ? usersResponse.data.map(u => u.id) : [];

            // Fetch tasks for all these users (simplified for json-server)
            const tasksResponse = await axios.get(`${API_URL}/tasks`);
            const tasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];
            return tasks.filter(t => userIds.includes(t.userId));
        } catch (error) {
            console.error("Error fetching group tasks:", error);
            return [];
        }
    },

    addTask: async (task) => {
        if (isDemoMode) {
            const tasks = getLocalTasks();
            const newTask = { ...task, id: Date.now().toString() };
            tasks.push(newTask);
            saveLocalTasks(tasks);
            return newTask;
        }
        try {
            const response = await axios.post(`${API_URL}/tasks`, task);
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
            const updatedTasks = tasks.map((t) => (String(t.id) === String(id) ? { ...t, ...updates } : t));
            saveLocalTasks(updatedTasks);
            return updatedTasks.find((t) => String(t.id) === String(id));
        }
        try {
            const response = await axios.patch(`${API_URL}/tasks/${id}`, updates);
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
                if (String(t.id) === String(id)) {
                    return { ...task, id: t.id };
                }
                return t;
            });
            saveLocalTasks(updatedTasks);
            return { ...task, id };
        }
        try {
            const response = await axios.put(`${API_URL}/tasks/${id}`, task);
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
            await axios.delete(`${API_URL}/tasks/${id}`);
            return true;
        } catch (error) {
            isDemoMode = true;
            return api.deleteTask(id);
        }
    },

    isDemoMode: () => isDemoMode,

    likeTask: async (id, userId) => {
        const tasks = isDemoMode ? getLocalTasks() : (await axios.get(`${API_URL}/tasks/${id}`)).data;
        const task = isDemoMode ? tasks.find(t => String(t.id) === String(id)) : tasks;

        let likedBy = task.likedBy || [];
        if (likedBy.includes(userId)) {
            likedBy = likedBy.filter(uid => uid !== userId);
        } else {
            likedBy.push(userId);
        }

        return api.updateTask(id, {
            likedBy,
            likes: likedBy.length
        });
    },

    addComment: async (id, currentComments = [], comment) => {
        const newComments = [...(currentComments || []), {
            id: Date.now().toString(),
            text: comment.text,
            author: comment.author,
            authorId: comment.authorId,
            timestamp: new Date().toISOString()
        }];
        return api.updateTask(id, { comments: newComments });
    }
};

export default api;
