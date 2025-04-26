const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  todos.push(req.body);
  res.json({ message: "Todo added" });
});

app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (todos[id]) {
    todos[id] = req.body;
    res.json({ message: "Todo updated" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (todos[id]) {
    todos.splice(id, 1);
    res.json({ message: "Todo deleted" });
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
