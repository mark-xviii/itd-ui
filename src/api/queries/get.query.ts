import { Utils } from '../../utils';

export async function getQuery(url: string, accessToken?: string) {
  return await (
    await fetch(`${Utils.Constants.API_URL}/${url}`, {
      headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    })
  ).json();
}
