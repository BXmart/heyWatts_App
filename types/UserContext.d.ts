import { OrganizationI } from '.';

export type RolesType = (typeof ROLES)[keyof typeof ROLES];

export type UserContextT = {
  token: string;
  user: {
    _id: string;
    organization: OrganizationI | null;
    type: RolesType;
    isAuthenticated: boolean;
    name: string;
    surname: string;
    email: string;
    img: string;
    firstTime: boolean;
    surveyFilledOut: boolean;
    termsAccepted: boolean;
    subscription: string;
    propertyByDefault: {
      _id?: string;
      name?: string;
      cif?: string;
      description?: string;
      longitude?: string;
      latitude?: string;
      additionalAddress?: string;
    } | null;
  };
};
