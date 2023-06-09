import Modal from '../../Modal/Modal';
import { ModalNextSelectorInterface } from './ModalNextSelector.interface';
import './ModalNextSelector.sass';

export function ModalNextSelector({ isShown, setIsShown }: ModalNextSelectorInterface) {
  return (
    <Modal isShown={isShown} setIsShown={setIsShown}>
      <div className="mns-container"></div>
    </Modal>
  );
}
