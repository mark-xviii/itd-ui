import { Utils } from '../../utils';

export async function deleteQuery(url: string, accessToken: string) {
  return fetch(`${Utils.Constants.API_URL}/${url}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
