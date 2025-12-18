import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext.jsx";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // not logged in
      navigate("/login");
    } else {
      // logged in → role based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "customer" || user.role === "user") {
        navigate("/customer-dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  return null;
};

export default Root;
