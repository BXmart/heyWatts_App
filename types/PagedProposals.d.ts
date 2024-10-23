import { ProposalI } from '.';

export interface PagedProposalsI {
  content: ProposalI[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}