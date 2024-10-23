import { API_URL } from "@/utils/constants";
import axios from "axios";


export async function getProposals({ pageNo, show, pageSize, token }: { pageNo?: string | null; show?: string | null; pageSize?: string | null; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/p/proposals`));
  !!pageNo && pageNo !== '0' && url.searchParams.append('pageNo', pageNo?.toString());
  !!pageSize && pageSize !== '0' && url.searchParams.append('pageSize', pageSize?.toString());
  !!show && url.searchParams.append('show', show?.toString());
  const { data } = await axios.get(url.href, { headers: { Authorization: bearerToken } });

  return data;
}

export async function getProposalByPropertyId(propertyId: string, token: string) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/propertiesDetails/${propertyId}/proposal`), { headers: { Authorization: bearerToken } });
  return data;
}

export async function patchShowProposal({ propertyId, proposalId, token }: { propertyId: string; proposalId: string; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const { data } = await axios.patch(API_URL.concat(`/api/v1/web/propertiesDetails/${propertyId}/proposal/${proposalId}/update?show=false`), null, { headers: { Authorization: bearerToken } });
  return data;
}

export async function postProposal({ body, token }: { body: any; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const { data } = await axios.post(API_URL.concat(`/api/v1/web/proposal`), body, { headers: { Authorization: bearerToken } });
  return data;
}

export async function getPropertyHasCodefare(propertyId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/properties/${propertyId}/codeFare`));
  return data;
}
