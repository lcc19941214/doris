const equalization = val => val;

/**
 * Parse response result from xhr
 * @param {XMLHttpRequest} xhr
 * @param {*} options
 */
export default function parseResponse(xhr, options) {
  const { status, response } = xhr;
  const { transform = equalization } = options;
  const body = transform(response);

  return {
    status,
    body,
    raw: xhr
  };
}
