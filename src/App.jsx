import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { createStore } from "redux";
import todoReducer from "./redux/TodoReducer";
import TodoApp from "./TodoApp";
import { Toaster } from "react-hot-toast";

//  Setup redux-persist
const persistConfig = {
  key: "root",
  storage,
};
let loading = "....loading";

const persistedReducer = persistReducer(persistConfig, todoReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} /> {/* Added here */}
      <PersistGate loading={loading} persistor={persistor}>
        <TodoApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
