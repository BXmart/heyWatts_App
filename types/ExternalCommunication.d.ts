import { OrganizationI } from '.';

export interface ExternalCommunicationI {
  externalCommunicationId?: number;
  _id?: string;
  user: ExternalCommunicationUserI;
  huaweiUserName?: string;
  huaweiUserPass?: string;
  huaweiV6UserName?: string;
  huaweiV6UserPass?: string;
  froniusUserName?: string;
  froniusUserPass?: string;
  accessKeyId?: string;
  accessKeyValue?: string;
  availableApi?: number;
}

export interface ExternalCommunicationUserI {
  _id: string;
  organization?: OrganizationI;
  email?: string;
  name?: string;
  surname?: string;
  cif?: string;
  img?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}
