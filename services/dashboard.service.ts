import { API_URL } from "@/utils/constants";
import axios from "axios";

export interface InvoiceData {
  actual: Actual;
  prediction: Actual;
  comparative: Comparative;
}

export interface Actual {
  totalCost: number;
  energyTermCost: number;
  powerTermCost: number;
  incomeSurplus: number;
  energyConsumed: number;
  energySurplus: number;
  costPenalty: number;
  days: number;
}

export interface Comparative {
  energyKwActualCicle: number;
  energyKwLastCicle: number;
  costActualCicle: number;
  costLastCicle: number;
  energyKwActualWeek: number;
  energyKwLastWeek: number;
  costActualWeek: number;
  costLastWeek: number;
}

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

export async function getOwnerDashboard(propertyByDefaultId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyByDefaultId}/dashboard`));
  const { data } = await axios.get(url.href);
  return data;
}

export async function getOwnerInvoice(propertyId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyId}/dashboardCalculus`));
  const { data } = await axios.get(url.href);
  return data;
}