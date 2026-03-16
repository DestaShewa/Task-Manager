import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, CheckCircle2, ThumbsUp, MessageSquare } from 'lucide-react';

const FriendDashboard = ({ onLike, onAddComment, onToggleComplete }) => {
    const { user } = useAuth();
    const [groupTasks, setGroupTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLocalToggleComplete = async (id, completed) => {
        try {
            const updatedTask = await api.updateTask(id, { completed: !completed });
            setGroupTasks(groupTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            if (onToggleComplete) onToggleComplete(id, completed);
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleLocalLike = async (id) => {
        try {
            const updatedTask = await api.likeTask(id, user.id);
            setGroupTasks(groupTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            if (onLike) onLike(id);
        } catch (error) {
            console.error("Error liking task:", error);
        }
    };

    const handleLocalAddComment = async (id, currentComments, text) => {
        try {
            const updatedTask = await api.addComment(id, currentComments, {
                text,
                author: user.name,
                authorId: user.id
            });
            setGroupTasks(groupTasks.map(t => String(t.id) === String(id) ? updatedTask : t));
            if (onAddComment) onAddComment(id, currentComments, text);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const [tasks, allUsers] = await Promise.all([
                    api.getTasksByGroup(user.groupId),
                    api.getUsers()
                ]);
                setGroupTasks(tasks);
                setUsers(allUsers.filter(u => u.groupId === user.groupId));
            } catch (error) {
                console.error("Error fetching group data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroupData();
    }, [user]);

    if (isLoading) return <div className="text-center py-20 text-slate-500">Loading friend plans...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Friend Dashboard</h2>
                    <p className="text-slate-500">Collaborate and see what others are working on</p>
                </div>
                <div className="flex -space-x-2">
                    {users.map(u => (
                        <div key={u.id} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-primary-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-primary-500/20" title={u.name}>
                            {u.name.charAt(0)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(groupUser => {
                    const userTasks = groupTasks.filter(t => String(t.userId) === String(groupUser.id));
                    const isCurrentUser = String(groupUser.id) === String(user.id);

                    return (
                        <div key={groupUser.id} className={`card-premium p-6 border-t-4 ${isCurrentUser ? 'border-primary-500' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {groupUser.name}
                                        {isCurrentUser && <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full uppercase">You</span>}
                                    </h3>
                                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Daily Plan</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-extrabold text-primary-600">{userTasks.length}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Tasks</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {userTasks.length > 0 ? (
                                    userTasks.slice(0, 5).map(task => (
                                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                            {task.completed ? (
                                                <CheckCircle2
                                                    className="w-4 h-4 text-green-500 shrink-0 cursor-pointer hover:scale-110 transition-transform"
                                                    onClick={() => handleLocalToggleComplete(task.id, task.completed)}
                                                />
                                            ) : (
                                                <div
                                                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 cursor-pointer hover:border-primary-500 transition-colors"
                                                    onClick={() => handleLocalToggleComplete(task.id, task.completed)}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`text-sm truncate ${task.completed ? 'text-slate-400 line-through' : 'font-medium'}`}>
                                                        {task.title}
                                                    </span>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <button
                                                            onClick={() => handleLocalLike(task.id, task.likes)}
                                                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary-600 transition-colors"
                                                        >
                                                            <ThumbsUp className="w-3 h-3 text-primary-500" />
                                                            {task.likes || 0}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const text = prompt("Enter your comment:");
                                                                if (text) handleLocalAddComment(task.id, task.comments, text);
                                                            }}
                                                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary-600 transition-colors"
                                                        >
                                                            <MessageSquare className="w-3 h-3 text-slate-400" />
                                                            {task.comments?.length || 0}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No tasks planned yet</p>
                                )}
                                {userTasks.length > 5 && (
                                    <p className="text-[10px] text-center text-slate-400 font-medium">+{userTasks.length - 5} more tasks</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FriendDashboard;
