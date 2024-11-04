import { getInvoices } from '@/services/invoices.service';
import { getCheckProperty, getPropertyDetailsById } from '@/services/properties.service';
import { getProposalByPropertyId } from '@/services/proposal.service';
import useAuthStore from '@/stores/useAuthStore';
import { PagedProposalsI } from '@/types/PagedProposals';
import { ProposalI } from '@/types/Proposal';
import { INTERVAL_TIME, ROLES, URLS } from '@/utils/constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useInvoices = () => {
  const { currentProperty, user } = useAuthStore()
  const [invoicesData, setInvoicesData] = useState<any>();
  const [_isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState(false);

  const fetchInvoicesData = async () => {
    setIsLoading(true);
    try {
      if (currentProperty === undefined || currentProperty === null || user === undefined) {
        return null;
      } else {
        const response = await getInvoices(currentProperty);
        if (response) {
          setInvoicesData(response);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesData()
  }, [])

  return {
    invoicesData
  };
};
