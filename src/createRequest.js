import { GET, STATE_DONE, STATUS_SUCCESS, STATUS_CLIENT } from './const';
import { isString } from './util';
import createXHR from './createXHR';
import applyOptions from './applyOptions';
import parseRequest from './parseRequest';
import parseResponse from './parseResponse';

/**
 * Handler for `onreadystatechange`.
 * @param {XMLHttpRequest} xhr
 * @param {function} resolve
 * @param {function} reject
 */
function handleReadyStateChange(xhr, options, resolve, reject) {
  return function() {
    if (xhr.readyState === STATE_DONE) {
      let handler;
      if (xhr.status >= STATUS_SUCCESS && xhr.status < STATUS_CLIENT) {
        handler = resolve;
      } else {
        handler = reject;
      }
      handler(parseResponse(xhr, options));
    }
  };
}

/**
 * Create request
 * @param {object}    config
 * @param {string}    config.method
 * @param {string}    config.url
 * @param {null|object|FormData} config.data
 * @param {function}  config.onXXX
 * @param {boolean}   config.withCredentials
 * @param {number}    config.timeout
 * @param {object}    config.headers
 * @param {string}    config.responseType
 * @param {function}  config.transform
 */
export default function createRequest(config) {
  let { method = GET, url, data, ...options } = config;
  if (!url || !isString(url)) return;

  method = method.toUpperCase();

  const parsedRequest = parseRequest({ method, url, data, ...options });
  const body = parsedRequest.body;
  url = parsedRequest.url;

  const xhr = createXHR();

  /**
   * NOTICE:
   * when using `setRequestHeader`, state of xhr must be OPENED
   */
  xhr.open(method, url, true);
  applyOptions(xhr, url, method, body, options);

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = handleReadyStateChange(xhr, options, resolve, reject);
    xhr.send(body);
  });
}

export function createAlias(method) {
  return function(url, data, options) {
    return createRequest({ ...options, method, url, data });
  };
}
