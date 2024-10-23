import { DeviceI } from "@/types/Device";
import { NewDeviceRequestI } from "@/types/DeviceRequest";
import { API_URL } from "@/utils/constants";
import axios from "axios";


export async function getDeviceById(deviceId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/devices/${deviceId}`));
  return data;
}

export async function postNewDevice(body: NewDeviceRequestI) {
  const { data } = await axios.post(API_URL.concat('/api/v1/web/devices'), body);
  return data;
}

export async function patchChangeAvailabilityMode(deviceId: string, availability: number) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/update`));
  (availability === 0 || availability === 1 || availability === 2 || availability === 3) && url.searchParams.append('availability', availability.toString());
  const { data } = await axios.patch(url.href);
  return data;
}

export async function postPowerDevice(deviceId: string, command: 'on' | 'off') {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/set`));
  (command === 'on' || command === 'off') && url.searchParams.append('command', command);
  const { data } = await axios.post(url.href);
  return data;
}

export async function postCarChargerDevice({ deviceId, command, current }: { deviceId: string; command?: 'charge' | 'stop'; current?: number }) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/set`));
  (command === 'charge' || command === 'stop') && url.searchParams.append('command', command);
  !!current && current !== null && url.searchParams.append('current', current.toString());
  const { data } = await axios.post(url.href);
  return data;
}

export async function postBatteryDevice({ deviceId, command, power }: { deviceId: string; command?: string; power?: number | null }) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/set`));
  (command === 'discharge' || command === 'charge' || command === 'stop') && url.searchParams.append('command', command);
  !!power && power !== null && url.searchParams.append('power', power.toString());
  const { data } = await axios.post(url.href);
  return data;
}

export async function putDevice(body: DeviceI[]) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices`));
  const { data } = await axios.put(url.href, body);
  return data;
}

export async function putDeviceId(device: DeviceI) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${device._id}`));
  const { data } = await axios.put(url.href, device);
  return data;
}

export async function getHistoricDeviceById({ deviceId, code, startDate, endDate, token }: { deviceId: string; code?: string; startDate?: string; endDate?: string; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/historic`));
  !!code && url.searchParams.append('code', code);
  const { data } = await axios.get(url.href, { headers: { Authorization: bearerToken, startDate, endDate } });
  return data;
}

export async function patchActiveCommConfig(deviceId: string, configId: string, body: any) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}/configs/${configId}/enable`));
  const { data } = await axios.patch(url.href, body);
  return data;
}

export async function deleteDevice(deviceId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/devices/${deviceId}`));
  const { data } = await axios.delete(url.href);
  return data;
}
