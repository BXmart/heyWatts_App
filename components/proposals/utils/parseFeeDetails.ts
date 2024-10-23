import { ProposalI } from "@/types/Proposal";
import { parseArrayToObj } from "@/utils/parseArrayToObj";


export interface FeeDetail {
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

  codeFare: string;
  feeTypeOpt: number;
  peakAmountOPT: number;
  flatAmountOPT: number;
  valleyAmountOPT: number;
  peakAmountNO_OPT: number;
  flatAmountNO_OPT: number;
  valleyAmountNO_OPT: number;
  p1Amount: number;
  p2Amount: number;
  p3Amount: number;
  p4Amount: number;
  p5Amount: number;
  p6Amount: number;
  totalAmount: number;
  feeTypeNoOpt: number;
  costOpt: number;
  costNoOpt: number;
}

const parseAmountsOps = (details: any) => {

  const amountsOpt = details.amountsOpt && JSON.parse(details.amountsOpt);

  let peakAmountOPT = 0;
  let flatAmountOPT = 0;
  let valleyAmountOPT = 0;

  let p1Amount = 0;
  let p2Amount = 0;
  let p3Amount = 0;
  let p4Amount = 0;
  let p5Amount = 0;
  let p6Amount = 0;
  let totalAmount = 0;

  if (amountsOpt) {
    if (amountsOpt.length === 3) {
      peakAmountOPT = amountsOpt[0];
      flatAmountOPT = amountsOpt[1];
      valleyAmountOPT = amountsOpt[2];
    }

    if (amountsOpt.length === 2) {
      peakAmountOPT = amountsOpt[0];
      valleyAmountOPT = amountsOpt[1];
    }

    if (amountsOpt.length === 1) {
      totalAmount = amountsOpt[0];
    }

    if (amountsOpt.length === 6) {
      p1Amount = amountsOpt[0];
      p2Amount = amountsOpt[1];
      p3Amount = amountsOpt[2];
      p4Amount = amountsOpt[3];
      p5Amount = amountsOpt[4];
      p6Amount = amountsOpt[5];
    }


  }

  const amountsNoOpt = details.amountsNoOpt && JSON.parse(details.amountsNoOpt);
  let peakAmountNO_OPT = 0;
  let flatAmountNO_OPT = 0;
  let valleyAmountNO_OPT = 0;

  if (amountsNoOpt) {
    if (amountsNoOpt.length === 3) {
      peakAmountNO_OPT = amountsOpt[0];
      flatAmountNO_OPT = amountsOpt[1];
      valleyAmountNO_OPT = amountsOpt[2];
    }
  }

  return { peakAmountOPT, flatAmountOPT, valleyAmountOPT, p1Amount, p2Amount, p3Amount, p4Amount, p5Amount, p6Amount, totalAmount, peakAmountNO_OPT, flatAmountNO_OPT, valleyAmountNO_OPT };
}

export const parseFeesDetails = (proposal: ProposalI): FeeDetail => {
  const tempData = proposal.details.split(';').map((item) => item.split(':'));
  let tempDetails;
  if (tempData && tempData.length > 0) {
    tempDetails = parseArrayToObj(tempData);
    return {
      costOpt: tempDetails?.costOpt ?? 0,
      costNoOpt: tempDetails?.costNoOpt ?? 0,
      ROI: tempDetails?.ROIPOWS ?? 0,
      codeFare: tempDetails?.codeFare ?? '',
      endDate: tempDetails?.endDate ?? '',
      feeTypeOpt: tempDetails?.feeTypeOpt ? +tempDetails?.feeTypeOpt : 0,
      feeTypeNoOpt: tempDetails?.feeTypeNoOpt ? +tempDetails?.feeTypeNoOpt : 0,
      paybackYears: tempDetails?.paybackYearsFEES ?? 0,
      paybackMonths: tempDetails?.paybackMonthsFEES ?? 0,
      eurosSaving: tempDetails?.eurosSavingFEES ?? null,
      startDate: tempDetails?.startDate ?? '',
      energySurplus: null,
      eurosSurplus: null,
      numPanels: null,
      picPowInv: null,
      batteryCap: null,
      ...parseAmountsOps(tempDetails)
    };
  }
  return { codeFare: '', costOpt: 0, costNoOpt: 0, feeTypeOpt: 0, feeTypeNoOpt: 0, peakAmountOPT: 0, flatAmountOPT: 0, valleyAmountOPT: 0, ROI: 0, startDate: '', endDate: '', eurosSaving: null, paybackYears: 0, paybackMonths: 0, p1Amount: 0, p2Amount: 0, p3Amount: 0, p4Amount: 0, p5Amount: 0, p6Amount: 0, totalAmount: 0, peakAmountNO_OPT: 0, flatAmountNO_OPT: 0, valleyAmountNO_OPT: 0, energySurplus: null, eurosSurplus: null, numPanels: null, picPowInv: null, batteryCap: null };
};