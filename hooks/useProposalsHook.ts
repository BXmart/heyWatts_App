import { getCheckProperty, getPropertyDetailsById } from '@/services/properties.service';
import { getProposalByPropertyId } from '@/services/proposal.service';
import useAuthStore from '@/stores/useAuthStore';
import { PagedProposalsI } from '@/types/PagedProposals';
import { ProposalI } from '@/types/Proposal';
import { INTERVAL_TIME, ROLES, URLS } from '@/utils/constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useProposals = () => {
  const { currentProperty, user } = useAuthStore()
  const [proposalData, setProposalData] = useState<PagedProposalsI>();
  const [_isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState(false);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);
  const [batteriesProposals, setBatteriesProposals] = useState<ProposalI[]>([]);
  const [photovoltaicProposals, setPhotovoltaicProposals] = useState<ProposalI[]>([]);
  const [feesProposals, setFeesProposals] = useState<ProposalI[]>([]);
  const [powersProposals, setPowersProposals] = useState<ProposalI[]>([]);
  const [combinedProposals, setCombinedProposals] = useState<ProposalI[]>([]);

  const fetchProposalData = async () => {
    setIsLoading(true);
    try {
      if (currentProperty === undefined || currentProperty === null || user === undefined) {
        return null;
      } else {
        console.log(user!.token)
        const response = await getProposalByPropertyId(currentProperty, user!.token);
        if (response) {
          const filteredData = response.filter((proposal) => proposal.property?._id === currentProperty);
          const batteriesProposalsArray = filteredData.filter((proposal) => proposal.category === "batteries");
          const photovoltaicProposalsArray = filteredData.filter((proposal) => proposal.category === "inverter");
          const feesProposalsArray = filteredData.filter((proposal) => proposal.category === "fees");
          const powersProposalsArray = filteredData.filter((proposal) => proposal.category === "powers");
          const combinedProposalsArray = filteredData.filter((proposal) => proposal.category.includes("_"));

          setBatteriesProposals(batteriesProposalsArray);
          setPhotovoltaicProposals(photovoltaicProposalsArray);
          setFeesProposals(feesProposalsArray);
          setPowersProposals(powersProposalsArray);
          setCombinedProposals(combinedProposalsArray);
        }
        setProposalData(response);
      }
    } catch (error) {
      setIsLoading(false);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposalData()
  }, [])

  return {
    proposalData,
    openDeviceModal,
    batteriesProposals,
    photovoltaicProposals,
    feesProposals,
    powersProposals,
    combinedProposals
  };
};
