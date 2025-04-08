import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPasswordData, setNewPasswordData] = useState({
    password: "",
  });
  const [lazyLoading, setLazyLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    let newErrors = { ...errors };
    if (
      name === "password" &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@|+%&])[A-Za-z\d@|+%&]{6,}$/.test(
        value
      )
    ) {
      newErrors.password =
        "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character (@ | + % &)";
    } else {
      delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLazyLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: newPasswordData.password,
      });

      toast.success("Password reset successful!");
      setNewPasswordData({ password: "" }); // ✅ Clear input field after successful reset
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLazyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        <div className="space-y-2">
          <input
            type="password"
            name="password"
            value={newPasswordData.password}
            onChange={handleChange}
            placeholder="Enter New Password"
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={lazyLoading || Object.keys(errors).length > 0}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-50"
        >
          {lazyLoading ? "Processing..." : "Reset"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
