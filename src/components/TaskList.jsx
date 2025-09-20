import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

// Reordering logic will be passed down from the parent
function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
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
                    {...provided.dragHandleProps}
                    // Add a subtle lift and shadow effect while dragging
                    className={`${
                      snapshot.isDragging ? "shadow-2xl scale-105" : "shadow-sm"
                    } transition-all`}
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDeleteTask={onDeleteTask}
                      onEditTask={onEditTask}
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
