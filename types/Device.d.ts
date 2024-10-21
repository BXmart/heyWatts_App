import { AuthDeviceI, CommunicationConfigsI } from '.';

export interface DeviceI {
  _id: string;
  authorizedDevice: AuthDeviceI;
  name: string;
  priority: number;
  userStatus: number;
  machineStatus: string;
  maxDevicePower: number;
  minDevicePower: number;
  authorized: boolean;
  availability: null;
  serialNumber: null;
  createdAt: string;
  updatedAt: null;
  communicationConfigs: CommunicationConfigsI[];
  attributes: AttributeI[];
}
export interface AttributeI {
  _id: string;
  code: string;
  value: string;
}
