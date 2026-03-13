import React from 'react';
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = ({ tasks }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && !t.completed).length;

    // Generate chart data based on categories
    const chartData = [
        { name: 'Personal', count: tasks.filter(t => t.category === 'Personal').length },
        { name: 'Work', count: tasks.filter(t => t.category === 'Work').length },
        { name: 'Study', count: tasks.filter(t => t.category === 'Study').length },
        { name: 'Health', count: tasks.filter(t => t.category === 'Health').length },
        { name: 'Other', count: tasks.filter(t => t.category === 'Other' || !t.category).length },
    ].filter(d => d.count > 0);

    const stats = [
        {
            label: 'Total Tasks',
            value: totalTasks,
            icon: <ChartBarIcon className="w-6 h-6 text-primary-500" />,
            color: 'bg-primary-50 dark:bg-primary-900/20'
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
            color: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Pending',
            value: pendingTasks,
            icon: <ClockIcon className="w-6 h-6 text-amber-500" />,
            color: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            label: 'Urgent',
            value: highPriorityTasks,
            icon: <ExclamationCircleIcon className="w-6 h-6 text-accent" />,
            color: 'bg-rose-50 dark:bg-rose-900/20'
        },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-premium flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-premium lg:col-span-1 flex flex-col justify-center"
                >
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Overall Progress</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completion rate</p>
                        </div>
                        <span className="text-3xl font-bold text-primary-600">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-5 overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionRate}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="bg-primary-600 h-full rounded-full relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </motion.div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-center">
                        Sync Status: Optimized
                    </p>
                </motion.div>

                {/* Productivity Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card-premium lg:col-span-2"
                >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Task Distribution by Category</h3>
                    <div className="w-full min-h-[300px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        hide
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            backgroundColor: 'white'
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm italic">
                                No task data available for chart
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
