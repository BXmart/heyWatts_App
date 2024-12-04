import { InstallerSurveyRequestI } from "@/types/InstallerSurveyRequest";
import { API_URL } from "@/utils/constants";
import axios from "axios";


export async function postSurveyFilled(userId: string) {
  const { data } = await axios.post(API_URL.concat(`/api/v1/web/user/${userId}/surveyFilled`));
  return data;
}

export async function postApproval(userId: string, body: InstallerSurveyRequestI) {
  const { data } = await axios.post(API_URL.concat(`/api/v1/web/approvals?userId=${userId}`), body);
  return data;
}
