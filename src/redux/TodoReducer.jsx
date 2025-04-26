// src/redux/TodoReducer.js
const initialState = {
  todos: [],
};

const TodoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };

    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };

    case "EDIT_TODO":
      const updatedTodos = [...state.todos];
      updatedTodos[action.payload.index] = {
        ...updatedTodos[action.payload.index],
        title: action.payload.title,
        description: action.payload.description,
      };
      return { ...state, todos: updatedTodos };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((_, idx) => idx !== action.payload),
      };

    case "TOGGLE_COMPLETE":
      const toggledTodos = [...state.todos];
      toggledTodos[action.payload].completed =
        !toggledTodos[action.payload].completed;
      return { ...state, todos: toggledTodos };

    default:
      return state;
  }
};

export default TodoReducer;
