import { create } from 'zustand';
import { API_URL } from "@/utils/constants";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import {
  AuthStore,
  RegisterData,
} from '@/types/auth';
import { UserContextT } from '@/types/UserContext';
import { getPagesPropertiesByUserId, putEditProperty } from '@/services/properties.service';
import { putEditUser } from '@/services/users.service';

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  error: null,
  currentProperty: null,
  currentPropertyObject: null,
  properties: null,
  setUserFirstTime: async (user: UserContextT) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        user: {
          ...state.user.user,
          firstTime: false
        }
      } : null
    }));
    const userJson = await SecureStore.getItemAsync('userInfo');
    if (userJson) {
      const user = JSON.parse(userJson) as UserContextT;
      user.user.firstTime = false;
      set({ user, token: user.token, isLoading: false, currentProperty: user!.user.propertyByDefault?._id ?? undefined });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
    } else {
      set({ isLoading: false });
    }
  },
  updateProperty: async (propertyId: string, payload: any) => {
    try {
      await putEditProperty(propertyId, payload);
    } catch (error) {
      console.warn(error);
    }
  },
  updateUserInfo: async (userId: string, payload: any) => {
    try {
      await putEditUser(userId, payload, { loggedUserId: userId });
    } catch (error) {
      console.warn(error);
    }
  },
  setCurrentProperty: async (propertyId: string) => {
    const properties = await getPagesPropertiesByUserId({ userId: get().user!.user._id, pageSize: '50' })
    if (properties) {
      set({ currentPropertyObject: properties.content.find((property: any) => property._id === propertyId) })
      set({ properties: properties.content })
    }
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
      const { data } = await axios.post(`${API_URL}/api/v1/web/login`, {
        username: email,
        password
      });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
      set({ user: data, token: data.token, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false
      });
    }
  },

  register: async (formData: RegisterData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post(
        API_URL.concat('/api/v1/web/register'),
        formData
      );
      if (data) {
        get().login(formData.email, formData.password);
      }
    } catch (error: any) {
      if (error?.response?.data?.code === 'GW0002') {
        set({
          error: error.response?.data?.message || 'Ya existe un usuario con este correo',
          isLoading: false
        });
        return {
          error: "Ya existe un usuario con este correo",
          data: null
        };
      } else {
        set({
          error: error.response?.data?.message || 'Registro fallido por algún motivo',
          isLoading: false
        });
        return {
          error: "Registro fallido por algún motivo",
          data: null
        };
      }
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userInfo');
    set({ user: null, token: null });
    router.replace('/sign-in');
  },
}));

export default useAuthStore