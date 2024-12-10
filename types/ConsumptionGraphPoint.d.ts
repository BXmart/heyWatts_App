export interface ConsumptionGraphPointI {
  _id: string;
  net: number;
  cleanVat: number;
  batteryPower: number;
  createdAt: string;
  pvPower?: number;
}
