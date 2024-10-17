import { API_URL } from '@/utils/constants';
import axios from 'axios';

export async function getDayProductionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalProductionsSmall`));
  return data;
}

export async function getWeekProductionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalProductionsMedium`));
  return data;
}

export async function getMonthProductionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalProductionsBig`));
  return data;
}

export async function getDayConsumptionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalConsumptionSmall`));
  return data;
}

export async function getWeekConsumptionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalConsumptionMedium`));
  return data;
}

export async function getMonthConsumptionHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicalConsumptionBig`));
  return data;
}

export async function getDayHistorical(propertyId: string, currentDate: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/property/${propertyId}/historics`), {
    params: { CurrentDate: currentDate },
  });
  return data;
}

export async function getDatesDayHistorical(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/historicDates`));
  return data;
}

export async function postRecalculateHistoricPrice({ propertyId, date }: { propertyId: string; date: string }) {
  if (date.length === 0 || date === undefined || date === null) {
    return;
  }
  const { data } = await axios.post(API_URL.concat(`/api/v1/web/properties/${propertyId}/recalculateHistoricPrice?date=${date}`));
  return data;
}
