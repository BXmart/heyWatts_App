import { ReactNode } from "react";
import { Badge } from "react-native-paper";

export const setMachineStatusBadge = (type: string) => {
  const statusBadges: any = {
    standby: <Badge color="gray">Standby</Badge>,
    charging: (
      <div className="animate-pulse">
        <Badge color="green">Cargando</Badge>
      </div>
    ),
    discharging: (
      <div className="animate-pulse">
        <Badge color="green">Descargando</Badge>
      </div>
    ),
    charged: <Badge color="green">Cargado</Badge>,
    locked: <Badge color="gray">Bloqueado</Badge>,
    off: <Badge color="red">Apagado</Badge>,
    on: <Badge color="green">Encendido</Badge>,
    online: <Badge color="green">Online</Badge>,
    offline: <Badge color="red">Offline</Badge>,
    ongrid: <Badge color="green">Conectado a la red</Badge>,
    offgrid: <Badge color="red">Desconectado de la red</Badge>,
    ["true"]: <Badge color="green">Conectado a la red</Badge>,
    ["false"]: <Badge color="red">Con fallos</Badge>,
    ["No car"]: <Badge color="gray">Sin coche conectado</Badge>,
  };

  return statusBadges[type] || <Badge color="gray">Desconocido</Badge>;
};
