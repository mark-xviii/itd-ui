import { Utils } from '../../utils';

export async function makeChoiceQuery(choice: 'Yes' | 'No', accessToken: string) {
  return await fetch(`${Utils.Constants.API_URL}/sessions/make-choice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ choice: choice }),
  });
}
