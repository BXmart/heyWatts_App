import React, { createContext, useContext } from "react";
import { OwnerDashboardI, EnergyDayPriceI } from "@/types/OwnerDashboard";
import { PropertyI } from "..";

export interface PagedPropertiesResponseI {
  content: PropertyI[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface Property {
  id: string;
  value: string;
  label: string;
}

export interface TabsContextType {
  dashboardData: OwnerDashboardI | null;
  consumptionData: EnergyDayPriceI[];
  properties: PagedPropertiesResponseI | undefined;
  marketPrices: any[]; // Considera reemplazar 'any' con un tipo más específico si es posible
  compensationPrices: any[]; // Considera reemplazar 'any' con un tipo más específico si es posible
  propertiesList: Property[];
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProviderProps {
  children: React.ReactNode;
  value: TabsContextType;
}

export const TabsProvider: React.FC<TabsProviderProps> = ({ children, value }) => <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (context === null) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
};
