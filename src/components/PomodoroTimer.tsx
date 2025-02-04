import React from 'react';
import { Play, Pause, SkipForward, Plus, Minus } from 'lucide-react';
import type { TimerState } from '../types';

interface PomodoroTimerProps {
  timer: TimerState;
  onToggleTimer: () => void;
  onSkipInterval: () => void;
  onAdjustTime: (minutes: number) => void;
}

export class PomodoroTimer extends React.Component<PomodoroTimerProps> {
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  render() {
    const { timer, onToggleTimer, onSkipInterval, onAdjustTime } = this.props;
    const { mode, timeLeft, isRunning } = timer;

    return (
      <div className="mb-8 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
          {mode === 'work' ? 'Work Time' : 'Break Time'}
        </h2>
        <div className="mb-4 text-6xl font-bold text-gray-800 dark:text-white">
          {this.formatTime(timeLeft)}
        </div>
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => onAdjustTime(-1)}
            className="rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
            disabled={isRunning}
          >
            <Minus className="h-5 w-5" />
          </button>
          <button
            onClick={() => onAdjustTime(1)}
            className="rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
            disabled={isRunning}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onToggleTimer}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={onSkipInterval}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          >
            <SkipForward className="h-5 w-5" />
            Skip
          </button>
        </div>
      </div>
    );
  }
}