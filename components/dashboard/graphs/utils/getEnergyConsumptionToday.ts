import { ConsumptionListI, Prediction } from "@/types/OwnerDashboard";


export const getEnergyConsumptionToday = (data: ConsumptionListI[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.net > 0) {
        return accumulator + currentValue.net;
      } else {
        return accumulator;
      }
    }, 0) / 1000
  ).toFixed(3);

export const getEnergyConsumptionPredictionToday = (data: Prediction[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.consumptionWh > 0) {
        return accumulator + currentValue.consumptionWh;
      } else {
        return accumulator;
      }
    }, 0) / 1000
  ).toFixed(3);

export const getEnergySurplusProductionPredictionToday = (data: Prediction[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.surplus_energy_wh > 0) {
        return accumulator + currentValue.surplus_energy_wh;
      } else {
        return accumulator;
      }
    }, 0) / 1000
  ).toFixed(3);