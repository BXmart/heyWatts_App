import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react';
import { getDashboardConsumptionAndPredictionGraph, getEnergyPricesByPropertyId } from "@/services/dashboard.service";
import moment from "moment";
import parseDashboardData, { DashboardData, GraphType, ParsedDataItem } from "@/components/dashboard/utils/parseDashboardData";
import { validatePathConfig } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ConsumptionGraphData } from '@/types/OwnerDashboard';

interface DashboardHookResult {
  parsedEnergyData: ParsedDataItem[];
  parsedEnergyPredictionData: ParsedDataItem[];
  parsedMoneyData: ParsedDataItem[];
  loading: boolean;
  initialDataLoaded: boolean;
  error: string | null;
  graphType: GraphType;
  fetchDashboardData: (proeprtyId: string) => Promise<void>;
  setGraphType: (type: GraphType) => void;
  currentDate: string;
  setCurrentDate: Dispatch<SetStateAction<string>>;
  propertyId: string | null;
  setPropertyId: (id: string | null) => void;
  originalEnergyData: DashboardData | null;
  originalMoneyData: DashboardData | null;
}

const useDashboard = (): DashboardHookResult => {
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [energyData, setEnergyData] = useState<DashboardData | null>(null);
  const [moneyData, setMoneyData] = useState<DashboardData | null>(null);
  const [parsedEnergyData, setParsedEnergyData] = useState<ParsedDataItem[]>([]);
  const [parsedEnergyPredictionData, setParsedEnergyPredictionData] = useState<ParsedDataItem[]>([]);
  const [parsedMoneyData, setParsedMoneyData] = useState<ParsedDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [graphType, setGraphType] = useState<GraphType>(GraphType.Money);
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchDashboardData = useCallback(async (propertyIdParam: string | null) => {
    const propertyIdVal = propertyIdParam || propertyId
    if (!propertyIdVal) return;
    setLoading(true);
    setError(null);

    try {

      const formattedDate = moment(currentDate)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .format('YYYY-MM-DD HH:mm:ss');

      const [energyData, moneyData] = await Promise.all([
        getDashboardConsumptionAndPredictionGraph({ propertyId: propertyIdVal, date: formattedDate }),
        getEnergyPricesByPropertyId(propertyIdVal, formattedDate)
      ]);

      if (!energyData || !moneyData) {
        throw new Error("No data received");
      }

      // Parse both types of data
      const parsedEnergyData = parseDashboardData(energyData, GraphType.Energy);
      const parsedMoneyData = parseDashboardData(energyData, GraphType.Money);

      console.log({ energyData })
      console.log({ moneyData })
      setEnergyData(energyData);
      setMoneyData(moneyData);
      setParsedEnergyData(parsedEnergyData.parsedData);
      setParsedEnergyPredictionData(parsedEnergyData.parsedPredictionData);
      setParsedMoneyData(parsedMoneyData.parsedData);
      setInitialDataLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!initialDataLoaded) {
      fetchDashboardData(propertyId);
    }
  }, [fetchDashboardData, initialDataLoaded]);

  useEffect(() => {
    if (propertyId) {
      fetchDashboardData(propertyId);
    }
  }, [propertyId, currentDate]);

  const handleSetGraphType = useCallback((type: GraphType) => {
    setGraphType(type);
    if (!initialDataLoaded) {
      fetchDashboardData(propertyId);
    }
  }, [fetchDashboardData, initialDataLoaded]);

  return {
    parsedEnergyData,
    parsedEnergyPredictionData,
    parsedMoneyData,
    originalEnergyData: energyData,
    originalMoneyData: moneyData,
    loading,
    initialDataLoaded,
    error,
    graphType,
    fetchDashboardData,
    setGraphType: handleSetGraphType,
    currentDate,
    setCurrentDate,
    propertyId,
    setPropertyId
  };
};

export default useDashboard;