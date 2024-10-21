import { getDeviceById } from '@/services/device.service';
import useAuthStore from '@/stores/useAuthStore';
import moment from 'moment';
import { useEffect, useState } from 'react';


export const useDevice = (initialDevice: DeviceI) => {
  const [data, setData] = useState(initialDevice);
  const [historic, setHistoric] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const { user } = useAuthStore();

  const reloadDevice = () => {
    setReloadData(true);
  };

  const loadDevice = async () => {
    setIsLoading(true);
    try {
      const response = await getDeviceById(data._id);
      setData(response);
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };
  /* 
    const loadGraphDevice = async () => {
      // setIsLoading(true);
      try {
        const responseGraph = await getHistoricDeviceById({
          deviceId: data._id,
          token: user.token,
          code: 'DATA01',
          startDate: moment(new Date(Date.now() - 3600000 * 2)).format('yyyy-MM-DD HH:mm:ss'),
          // endDate: moment(new Date(Date.now())).format('yyyy-MM-DD HH:mm:ss'),
        });
  
        // Parse data
        const listOfDatesSet = new Set();
        const historicData: any = responseGraph
          .filter((item: HistoricDeviceGraphPointI) => {
            // const formattedDate = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
            // const formattedDate = moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
            return listOfDatesSet.has(item.createdAt) ? false : listOfDatesSet.add(item.createdAt);
          })
          .map((item: HistoricDeviceGraphPointI) => [moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), +item.value])
          .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  
        setHistoric(historicData);
      } catch (error) {
        // setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        // setIsLoading(false);
      }
    };
  
    const changeAuto = async (availability: number) => {
      setIsLoading(true);
      try {
        const response = await patchChangeAvailabilityMode(data._id, availability);
        setData(response);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Turn ON/OFF from onOff Devices
    const changePower = async (command: 'on' | 'off') => {
      setIsLoading(true);
      try {
        const response = await postPowerDevice(data._id, command);
        setData(response);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const changeCarCharger = async ({ command, current }: { command?: 'charge' | 'stop'; current?: number }) => {
      setIsLoading(true);
      try {
        const response = await postCarChargerDevice({ deviceId: data._id, command: command, current: current });
        setData(response);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const changeBattery = async ({ command, power }: { command?: string; power?: number }) => {
      setIsLoading(true);
      try {
        const response = await await postBatteryDevice({ deviceId: data._id, command: command, power: power ? power : null });
        setData(response);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (data.availability === 3 || data.availability === 1 || data.availability === 0) {
        try {
          loadGraphDevice();
        } catch (error) {
          setIsLoading(false);
          setError(true);
          console.warn(error);
        } finally {
          setIsLoading(false);
        }
      }
    }, [data.availability]);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        loadGraphDevice();
      }, INTERVAL_TIME);
      return () => clearInterval(intervalId);
    }, []);
  
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        reloadDeviceSecret()
      }, 30000);
      return () => clearInterval(intervalId);
    }, []);
  
    const reloadDeviceSecret = async () => {
      try {
        const response = await getDeviceById(data._id);
        setData(response);
      } catch (error) {
        setError(true);
        console.warn(error);
      }
    } */

  useEffect(() => {
    if (reloadData) {
      loadDevice();
      /* setReloadData(false); */
    }
  }, [reloadData]);

  return { deviceData: data, reloadDevice, /* changeAuto, changePower, changeCarCharger, changeBattery, */ isLoading, error, historic };
};
