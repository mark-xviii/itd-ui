import { Utils } from '../../utils';

export async function postMultipartQuery(url: string, multipart: FormData, isUpdate?: boolean) {
  return await fetch(`${Utils.Constants.API_URL}/${url}`, {
    method: isUpdate ? 'PUT' : 'POST',
    body: multipart,
  });
}
