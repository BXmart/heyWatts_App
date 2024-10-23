import { ProposalI } from "@/types/Proposal";
import { parseArrayToObj } from "@/utils/parseArrayToObj";

export interface InverterDetail {
  ROI: number;
  endDate: string;
  startDate: string;
  paybackYears: number;
  paybackMonths: number;
  eurosSaving: number | null;

  batteryCap: number | null;
  energySurplus: string | number | null;
  eurosSurplus: string | number | null;
  numPanels: number | null;
  picPowInv: number | null;
}

export const parseInverterDetails = (proposal: ProposalI): InverterDetail => {
  const tempData = proposal.details.split(";").map((item) => item.split(":"));
  let tempDetails;
  if (tempData && tempData.length > 0) {
    tempDetails = parseArrayToObj(tempData);
    return {
      ROI: tempDetails?.ROIPV ?? 0,
      endDate: tempDetails?.endDate ?? "",
      energySurplus: tempDetails?.energySurplus,
      eurosSurplus: tempDetails?.eurosSurplus,
      numPanels: tempDetails?.numPanels ?? 0,
      paybackYears: tempDetails?.paybackYearsINV ?? 0,
      picPowInv: tempDetails?.picPowInv ?? 0,
      paybackMonths: tempDetails?.remainingPaybackMonthsINV ?? 0,
      eurosSaving: tempDetails?.eurosSavingPV,
      startDate: tempDetails?.startDate ?? "",
      batteryCap: null,
    };
  }
  return { numPanels: 0, picPowInv: 0, eurosSaving: null, energySurplus: null, eurosSurplus: null, ROI: 0, startDate: "", endDate: "", paybackYears: 0, paybackMonths: 0, batteryCap: null };
};
