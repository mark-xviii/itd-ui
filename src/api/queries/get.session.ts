import { Utils } from '../../utils';

export async function getMySession(accessToken: string) {
  return await fetch(`${Utils.Constants.API_URL}/sessions/my`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
