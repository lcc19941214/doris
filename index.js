import { GET, POST, STATE_DONE, STATUS_SUCCESS, STATUS_CLIENT, RESPONSE_TYPE_JSON } from './const';
import { isBool, isString, isObject, isNumber, isFunc, query, isUndef } from './util';

/**
 * Create XHR with compatibility
 */
function createXHR() {
  let xhr;
  if (XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return xhr;
}

/**
 * Parse response result from xhr
 * @param {XMLHttpRequest} xhr
 * @param {*} options
 */
function parseResponse(xhr, options) {
  const { status, responseType, response } = xhr;
  const body = response;

  return {
    status,
    body,
    raw: xhr
  };
}

/**
 * Apply options to xhr
 * @param {XMLHttpRequest} xhr
 * @param {string} method
 * @param {*} options
 * @param {*} internalOptions
 */
function applyOptions(xhr, method, options, internalOptions) {
  const { withCredentials, responseType, timeout, onTimeout } = options;
  const { urlencoded } = internalOptions;

  // set withCredentials
  if (isBool(withCredentials)) {
    xhr.withCredentials = withCredentials;
  }

  // set responseType
  xhr.responseType = isUndef(responseType) ? RESPONSE_TYPE_JSON : responseType;

  // set headers
  let headers = options.headers || {};
  if (method === POST && urlencoded) {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
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

  // set onTimeout
  if (isFunc(onTimeout)) {
    xhr.onTimeout = onTimeout;
  }
}

/**
 * Handler for `onreadystatechange`.
 * @param {XMLHttpRequest} xhr
 * @param {function} resolve
 * @param {function} reject
 */
function handleReadyStateChange(xhr, options, resolve, reject) {
  return function(event) {
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
 * @param {*} config
 */
function createRequest(config) {
  const { method, url, data, ...options } = config;
  if (!url || !isString(url)) return;

  let $method = method.toUpperCase();
  let $url = url;
  let body = null;
  const internalOptions = {};

  switch ($method) {
    case POST:
      if (data instanceof FormData) {
        body = data;
      } else if (isObject(data)) {
        body = query.stringify(data);
        internalOptions.urlencoded = true;
      }
      break;
    case GET:
    default:
      if (data && isObject(data)) {
        $url = `${url}${query.stringify(data, true)}`;
      }
      break;
  }

  const xhr = createXHR();

  /**
   * when using `setRequestHeader`, state of xhr must be OPENED
   */
  xhr.open($method, $url, true);
  applyOptions(xhr, $method, options, internalOptions);

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = handleReadyStateChange(xhr, options, resolve, reject);
    xhr.send(body);
  });
}

function createAlias(method) {
  return function createRequestWithAlias(url, data, options) {
    return createRequest({ ...options, method, url, data });
  };
}

const get = createAlias(GET);
const post = createAlias(POST);
const create = createRequest;

export { get, post, create };
