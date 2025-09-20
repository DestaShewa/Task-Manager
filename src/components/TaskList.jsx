import React from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 py-10 border-2 border-dashed rounded-lg">
        <p className="font-semibold">No tasks found!</p>
        <p className="text-sm">Try adjusting your filters or add a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask} // Pass the new prop down
        />
      ))}
    </div>
  );
}

export default TaskList;
