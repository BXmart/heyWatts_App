import moment from 'moment';
import { useEffect, useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { getDashboardConsumptionAndPredictionGraph } from '@/services/dashboard.service';
import useAuthStore from '@/stores/useAuthStore';


export const useOwnerDashboard = () => {
  const [data, setData] = useState();
  const [graphData, setGraphData] = useState();
  const [showPredictions, setShowPredictions] = useState(false);
  const [calendarLimits, setCalendarLimits] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [historicalDates, setHistoricalDates] = useState<string[]>([]);

  const { userInfo } = useAuthStore();
  const propertyId = useGlobalSearchParams();

  /*  useEffect(() => {
     const intervalId = setInterval(() => {
       if (firstLoad) {
         setFirstLoad(false);
       } else {
         getData();
       }
     }, 120000);
     return () => clearInterval(intervalId);
   }, []); */

  /*   useEffect(() => {
      getHistoricalDates();
    }, []); */

  useEffect(() => {
    if (!!calendarLimits.length && calendarLimits[0]) {
      setCurrentDate(calendarLimits[0]);
    }
  }, [calendarLimits]);
  /* 
    const getData = async () => {
      setIsLoading(true);
      try {
        if (!!propertyId && (userInfo.user.propertyByDefault?._id === null || userInfo.user.propertyByDefault?._id === undefined || userInfo.user.propertyByDefault?._id === '')) {
          return;
        } else {
          const ownerDashboard = await getOwnerDashboard(propertyId ? propertyId : !!userInfo.user.propertyByDefault?._id ? userInfo.user.propertyByDefault?._id : '');
          setData(ownerDashboard);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    }; */

  /*  const getHistoricalDates = async () => {
     setIsLoading(true);
     try {
       if (!!propertyId && (userInfo.user.propertyByDefault?._id === null || userInfo.user.propertyByDefault?._id === undefined || userInfo.user.propertyByDefault?._id === '')) {
         return;
       } else {
         const dates = await getDatesDayHistorical(propertyId ? propertyId : !!userInfo.user.propertyByDefault?._id ? userInfo.user.propertyByDefault?._id : '');
         if (!!dates.length) {
           setHistoricalDates(dates);
           setCalendarLimits([dates[0], dates[dates.length - 1]]);
         }
       }
     } catch (error) {
       setIsLoading(false);
       setError(true);
       console.warn(error);
     } finally {
       setIsLoading(false);
     }
   }; */

  /*   const getConsumGraphDateData = async (date: string) => {
      setIsLoading(true);
  
      const formattedDate = moment(date)
        .set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .format('YYYY-MM-DD HH:mm:ss');
  
      try {
        if (!!propertyId && (userInfo.user.propertyByDefault?._id === null || userInfo.user.propertyByDefault?._id === undefined || userInfo.user.propertyByDefault?._id === '')) {
          return;
        } else {
          const id = propertyId ? propertyId : !!userInfo.user.propertyByDefault?._id ? userInfo.user.propertyByDefault?._id : '';
          const response = await getDashboardConsumptionGraphByDate({ propertyId: id, date: formattedDate });
          setConsumGraphDateData(response);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    }; */

  const getConsumptionAndPredictionGraphDateData = async (date: string) => {
    setIsLoading(true);

    const formattedDate = moment(date)
      .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .format('YYYY-MM-DD HH:mm:ss');

    try {
      if (!!propertyId) {
        return;
      } else {
        const response = await getDashboardConsumptionAndPredictionGraph({ propertyId, date: formattedDate });
        setGraphData(response);
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* const postRecalculateHistoric = async () => {
    setIsLoading(true);
    try {
      if (!!propertyId && (userInfo.user.propertyByDefault?._id === null || userInfo.user.propertyByDefault?._id === undefined || userInfo.user.propertyByDefault?._id === '')) {
        return;
      } else {
        await postRecalculateHistoricPrice({
          propertyId: propertyId ? propertyId : !!userInfo.user.propertyByDefault?._id ? userInfo.user.propertyByDefault?._id : '',
          date: currentDate,
        });
        getConsumptionAndPredictionGraphDateData(currentDate || '');
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }; */

  const handleChangeGraphDate = (date: string) => {
    setCurrentDate(date);
    getConsumptionAndPredictionGraphDateData(date || '');
  };

  /* const handleRecalculate = () => {
    postRecalculateHistoric();
  }; */

  return { data, graphData, calendarLimits, isLoading, handleChangeGraphDate, /* handleRecalculate, */ currentDate, setCurrentDate, setCalendarLimits, showPredictions, setShowPredictions, historicalDates };
};
