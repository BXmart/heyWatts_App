import { ContractI, DeviceI, UserI } from '.';

export interface DetailPropertyI {
  _id: string;
  devices: DeviceI[];
  contracts: ContractI[];
  name: string;
  description: string;
  user: UserI;
  consumptionAvailableApi: number;
  productionAvailableApi: number;
  cups: string;
  distributorCode: string;
  address: string;
  postalCode: string;
  province: string;
  municipality: string;
  pointType: number;
  longitude: string;
  latitude: string;
  additionalAddress: string;
  dataRecovered: boolean;
  createdAt: string;
  updatedAt: string;
}
