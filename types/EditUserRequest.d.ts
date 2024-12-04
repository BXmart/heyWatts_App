export type EditUserRequestI = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  cif: string;
  img?: string;
  organizationName?: string;
  organizationId?: string;
  type?: string;
  password?: string;
  user?: string;
  cif?: string;
  propertyByDefault?: {
    _id?: string;
  };
};

export type EditUserRequestHeaderI = {
  loggedUserId: string;
};
