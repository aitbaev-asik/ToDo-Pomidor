import { Sun, Moon } from 'lucide-react'; // Импортируем иконки для солнца и луны из библиотеки lucide-react

// Интерфейс для пропсов компонента ThemeToggle
interface ThemeToggleProps {
  theme: 'light' | 'dark'; // Текущая тема (светлая или темная)
  onToggleTheme: () => void; // Функция для смены темы
}

// Компонент переключателя темы
export function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggleTheme} // При клике на кнопку вызываем функцию переключения темы
      className="fixed right-4 top-4 rounded-lg bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
    >
      {/* Если текущая тема светлая, отображаем иконку луны (Dark Mode), иначе — иконку солнца (Light Mode) */}
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
