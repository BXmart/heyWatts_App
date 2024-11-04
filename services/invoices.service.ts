import { API_URL } from "@/utils/constants";
import axios from "axios";


export async function getInvoices(propertyId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/property/${propertyId}/propertyInvoices`));
  const { data } = await axios.get(url.href);
  return data;
}

export async function getPropertyInvoiceById(propertyInvoiceId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}`));
  const { data } = await axios.get(url.href);
  return data;
}

export async function postInvoice({ body, propertyId, token, startDay, invoiceDuration }: { body: any; propertyId: string; token: string; startDay?: number; invoiceDuration?: number }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyId}`));
  if (startDay) {
    url.searchParams.append('startDay', startDay.toString());
  }
  if (invoiceDuration) {
    url.searchParams.append('invoiceDuration', invoiceDuration.toString());
  }
  const { data } = await axios.post(url.href, body, { headers: { Authorization: bearerToken } });
  return data;
}

export async function putInvoice({ body, propertyInvoiceId, token, startDay, invoiceDuration }: { body: any; propertyInvoiceId: string; token: string; startDay?: number; invoiceDuration?: number }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}`));
  if (startDay) {
    url.searchParams.append('startDay', startDay.toString());
  }
  if (invoiceDuration) {
    url.searchParams.append('invoiceDuration', invoiceDuration.toString());
  }
  const { data } = await axios.put(url.href, body, { headers: { Authorization: bearerToken } });
  return data;
}

export async function getInvoiceFile(propertyInvoiceId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}/doc`));
  const { data } = await axios.get(url.href);
  return data;
}

export async function postInvoiceFile({ body, propertyInvoiceId, token }: { body: any; propertyInvoiceId: string; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}/doc`));
  const { data } = await axios.post(url.href, body, { headers: { Authorization: bearerToken } });
  return data;
}

export async function putInvoiceFile({ body, propertyInvoiceId, token }: { body: any; propertyInvoiceId: string; token: string }) {
  if (token === undefined || token === null || token.length === 0) return;
  const bearerToken = 'Bearer ' + token;
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}/doc`));
  const { data } = await axios.put(url.href, body, { headers: { Authorization: bearerToken } });
  return data;
}

export async function deleteInvoiceById(propertyInvoiceId: string) {
  const url = new URL(API_URL.concat(`/api/v1/web/propertyInvoices/${propertyInvoiceId}`));
  const { data } = await axios.delete(url.href);
  return data;
}
