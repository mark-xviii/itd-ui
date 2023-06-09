import { CardsType } from './cards.type';
import { SequencesType } from './sequences.type';

export type SessionsType = {
  id: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  finishedAt: string;
  isFinished: boolean;
  turn: number;
  deckPosition: 0;
  coffee: number;
  personnel: number;
  money: number;
  customers: number;
  verdict: string;
  currentCard: CardsType;
  currentSequences: SequencesType;
};
