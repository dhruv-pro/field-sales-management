import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { UserRole } from "../features/users/usersTypes";

type Props = {
    children: React.ReactNode;
    roles?: UserRole[];
};

const PrivateRoute = ({ children, roles }: Props) => {
    const token = storage.getToken();

    const userRole = useSelector(
        (state: RootState) => state.auth.user?.role
    );

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // role check
    if (roles && userRole && !roles.includes(userRole)) {
        return <Navigate to="/attendence" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;