import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Fetch Tasks
  const fetchTasksServer = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();

    return data;
  };

  // fetch tasks front
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasksServer();
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  // fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  };

  // Add Task server
  const addTaskServer = async (task) => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    return data;
  };

  // Add Task
  const addTask = async (task) => {
    const data = await addTaskServer(task);
    setTasks([...tasks, data]);
  };

  // Delete Task server
  const deleteTaskServer = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    return res.status;
  };

  // Delete Task
  const deleteTask = async (id) => {
    const status = await deleteTaskServer(id);

    if (status === 200) setTasks(tasks.filter((task) => task.id !== id));
    else alert("Error Deleting This Task");
  };

  // update reminder server
  const updateReminderServer = async (id) => {
    let taskToUpdate = await fetchTask(id);
    taskToUpdate.reminder = !taskToUpdate.reminder;

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(taskToUpdate),
    });

    const data = await res.json();
    return data;
  };

  // update reminder
  const updateReminder = async (id) => {
    const data = await updateReminderServer(id);

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />

      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={updateReminder} />
      ) : (
        "No Tasks To Show"
      )}

      <Footer />
    </div>
  );
};

export default App;
