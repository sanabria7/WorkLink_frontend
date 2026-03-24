import React, { useState } from "react"
import DefaultLayout from "../layout/defaultLayout"
import { useAuth } from "../auth/authProvider";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import type { AuthErrorResponse } from "../types/types";

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [password, setPassword] = useState("");
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();

        try {
            const response = await axios.post(
                "/registro",
                { nombre, apellido, correo, password, rol },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            console.log("registro OK", response.data);
            setErrorResponse("");
            goTo("/login");
        } catch (error) {
            if (isAxiosError<AuthErrorResponse>(error)) {
                if (!error.response) {
                    setErrorResponse("No responde el servidor");
                } else {
                    switch (error.response.status) {
                        case 400:
                            setErrorResponse("Datos incompletos o inválidos");
                            break;
                        case 401:
                            setErrorResponse("No autorizado");
                            break;
                        case 409:
                            setErrorResponse("El correo ya está registrado");
                            break;
                        default:
                            setErrorResponse(error.response.data?.body?.error || "Registro Fallido");
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
                <h1>Registro</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)} />
                <label>Apellido</label>
                <input
                    type="text"
                    value={apellido}
                    onChange={(evento) => setApellido(evento.target.value)} />
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
                <label>Rol</label>
                <input
                    type="text"
                    value={rol}
                    onChange={(evento) => setRol(evento.target.value)} />
                <button>Registrate</button>
            </form>
        </DefaultLayout>
    )
}