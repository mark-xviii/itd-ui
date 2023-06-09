import { CardsType } from './cards.type';

export type SequencesType = {
  id: string;
  name: string;
  description: string;
  length: string;
  cards: CardsType[];
  createdAt: string;
  updatedAt: string;
};
