D
export interface OwnerDashboardI {
  property: DashboardPropertyI;
  deviceDashboard: DevicesDashboardI;
  propertyResume: PropertyResumeI;
  consumptionList: ConsumptionListI[];
  monthConsumptionList: MonthConsumptionListI[];
  predictionList?: Prediction[];
}

export interface Prediction {
  _id: string;
  consumptionWh: number;
  surplus_energy_wh: number;
  createdAt: Date;
  updatedAt: null;
}

export interface ConsumptionResumeI {
  consumption: number;
  consumptionCost: number;
  currentConsumption: number;
  currentMonthProductions: number;
  currentWeekConsumption: number;
  currentWeekCost: number;
  lastMonthConsumption: number;
  lastMonthConsumptionCost: number;
  lastWeekConsumption: number;
  lastWeekConsumptionCost: number;
  lastWeekConsumptionCost: number;
}

export interface DashboardPropertyI {
  _id: string;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  additionalAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyResumeI {
  battery: number;
  production: number;
  consumption: number;
  total_consumption: number;
  feeType: number;
}

export interface ConsumptionGraphData {
  consumptionData: ConsumptionListI[];
  predictionData: Prediction[];
  predictedEuros: PredictedEuros[];
}

export interface PredictedEuros {
  hour: string;
  price: number;
}

export interface ConsumptionListI {
  consumption_id: number;
  _id: string;
  createdAt: string;
  cleanVat: number;
  net: number;
  fee: number;
  tip: number;
  flat: number;
  valley: number;
  feeType: number;
  propertyId: number;
}

export interface MonthConsumptionListI {
  _id: string;
  createdAt: Date;
  net: number;
  netCompensation: number;
  tip: number;
  flat: number;
  valley: number;
  tipCompensation: number;
  flatCompensation: number;
  valleyCompensation: number;
  propertyId: number;
}

export interface DevicesDashboardI {
  devices: number;
  onOff: number;
  carCharger: number;
  gateway: number;
  inverterHuawei: number;
  inverterFronius: number;
  batteries: number;
}

export interface EnergyDayPriceI {
  datetime: Date;
  price: number;
  tip: boolean;
  valley: boolean;
  flat: boolean;
}