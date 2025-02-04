<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>React + Vite + TypeScript ToDoList + Pomodora</title>
</head>
<body>
  <header>
    <h1>React + Vite + TypeScript ToDoList + Pomodora</h1>
  </header>
  <div class="container">
    <section>
      <h2>Описание</h2>
      <p>
        Это простое приложение для урока Front-End, созданное с использованием React, Vite и TypeScript. В проекте реализованы два основных функциональных блока:
      </p>
      <ul>
        <li><strong>ToDoList:</strong> возможность добавлять, удалять и отмечать задачи как выполненные;</li>
        <li><strong>Pomodora:</strong> таймер для техники Pomodoro, позволяющий организовать рабочее время.</li>
      </ul>
      <p>
        Приложение объединяет в себе функционал ToDoList и Pomodora, что позволяет не только вести список задач, но и эффективно планировать рабочее время с использованием техники Pomodoro.
      </p>
    </section>
    <section>
      <h2>Установка и запуск</h2>
      <p>Для установки и запуска проекта выполните следующие команды в терминале:</p>
      <pre>
git clone git@github.com:aitbaev-asik/ToDo-Pomidor.git
cd ToDo-Pomidor
docker build -t react-app .
docker run -d -p 3000:80 react-app
      </pre>
      <p>После запуска приложение будет доступно по адресу: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
    </section>
    <section>
      <h2>Документация и ресурсы</h2>
      <p>Проект создан с использованием следующих источников:</p>
      <ul>
        <li><a href="https://legacy.reactjs.org/docs/getting-started.html" target="_blank">React Documentation</a></li>
        <li><a href="https://vite.dev/guide/" target="_blank">Vite Documentation</a></li>
        <li><a href="https://www.typescriptlang.org/docs/" target="_blank">TypeScript Documentation</a></li>
      </ul>
      <p>Видео уроки:</p>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=KCrXgy8qtjM" target="_blank">В целом что такое Vite</a></li>
        <li><a href="https://www.youtube.com/watch?v=UTBqqUgvVGI&t=211s" target="_blank">Подробно про Vite</a></li>
        <li><a href="https://www.youtube.com/watch?v=VAeRhmpcWEQ" target="_blank"><Более подробнее про Vite</a></li>
        <li><a href="https://www.youtube.com/watch?v=CgkZ7MvWUAA" target="_blank"><Большой курс по React</a></li>
        <li><a href="https://www.youtube.com/watch?v=Gw1Amw6Duis" target="_blank">Tailwind Css, React, TS</a></li>
        <li><a href="https://www.youtube.com/watch?v=siTUv1L9ymM&t=149s" target="_blank">React+Typescript</a></li>
        <li><a href="https://www.youtube.com/watch?v=RbZyQWOEmD0" target="_blank">Настройка Vite</a></li>
        <li><a href="https://www.youtube.com/watch?v=cchqeWY0Nak&t=86s" target="_blank">React+Typescript</a></li>
        <li><a href="https://www.youtube.com/watch?v=TPACABQTHvM" target="_blank">Толку нет но прикольно</a></li>
        <li><a href="https://www.youtube.com/watch?v=GGi7Brsf7js" target="_blank">Видео 10</a></li>
      </ul>
    </section>
  </div>
</body>
</html>
