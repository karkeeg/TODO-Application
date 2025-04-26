import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TodoApp = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      dispatch({ type: "SET_TODOS", payload: JSON.parse(saved) });
    }
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Please fill both fields!");
      return;
    }
    if (editingIndex !== null) {
      dispatch({
        type: "EDIT_TODO",
        payload: { index: editingIndex, title, description },
      });
      setEditingIndex(null);
    } else {
      dispatch({
        type: "ADD_TODO",
        payload: { title, description, completed: false },
      });
    }
    setTitle("");
    setDescription("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTitle(todos[index].title);
    setDescription(todos[index].description);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure to delete?")) {
      dispatch({ type: "DELETE_TODO", payload: index });
    }
  };

  const handleToggleComplete = (index) => {
    dispatch({ type: "TOGGLE_COMPLETE", payload: index });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "COMPLETED") return todo.completed;
    if (filter === "PENDING") return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-br from-indigo-200 via-pink-200 to-yellow-100">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-5xl font-extrabold text-purple-700 mb-10"
      >
        🌟 My Todo App
      </motion.h1>

      {/* Input Form */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mb-8 backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-xl">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={handleAddOrEdit}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition transform duration-200"
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-6 mb-10">
        {["ALL", "COMPLETED", "PENDING"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-all ${
              filter === type
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-purple-600 border border-purple-400"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Todo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <AnimatePresence>
          {filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-gray-600 text-xl text-center"
            >
              No Todos Yet 📋
            </motion.div>
          ) : (
            filteredTodos.map((todo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-3xl shadow-2xl relative ${
                  todo.completed
                    ? "bg-green-200"
                    : "bg-white/70 backdrop-blur-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(idx)}
                    className="w-6 h-6 accent-purple-600 mt-1"
                  />
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-purple-800"
                      }`}
                    >
                      {todo.title}
                    </h2>
                    <p
                      className={`mt-2 text-gray-600 ${
                        todo.completed ? "line-through" : ""
                      }`}
                    >
                      {todo.description}
                    </p>
                  </div>
                </div>

                {/* Edit/Delete Buttons */}
                <div className="flex gap-3 absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoApp;
