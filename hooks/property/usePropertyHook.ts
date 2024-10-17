import { getPropertyDetailsById } from '@/services/properties.service';
import useAuthStore from '@/stores/useAuthStore';
import { INTERVAL_TIME } from '@/utils/constants';
import { useEffect, useState } from 'react';

export const useProperty = () => {
  const { currentProperty } = useAuthStore()
  const [propertyDetailsData, setPropertyDetailsData] = useState();
  const [_isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState(false);


  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPropertyDetailsData();
    }, INTERVAL_TIME);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPropertyDetailsData = async () => {
    setIsLoading(true);
    try {
      console.log({ currentProperty })
      if (currentProperty === undefined || currentProperty === null) {
        return null;
      } else {
        const response = await getPropertyDetailsById(currentProperty);
        setPropertyDetailsData(response);
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadPropertyData = () => {
    fetchPropertyDetailsData();
  };

  return { propertyDetailsData, reloadPropertyData };
};
