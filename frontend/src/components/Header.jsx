import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserContext from "../context/UserContext";
import api from "../services/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return (
    <>
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            My-App
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <ul className="hidden md:flex gap-6 items-center">
            <li>
              <Link to="/" classsName="hover:text-gray-300 transition">
                Home
              </Link>
            </li>

            {user && (
              <li>
                <Link to="/profile" className="hover:text-gray-300 transition">
                  Profile
                </Link>
              </li>
            )}

            {!user ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-gray-300 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-blue-700">
            <ul className="flex flex-col items-center gap-4 py-4">
              <li>
                <Link to="/" classsName="hover:text-gray-300 transition">
                  Home
                </Link>
              </li>

              {user && (
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 hover:text-gray-300 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
              )}

              {!user ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="block py-2 hover:text-gray-300 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block py-2 hover:text-gray-300 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
