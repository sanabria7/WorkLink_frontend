import { useEffect, useState, useCallback } from "react";
import * as profilesService from "../api/profilesService";
import type { AuthUser, ProfileCliente, ProfileProveedor, ProfilesUser } from "../types/types";

/**
 * useProfile
 * - user: objeto user proveniente de AuthProvider (debe contener .correo y .rol)
 *
 * Retorna:
 * - cliente: ProfileCliente | null
 * - proveedor: ProfileProveedor | null
 * - loading: boolean
 * - saving: boolean
 * - error: any
 * - setCliente, setProveedor: setters para actualizar estado local (útil para inputs controlados)
 * - saveCliente(payload): guarda perfil cliente en backend y actualiza estado local
 * - saveProveedor(payload): guarda perfil proveedor en backend y actualiza estado local
 */
export function useProfile(user: AuthUser | null) {
  console.log("useProfile llamado con user:", user);
  const [cliente, setCliente] = useState<ProfileCliente | null>(null);
  const [proveedor, setProveedor] = useState<ProfileProveedor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  
  const rolActivo = user?.rol ?? null;

  useEffect(() => {
    let mounted = true;

    async function load() {
      console.log("useProfile.load() - user al entrar:", user);
      setLoading(true);
      setError(null);
      setCliente(null);
      setProveedor(null);
      console.log("AuthUser recibido en useProfile:", user);
      if (!user || !user.correo) {
        setLoading(false);
        return;
      }
/* 
      const usuarioBase: ProfilesUser = {
        email: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
      }; */
      console.log("hola")
      console.log("AuthUser recibido en useProfile:", user);
      try {
        if (user.rol.toLocaleLowerCase() === "cliente") {
          const perfilCli = await profilesService.getPerfilCliente(user.correo/* , usuarioBase */);
          console.log("Perfil cliente cargado en useProfile:", perfilCli);
          if (mounted) setCliente(perfilCli);
          
        } else if (user.rol.toLocaleLowerCase() === "proveedor") {
          const perfilProv = await profilesService.getPerfilProveedor(user.correo/* , usuarioBase */);
          console.log("Perfil proveedor cargado en useProfile:", perfilProv);
          if (mounted) setProveedor(perfilProv);
        }
      } catch (err) {
        console.error("useProfile: error cargando perfil", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  const saveCliente = useCallback(async (payload: ProfileCliente) => {
    setSaving(true);
    setError(null);
    try {
      const email = payload.usuario?.email || user?.correo;
      if (!email) throw new Error("No hay email en payload.usuario");

      const usuarioPayload: ProfilesUser = payload.usuario;
      await profilesService.udpatedUser(email, usuarioPayload);

      const updatedCli = await profilesService.updatePerfilCliente(email, payload);
      setCliente(updatedCli);
      return updatedCli;
    } catch (err) {
      console.error("useProfile.saveCliente error", err);
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveProveedor = useCallback(async (payload: ProfileProveedor) => {
    setSaving(true);
    setError(null);
    try {
      const email = payload.usuario?.email || user?.correo;
      if (!email) throw new Error("No hay email en payload.usuario");

      const usuarioPayload: ProfilesUser = payload.usuario;
      await profilesService.udpatedUser(email, usuarioPayload);
      console.log("Objeto payload:", payload);
      const updatedProv = await profilesService.updatePerfilProveedor(email, payload);
      setProveedor(updatedProv);
      return updatedProv;
    } catch (err) {
      console.error("useProfile.saveProveedor error", err);
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    cliente,
    proveedor,
    rolActivo,
    loading,
    saving,
    error,
    setCliente,
    setProveedor,
    saveCliente,
    saveProveedor,
  };
}
