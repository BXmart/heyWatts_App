import { Property } from "@/app/owner-survey";

export interface NewPropertyRequestT extends Property {
  user: { _id: string };
};
