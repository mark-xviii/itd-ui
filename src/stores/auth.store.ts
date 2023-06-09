import { action, makeObservable, observable } from 'mobx';
import { createContext } from 'react';
import { Utils } from '../utils';

export class AuthStore {
  public accessToken: string | null = null;
  public role: 'Admin' | 'Common' | null = null;

  constructor() {
    makeObservable(this, {
      accessToken: observable,
      role: observable,
      setToken: action,
      signIn: action,
      signUp: action,
      signOut: action,
      setRole: action,
    });

    const _accessToken = localStorage.getItem('accessToken');

    // TODO: validate token

    if (_accessToken) {
      this.accessToken = _accessToken;

      this.testIdentity(_accessToken);
    } else {
      this.role = 'Common';
    }

    console.log(this.accessToken, _accessToken, this.role);
  }

  public setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  public setRole(role: 'Admin' | 'Common' | null) {
    this.role = role;
  }

  public async signIn(login: string, password: string) {
    const response = await fetch(`${Utils.Constants.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });

    if (response.status !== 201) {
      return false;
    }

    const result = (await response.json()) as { accessToken: string; role: 'Admin' | 'Common' };

    this.role = result.role;
    this.setToken(result.accessToken);

    return true;
  }

  public async testIdentity(accessToken: string) {
    const response = await fetch(`${Utils.Constants.API_URL}/auth/test-identity`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      this.role = 'Common';
    } else {
      const result = (await response.json()) as { id: string; login: string; role: 'Admin' | 'Common' };

      this.role = result.role;
    }
  }

  public async signUp(login: string, password: string, organizationTitle: string) {
    return await fetch(`${Utils.Constants.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: login,
        password: password,
        organizationTitle: organizationTitle,
      }),
    });
  }

  public signOut() {
    this.accessToken = null;
    this.role = null;
    localStorage.removeItem('accessToken');
  }
}

export const AuthContext = createContext<AuthStore>(new AuthStore());
