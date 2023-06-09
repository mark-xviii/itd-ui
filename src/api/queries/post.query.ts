import { Utils } from '../../utils';

export async function postQuery(url: string, object: object, accessToken?: string) {
  return await fetch(`${Utils.Constants.API_URL}/${url}`, {
    method: 'POST',
    body: JSON.stringify(object),
    headers: { 'Content-Type': 'application/json', ...(accessToken && { Authorization: `Bearer ${accessToken}` }) },
  });
}
