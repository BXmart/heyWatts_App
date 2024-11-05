export type NewPropertyRequestT = {
  name: string;
  description: string;
  user: unknown | { _id: string };
};
