/**
 * Create XHR with compatibility
 */
export default function createXHR() {
  let xhr;
  if (XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return xhr;
}
