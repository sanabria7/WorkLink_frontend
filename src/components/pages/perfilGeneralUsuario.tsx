import type { ProfilesUser } from "../../types/types";
import Icon from "../misc/icon";

interface Props {
    usuario: ProfilesUser | null;
    onChange: (partial: Partial<ProfilesUser>) => void;
    disabled?: boolean;
    errorResponse: Record<string, string>;
}

export default function PerfilUsuario({ usuario, onChange, disabled = false, errorResponse = {} }: Props): React.ReactElement | null {
    if (!usuario) return <p>No hay datos del usuario</p>;

    /*
       * handleFieldChange
       * - keyName: nombre del campo de ProfilesUser que cambia (por ejemplo "telefono").
       * - newValue: nuevo valor para ese campo (o null para borrarlo).
       *
       * Construye un objeto parcial con la única propiedad modificada
       * y lo pasa a onChange para que el componente padre lo fusione en su estado.
    */
    function handleFieldChange<Field extends keyof ProfilesUser>(
        keyName: Field,
        newValue: ProfilesUser[Field] | null
    ) {
        const partialUpdate: Partial<ProfilesUser> = { [keyName]: newValue } as Partial<ProfilesUser>;
        onChange(partialUpdate);
    }

    return (
        <fieldset className="fieldset" aria-label="">
            <img src={usuario.fotoPerfilUrl || "/src/assets/react.svg"} />
            <label htmlFor="user-fotoPerfilUrl">Editar Foto</label>
            <input id="user-fotoPerfilUrl"
                type="url"
                value={usuario.fotoPerfilUrl || ""}
                onChange={(evento) => handleFieldChange("fotoPerfilUrl", evento.target.value)}
                disabled={disabled}
            />
            <label htmlFor="user-correo" aria-label="Correo">Mi correo:</label>
            <input id="user-correo" type="email" value={usuario.email} readOnly disabled />
            <label htmlFor="user-nombre">Mi nombre:</label>
            <input id="user-nombre"
                type="text"
                value={usuario.nombre}
                onChange={(evento) => handleFieldChange("nombre", evento.target.value)}
                disabled={disabled}
                required />
            {errorResponse.nombre && (
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.nombre}
                </span>
            )}
            <label htmlFor="user-nombre">Mi apellido:</label>
            <input id="user-apellido"
                type="text"
                value={usuario.apellido}
                onChange={(evento) => handleFieldChange("apellido", evento.target.value)}
                disabled={disabled}
                required />
            {errorResponse.apellido && (
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.apellido}
                </span>
            )}
            <label htmlFor="user-telefono">Mi teléfono:</label>
            <input id="user-telefono"
                type="tel"
                value={usuario.telefono}
                onChange={(evento) => handleFieldChange("telefono", evento.target.value)}
                disabled={disabled}
                inputMode="tel"
            />
            {errorResponse.telefono && (
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.telefono}
                </span>
            )}
            <label htmlFor="user-fechaNacimiento">Mi fecha de nacimiento:</label>
            <input id="user-fechaNacimiento"
                type="date"
                value={usuario.fechaNacimiento ?? ""}
                onChange={(evento) => handleFieldChange("fechaNacimiento", evento.target.value)}
                disabled={disabled}
            />
        </fieldset>
    );
}