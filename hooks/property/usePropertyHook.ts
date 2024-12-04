import { getCheckProperty, getPropertyDetailsById } from '@/services/properties.service';
import useAuthStore from '@/stores/useAuthStore';
import { INTERVAL_TIME, ROLES, URLS } from '@/utils/constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useProperty = () => {
  const { currentProperty, user } = useAuthStore()
  const [propertyDetailsData, setPropertyDetailsData] = useState();
  const [_isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState(false);
  const [isPropertyOwner, setIsPropertyOwner] = useState(false);


  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPropertyDetailsData();
    }, INTERVAL_TIME);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPropertyDetailsData = async () => {
    setIsLoading(true);
    try {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !currentProperty) return
        const data = await getCheckProperty({ userId: user.user._id, propertyId: currentProperty });
        setIsPropertyOwner(!!data);
      } catch (error) {
        console.warn(error);
      }
    }
    fetchData()
  }, [])


  // useEffect(() => {
  //   if (isPropertyOwner !== null && !isPropertyOwner && user?.user.type === ROLES.OWNER) {
  //     return router.navigate(URLS.APP_INDEX);
  //   }
  // }, [isPropertyOwner])


  useEffect(() => {
    if (propertyDetailsData == undefined) {
      reloadPropertyData()
    }
  }, [propertyDetailsData])




  return { propertyDetailsData, reloadPropertyData, isPropertyOwner };
};
