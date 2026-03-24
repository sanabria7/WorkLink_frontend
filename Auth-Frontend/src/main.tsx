import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/login.tsx';
import Registro from './routes/registro.tsx';
import Index from './routes/index.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import { AuthProvider } from './auth/authProvider.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/registro",
        element: <Registro />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/index",
                element: <Index />
            }
        ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)
