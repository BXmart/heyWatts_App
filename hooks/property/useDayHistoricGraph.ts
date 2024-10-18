import { useEffect, useState } from 'react';
import moment from 'moment';
import { getDatesDayHistorical, getDayHistorical } from '@/services/historical.service';
import { SelectOptions } from '@/types/SelectOptions';
import { fetchNewDayGraphData } from '@/lib/fetchNewDayGraphData';
import useAuthStore from '@/stores/useAuthStore';

const initialData = {
  productionCleanVat: [],
  positiveConsumption: [],
  negativeConsumption: [],
  consumptionBattery: [],
  experimentalTest: [],
  totalConsumption: [],
  historicDevices: [],
  listOfDays: [],
  lastDay: '',
};

export const useDayHistoricGraph = () => {
  const { currentProperty } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(initialData);
  const [availableDates, setAvailableDates] = useState<SelectOptions[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [availableHours, setAvailableHours] = useState<number[]>([]);

  const fetchData = async (day: string) => {
    try {
      setIsLoading(true);
      if (!!day && currentProperty) {
        const response = await fetchNewDayGraphData(getDayHistorical, currentProperty, day);
        if (response) {
          setData(response);
          // Extract available hours from the response
          const uniqueHours = new Set(
            Object.values(response.totalConsumption).map((item) => {
              const date = new Date(item[0]);
              return date.getHours()
            })
          );
          setAvailableHours(Array.from(uniqueHours).sort((a, b) => a - b));
        }
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGraphDates = async () => {
    try {
      if (!currentProperty) return;
      setIsLoading(true);
      const response = await getDatesDayHistorical(currentProperty);
      if (response) {
        const parseDates = response.map((item: string) => ({
          id: item,
          value: moment(item).format('yyyy-MM-DD HH:mm:ss'),
          label: moment(item).format('ll'),
        }));
        setAvailableDates(parseDates);
        setSelectedDay(parseDates[0].value);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphDates();
  }, []);

  useEffect(() => {
    fetchData(selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(selectedDay);
    }, 300000);
    return () => clearInterval(intervalId);
  }, [selectedDay]);

  return { data, isLoading, availableDates, selectedDay, setSelectedDay, availableHours };
};