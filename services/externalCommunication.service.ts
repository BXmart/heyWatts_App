import { ExternalCommunicationI } from '@/types/ExternalCommunication';
import { API_URL } from '@/utils/constants';
import axios from 'axios';

export async function getExternalCommunicationsById(id: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/externalCommunications/${id}`));
  return data;
}

export async function getExternalCommunicationsByUserId(id: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/users/${id}/externalCommunications`));
  return data;
}

export async function postExternalCommunications(body: ExternalCommunicationI) {
  const { data } = await axios.post(API_URL.concat(`/api/v1/web/externalCommunications`), body);
  return data;
}

export async function putExternalCommunications(body: ExternalCommunicationI, userId: string) {
  const { data } = await axios.put(API_URL.concat(`/api/v1/web/externalCommunications`), body, { userId: userId });
  return data;
}