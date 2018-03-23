import { GET, POST } from './const';
import { isObject, query } from './util';

const BODY_INIT = [FormData, ArrayBuffer, Blob, URLSearchParams, ReadableStream];

export default function parseRequest({ method, data, url }) {
  let $url = url;
  let body = null;
  switch (method) {
    case POST:
      if (BODY_INIT.some(v => data instanceof v)) {
        body = data;
      } else if (isObject(data)) {
        try {
          body = query.stringify(data);
        } catch (error) {
          body = data;
        }
      }
      break;
    case GET:
      if (data && isObject(data)) {
        $url = `${url}${query.stringify(data, true)}`;
      }
      break;
    default:
  }
  return {
    url: $url,
    body
  };
}
