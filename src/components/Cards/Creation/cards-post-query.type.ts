import { CardTypesEnum } from '../../../enums/card-types.enum';
import { OutcomeNestedType } from '../../../types/CardCreation.type';

export type CardsPostQueryType = {
  type: CardTypesEnum;
  text: string;
  yesText: string;
  noText: string;
  yesOutcome: OutcomeNestedType;
  noOutcome: OutcomeNestedType;
  characterId: string;
  sequenceId?: string | null;
};
