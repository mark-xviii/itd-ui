import { CardTypesEnum } from '../../../enums/card-types.enum';

export interface ModalNextSelectorInterface {
  cardId?: string;
  cardType?: CardTypesEnum;
  sequenceId?: string;
  isShown: boolean;
  setIsShown: Function;
}
