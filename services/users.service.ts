import { EditUserRequestHeaderI, EditUserRequestI } from "@/types/EditUserRequest";
import { NewUserRequestHeaderI, NewUserRequestI } from "@/types/NewUserRequest";
import { CifRequestI } from "@/types/PutCIFRequest";
import { API_URL } from "@/utils/constants";
import axios from "axios";


export async function getUsersList() {
  const { data } = await axios.get(API_URL.concat('/api/v1/web/users'));
  return data;
}

export async function getPagedUsers({
  pageNo,
  search,
  type,
  organizationId,
  pageSize,
}: {
  pageNo?: string | null;
  search?: string | null;
  type?: string | null;
  organizationId?: string | null;
  pageSize?: string | null;
}) {
  const url = new URL(API_URL.concat('/api/v1/web/pages/users'));
  !!pageNo && pageNo !== '0' && url.searchParams.append('pageNo', pageNo?.toString());
  !!search && search !== '' && url.searchParams.append('search', search?.toString());
  !!type && type !== '' && url.searchParams.append('type', type?.toString());
  !!organizationId && organizationId !== '' && url.searchParams.append('organizationId', organizationId?.toString());
  !!pageSize && pageSize !== '0' && url.searchParams.append('pageSize', pageSize?.toString());

  const { data } = await axios.get(url.href);
  return data;
}

export async function putUserCif(userId: string, body: CifRequestI) {
  const { data } = await axios.put(API_URL.concat(`/api/v1/web/user/${userId}/cif`), body);
  return data;
}

export async function getUserById(userId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/users/${userId}`));
  return data;
}

export async function getUserDetailsById(userId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/users/${userId}/details`));
  return data;
}

export async function postNewUser(body: NewUserRequestI, headers: NewUserRequestHeaderI) {
  const { data } = await axios.post(API_URL.concat('/api/v1/web/users'), body, { headers });
  return data;
}

export async function deleteUserById(userId: string) {
  const { data } = await axios.delete(API_URL.concat(`/api/v1/web/users/${userId}`));
  return data;
}

export async function putEditUser(userId: string, body: EditUserRequestI, headers: EditUserRequestHeaderI) {
  const { data } = await axios.put(API_URL.concat(`/api/v1/web/users/${userId}`), body, { headers });
  return data;
}

export async function getInstallerByOrganizationId(organizationId: string) {
  const { data } = await axios.get(API_URL.concat(`/api/v1/web/pages/users?pageNo=0&organizationId=${organizationId}&type=INSTALLER`));
  return data;
}
