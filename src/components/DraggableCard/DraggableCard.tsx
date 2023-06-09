import { DraggableCardInterface } from './DraggableCard.interface';
import './DraggableCard.sass';

export function DraggableCard({ fillerUrl, character, card, style }: DraggableCardInterface) {
  return (
    <div className="dgc-over" style={style}>
      <div className="dgc-container">
        <div className="dgcc-wrap">
          {character &&
            card && [
              <img className="dgc-img" alt="dgc-img" src={character.imageLink} draggable={false} />,
              <div className="dgc-plaque">
                <b>{character.position}</b>
                <br />
                {character.name}
              </div>,
            ]}
          {fillerUrl && <img className="dgc-img" alt="dgc-img" src={fillerUrl} draggable={false} />}
        </div>
      </div>
    </div>
  );
}
