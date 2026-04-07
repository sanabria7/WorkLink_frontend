import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/authProvider.tsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import Login from './routes/login.tsx';
import Registro from './routes/registro.tsx';
import Index from './routes/home.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import Landing from './routes/landing.tsx';
import DefaultLayout from './components/layout/defaultLayout.tsx';
import RolRoute from './routes/rolRoute.tsx';
import ForgotPassword from './routes/forgot-password.tsx';
import ResetPassword from './routes/reset-password.tsx';
import ProveedorPublicView from './routes/proveedor/perfilPublicoView.tsx';
import PerfilRedirect from './components/pages/perfilRedirect.tsx';
import Dashboard from './routes/proveedor/dashboard.tsx';

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
            { path: "/proveedor/:correo", element: <ProveedorPublicView /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/perfil", element: <PerfilRedirect /> },
                    {
                        element: <RolRoute requiredRol='cliente' />,
                        children: [
                            { path: "/home", element: <Index /> },
                        ]
                    },
                    {
                        element: <RolRoute requiredRol="proveedor" />,
                        children: [
                            { path: "/dashboard", element: <Dashboard /> },
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
