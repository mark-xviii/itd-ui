import { Utils } from '../../utils';

export async function getMeQuery(accessToken: string) {
  return await fetch(`${Utils.Constants.API_URL}/${Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
