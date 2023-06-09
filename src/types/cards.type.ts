import { OutcomeNestedType } from './CardCreation.type';
import { CardTypesEnum } from '../enums/card-types.enum';
import { CharactersType } from './characters.type';
import { SequencesType } from './sequences.type';

export type CardsType = {
  id: string;
  type: CardTypesEnum;
  text: string;
  yesText: string;
  noText: string;
  yesOutcome: OutcomeNestedType;
  noOutcome: OutcomeNestedType;
  character: CharactersType;
  sequence: SequencesType;
  createdAt: string;
  updatedAt: string;
  nextCard: CardsType;
};
