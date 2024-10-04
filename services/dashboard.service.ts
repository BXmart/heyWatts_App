import { API_URL } from "@/utils/constants";
import axios from "axios";

export async function getDashboardConsumptionAndPredictionGraph({ propertyId, date }: { propertyId: string; date: string }) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyId}/dashboard/consumptionAndPredictionGraph`));
  !!date && !!date.length && url.searchParams.append('date', date);
  const { data } = await axios.get(url.href);
  return data;
}

export async function getEnergyPricesByPropertyId(propertyId: string, date: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyId}/prices`));
  url.searchParams.append('date', date);
  const { data } = await axios.get(url.href);
  return data;
}