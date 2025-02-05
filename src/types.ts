// Описание задачи
export interface Task {
  id: string; // Уникальный идентификатор задачи
  title: string; // Название задачи
  status: 'backlog' | 'todo' | 'in-progress' | 'completed'; // Статус задачи: 'backlog' - в ожидании, 'todo' - запланировано, 'in-progress' - в процессе, 'completed' - выполнено
  createdAt: number; // Время создания задачи (в миллисекундах от эпохи UNIX)
  linkedToPomodoro: boolean; // Привязана ли задача к технике Помодоро
}

// Состояние таймера
export interface TimerState {
  mode: 'work' | 'break'; // Режим таймера: 'work' - работа, 'break' - перерыв
  timeLeft: number; // Оставшееся время в секундах
  isRunning: boolean; // Является ли таймер запущенным
  workDuration: number; // Продолжительность рабочего периода в секундах
  breakDuration: number; // Продолжительность перерыва в секундах
  linkedTaskId: string | null; // ID задачи, связанной с текущим таймером (если есть)
}

// Состояние приложения, включающее задачи, таймер и тему
export interface AppState {
  tasks: Task[]; // Список задач
  timer: TimerState; // Состояние таймера
  theme: 'light' | 'dark'; // Тема приложения: светлая или темная
}
