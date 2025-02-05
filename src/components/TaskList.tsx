import React, { useState } from 'react'; // Импортируем необходимые хуки из React
import { Plus, Edit2, Trash2, GripVertical, Timer } from 'lucide-react'; // Импортируем иконки для кнопок
import type { Task } from '../types'; // Тип для задачи

// Интерфейс для пропсов компонента TaskList
interface TaskListProps {
  tasks: Task[]; // Список задач
  onAddTask: (title: string, linkedToPomodoro: boolean) => void; // Функция для добавления задачи
  onUpdateTask: (task: Task) => void; // Функция для обновления задачи
  onDeleteTask: (id: string) => void; // Функция для удаления задачи
  linkedTaskId: string | null; // ID задачи, связанной с Помодоро
}

// Константа с возможными статусами задач
const COLUMNS = ['backlog', 'todo', 'in-progress', 'completed'] as const;
const COLUMN_TITLES = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, linkedTaskId }: TaskListProps) {
  // Хуки для состояния
  const [newTask, setNewTask] = useState(''); // Для нового задания
  const [editingId, setEditingId] = useState<string | null>(null); // Для редактируемой задачи
  const [editText, setEditText] = useState(''); // Текст редактируемой задачи
  const [draggedTask, setDraggedTask] = useState<Task | null>(null); // Для задачи, которая в процессе перетаскивания
  const [linkToPomodoro, setLinkToPomodoro] = useState(false); // Связать задачу с Помодоро

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), linkToPomodoro); // Добавляем задачу
      setNewTask(''); // Сбрасываем поле ввода
      setLinkToPomodoro(false); // Сбрасываем Помодоро
    }
  };

  // Начинаем редактировать задачу
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  // Сохраняем изменения задачи
  const saveEdit = (task: Task) => {
    if (editText.trim()) {
      onUpdateTask({ ...task, title: editText.trim() }); // Обновляем задачу
    }
    setEditingId(null); // Останавливаем редактирование
  };

  // Обработчик начала перетаскивания
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.currentTarget.classList.add('opacity-50'); // Уменьшаем прозрачность элемента
  };

  // Обработчик завершения перетаскивания
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50'); // Восстанавливаем прозрачность
    setDraggedTask(null); // Сбрасываем перетаскиваемую задачу
  };

  // Обработчик события при наведении на область перетаскивания
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20'); // Добавляем стили при наведении
  };

  // Обработчик события, когда элемент выходит из области перетаскивания
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20'); // Убираем стили
  };

  // Обработчик события при отпускании элемента
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Task['status']) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20'); // Убираем стили
    if (draggedTask && draggedTask.status !== status) {
      onUpdateTask({ ...draggedTask, status }); // Обновляем статус задачи
    }
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Форма для добавления новой задачи */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {/* Кнопка для связи с Помодоро */}
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
        {/* Кнопка для добавления задачи */}
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      {/* Сетка с колонками для задач */}
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
              {COLUMN_TITLES[status]} {/* Заголовок колонки */}
            </h3>
            <div className="flex flex-col gap-2">
              {/* Отображение задач в колонке */}
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
                    {/* Перетаскиваемая ручка */}
                    <GripVertical className="h-5 w-5 cursor-move text-gray-400" />
                    {/* Редактирование задачи */}
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
                        {/* Отображение текста задачи */}
                        <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`}>
                          {task.title}
                        </span>
                        {/* Иконка Помодоро */}
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
                    {/* Кнопки для редактирования и удаления задачи */}
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
