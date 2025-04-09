import "./App.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/AppRouter";
import UserContext from "./context/UserContext";
import { useState, useEffect } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <AppRouter />
        <ToastContainer position="top-center" autoClose={1500} />
      </UserContext.Provider>
    </>
  );
};

export default App;
