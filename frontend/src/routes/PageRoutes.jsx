import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";

const PageRoutes = () => {
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="629093128331-afv13dd92b86a0c9s6kj8vobdn7fcktv.apps.googleusercontent.com">
        <Login></Login>
      </GoogleOAuthProvider>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PageRoutes;
