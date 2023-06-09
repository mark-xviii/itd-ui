import './FlowAnimation.sass';
import CoffeeSVG from '../../assets/generic/coffee_clr.svg';
import MoneySVG from '../../assets/generic/money_clr.svg';
import PersonnelSVG from '../../assets/generic/personnel_clr.svg';
import ProjectsSVG from '../../assets/generic/projects_clr.svg';

export interface FlowAnimationInterface {
  className?: string;
}

export function FlowAnimation({ className }: FlowAnimationInterface) {
  return (
    <div className={`fa-wrap ${className ? className : ''}`}>
      <img className="fa-svg" src={CoffeeSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={MoneySVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={PersonnelSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={ProjectsSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={CoffeeSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={MoneySVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={PersonnelSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={ProjectsSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={CoffeeSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={MoneySVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={PersonnelSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={ProjectsSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={CoffeeSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={MoneySVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={PersonnelSVG.toString()} alt="svg-img" />
      <img className="fa-svg" src={ProjectsSVG.toString()} alt="svg-img" />
    </div>
  );
}
