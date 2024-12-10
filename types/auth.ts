import { Property } from "@/app/owner-survey";
import { UserContextT } from "@/types/UserContext";
import { z } from 'zod';

export enum UserTypes {
  USUARIO = 'OWNER',
  INSTALADOR = 'INSTALLER'
}

export const RegisterSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum([UserTypes.USUARIO, UserTypes.INSTALADOR]),
  organizacionName: z.string().optional(),
});

export type RegisterData = z.infer<typeof RegisterSchema>;

export interface RegisterSuccessResponse {
  userId: string;
  token: string;
  error: false;
}

export interface RegisterErrorResponse {
  error: true;
  message: string;
}

export interface LoginErrorResponse {
  error: true;
  message: string;
}

export interface LoginSuccessResponse {
  data: UserContextT;
}

export interface AuthState {
  user: UserContextT | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  currentProperty: string;
  currentPropertyObject: Property | null;
  properties: Property[] | null;
}

export interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  setCurrentProperty: (propertyId: string) => void;
  setUserFirstTime: (user: UserContextT) => void;
  updateProperty: (propertyId: string, payload: any) => void;
  updateUserInfo: (userId: string, payload: any) => void;
}

export type AuthStore = AuthState & AuthActions;