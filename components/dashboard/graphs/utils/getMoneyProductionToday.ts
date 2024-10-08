import { ConsumptionListI, PredictedEuros } from "@/types/OwnerDashboard";


export const getMoneyProductionToday = (data: ConsumptionListI[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.tip < 0) {
        accumulator += currentValue.tip;
      }

      if (currentValue.valley < 0) {
        accumulator += currentValue.valley;
      }

      if (currentValue.flat < 0) {
        accumulator += currentValue.flat;
      }

      return accumulator;
    }, 0)
  ).toFixed(2);


export const getMoneyPredictedProductionToday = (data: PredictedEuros[]) =>
  Math.abs(
    data.reduce((accumulator, currentValue) => {
      if (currentValue.price < 0) {
        accumulator += currentValue.price;
      }

      return accumulator;
    }, 0)
  ).toFixed(2);