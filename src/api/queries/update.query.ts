import { Utils } from '../../utils';

export async function updateQuery(url: string, body: any, accessToken: string) {
  return fetch(`${Utils.Constants.API_URL}/${url}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
}
