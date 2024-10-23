import { ProposalI } from "@/types/Proposal";
import { parseArrayToObj } from "@/utils/parseArrayToObj";


export interface PowersDetail {
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

  actualPows: number[];
  costPenalty: number;
  costPowChange: number;
  recommendedPowers: number[];
  subproposal: number;
}

export const parsePowersDetails = (proposal: ProposalI): PowersDetail => {
  const tempData = proposal.details.split(';').map((item) => item.split(':'));
  let tempDetails;
  if (tempData && tempData.length > 0) {
    tempDetails = parseArrayToObj(tempData);
    return {
      actualPows: tempDetails?.actualPows ? JSON.parse(tempDetails.actualPows.toString()) : [],
      ROI: tempDetails?.ROIPOWS ?? 0,
      costPenalty: tempDetails?.costPenalty ?? 0,
      costPowChange: tempDetails?.costPowChange ?? 0,
      endDate: tempDetails?.endDate ?? '',
      paybackYears: tempDetails?.paybackYearsPOWS ?? 0,
      paybackMonths: tempDetails?.paybackMonthPOWSs ?? 0,
      recommendedPowers: tempDetails?.recommendedPows ? JSON.parse(tempDetails.recommendedPows.toString()) : [],
      eurosSaving: tempDetails?.eurosSavingPOWS,
      startDate: tempDetails?.startDate ?? '',
      subproposal: tempDetails?.subproposal ? +tempDetails?.subproposal : 0,
      batteryCap: null,
      eurosSurplus: null,
      energySurplus: null,
      numPanels: null,
      picPowInv: null,
    };
  }
  return {
    actualPows: [],
    ROI: 0,
    costPenalty: 0,
    costPowChange: 0,
    endDate: '',
    paybackYears: 0,
    paybackMonths: 0,
    recommendedPowers: [],
    eurosSaving: null,
    startDate: '',
    subproposal: 0,
    batteryCap: null,
    eurosSurplus: null,
    energySurplus: null,
    numPanels: null,
    picPowInv: null,
  };
};
