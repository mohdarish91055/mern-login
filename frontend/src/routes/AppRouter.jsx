import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ForgotPass from "../pages/ForgotPass";
import Profile from "../pages/Profile";
import Home from "../pages/Home";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="pt-4 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </BrowserRouter>
      
    </>
  );
};

export default AppRouter;
