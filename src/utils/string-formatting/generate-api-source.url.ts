import { Utils } from '..';

export function generateApiSourceUrl(entityName: string) {
  return `${Utils.Constants.API_URL}/${entityName}`;
}
