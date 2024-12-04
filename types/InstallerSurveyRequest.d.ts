export interface InstallerSurveyRequestI {
  approvedQC: boolean;
  atLeast1yearExp: boolean;
  atLeast3starsCSA: boolean;
  atLeast70RFQ: boolean;
  cif?: string;
  validCIF?: boolean;
  lessThan2daysCR: boolean;
  quoteResponseTimes: boolean;
  organizationDevice: InstallerSurveyOrganizationDevice[];
  fillLater?: boolean;
}

export interface InstallerSurveyOrganizationDevice {
  authorizedDevice: InstallerSurveyAuthorizedDevice;
  installationExp: number;
  operationArea: string;
  brandInstallationExp: number;
  installationAcceptance: boolean;
  lawOwnedCourse: boolean;
  deviceConnCourse: boolean;
}

export interface InstallerSurveyAuthorizedDevice {
  get_id: string;
}
