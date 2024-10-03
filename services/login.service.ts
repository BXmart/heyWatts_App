import { LoginT } from "../types/types";
import { API_URL } from "../utils/constants";


export async function postLogin(body: LoginT) {
  const data = await fetch(API_URL.concat('/api/v1/web/login'), {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
}

export async function postForgot(email: any) {
  const data = await fetch(API_URL.concat(`/api/v1/web/forgot?email=${email}`), {
    method: 'POST',
    body: JSON.stringify(email),
  });
  return data;
}

export async function postRecoverPassword({ token, password }: { token: any; password: any }) {
  const data = await fetch(API_URL.concat(`/api/v1/web/recover/${token}?password=${password}`), {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
  return data;
}
