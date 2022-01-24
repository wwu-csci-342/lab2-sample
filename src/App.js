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
    const res = await fetch("https://us-central1-task-list-ecc42.cloudfunctions.net/api/tasks");
    const data = await res.json();

    return data.result;
  };

  // fetch tasks front
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasksServer();
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  // Add Task server
  const addTaskServer = async (task) => {
    const res = await fetch("https://us-central1-task-list-ecc42.cloudfunctions.net/api/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({task: task}),
    });

    const data = await res.json();
    return data.result;
  };

  // Add Task
  const addTask = async (task) => {
    const data = await addTaskServer(task);
    setTasks([...tasks, data]);
  };

  // Delete Task server
  const deleteTaskServer = async (id) => {
    const res = await fetch(`https://us-central1-task-list-ecc42.cloudfunctions.net/api/tasks/${id}`, {
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
  const updateReminderServer = async (id, reminder) => {
    const res = await fetch(`https://us-central1-task-list-ecc42.cloudfunctions.net/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({reminder: !reminder}),
    });

    const data = await res.json();
    return data.result;
  };

  // update reminder
  const updateReminder = async (id, reminder) => {
    const data = await updateReminderServer(id, reminder);

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
