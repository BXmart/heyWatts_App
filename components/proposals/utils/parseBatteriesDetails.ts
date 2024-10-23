import { ProposalI } from "@/types/Proposal";
import { parseArrayToObj } from "@/utils/parseArrayToObj";


export interface BatteryDetail {
  ROI: number;
  endDate: string;
  startDate: string;
  paybackYears: number;
  paybackMonths: number;
  eurosSaving: number | null;

  batteryCap: number | null,
  energySurplus: string | number | null;
  eurosSurplus: string | number | null;
  numPanels: number | null;
  picPowInv: number | null;

  costPenalty: number;
  costOpt: number;
}

export const parseBatteriesDetails = (proposal: ProposalI): BatteryDetail => {
  const tempData = proposal.details.split(';').map((item) => item.split(':'));
  let tempDetails;
  if (tempData && tempData.length > 0) {
    tempDetails = parseArrayToObj(tempData);
    return {
      ROI: tempDetails?.ROIBAT ?? 0,
      batteryCap: tempDetails?.batteryCap ?? 0,
      endDate: tempDetails?.endDate ?? '',
      paybackYears: tempDetails?.paybackYearsBAT ?? 0,
      paybackMonths: tempDetails?.paybackMonthsBAT ?? 0,
      eurosSaving: tempDetails?.eurosSavingBAT ?? null,
      startDate: tempDetails?.startDate ?? '',
      costPenalty: tempDetails?.costPenalty ?? 0,
      costOpt: tempDetails?.costOpt ?? 0,
      energySurplus: null,
      eurosSurplus: null,
      numPanels: null,
      picPowInv: null,
    };
  }
  return {
    ROI: 0,
    batteryCap: 0,
    endDate: '',
    paybackYears: 0,
    paybackMonths: 0,
    eurosSaving: null,
    startDate: '',
    costPenalty: 0,
    costOpt: 0,
    energySurplus: null,
    eurosSurplus: null,
    numPanels: null,
    picPowInv: null,
  };
};