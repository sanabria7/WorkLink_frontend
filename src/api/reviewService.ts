import api from "./axiosProfiles";
import type { Review } from "../types/userTypes";

export async function getReviewById(idReview: string): Promise<Review> {
    const { data } = await api.get(`${"/api/review/obtener/"}${idReview}`);
    return data;
}

export async function getReviewsByCliente(clienteId: string): Promise<Review[]> {
    const { data } = await api.get(`${"/api/review/obtenerPorCliente/"}${clienteId}`);
    return data;
}

export async function getReviewsByProveedor(proveedorId: string): Promise<Review[]> {
    const  response  = await api.get(`${"/api/review/obtenerPorProveedor/"}${proveedorId}`);
    return response.data;
}

export async function getReviewsByServicio(servicioId: string): Promise<Review[]> {
    const { data } = await api.get(`${"/api/review/obtenerPorService/"}${servicioId}`);
    return data;
}

export async function guardarReview(review: Review): Promise<Review> {
    const { data } = await api.post<Review>(
        "/api/review/guardar",
        {
            calificacion: review.calificacion,
            comentario: review.comentario,
            idCliente: review.clienteId,
            idProveedor: review.proveedorId,
            idService: review.idService,
        }
    );
    return data;
}