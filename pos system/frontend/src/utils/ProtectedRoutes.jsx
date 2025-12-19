import { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, requireRole }) => {
    const { user, loading } = useAuth(); 
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        
        const userRole = user.role === 'user' ? 'customer' : user.role;

        if (!requireRole.includes(userRole)) {
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
