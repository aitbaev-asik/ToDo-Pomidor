import { useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppState, Task } from './types';

// Начальное состояние приложения
const INITIAL_STATE: AppState = {
  tasks: [], // Список задач
  timer: {
    mode: 'work', // Режим работы (work/break)
    timeLeft: 25 * 60, // Оставшееся время в секундах
    isRunning: false, // Запущен ли таймер
    workDuration: 25 * 60, // Длительность рабочего интервала
    breakDuration: 5 * 60, // Длительность перерыва
    linkedTaskId: null, // ID связанной задачи (если есть)
  },
  theme: 'light', // Текущая тема (светлая/темная)
};

function App() {
  // Используем локальное хранилище для сохранения состояния
  const [state, setState] = useLocalStorage<AppState>('todo-pomodoro-state', INITIAL_STATE);

  // Хук для обновления таймера каждую секунду
  useEffect(() => {
    let interval: number;
    if (state.timer.isRunning && state.timer.timeLeft > 0) {
      interval = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          timer: {
            ...prev.timer,
            timeLeft: prev.timer.timeLeft - 1,
          },
        }));
      }, 1000);
    } else if (state.timer.timeLeft === 0) {
      // Переключение между работой и перерывом
      const newMode = state.timer.mode === 'work' ? 'break' : 'work';

      if (state.timer.mode === 'work' && state.timer.linkedTaskId) {
        // Завершаем задачу, если она была привязана к таймеру
        const linkedTask = state.tasks.find(task => task.id === state.timer.linkedTaskId);
        if (linkedTask) {
          setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
              task.id === linkedTask.id ? { ...task, status: 'completed' } : task
            ),
            timer: {
              ...prev.timer,
              mode: newMode,
              timeLeft: newMode === 'work' ? prev.timer.workDuration : prev.timer.breakDuration,
              isRunning: false,
              linkedTaskId: null,
            },
          }));
          return;
        }
      }

      // Переключение таймера без привязанной задачи
      setState((prev) => ({
        ...prev,
        timer: {
          ...prev.timer,
          mode: newMode,
          timeLeft: newMode === 'work' ? prev.timer.workDuration : prev.timer.breakDuration,
          isRunning: false,
        },
      }));
    }
    return () => clearInterval(interval);
  }, [state.timer.isRunning, state.timer.timeLeft, setState]);

  // Хук для изменения темы приложения
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Функция для добавления новой задачи
  const handleAddTask = (title: string, linkedToPomodoro: boolean) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'backlog', // Новая задача в статусе "в ожидании"
      createdAt: Date.now(),
      linkedToPomodoro,
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  // Функция для обновления задачи
  const handleUpdateTask = (task: Task) => {
    setState((prev) => {
      if (task.status === 'in-progress' && task.linkedToPomodoro) {
        // Если задача запущена и привязана к таймеру, запускаем таймер
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
          timer: {
            ...prev.timer,
            isRunning: true,
            mode: 'work',
            timeLeft: prev.timer.workDuration,
            linkedTaskId: task.id,
          },
        };
      }

      // Если задача больше не в работе, сбрасываем связь с таймером
      if (task.id === prev.timer.linkedTaskId && task.status !== 'in-progress') {
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
          timer: {
            ...prev.timer,
            isRunning: false,
            linkedTaskId: null,
          },
        };
      }

      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
      };
    });
  };

  // Функция для удаления задачи
  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      timer: prev.timer.linkedTaskId === id
        ? { ...prev.timer, isRunning: false, linkedTaskId: null }
        : prev.timer,
    }));
  };

  // Функция для запуска/паузы таймера
  const handleToggleTimer = () => {
    setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        isRunning: !prev.timer.isRunning,
      },
    }));
  };

  // Функция для пропуска текущего интервала (работа/перерыв)
  const handleSkipInterval = () => {
    const newMode = state.timer.mode === 'work' ? 'break' : 'work';
    setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        mode: newMode,
        timeLeft: newMode === 'work' ? prev.timer.workDuration : prev.timer.breakDuration,
        isRunning: false,
        linkedTaskId: newMode === 'break' ? null : prev.timer.linkedTaskId,
      },
    }));
  };

  // Функция для изменения времени таймера
  const handleAdjustTime = (minutes: number) => {
    if (!state.timer.isRunning) {
      setState((prev) => ({
        ...prev,
        timer: {
          ...prev.timer,
          timeLeft: Math.max(60, prev.timer.timeLeft + minutes * 60),
          [prev.timer.mode === 'work' ? 'workDuration' : 'breakDuration']: 
            Math.max(60, prev.timer.timeLeft + minutes * 60),
        },
      }));
    }
  };

  // Функция для переключения темы (светлая/темная)
  const handleToggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 transition-colors dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="mb-8 flex w-full items-center justify-between">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            Task Management
          </h1>
          <ThemeToggle theme={state.theme} onToggleTheme={handleToggleTheme} />
        </div>
        <PomodoroTimer
          timer={state.timer}
          onToggleTimer={handleToggleTimer}
          onSkipInterval={handleSkipInterval}
          onAdjustTime={handleAdjustTime}
        />
        <TaskList
          tasks={state.tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          linkedTaskId={state.timer.linkedTaskId}
        />
      </div>
    </div>
  );
}

export default App;
