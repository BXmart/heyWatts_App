import { create } from 'zustand';
import { API_URL } from "@/utils/constants";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { UserContextT } from "@/types/UserContext";
import { router } from "expo-router";
import { z } from 'zod';

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

interface AuthStore {
  userInfo: UserContextT | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  token: string | null;
  resetStore: () => void;
  initialize: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (formData: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
}

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  success: false,
  token: null
};

const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,
  resetStore: () => {
    set({ loading: false, success: false, error: null });
  },
  initialize: async () => {
    try {
      set({ loading: true });
      const userJson = await SecureStore.getItemAsync('userInfo');

      if (userJson) {
        const parsedUser = JSON.parse(userJson) as UserContextT;
        if (parsedUser.user.propertyByDefault?._id) {
        }
        set({ userInfo: parsedUser });
      }

      set({ loading: false });
    } catch (error) {
      console.error('Error initializing auth store:', error);
      set({ loading: false, error: 'Failed to initialize auth store' });
    }
  },
  login: async ({ email, password }) => {
    set({ loading: true });
    try {

      console.log(`${API_URL}/api/v1/web/login`)
      console.log({ email, password })
      const { data: loginResponse } = await axios.post(`${API_URL}/api/v1/web/login`, {
        username: email,
        password,
      });

      await SecureStore.setItemAsync('userInfo', JSON.stringify(loginResponse));

      set({
        error: null,
        success: true,
        userInfo: loginResponse
      });

      return { error: false, ...loginResponse };
    } catch (error: any) {
      set({
        success: false,
        error: error?.response?.data?.message || error.message
      });

      return { error: error?.response?.data?.message || error.message };
    } finally {
      set({ loading: false });
    }
  },
  register: async (formData: RegisterData) => {
    try {
      set({ loading: true });

      RegisterSchema.parse(formData);

      const { data: registerData } = await axios.post(
        `${API_URL}/api/v1/web/register`,
        formData
      );

      set({ error: null, success: true });

      return { error: false, ...registerData };
    } catch (error: any) {

      let errorMessage = '';

      if (error instanceof z.ZodError) {
        errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({
        success: false,
        error: errorMessage
      });

      return {
        error: true,
        message:
          errorMessage ||
          "An error occurred during registration",
      };
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userInfo');
    set(initialState);
  }
}));

export default useAuthStore;