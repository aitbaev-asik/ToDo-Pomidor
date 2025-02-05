import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Timer } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, linkedToPomodoro: boolean) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  linkedTaskId: string | null;
}

const COLUMNS = ['backlog', 'todo', 'in-progress', 'completed'] as const;
const COLUMN_TITLES = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, linkedTaskId }: TaskListProps) {
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [linkToPomodoro, setLinkToPomodoro] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), linkToPomodoro);
      setNewTask('');
      setLinkToPomodoro(false);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = (task: Task) => {
    if (editText.trim()) {
      onUpdateTask({ ...task, title: editText.trim() });
    }
    setEditingId(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Task['status']) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
    
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask({ ...draggedTask, status });
    }
  };

  return (
    <div className="w-full max-w-7xl">
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setLinkToPomodoro(!linkToPomodoro)}
          className={`rounded-lg px-4 py-2 transition-colors ${
            linkToPomodoro
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          <Timer className="h-5 w-5" />
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((status) => (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className="flex h-full min-h-[500px] flex-col rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              {COLUMN_TITLES[status]}
            </h3>
            <div className="flex flex-col gap-2">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <GripVertical className="h-5 w-5 cursor-move text-gray-400" />
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(task)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(task)}
                        className="flex-1 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <div className="flex flex-1 items-center gap-2">
                        <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
                          {task.title}
                        </span>
                        {task.linkedToPomodoro && (
                          <Timer
                            className={`h-4 w-4 ${
                              task.id === linkedTaskId
                                ? 'text-blue-500 dark:text-blue-400'
                                : 'text-gray-400'
                            }`}
                          />
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => startEditing(task)}
                      className="text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}