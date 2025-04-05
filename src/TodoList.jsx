import { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);

 useEffect(() => {
    fetch("https://backend-kdkh.onrender.com/api/tasks/") // Updated URL
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);  

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
