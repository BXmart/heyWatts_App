import { NewPropertyRequestT } from "@/types/NewPropertyRequest";
import { API_URL } from "@/utils/constants";
import axios from "axios";

export async function getPropertyDetailsById(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/propertiesDetails/${propertyId}`));
  return data;
}

export async function getPagesPropertiesByUserId({ userId, pageNo, search, pageSize }: { userId: string, pageNo?: string | null, search?: string | null, pageSize?: string | null }) {
  const url = new URL(API_URL.concat(`/api/v1/web/pages/user/${userId}/properties`));
  !!pageNo && pageNo !== '0' && url.searchParams.append('pageNo', pageNo?.toString());
  !!search && search !== '0' && url.searchParams.append('search', search?.toString());
  !!pageSize && pageSize !== '0' && url.searchParams.append('pageSize', pageSize?.toString());

  const { data } = await axios.get(url.href);
  return data;
}

export async function putEditProperty(propertyId: string, body: any) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyId}`));
  const { data } = await axios.put(url.href, body);
  return data;
}

export async function getEnergyCompensationPricesByPropertyId(propertyId: string, date: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/properties/${propertyId}/prices`));
  url.searchParams.append('date', date);
  url.searchParams.append('compensation', 'true');
  const { data } = await axios.get(url.href);
  return data;
}


export async function getCheckProperty({ userId, propertyId }: { userId: string, propertyId: string }) {
  if (propertyId === '' || userId === '') {
    return;
  }
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/checkProperty/${userId}?propertyId=${propertyId}`));
  return data
}

export async function postNewProperty(body: NewPropertyRequestT) {
  const { data } = await axios.post(API_URL.concat('/api/v1/web/properties'), body);
  return data;
}