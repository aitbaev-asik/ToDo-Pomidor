export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'completed';
  createdAt: number;
}

export interface TimerState {
  mode: 'work' | 'break';
  timeLeft: number;
  isRunning: boolean;
  workDuration: number;
  breakDuration: number;
}

export interface AppState {
  tasks: Task[];
  timer: TimerState;
  theme: 'light' | 'dark';
}