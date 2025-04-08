import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPass: "",
    photo: null,
    imageurl: "",
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [lazyLoading, setLazyLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };

    if (name === "name") {
      if (value.trim() === "") {
        newErrors.name = "Name is required";
      } else if (value.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters long";
      } else {
        delete newErrors.name;
      }
    }

    if (
      name === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      newErrors.email = "invalid email format";
    } else {
      delete newErrors.email;
    }

    if (name === "mobile" && !/^[6-9]\d{9}$/.test(value)) {
      newErrors.mobile = "Invalid mobile format";
    } else {
      delete newErrors.mobile;
    }

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

    if (name === "confirmPass") {
      if (value !== formData.password) {
        newErrors.confirmPass = "Passwords do not match";
      } else {
        delete newErrors.confirmPass;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsRegistering(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("password", formData.password);
    data.append("image", formData.imageurl);

    try {
      const response = await api.post("/auth/register", data);

      toast.success("Registered Successfully");

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPass: "",
        photo: null,
        imageurl: "",
      });

      setErrors({});
      setImagePreview("");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong, please try again."
      );
      console.log(err);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const ImageUpload = async (e) => {
    e.preventDefault();
    if (!formData.photo) {
      console.log("No image selected for upload");
      return;
    }
    const formDataImage = new FormData();
    formDataImage.append("image", formData.photo);

    setLazyLoading(true);
    try {
      const response = await api.post("/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedImageUrl = response.data.imageUrl;

      setFormData((prevState) => ({
        ...prevState,
        imageurl: uploadedImageUrl,
        photo: null,
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input UI
      }

      setImagePreview(uploadedImageUrl);
      setLazyLoading(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
    } finally {
      setLazyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-2"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            name="photo"
            className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleImageChange}
          />
          <button
            onClick={ImageUpload}
            disabled={lazyLoading || !formData.photo || !!formData.imageurl}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 ${
              lazyLoading || !formData.photo || !!formData.imageurl
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {lazyLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {imagePreview && (
          <div className="flex justify-center mt-2">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-[200px] border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition "
            />
          </div>
        )}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
          value={formData.name}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
          value={formData.email}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="number"
          name="mobile"
          placeholder="Mobile No"
          className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
          value={formData.mobile}
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm">{errors.mobile}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <input
          type="password"
          name="confirmPass"
          placeholder="Confirm Password"
          className="w-full border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={formData.confirmPass}
          onChange={handleChange}
        />
        {errors.confirmPass && (
          <p className="text-red-500 text-sm">{errors.confirmPass}</p>
        )}

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0 || isRegistering}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 ${
            Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          {isRegistering ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
