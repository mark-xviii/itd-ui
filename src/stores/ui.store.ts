import { makeAutoObservable } from 'mobx';

export class UIStore {
  public isOnAuth: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }
}
