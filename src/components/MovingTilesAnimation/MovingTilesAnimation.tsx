import { MovingTilesAnimationInterface } from './MovingTilesAnimation.interface';
import './MovingTilesAnimation.sass';

export function MovingTilesAnimation({ className }: MovingTilesAnimationInterface) {
  return <div className={`mta ${className ? className : ''}`} />;
}
