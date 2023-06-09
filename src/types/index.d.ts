declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';
declare module 'vanta/dist/vanta.halo.min' {
  const HALO: any;
  export default HALO;
}

export interface HaloParams {
  el: string;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  xOffset?: number;
  yOffset?: number;
  size?: number;
  backgroundColor?: string;
}

export interface HaloInstance {
  setOptions: ({
    el,
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
    size,
    xOffset,
    yOffset,
    backgroundColor,
  }: Omit<HaloParams, 'el'>) => void;
  resize: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    VANTA: {
      HALO: ({
        el,
        mouseControls,
        touchControls,
        gyroControls,
        minHeight,
        minWidth,
        size,
        xOffset,
        yOffset,
        backgroundColor,
      }: HaloParams) => HaloInstance;
    };
  }
}
