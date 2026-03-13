import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

// Reordering logic will be passed down from the parent
function TaskList({
  tasks,
  viewMode = "list",
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onLike,
  onAddComment,
  onDragEnd,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10 py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <p className="font-semibold">No tasks found!</p>
        <p className="text-sm">Try adjusting your filters or add a new task.</p>
      </div>
    );
  }

  if (viewMode === "grouped") {
    const categories = [...new Set(tasks.map((t) => t.category || "General"))];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {category}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {tasks.filter((t) => (t.category || "General") === category).length}
              </span>
            </div>
            <div className="space-y-4">
              {tasks
                .filter((t) => (t.category || "General") === category)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                    onLike={onLike}
                    onAddComment={onAddComment}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    // {...provided.dragHandleProps} <-- Moved to a specific icon in TaskItem
                    // Add a subtle lift and shadow effect while dragging
                    className={`${snapshot.isDragging ? "shadow-2xl scale-105" : "shadow-sm"
                      } transition-all`}
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDeleteTask={onDeleteTask}
                      onEditTask={onEditTask}
                      onLike={onLike}
                      onAddComment={onAddComment}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;
