export interface ContractI {
  _id?: string;
  address: string;
  cups: string;
  postalCode: string;
  province: string;
  municipality: string;
  pointType: number;
  marketer: string;
  powerKW: number;
  timeDiscrimination: string;
  startDate: string | Date;
  endDate: string | Date;
  codeFare: string;
  selfConsumptionTypeCode: string;
  partitionCoefficient: number;
  cau: string;
  installedCapacity: number;
  createdAt?: string;
  updatedAt?: string;
  feeType?: number;
}
