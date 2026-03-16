import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit2, User, Layout, Filter, Shield, UserX, Check, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import TaskList from './TaskList';

const AdminDashboard = ({ onLike, onAddComment, onToggleComplete, onDeleteTask }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [tasksData, usersData] = await Promise.all([
                    api.getTasks(),
                    api.getUsers()
                ]);
                setAllTasks(tasksData);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getUserName = (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.name : 'Unknown User';
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Admin Warning: Are you sure you want to delete this task?")) {
            await api.deleteTask(id);
            setAllTasks(allTasks.filter(t => t.id !== id));
        }
    };

    const handleDeleteUser = async (id) => {
        if (id === currentUser.id) {
            alert("You cannot delete yourself!");
            return;
        }
        if (window.confirm("DANGER: Are you sure you want to delete this user and all their data?")) {
            try {
                // Delete user
                await api.deleteUser(id);
                // Filter out their tasks locally for immediate feedback
                setUsers(users.filter(u => u.id !== id));
                setAllTasks(allTasks.filter(t => t.userId !== id));
            } catch (error) {
                alert("Failed to delete user.");
            }
        }
    };

    const handleUpdateUserRole = async (id, newRole) => {
        try {
            await api.updateUser(id, { role: newRole });
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            setEditingUser(null);
        } catch (error) {
            alert("Failed to update user role.");
        }
    };

    const handleLocalLike = async (id) => {
        try {
            const updatedTask = await api.likeTask(id, currentUser.id);
            setAllTasks(allTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            // Also call the prop to keep App.jsx state in sync if needed
            if (onLike) onLike(id);
        } catch (error) {
            console.error("Error liking task:", error);
        }
    };

    const handleLocalAddComment = async (id, currentComments, commentText) => {
        try {
            const updatedTask = await api.addComment(id, currentComments, {
                text: commentText,
                author: currentUser.name,
                authorId: currentUser.id
            });
            setAllTasks(allTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            // Also call the prop to keep App.jsx state in sync if needed
            if (onAddComment) onAddComment(id, currentComments, commentText);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleLocalToggleComplete = async (id, completed) => {
        try {
            const updatedTask = await api.updateTask(id, { completed: !completed });
            setAllTasks(allTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            if (onToggleComplete) onToggleComplete(id, completed);
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleLocalDeleteTask = async (id) => {
        if (window.confirm("Admin Warning: Are you sure you want to delete this task?")) {
            try {
                await api.deleteTask(id);
                setAllTasks(allTasks.filter(t => String(t.id) !== String(id)));
                if (onDeleteTask) onDeleteTask(id);
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    if (isLoading) return <div className="text-center py-20 animate-pulse text-slate-500">Loading Admin Dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Management</h2>
                    <p className="text-slate-500">Overview of all system tasks and users</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-md shadow-sm text-sm font-medium">System Stats</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card-premium p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                        <Layout className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Tasks</p>
                        <p className="text-2xl font-bold">{allTasks.length}</p>
                    </div>
                </div>
                <div className="card-premium p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                </div>
                {selectedUserId && (
                    <div className="card-premium p-6 flex items-center justify-between col-span-1 md:col-span-2 bg-primary-50 dark:bg-primary-900/10 border-primary-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                                {getUserName(selectedUserId).charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Filtered By User</p>
                                <p className="text-lg font-bold">{getUserName(selectedUserId)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedUserId(null)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-primary-200 rounded-xl text-sm font-bold text-primary-600 hover:bg-primary-50 transition-all shadow-sm"
                        >
                            Clear Filter
                        </button>
                    </div>
                )}
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">All Tasks (CRUD)</h3>
                    <Filter className="text-slate-400 w-5 h-5 cursor-pointer hover:text-primary-500" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Owner</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Task Title</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Priority</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {allTasks
                                .filter(t => !selectedUserId || String(t.userId) === String(selectedUserId))
                                .map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                    {getUserName(task.userId).charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium">{getUserName(task.userId)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div>
                                                {task.title}
                                                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                                                    <button
                                                        onClick={() => handleLocalLike(task.id)}
                                                        className={`flex items-center gap-1 transition-all ${task.likedBy?.includes(currentUser.id) ? 'text-primary-600 font-bold' : 'text-slate-400 hover:text-primary-500'}`}
                                                    >
                                                        <Check className={`w-3 h-3 ${task.likedBy?.includes(currentUser.id) ? 'fill-current' : ''}`} /> Like ({task.likes || 0})
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const commentText = prompt("Enter your comment:");
                                                            if (commentText) handleLocalAddComment(task.id, task.comments, commentText);
                                                        }}
                                                        className="flex items-center gap-1 hover:text-primary-500 transition-colors"
                                                    >
                                                        <Layout className="w-3 h-3" /> Comments ({task.comments?.length || 0})
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs ${task.completed ? 'text-green-500 font-medium' : 'text-slate-400'}`}>
                                                {task.completed ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleLocalDeleteTask(task.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card-premium overflow-hidden mt-12 bg-white/40 dark:bg-slate-800/20 border-primary-200 dark:border-primary-900/30">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-primary-50/30 dark:bg-primary-900/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">System User Control</h3>
                            <p className="text-sm text-slate-500 font-medium">Manage privileges and active directory accounts</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Identity</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Security Level</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map(u => (
                                <tr key={u.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => setSelectedUserId(u.id)}
                                                    className="text-sm font-bold text-slate-800 dark:text-white hover:text-primary-600 transition-colors text-left"
                                                >
                                                    {u.name}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUserId(u.id)}
                                                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium transition-all text-left"
                                                >
                                                    {u.email}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {editingUser === u.id ? (
                                            <div className="flex items-center gap-2 animate-fade-in">
                                                <select
                                                    className="text-sm bg-white dark:bg-slate-800 border-2 border-primary-100 dark:border-primary-900/30 rounded-xl px-3 py-1.5 outline-none focus:border-primary-500"
                                                    defaultValue={u.role}
                                                    onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                                >
                                                    <option value="user">Standard User</option>
                                                    <option value="admin">System Admin</option>
                                                </select>
                                                <button onClick={() => setEditingUser(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                    {u.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {u.role}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => setEditingUser(u.id)}
                                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                                                title="Edit Permissions"
                                            >
                                                <Edit2 className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className={`p-2.5 rounded-xl transition-all ${u.id === currentUser.id ? 'opacity-10 grayscale cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                                                disabled={u.id === currentUser.id}
                                                title="Revoke Access"
                                            >
                                                <UserX className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUserId && (
                <div className="card-premium mt-12 overflow-hidden bg-slate-50 dark:bg-slate-900 border-primary-500">
                    <div className="p-6 border-b border-primary-500/20 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSelectedUserId(null)}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h3 className="font-bold text-lg">User Daily Plan: {getUserName(selectedUserId)}</h3>
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Collected View</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <TaskList
                            tasks={allTasks.filter(t => String(t.userId) === String(selectedUserId))}
                            viewMode="grouped"
                            onLike={handleLocalLike}
                            onAddComment={handleLocalAddComment}
                            onToggleComplete={handleLocalToggleComplete}
                            onDeleteTask={handleLocalDeleteTask}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
