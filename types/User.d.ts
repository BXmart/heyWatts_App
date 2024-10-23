import { OrganizationI } from '.';
export interface UserI {
  _id: string;
  organization: OrganizationI;
  email: string;
  name: string;
  surname: string;
  img: string;
  type: string;
  firstTime: boolean;
  surveyFilledOut: boolean;
  termsAccepted: true;
}