import { ContractI, UserI } from '.';
import { PropertyInvoiceI } from './PropertyInvoice';

export interface PropertyI {
  _id: string;
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
  latitude: string;
  longitude: string;
  additionalAddress: string;
  contracts: ContractI[];
  dataRecovered: boolean;
  inclination: number;
  orientation: number;
  monthAvg: number;
  m2: number;
  interestedDevices: number[];
  createdAt: string;
  updatedAt: null;
  propertyInvoices: PropertyInvoiceI[];
}
