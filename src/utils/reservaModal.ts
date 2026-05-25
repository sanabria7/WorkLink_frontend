import { addMinutes, isSameDay } from "date-fns";
import type { HorasDisp } from "../types/horariosTypes";

export const buildDateTimeFromTime = (baseDate: Date, time: string) => {

    const [hoursStr, minutesStr = "00", secondsStr = "00"] =
        time.split(":");

    const result = new Date(baseDate);

    result.setHours(
        Number(hoursStr),
        Number(minutesStr),
        Number(secondsStr),
        0
    );

    return result;
};

export const filterExpiredSlots = ({ fechaSeleccionada, horasDisp, currentTime, duracionServicio, }: {
    fechaSeleccionada: Date;
    horasDisp: HorasDisp[];
    currentTime: Date;
    duracionServicio: number;
}) => {

    const esHoy = isSameDay(fechaSeleccionada, currentTime);

    if (!esHoy) return horasDisp;

    const corteMinimo = addMinutes(currentTime, duracionServicio);

    return horasDisp.filter((slot) => {
        const inicioSlot = buildDateTimeFromTime(fechaSeleccionada, slot.horaInicio);
        return inicioSlot >= corteMinimo;
    });
};