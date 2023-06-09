import { SessionsType } from './sessions.type';

export type UsersType = {
  id: string;
  login: string;
  organizationTitle: string;
  role: string;
  maxScoreRecord: number;
  sessions: SessionsType[];
  createdAt: string;
  updatedAt: string;
};
