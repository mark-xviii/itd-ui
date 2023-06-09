import { CSSProperties } from 'react';
import { CardsType } from '../../types/cards.type';
import { CharactersType } from '../../types/characters.type';

export interface DraggableCardInterface {
  fillerUrl?: string;
  character?: CharactersType;
  card?: CardsType;
  onMouseUp?: any;
  onMouseDown?: any;
  onMouseMove?: any;
  style?: CSSProperties | undefined;
}
