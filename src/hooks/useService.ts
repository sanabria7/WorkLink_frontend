import { useState, useCallback } from "react";
import type { Service } from "../types/serviceTypes";
import * as offerService from "../api/offerService";

export function useService() {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);

  const crearServicio = useCallback(async (payload: Service) => {
    setSaving(true);
    setError(null);
    try {
      const created = await offerService.crearServicio(payload);
      setService(created);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const buscarServicio = useCallback(async (query: string) => {
    if (!query || query.trim() === "") {
      setLoading(false);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const resultados = await offerService.buscarServicio(query);
      return resultados;
    } catch (err: any) {
      if (err.response && err.response.status === 404) return [];
      setError(err)
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateServicio = useCallback(async (id: string, payload: Service) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await offerService.updateServicio(id, payload);
      setService(updated);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const getServicioById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await offerService.getServicioById(id);
      setService(fetched);
      return fetched;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAll = await offerService.getAllServices();
      return fetchedAll;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProveedorByIdServices = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedByProveedorId = await offerService.getProveedorByIdServices(id);
      return fetchedByProveedorId;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarServicio = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await offerService.eliminarServicio(id);
      setService(null);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [])

  return {
    service,
    loading,
    saving,
    error,
    crearServicio,
    updateServicio,
    buscarServicio,
    getServicioById,
    getAllServices,
    getProveedorByIdServices,
    eliminarServicio,
    setService, // útil para inputs controlados
  };
}
