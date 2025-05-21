import { Navigate, RouteObject } from 'react-router-dom';
import Login from '../pages/Login';

export const authRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="login" replace />,
  },
  {
    path: 'login',
    element: <Login />,
  },
];
