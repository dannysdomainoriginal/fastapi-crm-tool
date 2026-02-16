import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { 
  useTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation 
} from '../hooks/api/useTasks';
import type { Task, TaskCreate, TaskUpdate } from '../types';

const TasksPage: React.FC = () => {
  const { data: tasks = [], isLoading, error, refetch } = useTasksQuery();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = async (newTask: TaskCreate | TaskUpdate) => {
    try {
      await createMutation.mutateAsync(newTask as TaskCreate);
      setIsAdding(false);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleEditTask = async (updatedTask: TaskCreate | TaskUpdate) => {
    if (!editingTask) return;
    try {
      await updateMutation.mutateAsync({ id: editingTask.id, task: updatedTask as TaskUpdate });
      setEditingTask(null);
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateMutation.mutateAsync({ id: task.id, task: { status: newStatus } });
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setIsAdding(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Failed to load tasks
          <button 
            onClick={() => refetch()}
            className="ml-4 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        {!isAdding && !editingTask && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        )}
      </div>

      {(isAdding || editingTask) ? (
        <div className="mb-6">
          <TaskForm
            initialData={editingTask}
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            onCancel={() => {
              setIsAdding(false);
              setEditingTask(null);
            }}
          />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={startEdit}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TasksPage;

