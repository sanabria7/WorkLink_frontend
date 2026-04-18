import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/authProvider.tsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import Login from './routes/login.tsx';
import Registro from './routes/registro.tsx';
import ProtectedRoute from './routes/protectedRoute.tsx';
import DefaultLayout from './components/layout/defaultLayout.tsx';
import RolRoute from './routes/rolRoute.tsx';
import ForgotPassword from './routes/forgot-password.tsx';
import ResetPassword from './routes/reset-password.tsx';
import ProveedorPublicView from './routes/proveedor/perfilProveedorVista.tsx';
import PerfilRedirect from './components/pages/perfilRedirect.tsx';
import Dashboard from './routes/proveedor/dashboard.tsx';
import Landing from './routes/landing.tsx';
import PublicRoute from './routes/publicRoute.tsx';
import Home from './routes/cliente/home.tsx';
import CrearServicio from './components/pages/crearServicio.tsx';
import MisServicios from './routes/proveedor/listaServicios.tsx';
import EditarServicio from './components/pages/editarServicio.tsx';
import ResultadosBusqueda from './routes/resultados.tsx';
import Servicio from './routes/servicio/servicioVista.jsx';

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            { path: "/busqueda", element: <ResultadosBusqueda /> },
            { path: "/servicio/:id", element: <Servicio /> },
            { path: "/:correo", element: <ProveedorPublicView /> },
            {
                element: <PublicRoute />,
                children: [
                    { path: "/", element: <Landing /> },
                    { path: "/login", element: <Login /> },
                    { path: "/registro", element: <Registro /> },
                    { path: "/forgot-password", element: <ForgotPassword /> },
                    { path: "/reset-password", element: <ResetPassword /> },
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/perfil", element: <PerfilRedirect /> },
                    {
                        element: <RolRoute requiredRol='cliente' />,
                        children: [
                            { path: "/home", element: <Home /> },
                        ]
                    },
                    {
                        element: <RolRoute requiredRol="proveedor" />,
                        children: [
                            { path: "/dashboard", element: <Dashboard /> },
                            { path: "/calendario", element: <></> },
                            { path: "/crear-servicio", element: <CrearServicio /> },
                            { path: "/editar-servicio/:id", element: <EditarServicio /> },
                            { path: "/mis-servicios", element: <MisServicios /> }
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
