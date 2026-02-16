import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { tasksApi } from '../services/api';
import type { Task, TaskCreate, TaskUpdate } from '../types';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (newTask: TaskCreate | TaskUpdate) => {
    try {
      const created = await tasksApi.create(newTask as TaskCreate);
      setTasks([...tasks, created]);
      setIsAdding(false);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  const handleEditTask = async (updatedTask: TaskCreate | TaskUpdate) => {
    if (!editingTask) return;
    
    try {
      const updated = await tasksApi.update(editingTask.id, updatedTask as TaskUpdate);
      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await tasksApi.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await tasksApi.update(task.id, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error('Error updating task status:', err);
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
          {error}
          <button 
            onClick={loadTasks}
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
