import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://backend-kdkh.onrender.com/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Sync theme with localStorage
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const response = await axios.post(API_URL, { title: task, completed: false });
      setTasks([...tasks, response.data]); // Update state with new task from API
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  const saveEdit = (id, newText) => {
    if (newText.trim() === "") return;
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, title: newText, isEditing: false } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
  );

  return (
    <div className={`todo-container ${darkMode ? "bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 text-white" : "bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 text-gray-900"} p-10`}>
      <div className="relative mb-6">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="absolute top-4 left-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-500 transition-all"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <h1 className="text-4xl font-semibold text-left mt-10">To-Do List App</h1>
      </div>

      {/* Add Task Section */}
      <div className="flex mb-6 space-x-2">
        <input 
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add new task here"
          className="todo-input text-base p-3 w-full rounded-l-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button 
          onClick={addTask} 
          className="bg-indigo-600 text-white px-4 py-3 rounded-r-md hover:scale-105 transition-all"
        >
         ➕
        </button>
      </div>

      {/* Filter Buttons Section */}
      <div className="filter-buttons mb-6 flex justify-center space-x-8">
        <button 
          onClick={() => setFilter("all")} 
          className={`px-5 py-3 rounded-full transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-indigo-100"}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter("completed")} 
          className={`px-5 py-3 rounded-full transition-all ${filter === "completed" ? "bg-green-500 text-white" : "bg-white text-gray-700 hover:bg-green-100"}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setFilter("pending")} 
          className={`px-5 py-3 rounded-full transition-all ${filter === "pending" ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-red-100"}`}
        >
          Pending
        </button>
      </div>

      {/* Task List Section */}
      <ul className="mt-4 space-y-6 px-10">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`todo-item flex justify-between items-center p-4 rounded-xl ${task.completed ? "bg-green-100" : "bg-white shadow-lg"} transition-all transform hover:scale-105`}>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task.id)} 
                className="mr-4 border-2 rounded-lg p-2"
              />
              {task.isEditing ? (
                <input 
                  type="text" 
                  defaultValue={task.title} 
                  onBlur={(e) => saveEdit(task.id, e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && saveEdit(task.id, e.target.value)}
                  className="border p-3 rounded-lg shadow-md transition-all"
                />
              ) : (
                <span className={task.completed ? "line-through text-gray-400" : "text-lg"}>
                  {task.title || "Untitled Task"}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              {!task.isEditing ? (
                <button 
                  onClick={() => startEditing(task.id)} 
                  className="text-indigo-600 hover:text-indigo-800 transition-all"
                >
                  ✏️ Edit
                </button>
              ) : (
                <button 
                  onClick={() => saveEdit(task.id, task.title)} 
                  className="text-green-600 hover:text-green-800 transition-all"
                >
                  💾 Save
                </button>
              )}
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-red-600 hover:text-red-800 transition-all"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
