import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast"; // 🆕 added

const TodoApp = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      dispatch({ type: "SET_TODOS", payload: JSON.parse(saved) });
    }
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      dueDate.trim() === ""
    ) {
      toast.error("Please fill Title, Description, and Due Date.");
      return;
    }
    if (editingIndex !== null) {
      dispatch({
        type: "EDIT_TODO",
        payload: { index: editingIndex, title, description, dueDate, priority },
      });
      toast.success("Todo updated!");
      setEditingIndex(null);
    } else {
      dispatch({
        type: "ADD_TODO",
        payload: { title, description, dueDate, priority, completed: false },
      });
      toast.success("Todo added!");
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const todo = todos[index];
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate || "");
    setPriority(todo.priority || "Medium");
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      dispatch({ type: "DELETE_TODO", payload: index });
      toast.error("Todo deleted!");
    }
  };

  const handleToggleComplete = (index) => {
    dispatch({ type: "TOGGLE_COMPLETE", payload: index });
    toast("Todo status updated!", { icon: "🔄" });
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "COMPLETED") return todo.completed;
      if (filter === "PENDING") return !todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-tr from-pink-200 to-blue-300 text-black"
      } min-h-screen p-6`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">📝 My Todos</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mb-8 mx-auto">
        <input
          className="border p-3 rounded flex-1 focus:outline-none"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded shadow-md"
        >
          ➕ Add Todo
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-8 justify-center">
        {["ALL", "COMPLETED", "PENDING"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded ${
              filter === type
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <AnimatePresence>
          {filteredTodos.length === 0 ? (
            <motion.div
              className="col-span-2 text-center text-gray-500 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No todos found. 🎈
            </motion.div>
          ) : (
            filteredTodos.map((todo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-6 rounded-lg shadow-xl relative ${
                  todo.completed ? "bg-green-200" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(idx)}
                    className="w-5 h-5 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h2
                        className={`text-2xl font-bold ${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-purple-700"
                        }`}
                      >
                        {todo.title}
                      </h2>
                      <span
                        className={`text-sm font-semibold ${priorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                    <p
                      className={`mt-2 ${
                        todo.completed ? "line-through" : "text-gray-600"
                      }`}
                    >
                      {todo.description}
                    </p>
                    {todo.dueDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal for Adding/Editing */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingIndex !== null ? "Edit Todo" : "Add Todo"}
            </h2>
            <input
              className="border p-3 rounded mb-4 w-full"
              placeholder="Enter Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-3 rounded mb-4 w-full"
              placeholder="Enter Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="date"
              className="border p-3 rounded mb-4 w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              className="border p-3 rounded mb-6 w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEdit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
