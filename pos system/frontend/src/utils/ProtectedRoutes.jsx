import { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, requireRole }) => {
    const { user, loading } = useAuth();  // Assuming your auth context has a loading state
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        
        if (!requireRole.includes(user.role)) {
            navigate("/unauthorized");
            return;  
        }
        
        setChecked(true);
    }, [user, navigate, requireRole]);

    // Show loading while checking authentication
    if (!checked) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    return children;
}

export default ProtectedRoutes;