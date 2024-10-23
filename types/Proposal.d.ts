import { PropertyI } from '.';

export interface ProposalI {
  _id: string;
  proposalLines: ProposalLineI[];
  show: boolean;
  category: string;
  details: string;
  proposalType: number;
  preProposalEnergy: number;
  postProposalEnergy: number;
  preProposalInvoice: number;
  postProposalInvoice: number;
  property?: PropertyI;
  createdAt: string;
}

export interface ProposalLineI {
  _id: string;
  period: number;
  prePeriodEnergy: number;
  postPeriodEnergy: number;
  prePeriodInvoice: number;
  postPeriodInvoice: number;
}