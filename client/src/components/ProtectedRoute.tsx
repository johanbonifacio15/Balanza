import {Navigate, Outlet} from "react-router";
import {useAuth} from "../context/authContext";

export function ProtectedRoute() {
    const {user, loading} = useAuth();

    if (loading) {
        return <p className="p-8 text-sm text-muted">Cargando...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}