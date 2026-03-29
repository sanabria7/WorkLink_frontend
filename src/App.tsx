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

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Landing />,
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
                path: "/busqueda",
                /* element: <ResultadosBusqueda/> */
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/home",
                        element: <Index />
                    },
                    {
                        path: "/perfil",
                        /* element: <Perfil /> */
                    },
                    {
                        path: "/proveedor/dashboard"
                        /* element: <Dashboard/> */
                    },
                    {
                        path: "/proveedor/crearPerfil"
                        /* element: <crearPerfilProv/> */
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
