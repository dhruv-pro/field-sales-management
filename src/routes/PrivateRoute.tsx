import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

type Props = {
    children: React.ReactNode;
};

const PrivateRoute = ({
    children,
}: Props) => {
    const token = storage.getToken();

    if (!token) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;