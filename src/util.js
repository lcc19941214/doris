const CONSTANT = {
  PROP_PATH_PATTERN: /[,./\\]/
};

// =================================
// Type check
// =================================

const isString = str => typeof str === 'string';

const isNumber = num => typeof num === 'number';

const isBool = bool => typeof bool === 'boolean';

const isArray = arr => {
  if (Array.isArray) {
    return Array.isArray(arr);
  } else {
    return arr instanceof Array;
  }
};

const isFunc = fn => typeof fn === 'function';

const isNull = val => val === null;

const isUndef = val => val === undefined;

const isObject = obj => !isNull(obj) && typeof obj === 'object';

const isEmptyObject = obj => {
  if (Object.hasOwnProperty('keys')) {
    return Object.keys(obj).length === 0;
  } else {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
};

const isNode = node => {
  return isObject(Node)
    ? node instanceof Node
    : !!(node && isObject(node) && isNumber(node.nodeType) && isString(node.nodeName));
};

const isElement = elem => {
  return isObject(HTMLElement)
    ? elem instanceof HTMLElement
    : !!(elem && isObject(elem) && elem.nodeType === 1 && isString(elem.nodeName));
};

// =================================
// Function
// =================================

function debounce(fn, wait) {
  var timer, context, args;

  var debounced = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    context = this;
    args = arguments;

    timer = setTimeout(function() {
      fn.apply(context, args);
    }, wait);
  };

  debounced.cancel = function() {
    clearTimeout(timer);
    timer = context = args = null;
  };

  return debounced;
}

function throttle(fn, wait) {
  var timer, context, args;

  var throttled = function() {
    if (!timer) {
      context = this;
      args = arguments;

      timer = setTimeout(function() {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };

  throttled.cancel = function() {
    clearTimeout(timer);
    timer = context = args = null;
  };

  return throttled;
}

function compose() {
  const fns = Array.from(arguments);
  return function() {
    const context = this;

    const args = Array.from(arguments);
    const result = fns.reduceRight((rst, fn, index, arr) => {
      return fn.apply(context, [].concat(rst));
    }, args);
    return result;
  };
}

function composeLeft() {
  const fns = Array.from(arguments);
  return compose.apply(undefined, fns.concat().reverse());
}

// =================================
// Object
// =================================

function getProp(target, path) {
  if (!isString(path) || !isObject(target)) return undefined;
  const arr = path.split(CONSTANT.PROP_PATH_PATTERN);

  let oTarget = target;
  for (const key of arr) {
    if (oTarget && oTarget.hasOwnProperty(key)) {
      oTarget = oTarget[key];
    } else {
      oTarget = undefined;
    }
  }
  return oTarget;
}

function setProp(target, path, val) {
  if (!isString(path) || !isObject(target)) return false;
  const arr = path.split(CONSTANT.PROP_PATH_PATTERN);

  let oTarget = target;
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    const isLast = arr.length - 1 === i;
    if (!oTarget.hasOwnProperty(key) || !isLast) {
      oTarget[key] = {};
    }
    oTarget = oTarget[key];
    if (isLast) {
      oTarget[key] = val;
    }
  }
  return true;
}

// =================================
// Query
// =================================

const query = {
  /**
   * stringify a query object
   * @param {object} obj
   * @param {boolean} hasPrefix
   * @return {string}
   * @example
   * stringify({ a: 1 }) => a=1
   * stringify({ a: '?' }, true) => ?%3F
   */
  stringify: (obj = {}, hasPrefix = false) => {
    const arr = [];
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      arr.push(`${key}=${encodeURIComponent(val)}`);
    });
    const str = arr.join('&');
    return hasPrefix ? `?${str}` : str;
  },

  /**
   * parse a query string to object
   * @param {string} str
   * @return {object}
   * @example
   * parse("?q=fetch+get&") => { q: "fetch+get" }
   */
  parse: (str = '') => {
    if (str.indexOf('?') === 0) {
      str = str.slice(1);
    }
    const arr = str.split('&');
    if (!arr.length) return;
    const obj = {};
    arr.forEach(v => {
      const [key, value] = v.split('=');
      obj[key] = decodeURIComponent(value);
    });
    return obj;
  }
};

export {
  isBool,
  isString,
  isNumber,
  isArray,
  isFunc,
  isNull,
  isUndef,
  isObject,
  isEmptyObject,
  isNode,
  isElement,
  debounce,
  throttle,
  compose,
  composeLeft,
  prop,
  setProp,
  query
};
