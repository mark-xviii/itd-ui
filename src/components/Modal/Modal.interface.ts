export interface ModalInterface {
  children: any;
  isShown: boolean;
  setIsShown: Function;
  altAction?: Function;
  altButtonText?: string;
  className?: string;
}
