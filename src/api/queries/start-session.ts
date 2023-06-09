import { Utils } from '../../utils';

export async function startSession(accessToken: string) {
  return await fetch(`${Utils.Constants.API_URL}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SESSIONS}/start`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
