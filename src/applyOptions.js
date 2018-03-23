import { POST, RESPONSE_TYPE_JSON, POST_ENCODE_FORMDATA, POST_ENCODE_URLENCODE } from './const';
import { isBool, isNumber, isFunc, isUndef } from './util';

/**
 * Apply options to xhr
 * @param {XMLHttpRequest} xhr
 * @param {string} url
 * @param {string} method
 * @param {*} body
 * @param {*} options
 */
export default function applyOptions(xhr, url, method, body, options) {
  const { withCredentials, responseType, timeout } = options;

  // set withCredentials
  if (isBool(withCredentials)) {
    xhr.withCredentials = withCredentials;
  }

  // set responseType
  xhr.responseType = isUndef(responseType) ? RESPONSE_TYPE_JSON : responseType;

  // set headers
  let headers = options.headers || {};
  if (method === POST) {
    const enctype = body instanceof FormData ? POST_ENCODE_FORMDATA : POST_ENCODE_URLENCODE;

    headers = {
      'Content-Type': enctype,
      ...headers
    };
  }
  Object.keys(headers).forEach(header => {
    xhr.setRequestHeader(header, headers[header]);
  });

  // set timeout
  if (isNumber(timeout)) {
    xhr.timeout = timeout;
  }

  // bind handlers
  Object.keys(options).forEach(handler => {
    if (/^on[a-z]+$/.test(handler) && isFunc(options[handler])) {
      xhr.addEventListener(handler.slice(2), options[handler]);
    }
  });
}
