import api from "./axiosOffer";
import type { Service } from "../types/serviceTypes";

export async function crearServicio(servicio: Service): Promise<Service> {
  const { data } = await api.post<Service>("/servicio/crear", servicio);
  return data;
}

export async function buscarServicio(query: string): Promise<Service[]> {
  const { data } = await api.post<Service[]>("/servicio/busqueda", { query });
  return data;
}

export async function updateServicio(id: string, servicio: Service): Promise<Service> {
  const { data } = await api.put<Service>(`${"/servicio/actualizar"}/${id}`, servicio);
  return data;
}

export async function getServicioById(id: string): Promise<Service> {
  const { data } = await api.get<Service>(`${"/servicio/get"}/${id}`);
  return data;
}

export async function getAllServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>("/servicio/listar");
  return data;
}

export async function getProveedorByIdServices(id: string): Promise<Service[]> {
  const { data } = await api.get<Service[]>(`${"/servicio/listar/"}${id}`);
  return data;
}

export async function eliminarServicio(id: string): Promise<void> {
  await api.delete(`${"/servicio/"}${id}`);
}