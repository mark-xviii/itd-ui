import { Utils } from '../../utils';

export async function getOneQuery(entityName: string, id: string) {
  return await fetch(`${Utils.Constants.API_URL}/${entityName}/${id}`);
}
