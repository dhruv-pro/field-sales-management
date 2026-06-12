import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchProfile } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      localStorage.getItem('sfa_token');

    if (token) {
      dispatch(fetchProfile() as any);
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;