import { ResourceIndicatorInterface } from './ResourceIndicator.interface';
import './ResourceIndicator.sass';

export function ResourceIndicator({ resourceValue, resourceColor, children }: ResourceIndicatorInterface) {
  return (
    <div className="ri">
      {children}
      <div
        className="ri-filler"
        style={{
          height: `${resourceValue > 100 ? 100 : resourceValue < 0 ? 0 : resourceValue}%`,
          background: `${resourceValue >= 100 ? '#ff0000' : resourceColor || '#ffaaff'}`,
        }}
      />
      <div
        className="ri-outfiller"
        style={{
          height: `${100 - resourceValue > 100 ? 100 : resourceValue < 0 ? 0 : 100 - resourceValue}%`,
          background: `${resourceValue <= 0 ? '#ff0000' : '#ffffff'}`,
        }}
      />
    </div>
  );
}
