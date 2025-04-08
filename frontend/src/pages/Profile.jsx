import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    image: "",
    photo: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || "",
        mobile: storedUser.mobile || "",
        image: storedUser.image || "",
        photo: null,
      });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const ImageUpload = async (e) => {
    e.preventDefault();
    if (!formData.photo) return;

    const formDataImage = new FormData();
    formDataImage.append("image", formData.photo);

    setLazyLoading(true);
    try {
      const response = await api.post("/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedImageUrl = response.data.imageUrl;

      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
        photo: null,
      }));

      if (fileInputRef.current) fileInputRef.current.value = "";
      setImagePreview(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed!");
    } finally {
      setLazyLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLazyLoading(true);
    const updatedUser = {
      ...user,
      name: formData.name,
      mobile: formData.mobile,
      image: formData.image,
    };

    try {
      const response = await api.put(`/users/${user._id}`, updatedUser);
      console.log(response);
      const savedUser = response.data.updatedUser;
      localStorage.setItem("user", JSON.stringify(savedUser));
      setUser(savedUser);
      setEditing(false);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLazyLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      mobile: user.mobile || "",
      image: user.image || "",
      photo: null,
    });
    setImagePreview("");
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center space-y-4">
        {editing ? (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              name="photo"
              className="w-full border border-gray-300 p-1 rounded-md"
              onChange={handleImageChange}
            />
            <button
              onClick={ImageUpload}
              disabled={lazyLoading || !formData.photo}
              className={`w-full text-white font-semibold py-2 rounded-md transition duration-300 ${
                lazyLoading || !formData.photo
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              {lazyLoading ? "Uploading..." : "Upload"}
            </button>

            {formData.image && (
              <div className="flex justify-center mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-[200px] object-cover border rounded-md"
                />
              </div>
            )}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 rounded mb-2"
            />

            <p className="text-gray-600">
              <strong>Email: </strong>
              <input type="text" value={user?.email} disabled />
            </p>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full border p-2 rounded mb-2"
            />

            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
              onClick={handleSave}
              disabled={lazyLoading}
            >
              {lazyLoading ? "Saving" : "Save"}
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <img
              src={
                user.image
                  ? user.image
                  : "https://img.icons8.com/nolan/64/user-default.png"
              }
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
            />
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">
              <strong>Email: </strong>
              {user.email}
            </p>
            <p className="text-gray-600">
              <strong>Mobile: </strong>
              {user.mobile}
            </p>
            <p className="text-gray-600">
              <strong>Joined:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toDateString() : "N/A"}
            </p>
            <p className="text-gray-600">
              <strong>Updated:</strong>{" "}
              {user.updatedAt ? new Date(user.updatedAt).toDateString() : "N/A"}
            </p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
