export type HistoricEchartsI = {
  productionCleanVat: PointT[];
  positiveConsumption: PointT[];
  negativeConsumption: PointT[];
  consumptionBattery: PointT[];
  totalConsumption: PointT[];
  historicDevices?: any[];
  listOfDays?: string[];
  lastDay?: string;
  listOfMonths?: string[];
  lastMonth?: string;
  year?: number;
  weeks?: number;
};
