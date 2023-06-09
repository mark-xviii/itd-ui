import './Card.sass';
import { CardInterface } from './Card.interface';

export function Card({ imageURL, characterName }: CardInterface) {
  return (
    <div className="card-container">
      <img className="card-image" src={imageURL} alt="card" />
      <div className="card-plaque">
        <p className="card-character-name">{characterName}</p>
      </div>
    </div>
  );
}
