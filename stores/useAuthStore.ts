import { create } from 'zustand';
import { API_URL } from "@/utils/constants";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { UserContextT } from "@/types/UserContext";
import { router } from "expo-router";
import { z } from 'zod';
import { PropertyI } from '@/app/(home)';

const RegisterSchema = z.object({
  nombre: z.string(),
  apellidos: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(["usuario", "instalador"]),
  organizacion: z.string().optional(),
});

export type RegisterData = z.infer<typeof RegisterSchema>;

interface RegisterSuccessResponse {
  userId: string;
  token: string;
  error: false;
}

interface RegisterErrorResponse {
  error: true;
  message: string;
}

interface LoginErrorResponse {
  error: true;
  message: string;
}

interface LoginSuccessResponse {
  data: UserContextT
}

type RegisterFunction = (
  nombre: string,
  apellidos: string,
  email: string,
  password: string,
  userType: "usuario" | "instalador",
  organizacion?: string
) => Promise<RegisterSuccessResponse | RegisterErrorResponse>;

interface AuthState {
  user: UserContextT | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  currentProperty: string | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentProperty: (propertyId: string) => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  error: null,
  loading: true,
  currentProperty: null,
  setCurrentProperty: (propertyId: string) => {
    set({ currentProperty: propertyId });
  },
  initialize: async () => {
    try {
      const userJson = await SecureStore.getItemAsync('userInfo');
      if (userJson) {
        const user = JSON.parse(userJson) as UserContextT;
        set({ user, token: user.token, isLoading: false, currentProperty: user!.user.propertyByDefault?._id ?? undefined });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to initialize auth', isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post(`${API_URL}/api/v1/web/login`, { username: email, password });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
      set({ user: data, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
    }
  },

  register: async (formData: RegisterData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post(`${API_URL}/api/v1/web/register`, formData);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
      set({ user: data, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userInfo');
    set({ user: null, token: null });
  },
}));

export default useAuthStore