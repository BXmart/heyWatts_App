import { useState, useEffect, useCallback } from 'react';
import { getDashboardConsumptionAndPredictionGraph, getEnergyPricesByPropertyId } from "@/services/dashboard.service";
import moment from "moment";
import parseDashboardData, { DashboardData, GraphType, ParsedDataItem } from "@/components/dashboard/utils/parseDashboardData";
import { validatePathConfig } from '@react-navigation/native';

interface DashboardHookResult {
  parsedEnergyData: ParsedDataItem[];
  parsedEnergyPredictionData: ParsedDataItem[];
  parsedMoneyData: ParsedDataItem[];
  loading: boolean;
  initialDataLoaded: boolean;
  error: string | null;
  graphType: GraphType;
  fetchDashboardData: () => Promise<void>;
  setGraphType: (type: GraphType) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  propertyId: string | null;
  setPropertyId: (id: string | null) => void;
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
  const [currentDate, setCurrentDate] = useState<string>(moment().format('YYYY-MM-DD'));

  const fetchDashboardData = useCallback(async () => {

    if (!propertyId) return;

    console.log('Fetching dashboard data');
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
        getDashboardConsumptionAndPredictionGraph({ propertyId, date: formattedDate }),
        getEnergyPricesByPropertyId(propertyId, formattedDate)
      ]);

      if (!energyData || !moneyData) {
        throw new Error("No data received");
      }

      // Parse both types of data
      const parsedEnergyData = parseDashboardData(energyData, GraphType.Energy);
      const parsedMoneyData = parseDashboardData(energyData, GraphType.Money);

      console.log({ parsedEnergyData, parsedMoneyData });

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
      fetchDashboardData();
    }
  }, [fetchDashboardData, initialDataLoaded]);

  useEffect(() => {
    fetchDashboardData();
  }, [propertyId, currentDate]);

  const handleSetGraphType = useCallback((type: GraphType) => {
    setGraphType(type);
    if (!initialDataLoaded) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, initialDataLoaded]);

  return {
    parsedEnergyData,
    parsedEnergyPredictionData,
    parsedMoneyData,
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