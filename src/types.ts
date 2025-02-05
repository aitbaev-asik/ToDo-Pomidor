export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'completed';
  createdAt: number;
  linkedToPomodoro: boolean;
}

export interface TimerState {
  mode: 'work' | 'break';
  timeLeft: number;
  isRunning: boolean;
  workDuration: number;
  breakDuration: number;
  linkedTaskId: string | null;
}

export interface AppState {
  tasks: Task[];
  timer: TimerState;
  theme: 'light' | 'dark';
}