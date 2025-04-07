import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "https://backend-kdkh.onrender.com/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (task.trim() === "") return;
    try {
      const response = await axios.post(API_URL, { title: task, completed: false });
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (id, updatedTitle) => {
    if (updatedTitle.trim() === "") return;
    try {
      const response = await axios.put(`${API_URL}${id}/`, { title: updatedTitle });
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const response = await axios.patch(`${API_URL}${task.id}/`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
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

      <div className="flex mb-6 space-x-2">
        <input 
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add new task here"
          className="text-base p-3 w-full rounded-l-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button 
          onClick={addTask} 
          className="bg-indigo-600 text-white px-4 py-3 rounded-r-md hover:scale-105 transition-all"
        >
          ➕
        </button>
      </div>

      <div className="filter-buttons mb-6 flex justify-center space-x-8">
        <button onClick={() => setFilter("all")} className={`px-5 py-3 rounded-full transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-indigo-100"}`}>
          All
        </button>
        <button onClick={() => setFilter("completed")} className={`px-5 py-3 rounded-full transition-all ${filter === "completed" ? "bg-green-500 text-white" : "bg-white text-gray-700 hover:bg-green-100"}`}>
          Completed
        </button>
        <button onClick={() => setFilter("pending")} className={`px-5 py-3 rounded-full transition-all ${filter === "pending" ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-red-100"}`}>
          Pending
        </button>
      </div>

      <ul className="mt-4 space-y-6 px-10">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`flex justify-between items-center p-4 rounded-xl ${task.completed ? "bg-green-100" : "bg-white shadow-lg"} transition-all transform hover:scale-105`}>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task)} 
                className="mr-4 border-2 rounded-lg p-2"
              />
              {editingTaskId === task.id ? (
                <input 
                  type="text" 
                  defaultValue={task.title} 
                  onBlur={(e) => updateTask(task.id, e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && updateTask(task.id, e.target.value)}
                  className="border p-3 rounded-lg shadow-md transition-all"
                  autoFocus
                />
              ) : (
                <span className={task.completed ? "line-through text-gray-400" : "text-lg"}>
                  {task.title || "Untitled Task"}
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              {editingTaskId !== task.id ? (
                <button onClick={() => setEditingTaskId(task.id)} className="text-indigo-600 hover:text-indigo-800 transition-all">
                  ✏️ Edit
                </button>
              ) : (
                <button onClick={() => updateTask(task.id, task.title)} className="text-green-600 hover:text-green-800 transition-all">
                  💾 Save
                </button>
              )}
              <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-800 transition-all">
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
