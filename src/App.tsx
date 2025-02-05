import { useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { ThemeToggle } from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppState, Task } from './types';

const INITIAL_STATE: AppState = {
  tasks: [],
  timer: {
    mode: 'work',
    timeLeft: 25 * 60, // 25 minutes
    isRunning: false,
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    linkedTaskId: null,
  },
  theme: 'light',
};

function App() {
  const [state, setState] = useLocalStorage<AppState>('todo-pomodoro-state', INITIAL_STATE);

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
      const newMode = state.timer.mode === 'work' ? 'break' : 'work';
      
      // If it's the end of a work session and there's a linked task, move it to completed
      if (state.timer.mode === 'work' && state.timer.linkedTaskId) {
        const linkedTask = state.tasks.find(task => task.id === state.timer.linkedTaskId);
        if (linkedTask) {
          setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
              task.id === linkedTask.id
                ? { ...task, status: 'completed' }
                : task
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const handleAddTask = (title: string, linkedToPomodoro: boolean) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'backlog',
      createdAt: Date.now(),
      linkedToPomodoro,
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const handleUpdateTask = (task: Task) => {
    setState((prev) => {
      // If the task is moved to in-progress and is linked to pomodoro, start the timer
      if (task.status === 'in-progress' && task.linkedToPomodoro) {
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
      
      // If the task is moved out of in-progress and is the linked task, stop the timer
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

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      timer: prev.timer.linkedTaskId === id
        ? { ...prev.timer, isRunning: false, linkedTaskId: null }
        : prev.timer,
    }));
  };

  const handleToggleTimer = () => {
    setState((prev) => ({
      ...prev,
      timer: {
        ...prev.timer,
        isRunning: !prev.timer.isRunning,
      },
    }));
  };

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