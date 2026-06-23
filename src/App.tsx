import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfile } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';
import { socket } from './socket';
import toast from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state: any) => state.auth.user
  );

  useEffect(() => {
    const token = localStorage.getItem('sfa_token');

    if (token) {
      dispatch(fetchProfile() as any);
    }
  }, [dispatch]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (user?._id) {
      console.log('Joining Room:', user._id);

      socket.emit('join', user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("notification", (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return <AppRoutes />;
}

export default App;