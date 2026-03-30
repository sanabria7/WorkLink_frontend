import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/login.tsx';
import Registro from './routes/registro.tsx';
import Index from './routes/index.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import { AuthProvider } from './auth/authProvider.tsx';
import Landing from './routes/landing.tsx';
import DefaultLayout from './components/layout/defaultLayout.tsx';
import RolRoute from './routes/rolRoute.tsx';
import ForgotPassword from './routes/forgot-password.tsx';
import ResetPassword from './routes/reset-password.tsx';

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            { path: "/", element: <Landing /> },
            { path: "/login", element: <Login /> },
            { path: "/registro", element: <Registro /> },
            { path: "/forgot-password", element: <ForgotPassword /> },
            { path: "/reset-password", element: <ResetPassword /> },
            { path: "/busqueda", /* element: <ResultadosBusqueda/> */ },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/home", element: <Index /> },
                    { path: "/perfil", /* element: <Perfil /> */ },
                    {
                        element: <RolRoute requiredRol="proveedor" />,
                        children: [
                            { path: "/proveedor/dashboard", /* element: <Dashboard/> */ },
                            { path: "/proveedor/calendario", /* element: <crearPerfilProv/> */ },
                        ]
                    },
                ]
            },
        ],
    }
]);

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)
