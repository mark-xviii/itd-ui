import { ModalInterface } from './Modal.interface';
import './Modal.sass';

export default function Modal({ className, children, isShown, setIsShown, altAction, altButtonText }: ModalInterface) {
  return (
    <>
      {isShown
        ? () => {
            document.body.style.overflow = 'hidden';
            return;
          }
        : () => {
            document.body.style.overflow = '';
            return;
          }}
      {isShown && (
        <div className={`modal-container ${className ? className : ''}`}>
          <div className="modal-window">
            {children}
            <div className="modal-buttons">
              {altButtonText && (
                <button
                  onClick={() => {
                    console.log(altAction);
                    if (altAction) {
                      altAction();
                    }
                  }}
                  className="modal-button mb-alt"
                >
                  {altButtonText}
                </button>
              )}
              <button
                onClick={() => {
                  if (setIsShown) {
                    setIsShown(false);
                  }
                }}
                className="modal-button"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
