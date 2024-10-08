import { ConsumptionListI } from "@/types/OwnerDashboard";


export const getEnergyProductionToday = (data: ConsumptionListI[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.net < 0) {
        return accumulator + currentValue.net;
      } else {
        return accumulator;
      }
    }, 0) / 1000
  ).toFixed(3);
