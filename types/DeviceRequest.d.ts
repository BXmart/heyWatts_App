export interface NewDeviceRequestI {
  property: AuthorizedDevice;
  authorizedDevice: AuthorizedDeviceFromNewDevice;
  name: string;
  priority: number;
  userStatus: number;
  machineStatus: number;
  maxDevicePower: number;
  minDevicePower: number;
  authorized: boolean;
  isActive: boolean;
  availability: number;
  serialNumber: string;
  isEnabled: boolean;
  attributes: Attribute[];
  communicationConfigs?: Record<string, string>[];
}

export interface Attribute {
  authorizedAttribute_Id: string;
  code: string;
  value: number;
}

export interface AuthorizedDeviceFromNewDevice {
  _id: string;
}
