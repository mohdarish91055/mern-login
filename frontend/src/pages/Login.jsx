import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import UserContext from "../context/UserContext";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });

    let newError = { ...errors };
    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        newError.email = "Invalid email format";
      } else {
        delete newError.email;
      }
    }

    setErrors(newError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", loginData);

      const { user } = response.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

        <div className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={loginData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 ${
            Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          Login
        </button>

        <div className="flex justify-between text-sm text-blue-500 mt-2">
          <Link to="/register" className="hover:underline">
            Sign Up
          </Link>
          <Link to="/forgot-password" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
