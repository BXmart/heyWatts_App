import { getExternalCommunicationsByUserId } from '@/services/externalCommunication.service';
import useAuthStore from '@/stores/useAuthStore';
import { ExternalCommunicationI } from '@/types/ExternalCommunication';
import { useEffect, useState } from 'react';


export const useFetchExternalCommunications = () => {
  const [data, setData] = useState<ExternalCommunicationI>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getExternalCommunicationsByUserId(user!.user._id);
        console.log({ response })
        setData(response);
      } catch (error) {
        setIsLoading(false);
        setError(true);
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, []);

  return { data, isLoading, error };
};
