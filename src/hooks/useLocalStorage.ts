import { useState, useEffect } from 'react';

// Хук для работы с localStorage, который сохраняет данные и синхронизирует их
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Инициализируем состояние с использованием значения из localStorage или начального значения
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Попытка получить сохраненное значение из localStorage
      const item = window.localStorage.getItem(key);
      // Если значение существует, парсим его, иначе возвращаем начальное значение
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error); // Если произошла ошибка, выводим её в консоль
      return initialValue; // В случае ошибки возвращаем начальное значение
    }
  });

  // Эффект, который обновляет localStorage при изменении storedValue
  useEffect(() => {
    try {
      // Преобразуем состояние в строку и сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error); // Если произошла ошибка при записи, выводим её в консоль
    }
  }, [key, storedValue]); // Эффект срабатывает при изменении key или storedValue

  // Возвращаем текущее значение из localStorage и функцию для его обновления
  return [storedValue, setStoredValue] as const;
}
