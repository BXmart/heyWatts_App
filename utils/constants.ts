/* export const IS_IN_PRODUCTION = import.meta.env.MODE === 'production'; */

export const API_URL =/*  IS_IN_PRODUCTION ? 'https://api.heywatts.es' : */ 'http://heywatts-core.heywatts.svc.cluster.local:8080';

export const ROLES = {
  OWNER: 'OWNER',
  INSTALLER: 'INSTALLER',
  ADMIN: 'ADMIN',
} as const;

export const URLS = {
  AI_TEST: '/home/ai_test',
  APP_INSTALLER_DASHBOARD: '/dashboard-installer',
  APP_ADMIN_DASHBOARD: '/dashboard-admin',
  APP_ACCEPT_TERMS: '/home/accept-terms',
  APP_ADMIN_APPROVALS: '/home/homerovals',
  APP_ADMIN_AUTH_DEVICES: '/home/devices',
  APP_ADMIN_DETAIL_APPROVALS: '/home/homerovals/:approvalId',
  APP_ADMIN_DETAIL_AUTH_DEVICE: '/home/devices/:authDeviceId',
  APP_ADMIN_DETAIL_USER: '/home/users/:userId',
  APP_ADMIN_EDIT_AUTH_DEVICE: '/home/devices/:authDeviceId/edit',
  APP_ADMIN_EDIT_USER: '/home/users/:userId/edit',
  APP_ADMIN_NEW_AUTH_DEVICE: '/home/devices/new',
  APP_ADMIN_NEW_USER: '/home/users/new',
  APP_ADMIN_USERS: '/home/users',
  APP_ADMIN_SCHEDULE_LOG: '/home/schedule-log',
  APP_ADMIN_FARES: '/home/fares',
  APP_ADMIN_NEW_FARE: '/home/fares/new',
  APP_ADMIN_EDIT_FARE: '/home/fares/:fareId/edit',
  APP_ADMIN_SUGGESTS: '/home/suggests',
  APP_ADMIN_DETAIL_PROPERTY_INVOICES: '/home/properties/:propertyId/invoices',
  APP_CHECKOUT_ERROR: '/home/checkout/error',
  APP_CHECKOUT_SUCCESS: '/home/checkout/success',
  APP_CHECKOUT: '/home/checkout',
  APP_DASHBOARD: '/home/dashboard',
  APP_INDEX: '/(home)',
  APP_INSTALLER_APPROVALS: '/home/my-approvals',
  APP_INSTALLER_DETAIL_APPROVAL: '/home/my-approvals/:approvalId',
  APP_INSTALLER_CLIENTS: '/home/clients',
  APP_INSTALLER_DETAIL_CLIENT: '/home/clients/:userId',
  APP_INSTALLER_EDIT_CLIENT: '/home/clients/:userId/edit',
  APP_INSTALLER_EDIT_PROPERTY: '/home/properties/:propertyId/edit',
  APP_INSTALLER_NEW_CLIENT: '/home/clients/new',
  APP_INSTALLER_NEW_PROPERTY: '/home/properties/new',
  APP_INSTALLER_NEW_DEVICE: '/home/properties/:propertyId/new-device',
  APP_INSTALLER_PROPERTIES: '/home/properties',
  APP_INSTALLER_PROPERTY_ALARMS: '/home/properties/:propertyId/alarms',
  APP_INSTALLER_PROPERTY_SETTINGS: '/home/properties/:propertyId/settings',
  APP_INSTALLER_DETAIL_PROPERTY: '/home/properties/:propertyId',
  APP_INSTALLER_SURVEY: '/home/installer-survey',
  APP_INSTALLER_RFQ: '/home/request-for-quotations',
  APP_INSTALLER_DETAIL_RFQ: '/home/request-for-quotations/:orderId',
  APP_INSTALLER_DETAIL_RFQ_DETAIL_PROPERTY: '/home/request-for-quotations/:orderId/:propertyId',
  APP_INSTALLER_INSTALLATIONS: '/home/installations',
  APP_INSTALLER_DETAIL_INSTALLATION: '/home/installations/:orderId',
  APP_INSTALLER_PLANTS: '/home/plants',
  APP_INSTALLER_CHAT: '/home/chat',
  APP_OWNER_DASHBOARD: '/dashboard-owner',
  APP_OWNER_PROPERTIES: '/home/my-properties',
  APP_OWNER_DETAIL_PROPERTY: '/home/my-properties/:propertyId',
  APP_OWNER_DETAIL_PROPERTY_NEW_SCHEDULE: '/home/my-properties/:propertyId/:deviceId/new-schedule',
  APP_OWNER_DETAIL_PROPERTY_EDIT_SCHEDULE: '/home/my-properties/:propertyId/:deviceId/:scheduleId/edit-schedule',
  APP_OWNER_PROPERTY_DETAIL_SCHEDULER: '/home/my-properties/:propertyId/scheduler',
  APP_OWNER_DETAIL_SCHEDULER_NEW: '/home/my-properties/:propertyId/scheduler/:deviceId/new-schedule',
  APP_OWNER_DETAIL_SCHEDULER_EDIT: '/home/my-properties/:propertyId/scheduler/:deviceId/:scheduleId/edit-schedule',
  APP_OWNER_DETAIL_PROPERTY_INVOICES: '/home/my-properties/:propertyId/invoices',
  APP_OWNER_PROPERTY_SETTINGS: '/home/my-properties/:propertyId/settings',
  APP_OWNER_PROPERTY_ALARMS: '/home/my-properties/:propertyId/alarms',
  APP_OWNER_NEW_DEVICE: '/home/my-properties/:propertyId/new-device',
  APP_OWNER_RFQ: '/home/my-request-for-quotations',
  APP_OWNER_DETAIL_RFQ: '/home/my-request-for-quotations/:RFQId',
  APP_OWNER_DETAIL_RFQ_ORDER: '/home/my-request-for-quotations/:RFQId/:orderId',
  APP_OWNER_INSTALLATIONS: '/home/my-installations',
  APP_OWNER_DETAIL_INSTALLATION: '/home/my-installations/:orderId',
  APP_OWNER_EDIT_PROPERTY: '/home/my-properties/:propertyId/edit',
  APP_OWNER_NEW_PROPERTY: '/home/my-properties/new',
  APP_OWNER_UNDERSTAND_BILL: '/understand-bill',
  APP_OWNER_PROPOSALS: '/home/proposals',
  APP_OWNER_DETAIL_PROPOSALS: '/home/proposals/:propertyId',
  APP_MAINTENANCE: '/home/maintenance',
  APP_NEW_PLANT: '/home/plants/new',
  APP_NOTIFICATIONS: '/home/notifications',
  APP_PRICING: '/home/pricing',
  APP_SETTINGS: '/home/settings',
  APP_SURVEY_SENT: '/home/survey/sent',
  APP_SURVEY: '/home/survey',
  APP_TOUR: '/home/tour',
  SIGN_IN: '/sign-in',
  PASSWORD_CHANGE_PASSWORD: '/password/change',
  PASSWORD_CHANGE_SEND_EMAIL: '/password/send-email',
  PASSWORD_NEW: '/password/new',
  PUBLIC_INSTALLER: '/installer',
  PUBLIC_LANDING: '/',
  REGISTER: '/register',
} as const;

