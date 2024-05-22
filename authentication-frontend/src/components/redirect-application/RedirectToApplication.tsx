import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const RedirectToApplication: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>; 
    }
    
    return isAuthenticated ? <Navigate to="/application" /> : <Navigate to="/login" />;
};

export default RedirectToApplication;
