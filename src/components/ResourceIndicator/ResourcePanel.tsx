import { ResourceIndicator } from './ResourceIndicator';

import CoffeeSVG from '../../assets/generic/coffee.svg';
import MoneySVG from '../../assets/generic/money.svg';
import PersonnelSVG from '../../assets/generic/personnel.svg';
import ProjectsSVG from '../../assets/generic/projects.svg';
import './ResourcePanel.sass';

export interface ResourcePanelInterface {
  coffee: number;
  money: number;
  personnel: number;
  customers: number;
  className?: string;
}

export function ResourcePanel({ coffee, money, personnel, customers, className }: ResourcePanelInterface) {
  return (
    <div className={`rip ${className ? className : ''}`}>
      <ResourceIndicator resourceValue={coffee} resourceColor="#a9907e">
        <img className="rip-icon" src={CoffeeSVG.toString()} alt="svg-img" />
      </ResourceIndicator>
      <ResourceIndicator resourceValue={money} resourceColor="#5dbb63">
        <img className="rip-icon" src={MoneySVG.toString()} alt="svg-img" />
      </ResourceIndicator>
      <ResourceIndicator resourceValue={personnel} resourceColor="#ffaaff">
        <img className="rip-icon" src={PersonnelSVG.toString()} alt="svg-img" />
      </ResourceIndicator>
      <ResourceIndicator resourceValue={customers} resourceColor="#A8CEE9">
        <img className="rip-icon" src={ProjectsSVG.toString()} alt="svg-img" />
      </ResourceIndicator>
    </div>
  );
}
