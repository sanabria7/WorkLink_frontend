import type { ReservaDTO } from "./reservaTypes";
import type { profilesService } from "./serviceTypes";

export interface CheckoutLocationState {
    servicio: profilesService;
    reserva: ReservaDTO;
    idsSlots: number[];
}