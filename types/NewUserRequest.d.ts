export type NewUserRequestI = {
  name: string;
  surname: string;
  email: string;
  organizationName?: string;
  type: string;
  password?: string;
  cif?: string;
};

export type NewUserRequestHeaderI = {
  userId: string;
};
