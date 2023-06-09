import { CardsType } from './cards.type';

export enum ChoiceSummaryEnum {
  FAILURE = 'Failure',
  VICTORY = 'Victory',
  CONTINUE = 'Continue',
  SEQUENCE_BEGINNING = 'Sequence beginning',
  SEQUENCE_END = 'Sequence end',
}

export type ChoiceResponseType = {
  type: ChoiceSummaryEnum;
  summary: string;
  resourceObject: {
    coffee: number;
    personnel: number;
    customers: number;
    money: number;
  };
  nextCard?: CardsType;
};