export const ERR_CODES = {
  UNKNOWN: 'UNKNOWN',
  ERR_NETWORK: 'ERR_NETWORK',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_DIFF: 'PASSWORD_DIFF',
  PASSWORD_SHORT: 'PASSWORD_SHORT',
  INPUT_SHORT: 'INPUT_SHORT',
  PHONE_SHORT: 'PHONE_SHORT',
  INVALID_NUMBER: 'INVALID_NUMBER',
  REGISTER_INPUT_ERRORS: 'REGISTER_INPUT_ERRORS',
  EMPTY_FIELD: 'EMPTY_FIELD',
  EMPTY_DATE: 'EMPTY_DATE',
  TERMS_NEEDED: 'TERMS_NEEDED',
  NULL_SELECT: 'NULL_SELECT',
  SURVEY_DEVICE_ALREADY_EXISTS: 'SURVEY_DEVICE_ALREADY_EXISTS',
  DATE_ALREADY_EXISTS: 'DATE_ALREADY_EXISTS',
  ATTRIBUTE_CODE_EXISTS: 'ATTRIBUTE_CODE_EXISTS',
  GW0000: 'GW0000',
  VALIDATION_ERROR: 'GW0001',
  GW0002: 'GW0002', //USER_ALREADY_EXISTS
  NOT_VALID_TYPE: 'GW0003',
  ORGANIZATION_NEEDED: 'GW0004',
  '500L': '500L',
  LOADING_ERROR: 'LOADING_ERROR',
  REPEATED_PRIORITY: 'REPEATED_PRIORITY',
  INVALID_DNI: 'INVALID_DNI',
  DATADIS_NOT_FOUND: 'DATADIS_NOT_FOUND',
  DATADIS_NOT_FOUND_SUPPLIES: 'DATADIS_NOT_FOUND_SUPPLIES',
  DATADIS_NOT_ALLOWED_SUPPLIES: 'DATADIS_NOT_ALLOWED_SUPPLIES',
  EMPTY_NEEDED: 'EMPTY_NEEDED',
} as const;

export const HELP_CODES = {
  UNKNOWN: 'UNKNOWN',
  PASSWORD_MIN: 'PASSWORD_MIN',
  PASSWORD_EQUAL: 'PASSWORD_EQUAL',
} as const;

export const SUCCESS_CODES = {
  UNKNOWN: 'UNKNOWN',
  NEW_PASSWORD: 'NEW_PASSWORD',
  REGISTER_COMPLETE: 'REGISTER_COMPLETE',
  NEW_ELEMENT_SAVED: 'NEW_ELEMENT_SAVED',
  DELETED_ELEMENT: 'DELETED_ELEMENT',
  ORDER_COMPLETE: 'ORDER_COMPLETE',
  CHANGES_SAVED: 'CHANGES_SAVED',
} as const;

export const API_SELECTORS = {
  NO_API: '0',
  HUAWEI: '1',
  FRONIUS: '2',
  DATADIS: '3',
  BOTH: '4',
} as const;

export const INSTALLATIONS_STATUS = {
  PENDING: 'Pendiente',
  DELAYED: 'Cita retrasada',
  IN_PROCESS: 'En proceso',
  CANCELLED: 'Cancelada',
  AWAIT_EVALUATION: 'Pendiente de evaluación',
  FINISHED: 'Finalizado',
} as const;

export const TOKEN_EXPIRATION_TIME = 1000 * 60;