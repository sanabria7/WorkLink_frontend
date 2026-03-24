import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout"
import { useAuth } from "../auth/authProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import type { AuthErrorResponse } from "../types/types";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (!correo || !password) {
            setErrorResponse("Correo y contraseña son obligatorios");
            return;
        }

        try {
            const response = await axios.post(
                "/login",
                { correo, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                console.log("login OK", response.data);
                setErrorResponse("");
                goTo("/index");                
            } else {
                console.log("Algo sucedió")
                
            }
        } catch (error) {
            if (isAxiosError<AuthErrorResponse>(error)) {
                if (!error.response) {
                    setErrorResponse("No responde el servidor");
                } else {
                    switch (error.response.status) {
                        case 400:
                            setErrorResponse("Falta correo o contraseña");
                            break;
                        case 401:
                            setErrorResponse("Credenciales inválidas");
                            break;
                        case 403:
                            setErrorResponse("Acceso denegado");
                            break;
                        case 404:
                            setErrorResponse("Usuario no encontrado");
                            break;
                        case 500:
                            setErrorResponse("Error interno del servidor");
                            break;
                        default:
                            setErrorResponse(error.response.data?.body?.error || "Login Fallido");
                    }
                }
            } else {
                setErrorResponse("Error de Axios");
            }
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/index" />
    }

    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>Correo</label>
                <input
                    type="email"
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)} />
                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)} />
                <button>Ingresar</button>
                <p> ¿No tenes cuenta capo?
                    <Link to="/registro"> Registrate </Link>
                </p>
            </form>
        </DefaultLayout>
    );
}