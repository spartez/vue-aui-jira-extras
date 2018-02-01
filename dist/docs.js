'use strict';

/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "production" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "production" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "production" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {}
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {}
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {}
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

var queue = [];
var activatedChildren = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (props && hasOwn(props, key)) {
      
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {}
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {}
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.13';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {}
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */









// add a raw attr (use this in preTransforms)








// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    var mode = this.mode;

    // warn invalid mode
    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {}
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else {}
  }
  
}, 0);

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var vueAui = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e), i.l=!0, i.exports}var n={};return e.m=t, e.c=n, e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r});}, e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n), n}, e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}, e.p="./dist/", e(e.s=0)}({"+66z":function(t,e){function n(t){return i.call(t)}var r=Object.prototype,i=r.toString;t.exports=n;},"+E39":function(t,e,n){t.exports=!n("S82l")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});},"+ZMJ":function(t,e,n){var r=n("lOnJ");t.exports=function(t,e,n){if(r(t), void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)}}return function(){return t.apply(e,arguments)}};},"+gg+":function(t,e,n){var r=n("TQ3y"),i=r["__core-js_shared__"];t.exports=i;},"+tPU":function(t,e,n){n("xGkn");for(var r=n("7KvD"),i=n("hJx8"),o=n("/bQp"),a=n("dSzd")("toStringTag"),s="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<s.length;u++){var c=s[u],l=r[c],f=l&&l.prototype;f&&!f[a]&&i(f,a,c), o[c]=o.Array;}},"/GnY":function(t,e,n){function r(t){if(!i(t))return o(t);var e=[];for(var n in Object(t))s.call(t,n)&&"constructor"!=n&&e.push(n);return e}var i=n("HT7L"),o=n("W529"),a=Object.prototype,s=a.hasOwnProperty;t.exports=r;},"/I3N":function(t,e){function n(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}t.exports=n;},"/bQp":function(t,e){t.exports={};},"/n6Q":function(t,e,n){n("zQR9"), n("+tPU"), t.exports=n("Kh4W").f("iterator");},0:function(t,e,n){t.exports=n("sPfX");},"06OY":function(t,e,n){var r=n("3Eo+")("meta"),i=n("EqjI"),o=n("D2L2"),a=n("evD5").f,s=0,u=Object.isExtensible||function(){return!0},c=!n("S82l")(function(){return u(Object.preventExtensions({}))}),l=function(t){a(t,r,{value:{i:"O"+ ++s,w:{}}});},f=function(t,e){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!u(t))return"F";if(!e)return"E";l(t);}return t[r].i},p=function(t,e){if(!o(t,r)){if(!u(t))return!0;if(!e)return!1;l(t);}return t[r].w},d=function(t){return c&&v.NEED&&u(t)&&!o(t,r)&&l(t), t},v=t.exports={KEY:r,NEED:!1,fastKey:f,getWeak:p,onFreeze:d};},"0ZHD":function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,".aui-select2-container.select2-container.select2-allowclear .select2-choice abbr{display:block}","",{version:3,sources:["/Users/damian/vue-aui/src/components/select2/AuiSelect2Single.vue"],names:[],mappings:"AACA,iFACE,aAAe,CAChB",file:"AuiSelect2Single.vue",sourcesContent:["\n.aui-select2-container.select2-container.select2-allowclear .select2-choice abbr {\n  display: block;\n}\n"],sourceRoot:""}]);},"0wjB":function(t,e,n){e.a={props:{name:String,href:String,selected:Boolean}};},"0xhf":function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",{staticClass:"aui-navgroup aui-navgroup-vertical"},[n("div",{staticClass:"aui-navgroup-inner"},[t._t("default")],2)])},i=[],o={render:r,staticRenderFns:i};e.a=o;},"162o":function(t,e,n){(function(t){function r(t,e){this._id=t, this._clearFn=e;}var i=Function.prototype.apply;e.setTimeout=function(){return new r(i.call(setTimeout,window,arguments),clearTimeout)}, e.setInterval=function(){return new r(i.call(setInterval,window,arguments),clearInterval)}, e.clearTimeout=e.clearInterval=function(t){t&&t.close();}, r.prototype.unref=r.prototype.ref=function(){}, r.prototype.close=function(){this._clearFn.call(window,this._id);}, e.enroll=function(t,e){clearTimeout(t._idleTimeoutId), t._idleTimeout=e;}, e.unenroll=function(t){clearTimeout(t._idleTimeoutId), t._idleTimeout=-1;}, e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));}, n("mypn"), e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate, e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate;}).call(e,n("DuR2"));},"16tV":function(t,e,n){function r(t){for(var e=o(t),n=e.length;n--;){var r=e[n],a=t[r];e[n]=[r,a,i(a)];}return e}var i=n("tO4o"),o=n("ktak");t.exports=r;},"1Kpi":function(t,e,n){var r=n("sMXM");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("66390382",r,!0,{});},"1Yb9":function(t,e,n){var r=n("mgnk"),i=n("UnEC"),o=Object.prototype,a=o.hasOwnProperty,s=o.propertyIsEnumerable,u=r(function(){return arguments}())?r:function(t){return i(t)&&a.call(t,"callee")&&!s.call(t,"callee")};t.exports=u;},"1kS7":function(t,e){e.f=Object.getOwnPropertySymbols;},"22B7":function(t,e){function n(t,e){return t===e||t!==t&&e!==e}t.exports=n;},"2Hvv":function(t,e,n){function r(t){return i(this.__data__,t)>-1}var i=n("imBK");t.exports=r;},"2X2u":function(t,e){function n(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}t.exports=n;},"3Did":function(t,e,n){function r(t){return function(e){return i(e,t)}}var i=n("uCi2");t.exports=r;},"3Eo+":function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))};},"3GFx":function(t,e,n){e.a={props:{busy:Boolean,disabled:Boolean,value:Boolean,id:String,label:String,tooltipOn:String,tooltipOff:String},mounted:function(){var t=this;if(this.label&&!this.id)throw"You need to define aui-toggle-button id attribute to properly match label to the toggle";this.$refs.toggle.addEventListener("change",this.emitChange), this.$nextTick(function(){return t.$refs.toggle.busy=t.busy});},methods:{emitChange:function(){this.$emit("input",this.$refs.toggle.checked);}},watch:{busy:function(t){this.$refs.toggle.busy=t;}}};},"3IRH":function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){}, t.paths=[], t.children||(t.children=[]), Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}), Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}), t.webpackPolyfill=1), t};},"3WXc":function(t,e,n){e.a={props:{indeterminate:{type:Boolean,default:!1},progress:{type:Number,default:0,validator:function(t){return t>=0&&t<=1}}},watch:{progress:function(){this.setProgerssIndicator();},indeterminate:function(){this.setProgerssIndicator();}},mounted:function(){this.setProgerssIndicator();},methods:{setProgerssIndicator:function(){this.indeterminate?AJS.progressBars.setIndeterminate(this.$refs.progressIndicator):AJS.progressBars.update(this.$refs.progressIndicator,this.progress);}}};},"3fs2":function(t,e,n){var r=n("RY/4"),i=n("dSzd")("iterator"),o=n("/bQp");t.exports=n("FeBl").getIteratorMethod=function(t){if(void 0!=t)return t[i]||t["@@iterator"]||o[r(t)]};},"4mcu":function(t,e){t.exports=function(){};},"4wdF":function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("ul",{staticClass:"aui-nav"},[t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},"52gC":function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t};},"5N57":function(t,e,n){var r=n("ICSD"),i=n("TQ3y"),o=r(i,"Set");t.exports=o;},"5QVw":function(t,e,n){t.exports={default:n("BwfY"),__esModule:!0};},"5U4r":function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{staticClass:"vue-aui-multi-select2"},[n("input",{ref:"input",attrs:{disabled:t.disabled,type:"hidden"}}),t._v(" "),t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},"5Zxu":function(t,e,n){function r(t){var e=i(t),n=e%1;return e===e?n?e-n:e:0}var i=n("sBat");t.exports=r;},"6MiT":function(t,e,n){function r(t){return"symbol"==typeof t||o(t)&&i(t)==a}var i=n("aCM0"),o=n("UnEC"),a="[object Symbol]";t.exports=r;},"6rBM":function(t,e,n){var r=n("Dd8w"),i=n.n(r),o=n("T4eg");e.a={mixins:[o.a],props:{sortable:Boolean,tagsMode:Boolean,value:Array},created:function(){this.$on("dataChanged",this.updateValue);},mounted:function(){var t=this;this.$input.val(this.value&&this.value.join(","));var e=i()({},this.commonOptions);this.tagsMode?(e.formatNoMatches=function(){return"Type to add a value"}, e.tags=function(){return t.options}):(e.multiple=!0, e.data=function(){return{results:t.options}}), this.$input.auiSelect2(e), this.sortable&&this.setupSorting();},methods:{setupSorting:function(){var t=this;this.$input.prev("div").find(".select2-choices").sortable({containment:"parent",start:function(){return t.$input.auiSelect2("onSortStart")},update:function(){return t.$input.auiSelect2("onSortEnd")}});}}};},"7+uW":function(t,e,n){(function(t,n){function r(t){return void 0===t||null===t}function i(t){return void 0!==t&&null!==t}function o(t){return!0===t}function a(t){return!1===t}function s(t){return"string"==typeof t||"number"==typeof t||"symbol"==typeof t||"boolean"==typeof t}function u(t){return null!==t&&"object"==typeof t}function c(t){return"[object Object]"===no.call(t)}function l(t){return"[object RegExp]"===no.call(t)}function f(t){var e=parseFloat(String(t));return e>=0&&Math.floor(e)===e&&isFinite(t)}function p(t){return null==t?"":"object"==typeof t?JSON.stringify(t,null,2):String(t)}function d(t){var e=parseFloat(t);return isNaN(e)?t:e}function v(t,e){for(var n=Object.create(null),r=t.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return e?function(t){return n[t.toLowerCase()]}:function(t){return n[t]}}function h(t,e){if(t.length){var n=t.indexOf(e);if(n>-1)return t.splice(n,1)}}function m(t,e){return oo.call(t,e)}function g(t){var e=Object.create(null);return function(n){return e[n]||(e[n]=t(n))}}function y(t,e){function n(n){var r=arguments.length;return r?r>1?t.apply(e,arguments):t.call(e,n):t.call(e)}return n._length=t.length, n}function b(t,e){e=e||0;for(var n=t.length-e,r=new Array(n);n--;)r[n]=t[n+e];return r}function _(t,e){for(var n in e)t[n]=e[n];return t}function x(t){for(var e={},n=0;n<t.length;n++)t[n]&&_(e,t[n]);return e}function A(t,e,n){}function w(t,e){if(t===e)return!0;var n=u(t),r=u(e);if(!n||!r)return!n&&!r&&String(t)===String(e);try{var i=Array.isArray(t),o=Array.isArray(e);if(i&&o)return t.length===e.length&&t.every(function(t,n){return w(t,e[n])});if(i||o)return!1;var a=Object.keys(t),s=Object.keys(e);return a.length===s.length&&a.every(function(n){return w(t[n],e[n])})}catch(t){return!1}}function C(t,e){for(var n=0;n<t.length;n++)if(w(t[n],e))return n;return-1}function O(t){var e=!1;return function(){e||(e=!0, t.apply(this,arguments));}}function $(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function S(t,e,n,r){Object.defineProperty(t,e,{value:n,enumerable:!!r,writable:!0,configurable:!0});}function k(t){if(!yo.test(t)){var e=t.split(".");return function(t){for(var n=0;n<e.length;n++){if(!t)return;t=t[e[n]];}return t}}}function j(t){return"function"==typeof t&&/native code/.test(t.toString())}function T(t){Fo.target&&Ro.push(Fo.target), Fo.target=t;}function E(){Fo.target=Ro.pop();}function I(t){return new Uo(void 0,void 0,void 0,String(t))}function M(t,e){var n=t.componentOptions,r=new Uo(t.tag,t.data,t.children,t.text,t.elm,t.context,n,t.asyncFactory);return r.ns=t.ns, r.isStatic=t.isStatic, r.key=t.key, r.isComment=t.isComment, r.fnContext=t.fnContext, r.fnOptions=t.fnOptions, r.fnScopeId=t.fnScopeId, r.isCloned=!0, e&&(t.children&&(r.children=D(t.children,!0)), n&&n.children&&(n.children=D(n.children,!0))), r}function D(t,e){for(var n=t.length,r=new Array(n),i=0;i<n;i++)r[i]=M(t[i],e);return r}function B(t,e,n){t.__proto__=e;}function N(t,e,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];S(t,o,e[o]);}}function P(t,e){if(u(t)&&!(t instanceof Uo)){var n;return m(t,"__ob__")&&t.__ob__ instanceof Jo?n=t.__ob__:Wo.shouldConvert&&!Do()&&(Array.isArray(t)||c(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new Jo(t)), e&&n&&n.vmCount++, n}}function L(t,e,n,r,i){var o=new Fo,a=Object.getOwnPropertyDescriptor(t,e);if(!a||!1!==a.configurable){var s=a&&a.get,u=a&&a.set,c=!i&&P(n);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):n;return Fo.target&&(o.depend(), c&&(c.dep.depend(), Array.isArray(e)&&U(e))), e},set:function(e){var r=s?s.call(t):n;e===r||e!==e&&r!==r||(u?u.call(t,e):n=e, c=!i&&P(e), o.notify());}});}}function F(t,e,n){if(Array.isArray(t)&&f(e))return t.length=Math.max(t.length,e), t.splice(e,1,n), n;if(e in t&&!(e in Object.prototype))return t[e]=n, n;var r=t.__ob__;return t._isVue||r&&r.vmCount?n:r?(L(r.value,e,n), r.dep.notify(), n):(t[e]=n, n)}function R(t,e){if(Array.isArray(t)&&f(e))return void t.splice(e,1);var n=t.__ob__;t._isVue||n&&n.vmCount||m(t,e)&&(delete t[e], n&&n.dep.notify());}function U(t){for(var e=void 0,n=0,r=t.length;n<r;n++)e=t[n], e&&e.__ob__&&e.__ob__.dep.depend(), Array.isArray(e)&&U(e);}function V(t,e){if(!e)return t;for(var n,r,i,o=Object.keys(e),a=0;a<o.length;a++)n=o[a], r=t[n], i=e[n], m(t,n)?c(r)&&c(i)&&V(r,i):F(t,n,i);return t}function z(t,e,n){return n?function(){var r="function"==typeof e?e.call(n,n):e,i="function"==typeof t?t.call(n,n):t;return r?V(r,i):i}:e?t?function(){return V("function"==typeof e?e.call(this,this):e,"function"==typeof t?t.call(this,this):t)}:e:t}function H(t,e){return e?t?t.concat(e):Array.isArray(e)?e:[e]:t}function G(t,e,n,r){var i=Object.create(t||null);return e?_(i,e):i}function Q(t,e){var n=t.props;if(n){var r,i,o,a={};if(Array.isArray(n))for(r=n.length;r--;)"string"==typeof(i=n[r])&&(o=so(i), a[o]={type:null});else if(c(n))for(var s in n)i=n[s], o=so(s), a[o]=c(i)?i:{type:i};t.props=a;}}function W(t,e){var n=t.inject;if(n){var r=t.inject={};if(Array.isArray(n))for(var i=0;i<n.length;i++)r[n[i]]={from:n[i]};else if(c(n))for(var o in n){var a=n[o];r[o]=c(a)?_({from:o},a):{from:a};}}}function J(t){var e=t.directives;if(e)for(var n in e){var r=e[n];"function"==typeof r&&(e[n]={bind:r,update:r});}}function Z(t,e,n){function r(r){var i=Zo[r]||qo;u[r]=i(t[r],e[r],n,r);}"function"==typeof e&&(e=e.options), Q(e,n), W(e,n), J(e);var i=e.extends;if(i&&(t=Z(t,i,n)), e.mixins)for(var o=0,a=e.mixins.length;o<a;o++)t=Z(t,e.mixins[o],n);var s,u={};for(s in t)r(s);for(s in e)m(t,s)||r(s);return u}function Y(t,e,n,r){if("string"==typeof n){var i=t[e];if(m(i,n))return i[n];var o=so(n);if(m(i,o))return i[o];var a=uo(o);if(m(i,a))return i[a];return i[n]||i[o]||i[a]}}function K(t,e,n,r){var i=e[t],o=!m(n,t),a=n[t];if(tt(Boolean,i.type)&&(o&&!m(i,"default")?a=!1:tt(String,i.type)||""!==a&&a!==lo(t)||(a=!0)), void 0===a){a=q(r,i,t);var s=Wo.shouldConvert;Wo.shouldConvert=!0, P(a), Wo.shouldConvert=s;}return a}function q(t,e,n){if(m(e,"default")){var r=e.default;return t&&t.$options.propsData&&void 0===t.$options.propsData[n]&&void 0!==t._props[n]?t._props[n]:"function"==typeof r&&"Function"!==X(e.type)?r.call(t):r}}function X(t){var e=t&&t.toString().match(/^\s*function (\w+)/);return e?e[1]:""}function tt(t,e){if(!Array.isArray(e))return X(e)===X(t);for(var n=0,r=e.length;n<r;n++)if(X(e[n])===X(t))return!0;return!1}function et(t,e,n){if(e)for(var r=e;r=r.$parent;){var i=r.$options.errorCaptured;if(i)for(var o=0;o<i.length;o++)try{var a=!1===i[o].call(r,t,e,n);if(a)return}catch(t){nt(t,r,"errorCaptured hook");}}nt(t,e,n);}function nt(t,e,n){if(go.errorHandler)try{return go.errorHandler.call(null,t,e,n)}catch(t){rt(t,null,"config.errorHandler");}rt(t,e,n);}function rt(t,e,n){if(!_o&&!xo||"undefined"==typeof console)throw t;console.error(t);}function it(){ta=!1;var t=Xo.slice(0);Xo.length=0;for(var e=0;e<t.length;e++)t[e]();}function ot(t){return t._withTask||(t._withTask=function(){ea=!0;var e=t.apply(null,arguments);return ea=!1, e})}function at(t,e){var n;if(Xo.push(function(){if(t)try{t.call(e);}catch(t){et(t,e,"nextTick");}else n&&n(e);}), ta||(ta=!0, ea?Ko():Yo()), !t&&"undefined"!=typeof Promise)return new Promise(function(t){n=t;})}function st(t){ut(t,aa), aa.clear();}function ut(t,e){var n,r,i=Array.isArray(t);if((i||u(t))&&!Object.isFrozen(t)){if(t.__ob__){var o=t.__ob__.dep.id;if(e.has(o))return;e.add(o);}if(i)for(n=t.length;n--;)ut(t[n],e);else for(r=Object.keys(t), n=r.length;n--;)ut(t[r[n]],e);}}function ct(t){function e(){var t=arguments,n=e.fns;if(!Array.isArray(n))return n.apply(null,arguments);for(var r=n.slice(),i=0;i<r.length;i++)r[i].apply(null,t);}return e.fns=t, e}function lt(t,e,n,i,o){var a,s,u,c;for(a in t)s=t[a], u=e[a], c=sa(a), r(s)||(r(u)?(r(s.fns)&&(s=t[a]=ct(s)), n(c.name,s,c.once,c.capture,c.passive,c.params)):s!==u&&(u.fns=s, t[a]=u));for(a in e)r(t[a])&&(c=sa(a), i(c.name,e[a],c.capture));}function ft(t,e,n){function a(){n.apply(this,arguments), h(s.fns,a);}t instanceof Uo&&(t=t.data.hook||(t.data.hook={}));var s,u=t[e];r(u)?s=ct([a]):i(u.fns)&&o(u.merged)?(s=u, s.fns.push(a)):s=ct([u,a]), s.merged=!0, t[e]=s;}function pt(t,e,n){var o=e.options.props;if(!r(o)){var a={},s=t.attrs,u=t.props;if(i(s)||i(u))for(var c in o){var l=lo(c);dt(a,u,c,l,!0)||dt(a,s,c,l,!1);}return a}}function dt(t,e,n,r,o){if(i(e)){if(m(e,n))return t[n]=e[n], o||delete e[n], !0;if(m(e,r))return t[n]=e[r], o||delete e[r], !0}return!1}function vt(t){for(var e=0;e<t.length;e++)if(Array.isArray(t[e]))return Array.prototype.concat.apply([],t);return t}function ht(t){return s(t)?[I(t)]:Array.isArray(t)?gt(t):void 0}function mt(t){return i(t)&&i(t.text)&&a(t.isComment)}function gt(t,e){var n,a,u,c,l=[];for(n=0;n<t.length;n++)a=t[n], r(a)||"boolean"==typeof a||(u=l.length-1, c=l[u], Array.isArray(a)?a.length>0&&(a=gt(a,(e||"")+"_"+n), mt(a[0])&&mt(c)&&(l[u]=I(c.text+a[0].text), a.shift()), l.push.apply(l,a)):s(a)?mt(c)?l[u]=I(c.text+a):""!==a&&l.push(I(a)):mt(a)&&mt(c)?l[u]=I(c.text+a.text):(o(t._isVList)&&i(a.tag)&&r(a.key)&&i(e)&&(a.key="__vlist"+e+"_"+n+"__"), l.push(a)));return l}function yt(t,e){return(t.__esModule||No&&"Module"===t[Symbol.toStringTag])&&(t=t.default), u(t)?e.extend(t):t}function bt(t,e,n,r,i){var o=zo();return o.asyncFactory=t, o.asyncMeta={data:e,context:n,children:r,tag:i}, o}function _t(t,e,n){if(o(t.error)&&i(t.errorComp))return t.errorComp;if(i(t.resolved))return t.resolved;if(o(t.loading)&&i(t.loadingComp))return t.loadingComp;if(!i(t.contexts)){var a=t.contexts=[n],s=!0,c=function(){for(var t=0,e=a.length;t<e;t++)a[t].$forceUpdate();},l=O(function(n){t.resolved=yt(n,e), s||c();}),f=O(function(e){i(t.errorComp)&&(t.error=!0, c());}),p=t(l,f);return u(p)&&("function"==typeof p.then?r(t.resolved)&&p.then(l,f):i(p.component)&&"function"==typeof p.component.then&&(p.component.then(l,f), i(p.error)&&(t.errorComp=yt(p.error,e)), i(p.loading)&&(t.loadingComp=yt(p.loading,e), 0===p.delay?t.loading=!0:setTimeout(function(){r(t.resolved)&&r(t.error)&&(t.loading=!0, c());},p.delay||200)), i(p.timeout)&&setTimeout(function(){r(t.resolved)&&f(null);},p.timeout))), s=!1, t.loading?t.loadingComp:t.resolved}t.contexts.push(n);}function xt(t){return t.isComment&&t.asyncFactory}function At(t){if(Array.isArray(t))for(var e=0;e<t.length;e++){var n=t[e];if(i(n)&&(i(n.componentOptions)||xt(n)))return n}}function wt(t){t._events=Object.create(null), t._hasHookEvent=!1;var e=t.$options._parentListeners;e&&$t(t,e);}function Ct(t,e,n){n?oa.$once(t,e):oa.$on(t,e);}function Ot(t,e){oa.$off(t,e);}function $t(t,e,n){oa=t, lt(e,n||{},Ct,Ot,t), oa=void 0;}function St(t,e){var n={};if(!t)return n;for(var r=0,i=t.length;r<i;r++){var o=t[r],a=o.data;if(a&&a.attrs&&a.attrs.slot&&delete a.attrs.slot, o.context!==e&&o.fnContext!==e||!a||null==a.slot)(n.default||(n.default=[])).push(o);else{var s=a.slot,u=n[s]||(n[s]=[]);"template"===o.tag?u.push.apply(u,o.children||[]):u.push(o);}}for(var c in n)n[c].every(kt)&&delete n[c];return n}function kt(t){return t.isComment&&!t.asyncFactory||" "===t.text}function jt(t,e){e=e||{};for(var n=0;n<t.length;n++)Array.isArray(t[n])?jt(t[n],e):e[t[n].key]=t[n].fn;return e}function Tt(t){var e=t.$options,n=e.parent;if(n&&!e.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(t);}t.$parent=n, t.$root=n?n.$root:t, t.$children=[], t.$refs={}, t._watcher=null, t._inactive=null, t._directInactive=!1, t._isMounted=!1, t._isDestroyed=!1, t._isBeingDestroyed=!1;}function Et(t,e,n){t.$el=e, t.$options.render||(t.$options.render=zo), Nt(t,"beforeMount");var r;return r=function(){t._update(t._render(),n);}, new ma(t,r,A,null,!0), n=!1, null==t.$vnode&&(t._isMounted=!0, Nt(t,"mounted")), t}function It(t,e,n,r,i){var o=!!(i||t.$options._renderChildren||r.data.scopedSlots||t.$scopedSlots!==eo);if(t.$options._parentVnode=r, t.$vnode=r, t._vnode&&(t._vnode.parent=r), t.$options._renderChildren=i, t.$attrs=r.data&&r.data.attrs||eo, t.$listeners=n||eo, e&&t.$options.props){Wo.shouldConvert=!1;for(var a=t._props,s=t.$options._propKeys||[],u=0;u<s.length;u++){var c=s[u];a[c]=K(c,t.$options.props,e,t);}Wo.shouldConvert=!0, t.$options.propsData=e;}if(n){var l=t.$options._parentListeners;t.$options._parentListeners=n, $t(t,n,l);}o&&(t.$slots=St(i,r.context), t.$forceUpdate());}function Mt(t){for(;t&&(t=t.$parent);)if(t._inactive)return!0;return!1}function Dt(t,e){if(e){if(t._directInactive=!1, Mt(t))return}else if(t._directInactive)return;if(t._inactive||null===t._inactive){t._inactive=!1;for(var n=0;n<t.$children.length;n++)Dt(t.$children[n]);Nt(t,"activated");}}function Bt(t,e){if(!(e&&(t._directInactive=!0, Mt(t))||t._inactive)){t._inactive=!0;for(var n=0;n<t.$children.length;n++)Bt(t.$children[n]);Nt(t,"deactivated");}}function Nt(t,e){var n=t.$options[e];if(n)for(var r=0,i=n.length;r<i;r++)try{n[r].call(t);}catch(n){et(n,t,e+" hook");}t._hasHookEvent&&t.$emit("hook:"+e);}function Pt(){va=ca.length=la.length=0, fa={}, pa=da=!1;}function Lt(){da=!0;var t,e;for(ca.sort(function(t,e){return t.id-e.id}), va=0;va<ca.length;va++)t=ca[va], e=t.id, fa[e]=null, t.run();var n=la.slice(),r=ca.slice();Pt(), Ut(n), Ft(r), Bo&&go.devtools&&Bo.emit("flush");}function Ft(t){for(var e=t.length;e--;){var n=t[e],r=n.vm;r._watcher===n&&r._isMounted&&Nt(r,"updated");}}function Rt(t){t._inactive=!1, la.push(t);}function Ut(t){for(var e=0;e<t.length;e++)t[e]._inactive=!0, Dt(t[e],!0);}function Vt(t){var e=t.id;if(null==fa[e]){if(fa[e]=!0, da){for(var n=ca.length-1;n>va&&ca[n].id>t.id;)n--;ca.splice(n+1,0,t);}else ca.push(t);pa||(pa=!0, at(Lt));}}function zt(t,e,n){ga.get=function(){return this[e][n]}, ga.set=function(t){this[e][n]=t;}, Object.defineProperty(t,n,ga);}function Ht(t){t._watchers=[];var e=t.$options;e.props&&Gt(t,e.props), e.methods&&Kt(t,e.methods), e.data?Qt(t):P(t._data={},!0), e.computed&&Jt(t,e.computed), e.watch&&e.watch!==jo&&qt(t,e.watch);}function Gt(t,e){var n=t.$options.propsData||{},r=t._props={},i=t.$options._propKeys=[],o=!t.$parent;Wo.shouldConvert=o;for(var a in e)!function(o){i.push(o);var a=K(o,e,n,t);L(r,o,a), o in t||zt(t,"_props",o);}(a);Wo.shouldConvert=!0;}function Qt(t){var e=t.$options.data;e=t._data="function"==typeof e?Wt(e,t):e||{}, c(e)||(e={});for(var n=Object.keys(e),r=t.$options.props,i=(t.$options.methods, n.length);i--;){var o=n[i];r&&m(r,o)||$(o)||zt(t,"_data",o);}P(e,!0);}function Wt(t,e){try{return t.call(e,e)}catch(t){return et(t,e,"data()"), {}}}function Jt(t,e){var n=t._computedWatchers=Object.create(null),r=Do();for(var i in e){var o=e[i],a="function"==typeof o?o:o.get;r||(n[i]=new ma(t,a||A,A,ya)), i in t||Zt(t,i,o);}}function Zt(t,e,n){var r=!Do();"function"==typeof n?(ga.get=r?Yt(e):n, ga.set=A):(ga.get=n.get?r&&!1!==n.cache?Yt(e):n.get:A, ga.set=n.set?n.set:A), Object.defineProperty(t,e,ga);}function Yt(t){return function(){var e=this._computedWatchers&&this._computedWatchers[t];if(e)return e.dirty&&e.evaluate(), Fo.target&&e.depend(), e.value}}function Kt(t,e){t.$options.props;for(var n in e)t[n]=null==e[n]?A:y(e[n],t);}function qt(t,e){for(var n in e){var r=e[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)Xt(t,n,r[i]);else Xt(t,n,r);}}function Xt(t,e,n,r){return c(n)&&(r=n, n=n.handler), "string"==typeof n&&(n=t[n]), t.$watch(e,n,r)}function te(t){var e=t.$options.provide;e&&(t._provided="function"==typeof e?e.call(t):e);}function ee(t){var e=ne(t.$options.inject,t);e&&(Wo.shouldConvert=!1, Object.keys(e).forEach(function(n){L(t,n,e[n]);}), Wo.shouldConvert=!0);}function ne(t,e){if(t){for(var n=Object.create(null),r=No?Reflect.ownKeys(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}):Object.keys(t),i=0;i<r.length;i++){for(var o=r[i],a=t[o].from,s=e;s;){if(s._provided&&a in s._provided){n[o]=s._provided[a];break}s=s.$parent;}if(!s&&"default"in t[o]){var u=t[o].default;n[o]="function"==typeof u?u.call(e):u;}}return n}}function re(t,e){var n,r,o,a,s;if(Array.isArray(t)||"string"==typeof t)for(n=new Array(t.length), r=0, o=t.length;r<o;r++)n[r]=e(t[r],r);else if("number"==typeof t)for(n=new Array(t), r=0;r<t;r++)n[r]=e(r+1,r);else if(u(t))for(a=Object.keys(t), n=new Array(a.length), r=0, o=a.length;r<o;r++)s=a[r], n[r]=e(t[s],s,r);return i(n)&&(n._isVList=!0), n}function ie(t,e,n,r){var i,o=this.$scopedSlots[t];if(o)n=n||{}, r&&(n=_(_({},r),n)), i=o(n)||e;else{var a=this.$slots[t];a&&(a._rendered=!0), i=a||e;}var s=n&&n.slot;return s?this.$createElement("template",{slot:s},i):i}function oe(t){return Y(this.$options,"filters",t,!0)||po}function ae(t,e,n,r){var i=go.keyCodes[e]||n;return i?Array.isArray(i)?-1===i.indexOf(t):i!==t:r?lo(r)!==e:void 0}function se(t,e,n,r,i){if(n)if(u(n)){Array.isArray(n)&&(n=x(n));var o;for(var a in n)!function(a){if("class"===a||"style"===a||io(a))o=t;else{var s=t.attrs&&t.attrs.type;o=r||go.mustUseProp(e,s,a)?t.domProps||(t.domProps={}):t.attrs||(t.attrs={});}if(!(a in o)&&(o[a]=n[a], i)){(t.on||(t.on={}))["update:"+a]=function(t){n[a]=t;};}}(a);}else;return t}function ue(t,e){var n=this._staticTrees||(this._staticTrees=[]),r=n[t];return r&&!e?Array.isArray(r)?D(r):M(r):(r=n[t]=this.$options.staticRenderFns[t].call(this._renderProxy,null,this), le(r,"__static__"+t,!1), r)}function ce(t,e,n){return le(t,"__once__"+e+(n?"_"+n:""),!0), t}function le(t,e,n){if(Array.isArray(t))for(var r=0;r<t.length;r++)t[r]&&"string"!=typeof t[r]&&fe(t[r],e+"_"+r,n);else fe(t,e,n);}function fe(t,e,n){t.isStatic=!0, t.key=e, t.isOnce=n;}function pe(t,e){if(e)if(c(e)){var n=t.on=t.on?_({},t.on):{};for(var r in e){var i=n[r],o=e[r];n[r]=i?[].concat(i,o):o;}}else;return t}function de(t){t._o=ce, t._n=d, t._s=p, t._l=re, t._t=ie, t._q=w, t._i=C, t._m=ue, t._f=oe, t._k=ae, t._b=se, t._v=I, t._e=zo, t._u=jt, t._g=pe;}function ve(t,e,n,r,i){var a=i.options;this.data=t, this.props=e, this.children=n, this.parent=r, this.listeners=t.on||eo, this.injections=ne(a.inject,r), this.slots=function(){return St(n,r)};var s=Object.create(r),u=o(a._compiled),c=!u;u&&(this.$options=a, this.$slots=this.slots(), this.$scopedSlots=t.scopedSlots||eo), a._scopeId?this._c=function(t,e,n,i){var o=Ae(s,t,e,n,i,c);return o&&(o.fnScopeId=a._scopeId, o.fnContext=r), o}:this._c=function(t,e,n,r){return Ae(s,t,e,n,r,c)};}function he(t,e,n,r,o){var a=t.options,s={},u=a.props;if(i(u))for(var c in u)s[c]=K(c,u,e||eo);else i(n.attrs)&&me(s,n.attrs), i(n.props)&&me(s,n.props);var l=new ve(n,s,o,r,t),f=a.render.call(null,l._c,l);return f instanceof Uo&&(f.fnContext=r, f.fnOptions=a, n.slot&&((f.data||(f.data={})).slot=n.slot)), f}function me(t,e){for(var n in e)t[so(n)]=e[n];}function ge(t,e,n,a,s){if(!r(t)){var c=n.$options._base;if(u(t)&&(t=c.extend(t)), "function"==typeof t){var l;if(r(t.cid)&&(l=t, void 0===(t=_t(l,c,n))))return bt(l,e,n,a,s);e=e||{}, Se(t), i(e.model)&&xe(t.options,e);var f=pt(e,t,s);if(o(t.options.functional))return he(t,f,e,n,a);var p=e.on;if(e.on=e.nativeOn, o(t.options.abstract)){var d=e.slot;e={}, d&&(e.slot=d);}be(e);var v=t.options.name||s;return new Uo("vue-component-"+t.cid+(v?"-"+v:""),e,void 0,void 0,void 0,n,{Ctor:t,propsData:f,listeners:p,tag:s,children:a},l)}}}function ye(t,e,n,r){var o={_isComponent:!0,parent:e,_parentVnode:t,_parentElm:n||null,_refElm:r||null},a=t.data.inlineTemplate;return i(a)&&(o.render=a.render, o.staticRenderFns=a.staticRenderFns), new t.componentOptions.Ctor(o)}function be(t){t.hook||(t.hook={});for(var e=0;e<_a.length;e++){var n=_a[e],r=t.hook[n],i=ba[n];t.hook[n]=r?_e(i,r):i;}}function _e(t,e){return function(n,r,i,o){t(n,r,i,o), e(n,r,i,o);}}function xe(t,e){var n=t.model&&t.model.prop||"value",r=t.model&&t.model.event||"input";(e.props||(e.props={}))[n]=e.model.value;var o=e.on||(e.on={});i(o[r])?o[r]=[e.model.callback].concat(o[r]):o[r]=e.model.callback;}function Ae(t,e,n,r,i,a){return(Array.isArray(n)||s(n))&&(i=r, r=n, n=void 0), o(a)&&(i=Aa), we(t,e,n,r,i)}function we(t,e,n,r,o){if(i(n)&&i(n.__ob__))return zo();if(i(n)&&i(n.is)&&(e=n.is), !e)return zo();Array.isArray(r)&&"function"==typeof r[0]&&(n=n||{}, n.scopedSlots={default:r[0]}, r.length=0), o===Aa?r=ht(r):o===xa&&(r=vt(r));var a,s;if("string"==typeof e){var u;s=t.$vnode&&t.$vnode.ns||go.getTagNamespace(e), a=go.isReservedTag(e)?new Uo(go.parsePlatformTagName(e),n,r,void 0,void 0,t):i(u=Y(t.$options,"components",e))?ge(u,n,t,r,e):new Uo(e,n,r,void 0,void 0,t);}else a=ge(e,n,t,r);return i(a)?(s&&Ce(a,s), a):zo()}function Ce(t,e,n){if(t.ns=e, "foreignObject"===t.tag&&(e=void 0, n=!0), i(t.children))for(var a=0,s=t.children.length;a<s;a++){var u=t.children[a];i(u.tag)&&(r(u.ns)||o(n))&&Ce(u,e,n);}}function Oe(t){t._vnode=null, t._staticTrees=null;var e=t.$options,n=t.$vnode=e._parentVnode,r=n&&n.context;t.$slots=St(e._renderChildren,r), t.$scopedSlots=eo, t._c=function(e,n,r,i){return Ae(t,e,n,r,i,!1)}, t.$createElement=function(e,n,r,i){return Ae(t,e,n,r,i,!0)};var i=n&&n.data;L(t,"$attrs",i&&i.attrs||eo,null,!0), L(t,"$listeners",e._parentListeners||eo,null,!0);}function $e(t,e){var n=t.$options=Object.create(t.constructor.options),r=e._parentVnode;n.parent=e.parent, n._parentVnode=r, n._parentElm=e._parentElm, n._refElm=e._refElm;var i=r.componentOptions;n.propsData=i.propsData, n._parentListeners=i.listeners, n._renderChildren=i.children, n._componentTag=i.tag, e.render&&(n.render=e.render, n.staticRenderFns=e.staticRenderFns);}function Se(t){var e=t.options;if(t.super){var n=Se(t.super);if(n!==t.superOptions){t.superOptions=n;var r=ke(t);r&&_(t.extendOptions,r), e=t.options=Z(n,t.extendOptions), e.name&&(e.components[e.name]=t);}}return e}function ke(t){var e,n=t.options,r=t.extendOptions,i=t.sealedOptions;for(var o in n)n[o]!==i[o]&&(e||(e={}), e[o]=je(n[o],r[o],i[o]));return e}function je(t,e,n){if(Array.isArray(t)){var r=[];n=Array.isArray(n)?n:[n], e=Array.isArray(e)?e:[e];for(var i=0;i<t.length;i++)(e.indexOf(t[i])>=0||n.indexOf(t[i])<0)&&r.push(t[i]);return r}return t}function Te(t){this._init(t);}function Ee(t){t.use=function(t){var e=this._installedPlugins||(this._installedPlugins=[]);if(e.indexOf(t)>-1)return this;var n=b(arguments,1);return n.unshift(this), "function"==typeof t.install?t.install.apply(t,n):"function"==typeof t&&t.apply(null,n), e.push(t), this};}function Ie(t){t.mixin=function(t){return this.options=Z(this.options,t), this};}function Me(t){t.cid=0;var e=1;t.extend=function(t){t=t||{};var n=this,r=n.cid,i=t._Ctor||(t._Ctor={});if(i[r])return i[r];var o=t.name||n.options.name,a=function(t){this._init(t);};return a.prototype=Object.create(n.prototype), a.prototype.constructor=a, a.cid=e++, a.options=Z(n.options,t), a.super=n, a.options.props&&De(a), a.options.computed&&Be(a), a.extend=n.extend, a.mixin=n.mixin, a.use=n.use, ho.forEach(function(t){a[t]=n[t];}), o&&(a.options.components[o]=a), a.superOptions=n.options, a.extendOptions=t, a.sealedOptions=_({},a.options), i[r]=a, a};}function De(t){var e=t.options.props;for(var n in e)zt(t.prototype,"_props",n);}function Be(t){var e=t.options.computed;for(var n in e)Zt(t.prototype,n,e[n]);}function Ne(t){ho.forEach(function(e){t[e]=function(t,n){return n?("component"===e&&c(n)&&(n.name=n.name||t, n=this.options._base.extend(n)), "directive"===e&&"function"==typeof n&&(n={bind:n,update:n}), this.options[e+"s"][t]=n, n):this.options[e+"s"][t]};});}function Pe(t){return t&&(t.Ctor.options.name||t.tag)}function Le(t,e){return Array.isArray(t)?t.indexOf(e)>-1:"string"==typeof t?t.split(",").indexOf(e)>-1:!!l(t)&&t.test(e)}function Fe(t,e){var n=t.cache,r=t.keys,i=t._vnode;for(var o in n){var a=n[o];if(a){var s=Pe(a.componentOptions);s&&!e(s)&&Re(n,o,r,i);}}}function Re(t,e,n,r){var i=t[e];!i||r&&i.tag===r.tag||i.componentInstance.$destroy(), t[e]=null, h(n,e);}function Ue(t){for(var e=t.data,n=t,r=t;i(r.componentInstance);)(r=r.componentInstance._vnode)&&r.data&&(e=Ve(r.data,e));for(;i(n=n.parent);)n&&n.data&&(e=Ve(e,n.data));return ze(e.staticClass,e.class)}function Ve(t,e){return{staticClass:He(t.staticClass,e.staticClass),class:i(t.class)?[t.class,e.class]:e.class}}function ze(t,e){return i(t)||i(e)?He(t,Ge(e)):""}function He(t,e){return t?e?t+" "+e:t:e||""}function Ge(t){return Array.isArray(t)?Qe(t):u(t)?We(t):"string"==typeof t?t:""}function Qe(t){for(var e,n="",r=0,o=t.length;r<o;r++)i(e=Ge(t[r]))&&""!==e&&(n&&(n+=" "), n+=e);return n}function We(t){var e="";for(var n in t)t[n]&&(e&&(e+=" "), e+=n);return e}function Je(t){return Wa(t)?"svg":"math"===t?"math":void 0}function Ze(t){if(!_o)return!0;if(Za(t))return!1;if(t=t.toLowerCase(), null!=Ya[t])return Ya[t];var e=document.createElement(t);return t.indexOf("-")>-1?Ya[t]=e.constructor===window.HTMLUnknownElement||e.constructor===window.HTMLElement:Ya[t]=/HTMLUnknownElement/.test(e.toString())}function Ye(t){if("string"==typeof t){var e=document.querySelector(t);return e||document.createElement("div")}return t}function Ke(t,e){var n=document.createElement(t);return"select"!==t?n:(e.data&&e.data.attrs&&void 0!==e.data.attrs.multiple&&n.setAttribute("multiple","multiple"), n)}function qe(t,e){return document.createElementNS(Ga[t],e)}function Xe(t){return document.createTextNode(t)}function tn(t){return document.createComment(t)}function en(t,e,n){t.insertBefore(e,n);}function nn(t,e){t.removeChild(e);}function rn(t,e){t.appendChild(e);}function on(t){return t.parentNode}function an(t){return t.nextSibling}function sn(t){return t.tagName}function un(t,e){t.textContent=e;}function cn(t,e,n){t.setAttribute(e,n);}function ln(t,e){var n=t.data.ref;if(n){var r=t.context,i=t.componentInstance||t.elm,o=r.$refs;e?Array.isArray(o[n])?h(o[n],i):o[n]===i&&(o[n]=void 0):t.data.refInFor?Array.isArray(o[n])?o[n].indexOf(i)<0&&o[n].push(i):o[n]=[i]:o[n]=i;}}function fn(t,e){return t.key===e.key&&(t.tag===e.tag&&t.isComment===e.isComment&&i(t.data)===i(e.data)&&pn(t,e)||o(t.isAsyncPlaceholder)&&t.asyncFactory===e.asyncFactory&&r(e.asyncFactory.error))}function pn(t,e){if("input"!==t.tag)return!0;var n,r=i(n=t.data)&&i(n=n.attrs)&&n.type,o=i(n=e.data)&&i(n=n.attrs)&&n.type;return r===o||Ka(r)&&Ka(o)}function dn(t,e,n){var r,o,a={};for(r=e;r<=n;++r)o=t[r].key, i(o)&&(a[o]=r);return a}function vn(t,e){(t.data.directives||e.data.directives)&&hn(t,e);}function hn(t,e){var n,r,i,o=t===ts,a=e===ts,s=mn(t.data.directives,t.context),u=mn(e.data.directives,e.context),c=[],l=[];for(n in u)r=s[n], i=u[n], r?(i.oldValue=r.value, yn(i,"update",e,t), i.def&&i.def.componentUpdated&&l.push(i)):(yn(i,"bind",e,t), i.def&&i.def.inserted&&c.push(i));if(c.length){var f=function(){for(var n=0;n<c.length;n++)yn(c[n],"inserted",e,t);};o?ft(e,"insert",f):f();}if(l.length&&ft(e,"postpatch",function(){for(var n=0;n<l.length;n++)yn(l[n],"componentUpdated",e,t);}), !o)for(n in s)u[n]||yn(s[n],"unbind",t,t,a);}function mn(t,e){var n=Object.create(null);if(!t)return n;var r,i;for(r=0;r<t.length;r++)i=t[r], i.modifiers||(i.modifiers=rs), n[gn(i)]=i, i.def=Y(e.$options,"directives",i.name,!0);return n}function gn(t){return t.rawName||t.name+"."+Object.keys(t.modifiers||{}).join(".")}function yn(t,e,n,r,i){var o=t.def&&t.def[e];if(o)try{o(n.elm,t,n,r,i);}catch(r){et(r,n.context,"directive "+t.name+" "+e+" hook");}}function bn(t,e){var n=e.componentOptions;if(!(i(n)&&!1===n.Ctor.options.inheritAttrs||r(t.data.attrs)&&r(e.data.attrs))){var o,a,s=e.elm,u=t.data.attrs||{},c=e.data.attrs||{};i(c.__ob__)&&(c=e.data.attrs=_({},c));for(o in c)a=c[o], u[o]!==a&&_n(s,o,a);(Co||$o)&&c.value!==u.value&&_n(s,"value",c.value);for(o in u)r(c[o])&&(Va(o)?s.removeAttributeNS(Ua,za(o)):Fa(o)||s.removeAttribute(o));}}function _n(t,e,n){if(Ra(e))Ha(n)?t.removeAttribute(e):(n="allowfullscreen"===e&&"EMBED"===t.tagName?"true":e, t.setAttribute(e,n));else if(Fa(e))t.setAttribute(e,Ha(n)||"false"===n?"false":"true");else if(Va(e))Ha(n)?t.removeAttributeNS(Ua,za(e)):t.setAttributeNS(Ua,e,n);else if(Ha(n))t.removeAttribute(e);else{if(Co&&!Oo&&"TEXTAREA"===t.tagName&&"placeholder"===e&&!t.__ieph){var r=function(e){e.stopImmediatePropagation(), t.removeEventListener("input",r);};t.addEventListener("input",r), t.__ieph=!0;}t.setAttribute(e,n);}}function xn(t,e){var n=e.elm,o=e.data,a=t.data;if(!(r(o.staticClass)&&r(o.class)&&(r(a)||r(a.staticClass)&&r(a.class)))){var s=Ue(e),u=n._transitionClasses;i(u)&&(s=He(s,Ge(u))), s!==n._prevClass&&(n.setAttribute("class",s), n._prevClass=s);}}function An(t){function e(){(a||(a=[])).push(t.slice(v,i).trim()), v=i+1;}var n,r,i,o,a,s=!1,u=!1,c=!1,l=!1,f=0,p=0,d=0,v=0;for(i=0;i<t.length;i++)if(r=n, n=t.charCodeAt(i), s)39===n&&92!==r&&(s=!1);else if(u)34===n&&92!==r&&(u=!1);else if(c)96===n&&92!==r&&(c=!1);else if(l)47===n&&92!==r&&(l=!1);else if(124!==n||124===t.charCodeAt(i+1)||124===t.charCodeAt(i-1)||f||p||d){switch(n){case 34:u=!0;break;case 39:s=!0;break;case 96:c=!0;break;case 40:d++;break;case 41:d--;break;case 91:p++;break;case 93:p--;break;case 123:f++;break;case 125:f--;}if(47===n){for(var h=i-1,m=void 0;h>=0&&" "===(m=t.charAt(h));h--);m&&ss.test(m)||(l=!0);}}else void 0===o?(v=i+1, o=t.slice(0,i).trim()):e();if(void 0===o?o=t.slice(0,i).trim():0!==v&&e(), a)for(i=0;i<a.length;i++)o=wn(o,a[i]);return o}function wn(t,e){var n=e.indexOf("(");return n<0?'_f("'+e+'")('+t+")":'_f("'+e.slice(0,n)+'")('+t+","+e.slice(n+1)}function Cn(t){console.error("[Vue compiler]: "+t);}function On(t,e){return t?t.map(function(t){return t[e]}).filter(function(t){return t}):[]}function $n(t,e,n){(t.props||(t.props=[])).push({name:e,value:n}), t.plain=!1;}function Sn(t,e,n){(t.attrs||(t.attrs=[])).push({name:e,value:n}), t.plain=!1;}function kn(t,e,n){t.attrsMap[e]=n, t.attrsList.push({name:e,value:n});}function jn(t,e,n,r,i,o){(t.directives||(t.directives=[])).push({name:e,rawName:n,value:r,arg:i,modifiers:o}), t.plain=!1;}function Tn(t,e,n,r,i,o){r=r||eo, r.capture&&(delete r.capture, e="!"+e), r.once&&(delete r.once, e="~"+e), r.passive&&(delete r.passive, e="&"+e), "click"===e&&(r.right?(e="contextmenu", delete r.right):r.middle&&(e="mouseup"));var a;r.native?(delete r.native, a=t.nativeEvents||(t.nativeEvents={})):a=t.events||(t.events={});var s={value:n};r!==eo&&(s.modifiers=r);var u=a[e];Array.isArray(u)?i?u.unshift(s):u.push(s):a[e]=u?i?[s,u]:[u,s]:s, t.plain=!1;}function En(t,e,n){var r=In(t,":"+e)||In(t,"v-bind:"+e);if(null!=r)return An(r);if(!1!==n){var i=In(t,e);if(null!=i)return JSON.stringify(i)}}function In(t,e,n){var r;if(null!=(r=t.attrsMap[e]))for(var i=t.attrsList,o=0,a=i.length;o<a;o++)if(i[o].name===e){i.splice(o,1);break}return n&&delete t.attrsMap[e], r}function Mn(t,e,n){var r=n||{},i=r.number,o=r.trim,a="$$v";o&&(a="(typeof $$v === 'string'? $$v.trim(): $$v)"), i&&(a="_n("+a+")");var s=Dn(e,a);t.model={value:"("+e+")",expression:'"'+e+'"',callback:"function ($$v) {"+s+"}"};}function Dn(t,e){var n=Bn(t);return null===n.key?t+"="+e:"$set("+n.exp+", "+n.key+", "+e+")"}function Bn(t){if(Sa=t.length, t.indexOf("[")<0||t.lastIndexOf("]")<Sa-1)return Ta=t.lastIndexOf("."), Ta>-1?{exp:t.slice(0,Ta),key:'"'+t.slice(Ta+1)+'"'}:{exp:t,key:null};for(ka=t, Ta=Ea=Ia=0;!Pn();)ja=Nn(), Ln(ja)?Rn(ja):91===ja&&Fn(ja);return{exp:t.slice(0,Ea),key:t.slice(Ea+1,Ia)}}function Nn(){return ka.charCodeAt(++Ta)}function Pn(){return Ta>=Sa}function Ln(t){return 34===t||39===t}function Fn(t){var e=1;for(Ea=Ta;!Pn();)if(t=Nn(), Ln(t))Rn(t);else if(91===t&&e++, 93===t&&e--, 0===e){Ia=Ta;break}}function Rn(t){for(var e=t;!Pn()&&(t=Nn())!==e;);}function Un(t,e,n){var r=e.value,i=e.modifiers,o=t.tag,a=t.attrsMap.type;if(t.component)return Mn(t,r,i), !1;if("select"===o)Hn(t,r,i);else if("input"===o&&"checkbox"===a)Vn(t,r,i);else if("input"===o&&"radio"===a)zn(t,r,i);else if("input"===o||"textarea"===o)Gn(t,r,i);else if(!go.isReservedTag(o))return Mn(t,r,i), !1;return!0}function Vn(t,e,n){var r=n&&n.number,i=En(t,"value")||"null",o=En(t,"true-value")||"true",a=En(t,"false-value")||"false";$n(t,"checked","Array.isArray("+e+")?_i("+e+","+i+")>-1"+("true"===o?":("+e+")":":_q("+e+","+o+")")), Tn(t,"change","var $$a="+e+",$$el=$event.target,$$c=$$el.checked?("+o+"):("+a+");if(Array.isArray($$a)){var $$v="+(r?"_n("+i+")":i)+",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&("+e+"=$$a.concat([$$v]))}else{$$i>-1&&("+e+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+Dn(e,"$$c")+"}",null,!0);}function zn(t,e,n){var r=n&&n.number,i=En(t,"value")||"null";i=r?"_n("+i+")":i, $n(t,"checked","_q("+e+","+i+")"), Tn(t,"change",Dn(e,i),null,!0);}function Hn(t,e,n){var r=n&&n.number,i='Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return '+(r?"_n(val)":"val")+"})",o="var $$selectedVal = "+i+";";o=o+" "+Dn(e,"$event.target.multiple ? $$selectedVal : $$selectedVal[0]"), Tn(t,"change",o,null,!0);}function Gn(t,e,n){var r=t.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,u=!o&&"range"!==r,c=o?"change":"range"===r?us:"input",l="$event.target.value";s&&(l="$event.target.value.trim()"), a&&(l="_n("+l+")");var f=Dn(e,l);u&&(f="if($event.target.composing)return;"+f), $n(t,"value","("+e+")"), Tn(t,c,f,null,!0), (s||a)&&Tn(t,"blur","$forceUpdate()");}function Qn(t){if(i(t[us])){var e=Co?"change":"input";t[e]=[].concat(t[us],t[e]||[]), delete t[us];}i(t[cs])&&(t.change=[].concat(t[cs],t.change||[]), delete t[cs]);}function Wn(t,e,n){var r=Da;return function i(){null!==t.apply(null,arguments)&&Zn(e,i,n,r);}}function Jn(t,e,n,r,i){e=ot(e), n&&(e=Wn(e,t,r)), Da.addEventListener(t,e,To?{capture:r,passive:i}:r);}function Zn(t,e,n,r){(r||Da).removeEventListener(t,e._withTask||e,n);}function Yn(t,e){if(!r(t.data.on)||!r(e.data.on)){var n=e.data.on||{},i=t.data.on||{};Da=e.elm, Qn(n), lt(n,i,Jn,Zn,e.context), Da=void 0;}}function Kn(t,e){if(!r(t.data.domProps)||!r(e.data.domProps)){var n,o,a=e.elm,s=t.data.domProps||{},u=e.data.domProps||{};i(u.__ob__)&&(u=e.data.domProps=_({},u));for(n in s)r(u[n])&&(a[n]="");for(n in u){if(o=u[n], "textContent"===n||"innerHTML"===n){if(e.children&&(e.children.length=0), o===s[n])continue;1===a.childNodes.length&&a.removeChild(a.childNodes[0]);}if("value"===n){a._value=o;var c=r(o)?"":String(o);qn(a,c)&&(a.value=c);}else a[n]=o;}}}function qn(t,e){return!t.composing&&("OPTION"===t.tagName||Xn(t,e)||tr(t,e))}function Xn(t,e){var n=!0;try{n=document.activeElement!==t;}catch(t){}return n&&t.value!==e}function tr(t,e){var n=t.value,r=t._vModifiers;if(i(r)){if(r.lazy)return!1;if(r.number)return d(n)!==d(e);if(r.trim)return n.trim()!==e.trim()}return n!==e}function er(t){var e=nr(t.style);return t.staticStyle?_(t.staticStyle,e):e}function nr(t){return Array.isArray(t)?x(t):"string"==typeof t?ps(t):t}function rr(t,e){var n,r={};if(e)for(var i=t;i.componentInstance;)(i=i.componentInstance._vnode)&&i.data&&(n=er(i.data))&&_(r,n);(n=er(t.data))&&_(r,n);for(var o=t;o=o.parent;)o.data&&(n=er(o.data))&&_(r,n);return r}function ir(t,e){var n=e.data,o=t.data;if(!(r(n.staticStyle)&&r(n.style)&&r(o.staticStyle)&&r(o.style))){var a,s,u=e.elm,c=o.staticStyle,l=o.normalizedStyle||o.style||{},f=c||l,p=nr(e.data.style)||{};e.data.normalizedStyle=i(p.__ob__)?_({},p):p;var d=rr(e,!0);for(s in f)r(d[s])&&hs(u,s,"");for(s in d)(a=d[s])!==f[s]&&hs(u,s,null==a?"":a);}}function or(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.add(e)}):t.classList.add(e);else{var n=" "+(t.getAttribute("class")||"")+" ";n.indexOf(" "+e+" ")<0&&t.setAttribute("class",(n+e).trim());}}function ar(t,e){if(e&&(e=e.trim()))if(t.classList)e.indexOf(" ")>-1?e.split(/\s+/).forEach(function(e){return t.classList.remove(e)}):t.classList.remove(e), t.classList.length||t.removeAttribute("class");else{for(var n=" "+(t.getAttribute("class")||"")+" ",r=" "+e+" ";n.indexOf(r)>=0;)n=n.replace(r," ");n=n.trim(), n?t.setAttribute("class",n):t.removeAttribute("class");}}function sr(t){if(t){if("object"==typeof t){var e={};return!1!==t.css&&_(e,bs(t.name||"v")), _(e,t), e}return"string"==typeof t?bs(t):void 0}}function ur(t){Ss(function(){Ss(t);});}function cr(t,e){var n=t._transitionClasses||(t._transitionClasses=[]);n.indexOf(e)<0&&(n.push(e), or(t,e));}function lr(t,e){t._transitionClasses&&h(t._transitionClasses,e), ar(t,e);}function fr(t,e,n){var r=pr(t,e),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===xs?Cs:$s,u=0,c=function(){t.removeEventListener(s,l), n();},l=function(e){e.target===t&&++u>=a&&c();};setTimeout(function(){u<a&&c();},o+1), t.addEventListener(s,l);}function pr(t,e){var n,r=window.getComputedStyle(t),i=r[ws+"Delay"].split(", "),o=r[ws+"Duration"].split(", "),a=dr(i,o),s=r[Os+"Delay"].split(", "),u=r[Os+"Duration"].split(", "),c=dr(s,u),l=0,f=0;return e===xs?a>0&&(n=xs, l=a, f=o.length):e===As?c>0&&(n=As, l=c, f=u.length):(l=Math.max(a,c), n=l>0?a>c?xs:As:null, f=n?n===xs?o.length:u.length:0), {type:n,timeout:l,propCount:f,hasTransform:n===xs&&ks.test(r[ws+"Property"])}}function dr(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max.apply(null,e.map(function(e,n){return vr(e)+vr(t[n])}))}function vr(t){return 1e3*Number(t.slice(0,-1))}function hr(t,e){var n=t.elm;i(n._leaveCb)&&(n._leaveCb.cancelled=!0, n._leaveCb());var o=sr(t.data.transition);if(!r(o)&&!i(n._enterCb)&&1===n.nodeType){for(var a=o.css,s=o.type,c=o.enterClass,l=o.enterToClass,f=o.enterActiveClass,p=o.appearClass,v=o.appearToClass,h=o.appearActiveClass,m=o.beforeEnter,g=o.enter,y=o.afterEnter,b=o.enterCancelled,_=o.beforeAppear,x=o.appear,A=o.afterAppear,w=o.appearCancelled,C=o.duration,$=ua,S=ua.$vnode;S&&S.parent;)S=S.parent, $=S.context;var k=!$._isMounted||!t.isRootInsert;if(!k||x||""===x){var j=k&&p?p:c,T=k&&h?h:f,E=k&&v?v:l,I=k?_||m:m,M=k&&"function"==typeof x?x:g,D=k?A||y:y,B=k?w||b:b,N=d(u(C)?C.enter:C),P=!1!==a&&!Oo,L=yr(M),F=n._enterCb=O(function(){P&&(lr(n,E), lr(n,T)), F.cancelled?(P&&lr(n,j), B&&B(n)):D&&D(n), n._enterCb=null;});t.data.show||ft(t,"insert",function(){var e=n.parentNode,r=e&&e._pending&&e._pending[t.key];r&&r.tag===t.tag&&r.elm._leaveCb&&r.elm._leaveCb(), M&&M(n,F);}), I&&I(n), P&&(cr(n,j), cr(n,T), ur(function(){cr(n,E), lr(n,j), F.cancelled||L||(gr(N)?setTimeout(F,N):fr(n,s,F));})), t.data.show&&(e&&e(), M&&M(n,F)), P||L||F();}}}function mr(t,e){function n(){w.cancelled||(t.data.show||((o.parentNode._pending||(o.parentNode._pending={}))[t.key]=t), v&&v(o), _&&(cr(o,l), cr(o,p), ur(function(){cr(o,f), lr(o,l), w.cancelled||x||(gr(A)?setTimeout(w,A):fr(o,c,w));})), h&&h(o,w), _||x||w());}var o=t.elm;i(o._enterCb)&&(o._enterCb.cancelled=!0, o._enterCb());var a=sr(t.data.transition);if(r(a)||1!==o.nodeType)return e();if(!i(o._leaveCb)){var s=a.css,c=a.type,l=a.leaveClass,f=a.leaveToClass,p=a.leaveActiveClass,v=a.beforeLeave,h=a.leave,m=a.afterLeave,g=a.leaveCancelled,y=a.delayLeave,b=a.duration,_=!1!==s&&!Oo,x=yr(h),A=d(u(b)?b.leave:b),w=o._leaveCb=O(function(){o.parentNode&&o.parentNode._pending&&(o.parentNode._pending[t.key]=null), _&&(lr(o,f), lr(o,p)), w.cancelled?(_&&lr(o,l), g&&g(o)):(e(), m&&m(o)), o._leaveCb=null;});y?y(n):n();}}function gr(t){return"number"==typeof t&&!isNaN(t)}function yr(t){if(r(t))return!1;var e=t.fns;return i(e)?yr(Array.isArray(e)?e[0]:e):(t._length||t.length)>1}function br(t,e){!0!==e.data.show&&hr(e);}function _r(t,e,n){xr(t,e,n), (Co||$o)&&setTimeout(function(){xr(t,e,n);},0);}function xr(t,e,n){var r=e.value,i=t.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,u=t.options.length;s<u;s++)if(a=t.options[s], i)o=C(r,wr(a))>-1, a.selected!==o&&(a.selected=o);else if(w(wr(a),r))return void(t.selectedIndex!==s&&(t.selectedIndex=s));i||(t.selectedIndex=-1);}}function Ar(t,e){return e.every(function(e){return!w(e,t)})}function wr(t){return"_value"in t?t._value:t.value}function Cr(t){t.target.composing=!0;}function Or(t){t.target.composing&&(t.target.composing=!1, $r(t.target,"input"));}function $r(t,e){var n=document.createEvent("HTMLEvents");n.initEvent(e,!0,!0), t.dispatchEvent(n);}function Sr(t){return!t.componentInstance||t.data&&t.data.transition?t:Sr(t.componentInstance._vnode)}function kr(t){var e=t&&t.componentOptions;return e&&e.Ctor.options.abstract?kr(At(e.children)):t}function jr(t){var e={},n=t.$options;for(var r in n.propsData)e[r]=t[r];var i=n._parentListeners;for(var o in i)e[so(o)]=i[o];return e}function Tr(t,e){if(/\d-keep-alive$/.test(e.tag))return t("keep-alive",{props:e.componentOptions.propsData})}function Er(t){for(;t=t.parent;)if(t.data.transition)return!0}function Ir(t,e){return e.key===t.key&&e.tag===t.tag}function Mr(t){t.elm._moveCb&&t.elm._moveCb(), t.elm._enterCb&&t.elm._enterCb();}function Dr(t){t.data.newPos=t.elm.getBoundingClientRect();}function Br(t){var e=t.data.pos,n=t.data.newPos,r=e.left-n.left,i=e.top-n.top;if(r||i){t.data.moved=!0;var o=t.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)", o.transitionDuration="0s";}}function Nr(t,e){var n=e?Hs(e):Vs;if(n.test(t)){for(var r,i,o,a=[],s=[],u=n.lastIndex=0;r=n.exec(t);){i=r.index, i>u&&(s.push(o=t.slice(u,i)), a.push(JSON.stringify(o)));var c=An(r[1].trim());a.push("_s("+c+")"), s.push({"@binding":c}), u=i+r[0].length;}return u<t.length&&(s.push(o=t.slice(u)), a.push(JSON.stringify(o))), {expression:a.join("+"),tokens:s}}}function Pr(t,e){var n=(e.warn, In(t,"class"));n&&(t.staticClass=JSON.stringify(n));var r=En(t,"class",!1);r&&(t.classBinding=r);}function Lr(t){var e="";return t.staticClass&&(e+="staticClass:"+t.staticClass+","), t.classBinding&&(e+="class:"+t.classBinding+","), e}function Fr(t,e){var n=(e.warn, In(t,"style"));if(n){t.staticStyle=JSON.stringify(ps(n));}var r=En(t,"style",!1);r&&(t.styleBinding=r);}function Rr(t){var e="";return t.staticStyle&&(e+="staticStyle:"+t.staticStyle+","), t.styleBinding&&(e+="style:("+t.styleBinding+"),"), e}function Ur(t,e){var n=e?Au:xu;return t.replace(n,function(t){return _u[t]})}function Vr(t,e){function n(e){l+=e, t=t.substring(e);}function r(t,n,r){var i,s;if(null==n&&(n=l), null==r&&(r=l), t&&(s=t.toLowerCase()), t)for(i=a.length-1;i>=0&&a[i].lowerCasedTag!==s;i--);else i=0;if(i>=0){for(var u=a.length-1;u>=i;u--)e.end&&e.end(a[u].tag,n,r);a.length=i, o=i&&a[i-1].tag;}else"br"===s?e.start&&e.start(t,[],!0,n,r):"p"===s&&(e.start&&e.start(t,[],!1,n,r), e.end&&e.end(t,n,r));}for(var i,o,a=[],s=e.expectHTML,u=e.isUnaryTag||fo,c=e.canBeLeftOpenTag||fo,l=0;t;){if(i=t, o&&yu(o)){var f=0,p=o.toLowerCase(),d=bu[p]||(bu[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i")),v=t.replace(d,function(t,n,r){return f=r.length, yu(p)||"noscript"===p||(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")), Cu(p,n)&&(n=n.slice(1)), e.chars&&e.chars(n), ""});l+=t.length-v.length, t=v, r(p,l-f,l);}else{var h=t.indexOf("<");if(0===h){if(iu.test(t)){var m=t.indexOf("--\x3e");if(m>=0){e.shouldKeepComment&&e.comment(t.substring(4,m)), n(m+3);continue}}if(ou.test(t)){var g=t.indexOf("]>");if(g>=0){n(g+2);continue}}var y=t.match(ru);if(y){n(y[0].length);continue}var b=t.match(nu);if(b){var _=l;n(b[0].length), r(b[1],_,l);continue}var x=function(){var e=t.match(tu);if(e){var r={tagName:e[1],attrs:[],start:l};n(e[0].length);for(var i,o;!(i=t.match(eu))&&(o=t.match(Ks));)n(o[0].length), r.attrs.push(o);if(i)return r.unarySlash=i[1], n(i[0].length), r.end=l, r}}();if(x){!function(t){var n=t.tagName,i=t.unarySlash;s&&("p"===o&&Ys(n)&&r(o), c(n)&&o===n&&r(n));for(var l=u(n)||!!i,f=t.attrs.length,p=new Array(f),d=0;d<f;d++){var v=t.attrs[d];au&&-1===v[0].indexOf('""')&&(""===v[3]&&delete v[3], ""===v[4]&&delete v[4], ""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"",m="a"===n&&"href"===v[1]?e.shouldDecodeNewlinesForHref:e.shouldDecodeNewlines;p[d]={name:v[1],value:Ur(h,m)};}l||(a.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:p}), o=n), e.start&&e.start(n,p,l,t.start,t.end);}(x), Cu(o,t)&&n(1);continue}}var A=void 0,w=void 0,C=void 0;if(h>=0){for(w=t.slice(h);!(nu.test(w)||tu.test(w)||iu.test(w)||ou.test(w)||(C=w.indexOf("<",1))<0);)h+=C, w=t.slice(h);A=t.substring(0,h), n(h);}h<0&&(A=t, t=""), e.chars&&A&&e.chars(A);}if(t===i){e.chars&&e.chars(t);break}}r();}function zr(t,e,n){return{type:1,tag:t,attrsList:e,attrsMap:ui(e),parent:n,children:[]}}function Hr(t,e){function n(t){t.pre&&(s=!1), pu(t.tag)&&(u=!1);for(var n=0;n<fu.length;n++)fu[n](t,e);}su=e.warn||Cn, pu=e.isPreTag||fo, du=e.mustUseProp||fo, vu=e.getTagNamespace||fo, cu=On(e.modules,"transformNode"), lu=On(e.modules,"preTransformNode"), fu=On(e.modules,"postTransformNode"), uu=e.delimiters;var r,i,o=[],a=!1!==e.preserveWhitespace,s=!1,u=!1;return Vr(t,{warn:su,expectHTML:e.expectHTML,isUnaryTag:e.isUnaryTag,canBeLeftOpenTag:e.canBeLeftOpenTag,shouldDecodeNewlines:e.shouldDecodeNewlines,shouldDecodeNewlinesForHref:e.shouldDecodeNewlinesForHref,shouldKeepComment:e.comments,start:function(t,a,c){var l=i&&i.ns||vu(t);Co&&"svg"===l&&(a=fi(a));var f=zr(t,a,i);l&&(f.ns=l), li(f)&&!Do()&&(f.forbidden=!0);for(var p=0;p<lu.length;p++)f=lu[p](f,e)||f;if(s||(Gr(f), f.pre&&(s=!0)), pu(f.tag)&&(u=!0), s?Qr(f):f.processed||(Yr(f), qr(f), ni(f), Wr(f,e)), r?o.length||r.if&&(f.elseif||f.else)&&ei(r,{exp:f.elseif,block:f}):r=f, i&&!f.forbidden)if(f.elseif||f.else)Xr(f,i);else if(f.slotScope){i.plain=!1;var d=f.slotTarget||'"default"';(i.scopedSlots||(i.scopedSlots={}))[d]=f;}else i.children.push(f), f.parent=i;c?n(f):(i=f, o.push(f));},end:function(){var t=o[o.length-1],e=t.children[t.children.length-1];e&&3===e.type&&" "===e.text&&!u&&t.children.pop(), o.length-=1, i=o[o.length-1], n(t);},chars:function(t){if(i&&(!Co||"textarea"!==i.tag||i.attrsMap.placeholder!==t)){var e=i.children;if(t=u||t.trim()?ci(i)?t:Mu(t):a&&e.length?" ":""){var n;!s&&" "!==t&&(n=Nr(t,uu))?e.push({type:2,expression:n.expression,tokens:n.tokens,text:t}):" "===t&&e.length&&" "===e[e.length-1].text||e.push({type:3,text:t});}}},comment:function(t){i.children.push({type:3,text:t,isComment:!0});}}), r}function Gr(t){null!=In(t,"v-pre")&&(t.pre=!0);}function Qr(t){var e=t.attrsList.length;if(e)for(var n=t.attrs=new Array(e),r=0;r<e;r++)n[r]={name:t.attrsList[r].name,value:JSON.stringify(t.attrsList[r].value)};else t.pre||(t.plain=!0);}function Wr(t,e){Jr(t), t.plain=!t.key&&!t.attrsList.length, Zr(t), ri(t), ii(t);for(var n=0;n<cu.length;n++)t=cu[n](t,e)||t;oi(t);}function Jr(t){var e=En(t,"key");e&&(t.key=e);}function Zr(t){var e=En(t,"ref");e&&(t.ref=e, t.refInFor=ai(t));}function Yr(t){var e;if(e=In(t,"v-for")){var n=Kr(e);n&&_(t,n);}}function Kr(t){var e=t.match(Su);if(e){var n={};n.for=e[2].trim();var r=e[1].trim().replace(ju,""),i=r.match(ku);return i?(n.alias=r.replace(ku,""), n.iterator1=i[1].trim(), i[2]&&(n.iterator2=i[2].trim())):n.alias=r, n}}function qr(t){var e=In(t,"v-if");if(e)t.if=e, ei(t,{exp:e,block:t});else{null!=In(t,"v-else")&&(t.else=!0);var n=In(t,"v-else-if");n&&(t.elseif=n);}}function Xr(t,e){var n=ti(e.children);n&&n.if&&ei(n,{exp:t.elseif,block:t});}function ti(t){for(var e=t.length;e--;){if(1===t[e].type)return t[e];t.pop();}}function ei(t,e){t.ifConditions||(t.ifConditions=[]), t.ifConditions.push(e);}function ni(t){null!=In(t,"v-once")&&(t.once=!0);}function ri(t){if("slot"===t.tag)t.slotName=En(t,"name");else{var e;"template"===t.tag?(e=In(t,"scope"), t.slotScope=e||In(t,"slot-scope")):(e=In(t,"slot-scope"))&&(t.slotScope=e);var n=En(t,"slot");n&&(t.slotTarget='""'===n?'"default"':n, "template"===t.tag||t.slotScope||Sn(t,"slot",n));}}function ii(t){var e;(e=En(t,"is"))&&(t.component=e), null!=In(t,"inline-template")&&(t.inlineTemplate=!0);}function oi(t){var e,n,r,i,o,a,s,u=t.attrsList;for(e=0, n=u.length;e<n;e++)if(r=i=u[e].name, o=u[e].value, $u.test(r))if(t.hasBindings=!0, a=si(r), a&&(r=r.replace(Iu,"")), Eu.test(r))r=r.replace(Eu,""), o=An(o), s=!1, a&&(a.prop&&(s=!0, "innerHtml"===(r=so(r))&&(r="innerHTML")), a.camel&&(r=so(r)), a.sync&&Tn(t,"update:"+so(r),Dn(o,"$event"))), s||!t.component&&du(t.tag,t.attrsMap.type,r)?$n(t,r,o):Sn(t,r,o);else if(Ou.test(r))r=r.replace(Ou,""), Tn(t,r,o,a,!1,su);else{r=r.replace($u,"");var c=r.match(Tu),l=c&&c[1];l&&(r=r.slice(0,-(l.length+1))), jn(t,r,i,o,l,a);}else{Sn(t,r,JSON.stringify(o)), !t.component&&"muted"===r&&du(t.tag,t.attrsMap.type,r)&&$n(t,r,"true");}}function ai(t){for(var e=t;e;){if(void 0!==e.for)return!0;e=e.parent;}return!1}function si(t){var e=t.match(Iu);if(e){var n={};return e.forEach(function(t){n[t.slice(1)]=!0;}), n}}function ui(t){for(var e={},n=0,r=t.length;n<r;n++)e[t[n].name]=t[n].value;return e}function ci(t){return"script"===t.tag||"style"===t.tag}function li(t){return"style"===t.tag||"script"===t.tag&&(!t.attrsMap.type||"text/javascript"===t.attrsMap.type)}function fi(t){for(var e=[],n=0;n<t.length;n++){var r=t[n];Du.test(r.name)||(r.name=r.name.replace(Bu,""), e.push(r));}return e}function pi(t,e){if("input"===t.tag){var n=t.attrsMap;if(n["v-model"]&&(n["v-bind:type"]||n[":type"])){var r=En(t,"type"),i=In(t,"v-if",!0),o=i?"&&("+i+")":"",a=null!=In(t,"v-else",!0),s=In(t,"v-else-if",!0),u=di(t);Yr(u), kn(u,"type","checkbox"), Wr(u,e), u.processed=!0, u.if="("+r+")==='checkbox'"+o, ei(u,{exp:u.if,block:u});var c=di(t);In(c,"v-for",!0), kn(c,"type","radio"), Wr(c,e), ei(u,{exp:"("+r+")==='radio'"+o,block:c});var l=di(t);return In(l,"v-for",!0), kn(l,":type",r), Wr(l,e), ei(u,{exp:i,block:l}), a?u.else=!0:s&&(u.elseif=s), u}}}function di(t){return zr(t.tag,t.attrsList.slice(),t.parent)}function vi(t,e){e.value&&$n(t,"textContent","_s("+e.value+")");}function hi(t,e){e.value&&$n(t,"innerHTML","_s("+e.value+")");}function mi(t,e){t&&(hu=Ru(e.staticKeys||""), mu=e.isReservedTag||fo, yi(t), bi(t,!1));}function gi(t){return v("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(t?","+t:""))}function yi(t){if(t.static=_i(t), 1===t.type){if(!mu(t.tag)&&"slot"!==t.tag&&null==t.attrsMap["inline-template"])return;for(var e=0,n=t.children.length;e<n;e++){var r=t.children[e];yi(r), r.static||(t.static=!1);}if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++){var a=t.ifConditions[i].block;yi(a), a.static||(t.static=!1);}}}function bi(t,e){if(1===t.type){if((t.static||t.once)&&(t.staticInFor=e), t.static&&t.children.length&&(1!==t.children.length||3!==t.children[0].type))return void(t.staticRoot=!0);if(t.staticRoot=!1, t.children)for(var n=0,r=t.children.length;n<r;n++)bi(t.children[n],e||!!t.for);if(t.ifConditions)for(var i=1,o=t.ifConditions.length;i<o;i++)bi(t.ifConditions[i].block,e);}}function _i(t){return 2!==t.type&&(3===t.type||!(!t.pre&&(t.hasBindings||t.if||t.for||ro(t.tag)||!mu(t.tag)||xi(t)||!Object.keys(t).every(hu))))}function xi(t){for(;t.parent;){if(t=t.parent, "template"!==t.tag)return!1;if(t.for)return!0}return!1}function Ai(t,e,n){var r=e?"nativeOn:{":"on:{";for(var i in t)r+='"'+i+'":'+wi(i,t[i])+",";return r.slice(0,-1)+"}"}function wi(t,e){if(!e)return"function(){}";if(Array.isArray(e))return"["+e.map(function(e){return wi(t,e)}).join(",")+"]";var n=Vu.test(e.value),r=Uu.test(e.value);if(e.modifiers){var i="",o="",a=[];for(var s in e.modifiers)if(Gu[s])o+=Gu[s], zu[s]&&a.push(s);else if("exact"===s){var u=e.modifiers;o+=Hu(["ctrl","shift","alt","meta"].filter(function(t){return!u[t]}).map(function(t){return"$event."+t+"Key"}).join("||"));}else a.push(s);a.length&&(i+=Ci(a)), o&&(i+=o);return"function($event){"+i+(n?e.value+"($event)":r?"("+e.value+")($event)":e.value)+"}"}return n||r?e.value:"function($event){"+e.value+"}"}function Ci(t){return"if(!('button' in $event)&&"+t.map(Oi).join("&&")+")return null;"}function Oi(t){var e=parseInt(t,10);if(e)return"$event.keyCode!=="+e;var n=zu[t];return"_k($event.keyCode,"+JSON.stringify(t)+","+JSON.stringify(n)+",$event.key)"}function $i(t,e){t.wrapListeners=function(t){return"_g("+t+","+e.value+")"};}function Si(t,e){t.wrapData=function(n){return"_b("+n+",'"+t.tag+"',"+e.value+","+(e.modifiers&&e.modifiers.prop?"true":"false")+(e.modifiers&&e.modifiers.sync?",true":"")+")"};}function ki(t,e){var n=new Wu(e);return{render:"with(this){return "+(t?ji(t,n):'_c("div")')+"}",staticRenderFns:n.staticRenderFns}}function ji(t,e){if(t.staticRoot&&!t.staticProcessed)return Ti(t,e);if(t.once&&!t.onceProcessed)return Ei(t,e);if(t.for&&!t.forProcessed)return Di(t,e);if(t.if&&!t.ifProcessed)return Ii(t,e);if("template"!==t.tag||t.slotTarget){if("slot"===t.tag)return Wi(t,e);var n;if(t.component)n=Ji(t.component,t,e);else{var r=t.plain?void 0:Bi(t,e),i=t.inlineTemplate?null:Ui(t,e,!0);n="_c('"+t.tag+"'"+(r?","+r:"")+(i?","+i:"")+")";}for(var o=0;o<e.transforms.length;o++)n=e.transforms[o](t,n);return n}return Ui(t,e)||"void 0"}function Ti(t,e){return t.staticProcessed=!0, e.staticRenderFns.push("with(this){return "+ji(t,e)+"}"), "_m("+(e.staticRenderFns.length-1)+(t.staticInFor?",true":"")+")"}function Ei(t,e){if(t.onceProcessed=!0, t.if&&!t.ifProcessed)return Ii(t,e);if(t.staticInFor){for(var n="",r=t.parent;r;){if(r.for){n=r.key;break}r=r.parent;}return n?"_o("+ji(t,e)+","+e.onceId+++","+n+")":ji(t,e)}return Ti(t,e)}function Ii(t,e,n,r){return t.ifProcessed=!0, Mi(t.ifConditions.slice(),e,n,r)}function Mi(t,e,n,r){function i(t){return n?n(t,e):t.once?Ei(t,e):ji(t,e)}if(!t.length)return r||"_e()";var o=t.shift();return o.exp?"("+o.exp+")?"+i(o.block)+":"+Mi(t,e,n,r):""+i(o.block)}function Di(t,e,n,r){var i=t.for,o=t.alias,a=t.iterator1?","+t.iterator1:"",s=t.iterator2?","+t.iterator2:"";return t.forProcessed=!0, (r||"_l")+"(("+i+"),function("+o+a+s+"){return "+(n||ji)(t,e)+"})"}function Bi(t,e){var n="{",r=Ni(t,e);r&&(n+=r+","), t.key&&(n+="key:"+t.key+","), t.ref&&(n+="ref:"+t.ref+","), t.refInFor&&(n+="refInFor:true,"), t.pre&&(n+="pre:true,"), t.component&&(n+='tag:"'+t.tag+'",');for(var i=0;i<e.dataGenFns.length;i++)n+=e.dataGenFns[i](t);if(t.attrs&&(n+="attrs:{"+Zi(t.attrs)+"},"), t.props&&(n+="domProps:{"+Zi(t.props)+"},"), t.events&&(n+=Ai(t.events,!1,e.warn)+","), t.nativeEvents&&(n+=Ai(t.nativeEvents,!0,e.warn)+","), t.slotTarget&&!t.slotScope&&(n+="slot:"+t.slotTarget+","), t.scopedSlots&&(n+=Li(t.scopedSlots,e)+","), t.model&&(n+="model:{value:"+t.model.value+",callback:"+t.model.callback+",expression:"+t.model.expression+"},"), t.inlineTemplate){var o=Pi(t,e);o&&(n+=o+",");}return n=n.replace(/,$/,"")+"}", t.wrapData&&(n=t.wrapData(n)), t.wrapListeners&&(n=t.wrapListeners(n)), n}function Ni(t,e){var n=t.directives;if(n){var r,i,o,a,s="directives:[",u=!1;for(r=0, i=n.length;r<i;r++){o=n[r], a=!0;var c=e.directives[o.name];c&&(a=!!c(t,o,e.warn)), a&&(u=!0, s+='{name:"'+o.name+'",rawName:"'+o.rawName+'"'+(o.value?",value:("+o.value+"),expression:"+JSON.stringify(o.value):"")+(o.arg?',arg:"'+o.arg+'"':"")+(o.modifiers?",modifiers:"+JSON.stringify(o.modifiers):"")+"},");}return u?s.slice(0,-1)+"]":void 0}}function Pi(t,e){var n=t.children[0];if(1===n.type){var r=ki(n,e.options);return"inlineTemplate:{render:function(){"+r.render+"},staticRenderFns:["+r.staticRenderFns.map(function(t){return"function(){"+t+"}"}).join(",")+"]}"}}function Li(t,e){return"scopedSlots:_u(["+Object.keys(t).map(function(n){return Fi(n,t[n],e)}).join(",")+"])"}function Fi(t,e,n){return e.for&&!e.forProcessed?Ri(t,e,n):"{key:"+t+",fn:function("+String(e.slotScope)+"){return "+("template"===e.tag?e.if?e.if+"?"+(Ui(e,n)||"undefined")+":undefined":Ui(e,n)||"undefined":ji(e,n))+"}}"}function Ri(t,e,n){var r=e.for,i=e.alias,o=e.iterator1?","+e.iterator1:"",a=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0, "_l(("+r+"),function("+i+o+a+"){return "+Fi(t,e,n)+"})"}function Ui(t,e,n,r,i){var o=t.children;if(o.length){var a=o[0];if(1===o.length&&a.for&&"template"!==a.tag&&"slot"!==a.tag)return(r||ji)(a,e);var s=n?Vi(o,e.maybeComponent):0,u=i||Hi;return"["+o.map(function(t){return u(t,e)}).join(",")+"]"+(s?","+s:"")}}function Vi(t,e){for(var n=0,r=0;r<t.length;r++){var i=t[r];if(1===i.type){if(zi(i)||i.ifConditions&&i.ifConditions.some(function(t){return zi(t.block)})){n=2;break}(e(i)||i.ifConditions&&i.ifConditions.some(function(t){return e(t.block)}))&&(n=1);}}return n}function zi(t){return void 0!==t.for||"template"===t.tag||"slot"===t.tag}function Hi(t,e){return 1===t.type?ji(t,e):3===t.type&&t.isComment?Qi(t):Gi(t)}function Gi(t){return"_v("+(2===t.type?t.expression:Yi(JSON.stringify(t.text)))+")"}function Qi(t){return"_e("+JSON.stringify(t.text)+")"}function Wi(t,e){var n=t.slotName||'"default"',r=Ui(t,e),i="_t("+n+(r?","+r:""),o=t.attrs&&"{"+t.attrs.map(function(t){return so(t.name)+":"+t.value}).join(",")+"}",a=t.attrsMap["v-bind"];return!o&&!a||r||(i+=",null"), o&&(i+=","+o), a&&(i+=(o?"":",null")+","+a), i+")"}function Ji(t,e,n){var r=e.inlineTemplate?null:Ui(e,n,!0);return"_c("+t+","+Bi(e,n)+(r?","+r:"")+")"}function Zi(t){for(var e="",n=0;n<t.length;n++){var r=t[n];e+='"'+r.name+'":'+Yi(r.value)+",";}return e.slice(0,-1)}function Yi(t){return t.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function Ki(t,e){try{return new Function(t)}catch(n){return e.push({err:n,code:t}), A}}function qi(t){var e=Object.create(null);return function(n,r,i){r=_({},r);r.warn;delete r.warn;var o=r.delimiters?String(r.delimiters)+n:n;if(e[o])return e[o];var a=t(n,r),s={},u=[];return s.render=Ki(a.render,u), s.staticRenderFns=a.staticRenderFns.map(function(t){return Ki(t,u)}), e[o]=s}}function Xi(t){return gu=gu||document.createElement("div"), gu.innerHTML=t?'<a href="\n"/>':'<div a="\n"/>', gu.innerHTML.indexOf("&#10;")>0}function to(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)), e.innerHTML}/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
var eo=Object.freeze({}),no=Object.prototype.toString,ro=v("slot,component",!0),io=v("key,ref,slot,slot-scope,is"),oo=Object.prototype.hasOwnProperty,ao=/-(\w)/g,so=g(function(t){return t.replace(ao,function(t,e){return e?e.toUpperCase():""})}),uo=g(function(t){return t.charAt(0).toUpperCase()+t.slice(1)}),co=/\B([A-Z])/g,lo=g(function(t){return t.replace(co,"-$1").toLowerCase()}),fo=function(t,e,n){return!1},po=function(t){return t},vo="data-server-rendered",ho=["component","directive","filter"],mo=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured"],go={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:fo,isReservedAttr:fo,isUnknownElement:fo,getTagNamespace:A,parsePlatformTagName:po,mustUseProp:fo,_lifecycleHooks:mo},yo=/[^\w.$]/,bo="__proto__"in{},_o="undefined"!=typeof window,xo="undefined"!=typeof WXEnvironment&&!!WXEnvironment.platform,Ao=xo&&WXEnvironment.platform.toLowerCase(),wo=_o&&window.navigator.userAgent.toLowerCase(),Co=wo&&/msie|trident/.test(wo),Oo=wo&&wo.indexOf("msie 9.0")>0,$o=wo&&wo.indexOf("edge/")>0,So=wo&&wo.indexOf("android")>0||"android"===Ao,ko=wo&&/iphone|ipad|ipod|ios/.test(wo)||"ios"===Ao,jo=(wo&&/chrome\/\d+/.test(wo), {}.watch),To=!1;if(_o)try{var Eo={};Object.defineProperty(Eo,"passive",{get:function(){To=!0;}}), window.addEventListener("test-passive",null,Eo);}catch(t){}var Io,Mo,Do=function(){return void 0===Io&&(Io=!_o&&void 0!==t&&"server"===t.process.env.VUE_ENV), Io},Bo=_o&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,No="undefined"!=typeof Symbol&&j(Symbol)&&"undefined"!=typeof Reflect&&j(Reflect.ownKeys);Mo="undefined"!=typeof Set&&j(Set)?Set:function(){function t(){this.set=Object.create(null);}return t.prototype.has=function(t){return!0===this.set[t]}, t.prototype.add=function(t){this.set[t]=!0;}, t.prototype.clear=function(){this.set=Object.create(null);}, t}();var Po=A,Lo=0,Fo=function(){this.id=Lo++, this.subs=[];};Fo.prototype.addSub=function(t){this.subs.push(t);}, Fo.prototype.removeSub=function(t){h(this.subs,t);}, Fo.prototype.depend=function(){Fo.target&&Fo.target.addDep(this);}, Fo.prototype.notify=function(){for(var t=this.subs.slice(),e=0,n=t.length;e<n;e++)t[e].update();}, Fo.target=null;var Ro=[],Uo=function(t,e,n,r,i,o,a,s){this.tag=t, this.data=e, this.children=n, this.text=r, this.elm=i, this.ns=void 0, this.context=o, this.fnContext=void 0, this.fnOptions=void 0, this.fnScopeId=void 0, this.key=e&&e.key, this.componentOptions=a, this.componentInstance=void 0, this.parent=void 0, this.raw=!1, this.isStatic=!1, this.isRootInsert=!0, this.isComment=!1, this.isCloned=!1, this.isOnce=!1, this.asyncFactory=s, this.asyncMeta=void 0, this.isAsyncPlaceholder=!1;},Vo={child:{configurable:!0}};Vo.child.get=function(){return this.componentInstance}, Object.defineProperties(Uo.prototype,Vo);var zo=function(t){void 0===t&&(t="");var e=new Uo;return e.text=t, e.isComment=!0, e},Ho=Array.prototype,Go=Object.create(Ho);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=Ho[t];S(Go,t,function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];var i,o=e.apply(this,n),a=this.__ob__;switch(t){case"push":case"unshift":i=n;break;case"splice":i=n.slice(2);}return i&&a.observeArray(i), a.dep.notify(), o});});var Qo=Object.getOwnPropertyNames(Go),Wo={shouldConvert:!0},Jo=function(t){if(this.value=t, this.dep=new Fo, this.vmCount=0, S(t,"__ob__",this), Array.isArray(t)){(bo?B:N)(t,Go,Qo), this.observeArray(t);}else this.walk(t);};Jo.prototype.walk=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)L(t,e[n],t[e[n]]);}, Jo.prototype.observeArray=function(t){for(var e=0,n=t.length;e<n;e++)P(t[e]);};var Zo=go.optionMergeStrategies;Zo.data=function(t,e,n){return n?z(t,e,n):e&&"function"!=typeof e?t:z(t,e)}, mo.forEach(function(t){Zo[t]=H;}), ho.forEach(function(t){Zo[t+"s"]=G;}), Zo.watch=function(t,e,n,r){if(t===jo&&(t=void 0), e===jo&&(e=void 0), !e)return Object.create(t||null);if(!t)return e;var i={};_(i,t);for(var o in e){var a=i[o],s=e[o];a&&!Array.isArray(a)&&(a=[a]), i[o]=a?a.concat(s):Array.isArray(s)?s:[s];}return i}, Zo.props=Zo.methods=Zo.inject=Zo.computed=function(t,e,n,r){if(!t)return e;var i=Object.create(null);return _(i,t), e&&_(i,e), i}, Zo.provide=z;var Yo,Ko,qo=function(t,e){return void 0===e?t:e},Xo=[],ta=!1,ea=!1;if(void 0!==n&&j(n))Ko=function(){n(it);};else if("undefined"==typeof MessageChannel||!j(MessageChannel)&&"[object MessageChannelConstructor]"!==MessageChannel.toString())Ko=function(){setTimeout(it,0);};else{var na=new MessageChannel,ra=na.port2;na.port1.onmessage=it, Ko=function(){ra.postMessage(1);};}if("undefined"!=typeof Promise&&j(Promise)){var ia=Promise.resolve();Yo=function(){ia.then(it), ko&&setTimeout(A);};}else Yo=Ko;var oa,aa=new Mo,sa=g(function(t){var e="&"===t.charAt(0);t=e?t.slice(1):t;var n="~"===t.charAt(0);t=n?t.slice(1):t;var r="!"===t.charAt(0);return t=r?t.slice(1):t, {name:t,once:n,capture:r,passive:e}}),ua=null,ca=[],la=[],fa={},pa=!1,da=!1,va=0,ha=0,ma=function(t,e,n,r,i){this.vm=t, i&&(t._watcher=this), t._watchers.push(this), r?(this.deep=!!r.deep, this.user=!!r.user, this.lazy=!!r.lazy, this.sync=!!r.sync):this.deep=this.user=this.lazy=this.sync=!1, this.cb=n, this.id=++ha, this.active=!0, this.dirty=this.lazy, this.deps=[], this.newDeps=[], this.depIds=new Mo, this.newDepIds=new Mo, this.expression="", "function"==typeof e?this.getter=e:(this.getter=k(e), this.getter||(this.getter=function(){})), this.value=this.lazy?void 0:this.get();};ma.prototype.get=function(){T(this);var t,e=this.vm;try{t=this.getter.call(e,e);}catch(t){if(!this.user)throw t;et(t,e,'getter for watcher "'+this.expression+'"');}finally{this.deep&&st(t), E(), this.cleanupDeps();}return t}, ma.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e), this.newDeps.push(t), this.depIds.has(e)||t.addSub(this));}, ma.prototype.cleanupDeps=function(){for(var t=this,e=this.deps.length;e--;){var n=t.deps[e];t.newDepIds.has(n.id)||n.removeSub(t);}var r=this.depIds;this.depIds=this.newDepIds, this.newDepIds=r, this.newDepIds.clear(), r=this.deps, this.deps=this.newDeps, this.newDeps=r, this.newDeps.length=0;}, ma.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():Vt(this);}, ma.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||u(t)||this.deep){var e=this.value;if(this.value=t, this.user)try{this.cb.call(this.vm,t,e);}catch(t){et(t,this.vm,'callback for watcher "'+this.expression+'"');}else this.cb.call(this.vm,t,e);}}}, ma.prototype.evaluate=function(){this.value=this.get(), this.dirty=!1;}, ma.prototype.depend=function(){for(var t=this,e=this.deps.length;e--;)t.deps[e].depend();}, ma.prototype.teardown=function(){var t=this;if(this.active){this.vm._isBeingDestroyed||h(this.vm._watchers,this);for(var e=this.deps.length;e--;)t.deps[e].removeSub(t);this.active=!1;}};var ga={enumerable:!0,configurable:!0,get:A,set:A},ya={lazy:!0};de(ve.prototype);var ba={init:function(t,e,n,r){if(!t.componentInstance||t.componentInstance._isDestroyed){(t.componentInstance=ye(t,ua,n,r)).$mount(e?t.elm:void 0,e);}else if(t.data.keepAlive){var i=t;ba.prepatch(i,i);}},prepatch:function(t,e){var n=e.componentOptions;It(e.componentInstance=t.componentInstance,n.propsData,n.listeners,e,n.children);},insert:function(t){var e=t.context,n=t.componentInstance;n._isMounted||(n._isMounted=!0, Nt(n,"mounted")), t.data.keepAlive&&(e._isMounted?Rt(n):Dt(n,!0));},destroy:function(t){var e=t.componentInstance;e._isDestroyed||(t.data.keepAlive?Bt(e,!0):e.$destroy());}},_a=Object.keys(ba),xa=1,Aa=2,wa=0;!function(t){t.prototype._init=function(t){var e=this;e._uid=wa++, e._isVue=!0, t&&t._isComponent?$e(e,t):e.$options=Z(Se(e.constructor),t||{},e), e._renderProxy=e, e._self=e, Tt(e), wt(e), Oe(e), Nt(e,"beforeCreate"), ee(e), Ht(e), te(e), Nt(e,"created"), e.$options.el&&e.$mount(e.$options.el);};}(Te), function(t){var e={};e.get=function(){return this._data};var n={};n.get=function(){return this._props}, Object.defineProperty(t.prototype,"$data",e), Object.defineProperty(t.prototype,"$props",n), t.prototype.$set=F, t.prototype.$delete=R, t.prototype.$watch=function(t,e,n){var r=this;if(c(e))return Xt(r,t,e,n);n=n||{}, n.user=!0;var i=new ma(r,t,e,n);return n.immediate&&e.call(r,i.value), function(){i.teardown();}};}(Te), function(t){var e=/^hook:/;t.prototype.$on=function(t,n){var r=this,i=this;if(Array.isArray(t))for(var o=0,a=t.length;o<a;o++)r.$on(t[o],n);else(i._events[t]||(i._events[t]=[])).push(n), e.test(t)&&(i._hasHookEvent=!0);return i}, t.prototype.$once=function(t,e){function n(){r.$off(t,n), e.apply(r,arguments);}var r=this;return n.fn=e, r.$on(t,n), r}, t.prototype.$off=function(t,e){var n=this,r=this;if(!arguments.length)return r._events=Object.create(null), r;if(Array.isArray(t)){for(var i=0,o=t.length;i<o;i++)n.$off(t[i],e);return r}var a=r._events[t];if(!a)return r;if(!e)return r._events[t]=null, r;if(e)for(var s,u=a.length;u--;)if((s=a[u])===e||s.fn===e){a.splice(u,1);break}return r}, t.prototype.$emit=function(t){var e=this,n=e._events[t];if(n){n=n.length>1?b(n):n;for(var r=b(arguments,1),i=0,o=n.length;i<o;i++)try{n[i].apply(e,r);}catch(n){et(n,e,'event handler for "'+t+'"');}}return e};}(Te), function(t){t.prototype._update=function(t,e){var n=this;n._isMounted&&Nt(n,"beforeUpdate");var r=n.$el,i=n._vnode,o=ua;ua=n, n._vnode=t, i?n.$el=n.__patch__(i,t):(n.$el=n.__patch__(n.$el,t,e,!1,n.$options._parentElm,n.$options._refElm), n.$options._parentElm=n.$options._refElm=null), ua=o, r&&(r.__vue__=null), n.$el&&(n.$el.__vue__=n), n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el);}, t.prototype.$forceUpdate=function(){var t=this;t._watcher&&t._watcher.update();}, t.prototype.$destroy=function(){var t=this;if(!t._isBeingDestroyed){Nt(t,"beforeDestroy"), t._isBeingDestroyed=!0;var e=t.$parent;!e||e._isBeingDestroyed||t.$options.abstract||h(e.$children,t), t._watcher&&t._watcher.teardown();for(var n=t._watchers.length;n--;)t._watchers[n].teardown();t._data.__ob__&&t._data.__ob__.vmCount--, t._isDestroyed=!0, t.__patch__(t._vnode,null), Nt(t,"destroyed"), t.$off(), t.$el&&(t.$el.__vue__=null), t.$vnode&&(t.$vnode.parent=null);}};}(Te), function(t){de(t.prototype), t.prototype.$nextTick=function(t){return at(t,this)}, t.prototype._render=function(){var t=this,e=t.$options,n=e.render,r=e._parentVnode;if(t._isMounted)for(var i in t.$slots){var o=t.$slots[i];(o._rendered||o[0]&&o[0].elm)&&(t.$slots[i]=D(o,!0));}t.$scopedSlots=r&&r.data.scopedSlots||eo, t.$vnode=r;var a;try{a=n.call(t._renderProxy,t.$createElement);}catch(e){et(e,t,"render"), a=t._vnode;}return a instanceof Uo||(a=zo()), a.parent=r, a};}(Te);var Ca=[String,RegExp,Array],Oa={name:"keep-alive",abstract:!0,props:{include:Ca,exclude:Ca,max:[String,Number]},created:function(){this.cache=Object.create(null), this.keys=[];},destroyed:function(){var t=this;for(var e in t.cache)Re(t.cache,e,t.keys);},watch:{include:function(t){Fe(this,function(e){return Le(t,e)});},exclude:function(t){Fe(this,function(e){return!Le(t,e)});}},render:function(){var t=this.$slots.default,e=At(t),n=e&&e.componentOptions;if(n){var r=Pe(n),i=this,o=i.include,a=i.exclude;if(o&&(!r||!Le(o,r))||a&&r&&Le(a,r))return e;var s=this,u=s.cache,c=s.keys,l=null==e.key?n.Ctor.cid+(n.tag?"::"+n.tag:""):e.key;u[l]?(e.componentInstance=u[l].componentInstance, h(c,l), c.push(l)):(u[l]=e, c.push(l), this.max&&c.length>parseInt(this.max)&&Re(u,c[0],c,this._vnode)), e.data.keepAlive=!0;}return e||t&&t[0]}},$a={KeepAlive:Oa};!function(t){var e={};e.get=function(){return go}, Object.defineProperty(t,"config",e), t.util={warn:Po,extend:_,mergeOptions:Z,defineReactive:L}, t.set=F, t.delete=R, t.nextTick=at, t.options=Object.create(null), ho.forEach(function(e){t.options[e+"s"]=Object.create(null);}), t.options._base=t, _(t.options.components,$a), Ee(t), Ie(t), Me(t), Ne(t);}(Te), Object.defineProperty(Te.prototype,"$isServer",{get:Do}), Object.defineProperty(Te.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}}), Te.version="2.5.13";var Sa,ka,ja,Ta,Ea,Ia,Ma,Da,Ba,Na=v("style,class"),Pa=v("input,textarea,option,select,progress"),La=function(t,e,n){return"value"===n&&Pa(t)&&"button"!==e||"selected"===n&&"option"===t||"checked"===n&&"input"===t||"muted"===n&&"video"===t},Fa=v("contenteditable,draggable,spellcheck"),Ra=v("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),Ua="http://www.w3.org/1999/xlink",Va=function(t){return":"===t.charAt(5)&&"xlink"===t.slice(0,5)},za=function(t){return Va(t)?t.slice(6,t.length):""},Ha=function(t){return null==t||!1===t},Ga={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},Qa=v("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Wa=v("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Ja=function(t){return"pre"===t},Za=function(t){return Qa(t)||Wa(t)},Ya=Object.create(null),Ka=v("text,number,password,search,email,tel,url"),qa=Object.freeze({createElement:Ke,createElementNS:qe,createTextNode:Xe,createComment:tn,insertBefore:en,removeChild:nn,appendChild:rn,parentNode:on,nextSibling:an,tagName:sn,setTextContent:un,setAttribute:cn}),Xa={create:function(t,e){ln(e);},update:function(t,e){t.data.ref!==e.data.ref&&(ln(t,!0), ln(e));},destroy:function(t){ln(t,!0);}},ts=new Uo("",{},[]),es=["create","activate","update","remove","destroy"],ns={create:vn,update:vn,destroy:function(t){vn(t,ts);}},rs=Object.create(null),is=[Xa,ns],os={create:bn,update:bn},as={create:xn,update:xn},ss=/[\w).+\-_$\]]/,us="__r",cs="__c",ls={create:Yn,update:Yn},fs={create:Kn,update:Kn},ps=g(function(t){var e={},n=/;(?![^(]*\))/g,r=/:(.+)/;return t.split(n).forEach(function(t){if(t){var n=t.split(r);n.length>1&&(e[n[0].trim()]=n[1].trim());}}), e}),ds=/^--/,vs=/\s*!important$/,hs=function(t,e,n){if(ds.test(e))t.style.setProperty(e,n);else if(vs.test(n))t.style.setProperty(e,n.replace(vs,""),"important");else{var r=gs(e);if(Array.isArray(n))for(var i=0,o=n.length;i<o;i++)t.style[r]=n[i];else t.style[r]=n;}},ms=["Webkit","Moz","ms"],gs=g(function(t){if(Ba=Ba||document.createElement("div").style, "filter"!==(t=so(t))&&t in Ba)return t;for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=0;n<ms.length;n++){var r=ms[n]+e;if(r in Ba)return r}}),ys={create:ir,update:ir},bs=g(function(t){return{enterClass:t+"-enter",enterToClass:t+"-enter-to",enterActiveClass:t+"-enter-active",leaveClass:t+"-leave",leaveToClass:t+"-leave-to",leaveActiveClass:t+"-leave-active"}}),_s=_o&&!Oo,xs="transition",As="animation",ws="transition",Cs="transitionend",Os="animation",$s="animationend";_s&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(ws="WebkitTransition", Cs="webkitTransitionEnd"), void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Os="WebkitAnimation", $s="webkitAnimationEnd"));var Ss=_o?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(t){return t()},ks=/\b(transform|all)(,|$)/,js=_o?{create:br,activate:br,remove:function(t,e){!0!==t.data.show?mr(t,e):e();}}:{},Ts=[os,as,ls,fs,ys,js],Es=Ts.concat(is),Is=function(t){function e(t){return new Uo(E.tagName(t).toLowerCase(),{},[],void 0,t)}function n(t,e){function n(){0==--n.listeners&&a(t);}return n.listeners=e, n}function a(t){var e=E.parentNode(t);i(e)&&E.removeChild(e,t);}function u(t,e,n,r,a){if(t.isRootInsert=!a, !c(t,e,n,r)){var s=t.data,u=t.children,l=t.tag;i(l)?(t.elm=t.ns?E.createElementNS(t.ns,l):E.createElement(l,t), g(t), d(t,u,e), i(s)&&m(t,e), p(n,t.elm,r)):o(t.isComment)?(t.elm=E.createComment(t.text), p(n,t.elm,r)):(t.elm=E.createTextNode(t.text), p(n,t.elm,r));}}function c(t,e,n,r){var a=t.data;if(i(a)){var s=i(t.componentInstance)&&a.keepAlive;if(i(a=a.hook)&&i(a=a.init)&&a(t,!1,n,r), i(t.componentInstance))return l(t,e), o(s)&&f(t,e,n,r), !0}}function l(t,e){i(t.data.pendingInsert)&&(e.push.apply(e,t.data.pendingInsert), t.data.pendingInsert=null), t.elm=t.componentInstance.$el, h(t)?(m(t,e), g(t)):(ln(t), e.push(t));}function f(t,e,n,r){for(var o,a=t;a.componentInstance;)if(a=a.componentInstance._vnode, i(o=a.data)&&i(o=o.transition)){for(o=0;o<j.activate.length;++o)j.activate[o](ts,a);e.push(a);break}p(n,t.elm,r);}function p(t,e,n){i(t)&&(i(n)?n.parentNode===t&&E.insertBefore(t,e,n):E.appendChild(t,e));}function d(t,e,n){if(Array.isArray(e))for(var r=0;r<e.length;++r)u(e[r],n,t.elm,null,!0);else s(t.text)&&E.appendChild(t.elm,E.createTextNode(String(t.text)));}function h(t){for(;t.componentInstance;)t=t.componentInstance._vnode;return i(t.tag)}function m(t,e){for(var n=0;n<j.create.length;++n)j.create[n](ts,t);S=t.data.hook, i(S)&&(i(S.create)&&S.create(ts,t), i(S.insert)&&e.push(t));}function g(t){var e;if(i(e=t.fnScopeId))E.setAttribute(t.elm,e,"");else for(var n=t;n;)i(e=n.context)&&i(e=e.$options._scopeId)&&E.setAttribute(t.elm,e,""), n=n.parent;i(e=ua)&&e!==t.context&&e!==t.fnContext&&i(e=e.$options._scopeId)&&E.setAttribute(t.elm,e,"");}function y(t,e,n,r,i,o){for(;r<=i;++r)u(n[r],o,t,e);}function b(t){var e,n,r=t.data;if(i(r))for(i(e=r.hook)&&i(e=e.destroy)&&e(t), e=0;e<j.destroy.length;++e)j.destroy[e](t);if(i(e=t.children))for(n=0;n<t.children.length;++n)b(t.children[n]);}function _(t,e,n,r){for(;n<=r;++n){var o=e[n];i(o)&&(i(o.tag)?(x(o), b(o)):a(o.elm));}}function x(t,e){if(i(e)||i(t.data)){var r,o=j.remove.length+1;for(i(e)?e.listeners+=o:e=n(t.elm,o), i(r=t.componentInstance)&&i(r=r._vnode)&&i(r.data)&&x(r,e), r=0;r<j.remove.length;++r)j.remove[r](t,e);i(r=t.data.hook)&&i(r=r.remove)?r(t,e):e();}else a(t.elm);}function A(t,e,n,o,a){for(var s,c,l,f,p=0,d=0,v=e.length-1,h=e[0],m=e[v],g=n.length-1,b=n[0],x=n[g],A=!a;p<=v&&d<=g;)r(h)?h=e[++p]:r(m)?m=e[--v]:fn(h,b)?(C(h,b,o), h=e[++p], b=n[++d]):fn(m,x)?(C(m,x,o), m=e[--v], x=n[--g]):fn(h,x)?(C(h,x,o), A&&E.insertBefore(t,h.elm,E.nextSibling(m.elm)), h=e[++p], x=n[--g]):fn(m,b)?(C(m,b,o), A&&E.insertBefore(t,m.elm,h.elm), m=e[--v], b=n[++d]):(r(s)&&(s=dn(e,p,v)), c=i(b.key)?s[b.key]:w(b,e,p,v), r(c)?u(b,o,t,h.elm):(l=e[c], fn(l,b)?(C(l,b,o), e[c]=void 0, A&&E.insertBefore(t,l.elm,h.elm)):u(b,o,t,h.elm)), b=n[++d]);p>v?(f=r(n[g+1])?null:n[g+1].elm, y(t,f,n,d,g,o)):d>g&&_(t,e,p,v);}function w(t,e,n,r){for(var o=n;o<r;o++){var a=e[o];if(i(a)&&fn(t,a))return o}}function C(t,e,n,a){if(t!==e){var s=e.elm=t.elm;if(o(t.isAsyncPlaceholder))return void(i(e.asyncFactory.resolved)?$(t.elm,e,n):e.isAsyncPlaceholder=!0);if(o(e.isStatic)&&o(t.isStatic)&&e.key===t.key&&(o(e.isCloned)||o(e.isOnce)))return void(e.componentInstance=t.componentInstance);var u,c=e.data;i(c)&&i(u=c.hook)&&i(u=u.prepatch)&&u(t,e);var l=t.children,f=e.children;if(i(c)&&h(e)){for(u=0;u<j.update.length;++u)j.update[u](t,e);i(u=c.hook)&&i(u=u.update)&&u(t,e);}r(e.text)?i(l)&&i(f)?l!==f&&A(s,l,f,n,a):i(f)?(i(t.text)&&E.setTextContent(s,""), y(s,null,f,0,f.length-1,n)):i(l)?_(s,l,0,l.length-1):i(t.text)&&E.setTextContent(s,""):t.text!==e.text&&E.setTextContent(s,e.text), i(c)&&i(u=c.hook)&&i(u=u.postpatch)&&u(t,e);}}function O(t,e,n){if(o(n)&&i(t.parent))t.parent.data.pendingInsert=e;else for(var r=0;r<e.length;++r)e[r].data.hook.insert(e[r]);}function $(t,e,n,r){var a,s=e.tag,u=e.data,c=e.children;if(r=r||u&&u.pre, e.elm=t, o(e.isComment)&&i(e.asyncFactory))return e.isAsyncPlaceholder=!0, !0;if(i(u)&&(i(a=u.hook)&&i(a=a.init)&&a(e,!0), i(a=e.componentInstance)))return l(e,n), !0;if(i(s)){if(i(c))if(t.hasChildNodes())if(i(a=u)&&i(a=a.domProps)&&i(a=a.innerHTML)){if(a!==t.innerHTML)return!1}else{for(var f=!0,p=t.firstChild,v=0;v<c.length;v++){if(!p||!$(p,c[v],n,r)){f=!1;break}p=p.nextSibling;}if(!f||p)return!1}else d(e,c,n);if(i(u)){var h=!1;for(var g in u)if(!I(g)){h=!0, m(e,n);break}!h&&u.class&&st(u.class);}}else t.data!==e.text&&(t.data=e.text);return!0}var S,k,j={},T=t.modules,E=t.nodeOps;for(S=0;S<es.length;++S)for(j[es[S]]=[], k=0;k<T.length;++k)i(T[k][es[S]])&&j[es[S]].push(T[k][es[S]]);var I=v("attrs,class,staticClass,staticStyle,key");return function(t,n,a,s,c,l){if(r(n))return void(i(t)&&b(t));var f=!1,p=[];if(r(t))f=!0, u(n,p,c,l);else{var d=i(t.nodeType);if(!d&&fn(t,n))C(t,n,p,s);else{if(d){if(1===t.nodeType&&t.hasAttribute(vo)&&(t.removeAttribute(vo), a=!0), o(a)&&$(t,n,p))return O(n,p,!0), t;t=e(t);}var v=t.elm,m=E.parentNode(v);if(u(n,p,v._leaveCb?null:m,E.nextSibling(v)), i(n.parent))for(var g=n.parent,y=h(n);g;){for(var x=0;x<j.destroy.length;++x)j.destroy[x](g);if(g.elm=n.elm, y){for(var A=0;A<j.create.length;++A)j.create[A](ts,g);var w=g.data.hook.insert;if(w.merged)for(var S=1;S<w.fns.length;S++)w.fns[S]();}else ln(g);g=g.parent;}i(m)?_(m,[t],0,0):i(t.tag)&&b(t);}}return O(n,p,f), n.elm}}({nodeOps:qa,modules:Es});Oo&&document.addEventListener("selectionchange",function(){var t=document.activeElement;t&&t.vmodel&&$r(t,"input");});var Ms={inserted:function(t,e,n,r){"select"===n.tag?(r.elm&&!r.elm._vOptions?ft(n,"postpatch",function(){Ms.componentUpdated(t,e,n);}):_r(t,e,n.context), t._vOptions=[].map.call(t.options,wr)):("textarea"===n.tag||Ka(t.type))&&(t._vModifiers=e.modifiers, e.modifiers.lazy||(t.addEventListener("change",Or), So||(t.addEventListener("compositionstart",Cr), t.addEventListener("compositionend",Or)), Oo&&(t.vmodel=!0)));},componentUpdated:function(t,e,n){if("select"===n.tag){_r(t,e,n.context);var r=t._vOptions,i=t._vOptions=[].map.call(t.options,wr);if(i.some(function(t,e){return!w(t,r[e])})){(t.multiple?e.value.some(function(t){return Ar(t,i)}):e.value!==e.oldValue&&Ar(e.value,i))&&$r(t,"change");}}}},Ds={bind:function(t,e,n){var r=e.value;n=Sr(n);var i=n.data&&n.data.transition,o=t.__vOriginalDisplay="none"===t.style.display?"":t.style.display;r&&i?(n.data.show=!0, hr(n,function(){t.style.display=o;})):t.style.display=r?o:"none";},update:function(t,e,n){var r=e.value;r!==e.oldValue&&(n=Sr(n), n.data&&n.data.transition?(n.data.show=!0, r?hr(n,function(){t.style.display=t.__vOriginalDisplay;}):mr(n,function(){t.style.display="none";})):t.style.display=r?t.__vOriginalDisplay:"none");},unbind:function(t,e,n,r,i){i||(t.style.display=t.__vOriginalDisplay);}},Bs={model:Ms,show:Ds},Ns={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]},Ps={name:"transition",props:Ns,abstract:!0,render:function(t){var e=this,n=this.$slots.default;if(n&&(n=n.filter(function(t){return t.tag||xt(t)}), n.length)){var r=this.mode,i=n[0];if(Er(this.$vnode))return i;var o=kr(i);if(!o)return i;if(this._leaving)return Tr(t,i);var a="__transition-"+this._uid+"-";o.key=null==o.key?o.isComment?a+"comment":a+o.tag:s(o.key)?0===String(o.key).indexOf(a)?o.key:a+o.key:o.key;var u=(o.data||(o.data={})).transition=jr(this),c=this._vnode,l=kr(c);if(o.data.directives&&o.data.directives.some(function(t){return"show"===t.name})&&(o.data.show=!0), l&&l.data&&!Ir(o,l)&&!xt(l)&&(!l.componentInstance||!l.componentInstance._vnode.isComment)){var f=l.data.transition=_({},u);if("out-in"===r)return this._leaving=!0, ft(f,"afterLeave",function(){e._leaving=!1, e.$forceUpdate();}), Tr(t,i);if("in-out"===r){if(xt(o))return c;var p,d=function(){p();};ft(u,"afterEnter",d), ft(u,"enterCancelled",d), ft(f,"delayLeave",function(t){p=t;});}}return i}}},Ls=_({tag:String,moveClass:String},Ns);delete Ls.mode;var Fs={props:Ls,render:function(t){for(var e=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=jr(this),s=0;s<i.length;s++){var u=i[s];if(u.tag)if(null!=u.key&&0!==String(u.key).indexOf("__vlist"))o.push(u), n[u.key]=u, (u.data||(u.data={})).transition=a;else;}if(r){for(var c=[],l=[],f=0;f<r.length;f++){var p=r[f];p.data.transition=a, p.data.pos=p.elm.getBoundingClientRect(), n[p.key]?c.push(p):l.push(p);}this.kept=t(e,null,c), this.removed=l;}return t(e,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0), this._vnode=this.kept;},updated:function(){var t=this.prevChildren,e=this.moveClass||(this.name||"v")+"-move";t.length&&this.hasMove(t[0].elm,e)&&(t.forEach(Mr), t.forEach(Dr), t.forEach(Br), this._reflow=document.body.offsetHeight, t.forEach(function(t){if(t.data.moved){var n=t.elm,r=n.style;cr(n,e), r.transform=r.WebkitTransform=r.transitionDuration="", n.addEventListener(Cs,n._moveCb=function t(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Cs,t), n._moveCb=null, lr(n,e));});}}));},methods:{hasMove:function(t,e){if(!_s)return!1;if(this._hasMove)return this._hasMove;var n=t.cloneNode();t._transitionClasses&&t._transitionClasses.forEach(function(t){ar(n,t);}), or(n,e), n.style.display="none", this.$el.appendChild(n);var r=pr(n);return this.$el.removeChild(n), this._hasMove=r.hasTransform}}},Rs={Transition:Ps,TransitionGroup:Fs};Te.config.mustUseProp=La, Te.config.isReservedTag=Za, Te.config.isReservedAttr=Na, Te.config.getTagNamespace=Je, Te.config.isUnknownElement=Ze, _(Te.options.directives,Bs), _(Te.options.components,Rs), Te.prototype.__patch__=_o?Is:A, Te.prototype.$mount=function(t,e){return t=t&&_o?Ye(t):void 0, Et(this,t,e)}, Te.nextTick(function(){go.devtools&&Bo&&Bo.emit("init",Te);},0);var Us,Vs=/\{\{((?:.|\n)+?)\}\}/g,zs=/[-.*+?^${}()|[\]\/\\]/g,Hs=g(function(t){var e=t[0].replace(zs,"\\$&"),n=t[1].replace(zs,"\\$&");return new RegExp(e+"((?:.|\\n)+?)"+n,"g")}),Gs={staticKeys:["staticClass"],transformNode:Pr,genData:Lr},Qs={staticKeys:["staticStyle"],transformNode:Fr,genData:Rr},Ws={decode:function(t){return Us=Us||document.createElement("div"), Us.innerHTML=t, Us.textContent}},Js=v("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),Zs=v("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),Ys=v("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),Ks=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,qs="[a-zA-Z_][\\w\\-\\.]*",Xs="((?:"+qs+"\\:)?"+qs+")",tu=new RegExp("^<"+Xs),eu=/^\s*(\/?)>/,nu=new RegExp("^<\\/"+Xs+"[^>]*>"),ru=/^<!DOCTYPE [^>]+>/i,iu=/^<!--/,ou=/^<!\[/,au=!1;"x".replace(/x(.)?/g,function(t,e){au=""===e;});var su,uu,cu,lu,fu,pu,du,vu,hu,mu,gu,yu=v("script,style,textarea",!0),bu={},_u={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t"},xu=/&(?:lt|gt|quot|amp);/g,Au=/&(?:lt|gt|quot|amp|#10|#9);/g,wu=v("pre,textarea",!0),Cu=function(t,e){return t&&wu(t)&&"\n"===e[0]},Ou=/^@|^v-on:/,$u=/^v-|^@|^:/,Su=/(.*?)\s+(?:in|of)\s+(.*)/,ku=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,ju=/^\(|\)$/g,Tu=/:(.*)$/,Eu=/^:|^v-bind:/,Iu=/\.[^.]+/g,Mu=g(Ws.decode),Du=/^xmlns:NS\d+/,Bu=/^NS\d+:/,Nu={preTransformNode:pi},Pu=[Gs,Qs,Nu],Lu={model:Un,text:vi,html:hi},Fu={expectHTML:!0,modules:Pu,directives:Lu,isPreTag:Ja,isUnaryTag:Js,mustUseProp:La,canBeLeftOpenTag:Zs,isReservedTag:Za,getTagNamespace:Je,staticKeys:function(t){return t.reduce(function(t,e){return t.concat(e.staticKeys||[])},[]).join(",")}(Pu)},Ru=g(gi),Uu=/^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,Vu=/^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/,zu={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},Hu=function(t){return"if("+t+")return null;"},Gu={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:Hu("$event.target !== $event.currentTarget"),ctrl:Hu("!$event.ctrlKey"),shift:Hu("!$event.shiftKey"),alt:Hu("!$event.altKey"),meta:Hu("!$event.metaKey"),left:Hu("'button' in $event && $event.button !== 0"),middle:Hu("'button' in $event && $event.button !== 1"),right:Hu("'button' in $event && $event.button !== 2")},Qu={on:$i,bind:Si,cloak:A},Wu=function(t){this.options=t, this.warn=t.warn||Cn, this.transforms=On(t.modules,"transformCode"), this.dataGenFns=On(t.modules,"genData"), this.directives=_(_({},Qu),t.directives);var e=t.isReservedTag||fo;this.maybeComponent=function(t){return!e(t.tag)}, this.onceId=0, this.staticRenderFns=[];},Ju=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"), new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)"), function(t){return function(e){function n(n,r){var i=Object.create(e),o=[],a=[];if(i.warn=function(t,e){(e?a:o).push(t);}, r){r.modules&&(i.modules=(e.modules||[]).concat(r.modules)), r.directives&&(i.directives=_(Object.create(e.directives||null),r.directives));for(var s in r)"modules"!==s&&"directives"!==s&&(i[s]=r[s]);}var u=t(n,i);return u.errors=o, u.tips=a, u}return{compile:n,compileToFunctions:qi(n)}}}(function(t,e){var n=Hr(t.trim(),e);!1!==e.optimize&&mi(n,e);var r=ki(n,e);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}})),Zu=Ju(Fu),Yu=Zu.compileToFunctions,Ku=!!_o&&Xi(!1),qu=!!_o&&Xi(!0),Xu=g(function(t){var e=Ye(t);return e&&e.innerHTML}),tc=Te.prototype.$mount;Te.prototype.$mount=function(t,e){if((t=t&&Ye(t))===document.body||t===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(r=Xu(r));else{if(!r.nodeType)return this;r=r.innerHTML;}else t&&(r=to(t));if(r){var i=Yu(r,{shouldDecodeNewlines:Ku,shouldDecodeNewlinesForHref:qu,delimiters:n.delimiters,comments:n.comments},this),o=i.render,a=i.staticRenderFns;n.render=o, n.staticRenderFns=a;}}return tc.call(this,t,e)}, Te.compile=Yu, e.a=Te;}).call(e,n("DuR2"),n("162o").setImmediate);},"77Pl":function(t,e,n){var r=n("EqjI");t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t};},"7KvD":function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n);},"7UMu":function(t,e,n){var r=n("R9M2");t.exports=Array.isArray||function(t){return"Array"==r(t)};},"7YkW":function(t,e,n){function r(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new i;++e<n;)this.add(t[e]);}var i=n("YeCl"),o=n("Cskv"),a=n("aQOO");r.prototype.add=r.prototype.push=o, r.prototype.has=a, t.exports=r;},"7e4z":function(t,e,n){function r(t,e){var n=a(t),r=!n&&o(t),l=!n&&!r&&s(t),p=!n&&!r&&!l&&c(t),d=n||r||l||p,v=d?i(t.length,String):[],h=v.length;for(var m in t)!e&&!f.call(t,m)||d&&("length"==m||l&&("offset"==m||"parent"==m)||p&&("buffer"==m||"byteLength"==m||"byteOffset"==m)||u(m,h))||v.push(m);return v}var i=n("uieL"),o=n("1Yb9"),a=n("NGEn"),s=n("ggOT"),u=n("ZGh9"),c=n("YsVG"),l=Object.prototype,f=l.hasOwnProperty;t.exports=r;},"7tvR":function(t,e,n){e.a={props:{size:{type:String,default:"medium"},squared:Boolean,src:{type:String,required:!0}}};},"880/":function(t,e,n){t.exports=n("hJx8");},"8J60":function(t,e,n){e.a={render:function(t){var e=this,n={disabled:this.disabled,href:this.href,target:this.target},r=this.href?"a":"button",i={click:function(){return e.$emit("click")},mousedown:function(){return e.$emit("mousedown")},mouseup:function(){return e.$emit("mouseup")}};return t(r,{class:this.classObject,on:i,attrs:n},this.$slots.default)},props:{compact:Boolean,disabled:Boolean,href:String,light:Boolean,subtle:Boolean,target:String,type:{type:String,validator:function(t){return"primary"===t||"link"===t}}},computed:{classObject:function(){return{"aui-button":!0,"aui-button-primary":"primary"===this.type,"aui-button-link":"link"===this.type,"aui-button-light":this.light,"aui-button-subtle":this.subtle,"aui-button-compact":this.compact}}}};},"94VQ":function(t,e,n){var r=n("Yobk"),i=n("X8DO"),o=n("e6n0"),a={};n("hJx8")(a,n("dSzd")("iterator"),function(){return this}), t.exports=function(t,e,n){t.prototype=r(a,{next:i(1,n)}), o(t,e+" Iterator");};},"94sX":function(t,e,n){function r(){this.__data__=i?i(null):{}, this.size=0;}var i=n("dCZQ");t.exports=r;},"9bBU":function(t,e,n){n("mClu");var r=n("FeBl").Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)};},"9yDk":function(t,e,n){var r=n("rdWa"),i=n("JTZO"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},"A/bR":function(t,e,n){function r(t){n("oQaK");}var i=n("W+aG"),o=n("WEmM"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,null,null);e.a=u.exports;},A9mX:function(t,e,n){function r(t){var e=i(this,t).delete(t);return this.size-=e?1:0, e}var i=n("pTUa");t.exports=r;},ANu0:function(t,e,n){function r(t){n("Td2t");}var i=n("0wjB"),o=n("chwb"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,"data-v-f86fda6a",null);e.a=u.exports;},"Ai/T":function(t,e){function n(t){if(null!=t){try{return i.call(t)}catch(t){}try{return t+""}catch(t){}}return""}var r=Function.prototype,i=r.toString;t.exports=n;},"B/s1":function(t,e,n){function r(t){n("hQeI");}var i=n("Pg23"),o=n("MQ5l"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,null,null);e.a=u.exports;},BO1k:function(t,e,n){t.exports={default:n("fxRn"),__esModule:!0};},Bdsj:function(t,e,n){var r=n("nHtQ"),i=n("QfuG"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},BwfY:function(t,e,n){n("fWfb"), n("M6a0"), n("OYls"), n("QWe/"), t.exports=n("FeBl").Symbol;},"C0/+":function(t,e,n){var r=n("pxkB"),i=n("YTR3"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},C0hh:function(t,e){function n(){return[]}t.exports=n;},C4MV:function(t,e,n){t.exports={default:n("9bBU"),__esModule:!0};},CW5P:function(t,e,n){function r(){this.size=0, this.__data__={hash:new i,map:new(a||o),string:new i};}var i=n("T/bE"),o=n("duB3"),a=n("POb3");t.exports=r;},Cskv:function(t,e){function n(t){return this.__data__.set(t,r), this}var r="__lodash_hash_undefined__";t.exports=n;},D2L2:function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)};},Dc0G:function(t,e,n){(function(t){var r=n("blYT"),i="object"==typeof e&&e&&!e.nodeType&&e,o=i&&"object"==typeof t&&t&&!t.nodeType&&t,a=o&&o.exports===i,s=a&&r.process,u=function(){try{return s&&s.binding&&s.binding("util")}catch(t){}}();t.exports=u;}).call(e,n("3IRH")(t));},Dd8w:function(t,e,n){e.__esModule=!0;var r=n("woOf"),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=i.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r]);}return t};},DuR2:function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(eval)("this");}catch(t){"object"==typeof window&&(n=window);}t.exports=n;},Dv2r:function(t,e,n){function r(t,e){var n=i(this,t),r=n.size;return n.set(t,e), this.size+=n.size==r?0:1, this}var i=n("pTUa");t.exports=r;},E4Hj:function(t,e){function n(t){return this.__data__.get(t)}t.exports=n;},E9To:function(t,e,n){var r=n("oJS2");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("1d29b8bd",r,!0,{});},EDRE:function(t,e,n){var r=n("QDt5"),i=n("bMfN"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},EGZi:function(t,e){t.exports=function(t,e){return{value:e,done:!!t}};},EHRO:function(t,e,n){function r(t,e,n,r,i,w,O){switch(n){case A:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer, e=e.buffer;case x:return!(t.byteLength!=e.byteLength||!w(new o(t),new o(e)));case p:case d:case m:return a(+t,+e);case v:return t.name==e.name&&t.message==e.message;case g:case b:return t==e+"";case h:var $=u;case y:var S=r&l;if($||($=c), t.size!=e.size&&!S)return!1;var k=O.get(t);if(k)return k==e;r|=f, O.set(t,e);var j=s($(t),$(e),r,i,w,O);return O.delete(t), j;case _:if(C)return C.call(t)==C.call(e)}return!1}var i=n("NkRn"),o=n("qwTf"),a=n("22B7"),s=n("FhcP"),u=n("WFiI"),c=n("octw"),l=1,f=2,p="[object Boolean]",d="[object Date]",v="[object Error]",h="[object Map]",m="[object Number]",g="[object RegExp]",y="[object Set]",b="[object String]",_="[object Symbol]",x="[object ArrayBuffer]",A="[object DataView]",w=i?i.prototype:void 0,C=w?w.valueOf:void 0;t.exports=r;},EXMZ:function(t,e,n){var r=n("qh/x"),i=n("WdV/"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},EmEE:function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",{class:t.classObject},[t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},EqjI:function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t};},FCuZ:function(t,e,n){function r(t,e,n){var r=e(t);return o(t)?r:i(r,n(t))}var i=n("uIr7"),o=n("NGEn");t.exports=r;},"FZ+f":function(t,e){function n(t,e){var n=t[1]||"",i=t[3];if(!i)return n;if(e&&"function"==typeof btoa){var o=r(i);return[n].concat(i.sources.map(function(t){return"/*# sourceURL="+i.sourceRoot+t+" */"})).concat([o]).join("\n")}return[n].join("\n")}function r(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var r=n(e,t);return e[2]?"@media "+e[2]+"{"+r+"}":r}).join("")}, e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0);}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"), e.push(a));}}, e};},FeBl:function(t,e){var n=t.exports={version:"2.5.3"};"number"==typeof __e&&(__e=n);},FhcP:function(t,e,n){function r(t,e,n,r,c,l){var f=n&s,p=t.length,d=e.length;if(p!=d&&!(f&&d>p))return!1;var v=l.get(t);if(v&&l.get(e))return v==e;var h=-1,m=!0,g=n&u?new i:void 0;for(l.set(t,e), l.set(e,t);++h<p;){var y=t[h],b=e[h];if(r)var _=f?r(b,y,h,e,t,l):r(y,b,h,t,e,l);if(void 0!==_){if(_)continue;m=!1;break}if(g){if(!o(e,function(t,e){if(!a(g,e)&&(y===t||c(y,t,n,r,l)))return g.push(e)})){m=!1;break}}else if(y!==b&&!c(y,b,n,r,l)){m=!1;break}}return l.delete(t), l.delete(e), m}var i=n("7YkW"),o=n("2X2u"),a=n("dmQx"),s=1,u=2;t.exports=r;},G2xm:function(t,e){function n(t){return this.__data__.has(t)}t.exports=n;},"G3/m":function(t,e,n){var r=n("unPb"),i=n("4wdF"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},HT7L:function(t,e){function n(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||r)}var r=Object.prototype;t.exports=n;},HnFe:function(t,e,n){var r=n("Dd8w"),i=n.n(r),o=n("jyVo");e.a={data:function(){return{id:Object(o.a)("aui-inline-dialog")}},props:{open:Boolean,persistent:Boolean,alignment:String,respondsTo:{type:String,default:"toggle"}},render:function(t){var e=this.$slots.trigger[0];return this.injectAttributes(e), t("span",[this.$slots.trigger,t("aui-inline-dialog",{class:{"vue-inline-dialog":!0},attrs:{id:this.id,open:this.open,persistent:this.persistent,alignment:this.alignment,"responds-to":"none"!==this.respondsTo?this.respondsTo:null},ref:"inlineDialogElement"},[t("div",{class:{"aui-inline-dialog-contents":!0}},this.$slots.dialog)])])},methods:{injectAttributes:function(t){t.data.attrs=i()({},t.data.attrs,{href:"#"+this.id,"aria-controls":this.id,"data-aui-trigger":"none"!==this.respondsTo});}},mounted:function(){var t=this;this.$refs.inlineDialogElement.addEventListener("aui-hide",function(){return t.$emit("aui-hide")}), this.$refs.inlineDialogElement.addEventListener("aui-show",function(){return t.$emit("aui-show")});}};},Hxdr:function(t,e){function n(t,e){for(var n=-1,r=null==t?0:t.length,i=Array(r);++n<r;)i[n]=e(t[n],n,t);return i}t.exports=n;},Hz6t:function(t,e,n){e.a={};},ICSD:function(t,e,n){function r(t,e){var n=o(t,e);return i(n)?n:void 0}var i=n("ITwD"),o=n("mTAn");t.exports=r;},IGcM:function(t,e,n){function r(t,e,n){e=i(e,t);for(var r=-1,l=e.length,f=!1;++r<l;){var p=c(e[r]);if(!(f=null!=t&&n(t,p)))break;t=t[p];}return f||++r!=l?f:!!(l=null==t?0:t.length)&&u(l)&&s(p,l)&&(a(t)||o(t))}var i=n("bIjD"),o=n("1Yb9"),a=n("NGEn"),s=n("ZGh9"),u=n("Rh28"),c=n("Ubhr");t.exports=r;},ITwD:function(t,e,n){function r(t){return!(!a(t)||o(t))&&(i(t)?v:c).test(s(t))}var i=n("gGqR"),o=n("eFps"),a=n("yCNF"),s=n("Ai/T"),u=/[\\^$.*+?()[\]{}|]/g,c=/^\[object .+?Constructor\]$/,l=Function.prototype,f=Object.prototype,p=l.toString,d=f.hasOwnProperty,v=RegExp("^"+p.call(d).replace(u,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=r;},Ibhu:function(t,e,n){var r=n("D2L2"),i=n("TcQ7"),o=n("vFc/")(!1),a=n("ax3d")("IE_PROTO");t.exports=function(t,e){var n,s=i(t),u=0,c=[];for(n in s)n!=a&&r(s,n)&&c.push(n);for(;e.length>u;)r(s,n=e[u++])&&(~o(c,n)||c.push(n));return c};},JBvZ:function(t,e,n){function r(t){var e=this.__data__,n=i(e,t);return n<0?void 0:e[n][1]}var i=n("imBK");t.exports=r;},JTZO:function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"tabs-pane",attrs:{id:t.id}},[t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},JyYQ:function(t,e,n){function r(t){return"function"==typeof t?t:null==t?a:"object"==typeof t?s(t)?o(t[0],t[1]):i(t):u(t)}var i=n("d+aQ"),o=n("eKBv"),a=n("wSKX"),s=n("NGEn"),u=n("iL3P");t.exports=r;},KgVm:function(t,e,n){function r(t,e,n){var r=null==t?0:t.length;if(!r)return-1;var u=null==n?0:a(n);return u<0&&(u=s(r+u,0)), i(t,o(e,3),u)}var i=n("cdq7"),o=n("JyYQ"),a=n("5Zxu"),s=Math.max;t.exports=r;},Kh4W:function(t,e,n){e.f=n("dSzd");},KmWZ:function(t,e,n){function r(){this.__data__=new i, this.size=0;}var i=n("duB3");t.exports=r;},LKZe:function(t,e,n){var r=n("NpIQ"),i=n("X8DO"),o=n("TcQ7"),a=n("MmMw"),s=n("D2L2"),u=n("SfB7"),c=Object.getOwnPropertyDescriptor;e.f=n("+E39")?c:function(t,e){if(t=o(t), e=a(e,!0), u)try{return c(t,e)}catch(t){}if(s(t,e))return i(!r.f.call(t,e),t[e])};},M6a0:function(t,e){},MDxl:function(t,e,n){var r=n("bnAi"),i=n("EmEE"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},MQ5l:function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",{staticClass:"aui-spinner-container",style:t.containerSize})},i=[],o={render:r,staticRenderFns:i};e.a=o;},MU5D:function(t,e,n){var r=n("R9M2");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)};},MmMw:function(t,e,n){var r=n("EqjI");t.exports=function(t,e){if(!r(t))return t;var n,i;if(e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;if("function"==typeof(n=t.valueOf)&&!r(i=n.call(t)))return i;if(!e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t)))return i;throw TypeError("Can't convert object to primitive value")};},MoMe:function(t,e,n){function r(t){return i(t,a,o)}var i=n("FCuZ"),o=n("l9Lx"),a=n("ktak");t.exports=r;},NGEn:function(t,e){var n=Array.isArray;t.exports=n;},NkRn:function(t,e,n){var r=n("TQ3y"),i=r.Symbol;t.exports=i;},NpIQ:function(t,e){e.f={}.propertyIsEnumerable;},NqZt:function(t,e){function n(t){var e=this.__data__,n=e.delete(t);return this.size=e.size, n}t.exports=n;},O4g8:function(t,e){t.exports=!0;},OCYs:function(t,e,n){function r(t){n("ZsEX");}var i=n("HnFe"),o=n("VU/8"),a=r,s=o(i.a,null,!1,a,null,null);e.a=s.exports;},ON07:function(t,e,n){var r=n("EqjI"),i=n("7KvD").document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}};},OYls:function(t,e,n){n("crlp")("asyncIterator");},POb3:function(t,e,n){var r=n("ICSD"),i=n("TQ3y"),o=r(i,"Map");t.exports=o;},Pfi1:function(t,e,n){function r(t){n("E9To");}var i=n("6rBM"),o=n("5U4r"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,null,null);e.a=u.exports;},Pg23:function(t,e,n){e.a={props:{spin:{type:Boolean,default:!0},radius:{type:Number,default:3},width:{type:Number,default:2},length:{type:Number,default:3},color:String},computed:{spinnerOptions:function(){return{className:"aui-spinner",position:"absolute",color:this.color,radius:this.radius,width:this.width,length:this.length}},containerSize:function(){var t=2*(this.radius+this.length+this.width);return{height:t+"px",width:t+"px"}}},mounted:function(){this.spin?this.start():this.stop();},watch:{spin:function(t){t?this.start():this.stop();},spinnerOptions:function(){this.spin&&this.start();}},methods:{start:function(){AJS.$(this.$el).spin(this.spinnerOptions);},stop:function(){AJS.$(this.$el).spinStop();}}};},PzxK:function(t,e,n){var r=n("D2L2"),i=n("sB3e"),o=n("ax3d")("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t), r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null};},Q7hp:function(t,e,n){function r(t,e,n){var r=null==t?void 0:i(t,e);return void 0===r?n:r}var i=n("uCi2");t.exports=r;},QDt5:function(t,e,n){e.a={};},QRG4:function(t,e,n){var r=n("UuGF"),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0};},"QWe/":function(t,e,n){n("crlp")("observable");},QY80:function(t,e,n){e.a={props:{text:String,value:[String,Number],data:Object},watch:{text:function(){this.optionsChanged();},value:function(){this.optionsChanged();},data:function(){this.optionsChanged();}},render:function(){},mounted:function(){this.optionsChanged();},destroyed:function(){this.optionsChanged();},methods:{optionsChanged:function(){this.$parent.$emit("optionsChanged");}}};},QfuG:function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"aui-buttons"},[t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},R4wc:function(t,e,n){var r=n("kM2E");r(r.S+r.F,"Object",{assign:n("To3L")});},R9M2:function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)};},RGrk:function(t,e,n){function r(t){var e=this.__data__;return i?void 0!==e[t]:a.call(e,t)}var i=n("dCZQ"),o=Object.prototype,a=o.hasOwnProperty;t.exports=r;},RPLV:function(t,e,n){var r=n("7KvD").document;t.exports=r&&r.documentElement;},"RY/4":function(t,e,n){var r=n("R9M2"),i=n("dSzd")("toStringTag"),o="Arguments"==r(function(){return arguments}()),a=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=a(e=Object(t),i))?n:o?r(e):"Object"==(s=r(e))&&"function"==typeof e.callee?"Arguments":s};},RfZv:function(t,e,n){function r(t,e){return null!=t&&o(t,e,i)}var i=n("SOZo"),o=n("IGcM");t.exports=r;},Rh28:function(t,e){function n(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=r}var r=9007199254740991;t.exports=n;},Rnw4:function(t,e,n){var r=n("3WXc"),i=n("VYYh"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},Rrel:function(t,e,n){var r=n("TcQ7"),i=n("n0T6").f,o={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return i(t)}catch(t){return a.slice()}};t.exports.f=function(t){return a&&"[object Window]"==o.call(t)?s(t):i(r(t))};},S7p9:function(t,e){function n(t){return function(e){return t(e)}}t.exports=n;},S82l:function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}};},SHWz:function(t,e,n){function r(t,e,n,r,a,u){var c=n&o,l=i(t),f=l.length;if(f!=i(e).length&&!c)return!1;for(var p=f;p--;){var d=l[p];if(!(c?d in e:s.call(e,d)))return!1}var v=u.get(t);if(v&&u.get(e))return v==e;var h=!0;u.set(t,e), u.set(e,t);for(var m=c;++p<f;){d=l[p];var g=t[d],y=e[d];if(r)var b=c?r(y,g,d,e,t,u):r(g,y,d,t,e,u);if(!(void 0===b?g===y||a(g,y,n,r,u):b)){h=!1;break}m||(m="constructor"==d);}if(h&&!m){var _=t.constructor,x=e.constructor;_!=x&&"constructor"in t&&"constructor"in e&&!("function"==typeof _&&_ instanceof _&&"function"==typeof x&&x instanceof x)&&(h=!1);}return u.delete(t), u.delete(e), h}var i=n("MoMe"),o=1,a=Object.prototype,s=a.hasOwnProperty;t.exports=r;},SOZo:function(t,e){function n(t,e){return null!=t&&e in Object(t)}t.exports=n;},SeI6:function(t,e,n){var r=n("lEvY"),i=n("gXOt"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},SfB7:function(t,e,n){t.exports=!n("+E39")&&!n("S82l")(function(){return 7!=Object.defineProperty(n("ON07")("div"),"a",{get:function(){return 7}}).a});},"T/bE":function(t,e,n){function r(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}var i=n("94sX"),o=n("ue/d"),a=n("eVIm"),s=n("RGrk"),u=n("Z2pD");r.prototype.clear=i, r.prototype.delete=o, r.prototype.get=a, r.prototype.has=s, r.prototype.set=u, t.exports=r;},T4eg:function(t,e,n){var r=n("Dd8w"),i=n.n(r),o=n("7+uW"),a=n("kbi+"),s=n.n(a);e.a={props:{disabled:Boolean,dropdownAutoWidth:Boolean,initSelection:Function,maximumInputLength:Number,minimumInputLength:Number,placeholder:String,query:Function,width:String},data:function(){return{options:[]}},computed:{commonOptions:function(){var t=this;return{dropdownAutoWidth:this.dropdownAutoWidth,formatResult:function(e){return t.renderTemplate(e,t.$scopedSlots.formatResult)},formatSelection:function(e){return t.renderTemplate(e,t.$scopedSlots.formatSelection)},initSelection:this.initSelection,maximumInputLength:this.maximumInputLength,minimumInputLength:this.minimumInputLength,placeholder:this.placeholder,query:this.query,width:this.width}}},created:function(){this.updateOptions(), this.$on("optionsChanged",this.updateOptions);},mounted:function(){this.$refs.input.className=this.$el.className, this.$el.className="", this.$input=AJS.$(this.$refs.input), this.$input.on("change",this.onSelect2ValueChanged);},watch:{value:function(){this.updateValue();},disabled:function(){this.updateValue();}},methods:{updateValue:function(){this.$input&&this.$input.auiSelect2("val",this.value);},updateOptions:function(){this.$slots.default&&(this.options=this.$slots.default.filter(function(t){return t.tag&&(t.tag.match(/aui-select2-option$/)||t.tag.match(/AuiSelect2Option$/))}).map(function(t){return t.componentOptions.propsData}).map(function(t){return i()({},t,{id:t.value})})), this.updateValue();},mapToOriginalVal:function(t){var e=s()(this.options,function(e){return""+e.value===t});return e&&e.value||t},onSelect2ValueChanged:function(t){var e="string"==typeof t.val?this.mapToOriginalVal(t.val):t.val.map(this.mapToOriginalVal);this.$emit("input",e);},renderTemplate:function(t,e){if(e){return new o.a({render:function(n){return n("wrapper",[e(t)])}}).$mount().$el.firstChild.outerHTML}return t.text}}};},TQ3y:function(t,e,n){var r=n("blYT"),i="object"==typeof self&&self&&self.Object===Object&&self,o=r||i||Function("return this")();t.exports=o;},TcQ7:function(t,e,n){var r=n("MU5D"),i=n("52gC");t.exports=function(t){return r(i(t))};},Td2t:function(t,e,n){var r=n("qXVY");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("16d8a89c",r,!0,{});},To3L:function(t,e,n){var r=n("lktj"),i=n("1kS7"),o=n("NpIQ"),a=n("sB3e"),s=n("MU5D"),u=Object.assign;t.exports=!u||n("S82l")(function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7, r.split("").forEach(function(t){e[t]=t;}), 7!=u({},t)[n]||Object.keys(u({},e)).join("")!=r})?function(t,e){for(var n=a(t),u=arguments.length,c=1,l=i.f,f=o.f;u>c;)for(var p,d=s(arguments[c++]),v=l?r(d).concat(l(d)):r(d),h=v.length,m=0;h>m;)f.call(d,p=v[m++])&&(n[p]=d[p]);return n}:u;},UTO1:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,".aui-spinner-container{position:relative;display:inline-block;vertical-align:middle}.aui-spinner-container .aui-spinner{top:50%!important;left:50%!important}","",{version:3,sources:["/Users/damian/vue-aui/src/components/AuiSpinner.vue"],names:[],mappings:"AACA,uBACE,kBAAmB,AACnB,qBAAsB,AACtB,qBAAuB,CACxB,AACD,oCACE,kBAAoB,AACpB,kBAAqB,CACtB",file:"AuiSpinner.vue",sourcesContent:["\n.aui-spinner-container {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n}\n.aui-spinner-container .aui-spinner {\n  top: 50% !important;\n  left: 50% !important;\n}\n"],sourceRoot:""}]);},Ubhr:function(t,e,n){function r(t){if("string"==typeof t||i(t))return t;var e=t+"";return"0"==e&&1/t==-o?"-0":e}var i=n("6MiT"),o=1/0;t.exports=r;},UnEC:function(t,e){function n(t){return null!=t&&"object"==typeof t}t.exports=n;},UnLw:function(t,e,n){var r=n("fMqj"),i=/^\./,o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,a=/\\(\\)?/g,s=r(function(t){var e=[];return i.test(t)&&e.push(""), t.replace(o,function(t,n,r,i){e.push(r?i.replace(a,"$1"):n||t);}), e});t.exports=s;},UptX:function(t,e,n){function r(t){n("1Kpi");}var i=n("7tvR"),o=n("lxbN"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,"data-v-348780a9",null);e.a=u.exports;},UuGF:function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)};},Uz1a:function(t,e,n){function r(t,e,n,r,m,y){var b=c(t),_=c(e),x=b?v:u(t),A=_?v:u(e);x=x==d?h:x, A=A==d?h:A;var w=x==h,C=A==h,O=x==A;if(O&&l(t)){if(!l(e))return!1;b=!0, w=!1;}if(O&&!w)return y||(y=new i), b||f(t)?o(t,e,n,r,m,y):a(t,e,x,n,r,m,y);if(!(n&p)){var $=w&&g.call(t,"__wrapped__"),S=C&&g.call(e,"__wrapped__");if($||S){var k=$?t.value():t,j=S?e.value():e;return y||(y=new i), m(k,j,n,r,y)}}return!!O&&(y||(y=new i), s(t,e,n,r,m,y))}var i=n("bJWQ"),o=n("FhcP"),a=n("EHRO"),s=n("SHWz"),u=n("gHOb"),c=n("NGEn"),l=n("ggOT"),f=n("YsVG"),p=1,d="[object Arguments]",v="[object Array]",h="[object Object]",m=Object.prototype,g=m.hasOwnProperty;t.exports=r;},V3tA:function(t,e,n){n("R4wc"), t.exports=n("FeBl").Object.assign;},VOAg:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,'.aui-dialog2-content.no-padding[data-v-2a24725d]{padding:0}[data-aui-version^="6"] .aui-dialog2[data-v-2a24725d]{top:109px;max-width:1200px;height:calc(100% - 120px)}[data-aui-version^="6"] .aui-dialog2-content[data-v-2a24725d]{height:calc(100% - 70px)}[data-aui-version^="6"] .dialog-header-actions[data-v-2a24725d]{display:table-cell;vertical-align:middle;text-align:right}',"",{version:3,sources:["/Users/damian/vue-aui/src/components/AuiDialog.vue"],names:[],mappings:"AACA,iDACE,SAAW,CACZ,AACD,sDACE,UAAW,AACX,iBAAkB,AAClB,yBAA2B,CAC5B,AACD,8DACE,wBAA0B,CAC3B,AACD,gEACE,mBAAoB,AACpB,sBAAuB,AACvB,gBAAkB,CACnB",file:"AuiDialog.vue",sourcesContent:['\n.aui-dialog2-content.no-padding[data-v-2a24725d] {\n  padding: 0;\n}\n[data-aui-version^="6"] .aui-dialog2[data-v-2a24725d] {\n  top: 109px;\n  max-width: 1200px;\n  height: calc(100% - 120px);\n}\n[data-aui-version^="6"] .aui-dialog2-content[data-v-2a24725d] {\n  height: calc(100% - 70px);\n}\n[data-aui-version^="6"] .dialog-header-actions[data-v-2a24725d] {\n  display: table-cell;\n  vertical-align: middle;\n  text-align: right;\n}\n'],sourceRoot:""}]);},"VU/8":function(t,e){t.exports=function(t,e,n,r,i,o){var a,s=t=t||{},u=typeof t.default;"object"!==u&&"function"!==u||(a=t, s=t.default);var c="function"==typeof s?s.options:s;e&&(c.render=e.render, c.staticRenderFns=e.staticRenderFns, c._compiled=!0), n&&(c.functional=!0), i&&(c._scopeId=i);var l;if(o?(l=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext, t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__), r&&r.call(this,t), t&&t._registeredComponents&&t._registeredComponents.add(o);}, c._ssrRegister=l):r&&(l=r), l){var f=c.functional,p=f?c.render:c.beforeCreate;f?(c._injectStyles=l, c.render=function(t,e){return l.call(e), p(t,e)}):c.beforeCreate=p?[].concat(p,l):[l];}return{esModule:a,exports:s,options:c}};},VXIy:function(t,e,n){var r=n("VOAg");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("837ab8a6",r,!0,{});},VYYh:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"progressIndicator",staticClass:"aui-progress-indicator"},[n("span",{staticClass:"aui-progress-indicator-value"})])},i=[],o={render:r,staticRenderFns:i};e.a=o;},"W+aG":function(t,e,n){var r=n("Dd8w"),i=n.n(r),o=n("T4eg");e.a={mixins:[o.a],props:{allowClear:Boolean,minimumResultsForSearch:Number,value:[String,Number]},mounted:function(){var t=this;this.$input.val(this.value);var e=i()({},this.commonOptions,{allowClear:this.allowClear,data:function(){return{results:t.options}},minimumResultsForSearch:this.minimumResultsForSearch});this.$input.auiSelect2(e);}};},W2nU:function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function i(t){if(l===setTimeout)return setTimeout(t,0);if((l===n||!l)&&setTimeout)return l=setTimeout, setTimeout(t,0);try{return l(t,0)}catch(e){try{return l.call(null,t,0)}catch(e){return l.call(this,t,0)}}}function o(t){if(f===clearTimeout)return clearTimeout(t);if((f===r||!f)&&clearTimeout)return f=clearTimeout, clearTimeout(t);try{return f(t)}catch(e){try{return f.call(null,t)}catch(e){return f.call(this,t)}}}function a(){h&&d&&(h=!1, d.length?v=d.concat(v):m=-1, v.length&&s());}function s(){if(!h){var t=i(a);h=!0;for(var e=v.length;e;){for(d=v, v=[];++m<e;)d&&d[m].run();m=-1, e=v.length;}d=null, h=!1, o(t);}}function u(t,e){this.fun=t, this.array=e;}function c(){}var l,f,p=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:n;}catch(t){l=n;}try{f="function"==typeof clearTimeout?clearTimeout:r;}catch(t){f=r;}}();var d,v=[],h=!1,m=-1;p.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];v.push(new u(t,e)), 1!==v.length||h||i(s);}, u.prototype.run=function(){this.fun.apply(null,this.array);}, p.title="browser", p.browser=!0, p.env={}, p.argv=[], p.version="", p.versions={}, p.on=c, p.addListener=c, p.once=c, p.off=c, p.removeListener=c, p.removeAllListeners=c, p.emit=c, p.prependListener=c, p.prependOnceListener=c, p.listeners=function(t){return[]}, p.binding=function(t){throw new Error("process.binding is not supported")}, p.cwd=function(){return"/"}, p.chdir=function(t){throw new Error("process.chdir is not supported")}, p.umask=function(){return 0};},W529:function(t,e,n){var r=n("f931"),i=r(Object.keys,Object);t.exports=i;},WEmM:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",[n("input",{ref:"input",attrs:{disabled:t.disabled,type:"hidden"}}),t._v(" "),t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},WFiI:function(t,e){function n(t){var e=-1,n=Array(t.size);return t.forEach(function(t,r){n[++e]=[r,t];}), n}t.exports=n;},"WdV/":function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"aui-nav-heading"},[n("strong",[t._v(t._s(t.name))])])},i=[],o={render:r,staticRenderFns:i};e.a=o;},WxI4:function(t,e){function n(){this.__data__=[], this.size=0;}t.exports=n;},X8DO:function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}};},Xc4G:function(t,e,n){var r=n("lktj"),i=n("1kS7"),o=n("NpIQ");t.exports=function(t){var e=r(t),n=i.f;if(n)for(var a,s=n(t),u=o.f,c=0;s.length>c;)u.call(t,a=s[c++])&&e.push(a);return e};},YDHx:function(t,e,n){function r(t,e,n,a,s){return t===e||(null==t||null==e||!o(t)&&!o(e)?t!==t&&e!==e:i(t,e,n,a,r,s))}var i=n("Uz1a"),o=n("UnEC");t.exports=r;},YTR3:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"aui-tabs horizontal-tabs"},[n("ul",{staticClass:"tabs-menu"},t._l(t.tabs,function(e){return n("li",{ref:"item",refInFor:!0,staticClass:"menu-item"},[n("a",{attrs:{href:"#"+e.componentOptions.propsData.tabId}},[t._v(t._s(e.data.attrs.name))])])})),t._v(" "),t._t("default")],2)])},i=[],o={render:r,staticRenderFns:i};e.a=o;},YeCl:function(t,e,n){function r(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}var i=n("CW5P"),o=n("A9mX"),a=n("v8Dt"),s=n("agim"),u=n("Dv2r");r.prototype.clear=i, r.prototype.delete=o, r.prototype.get=a, r.prototype.has=s, r.prototype.set=u, t.exports=r;},Yobk:function(t,e,n){var r=n("77Pl"),i=n("qio6"),o=n("xnc9"),a=n("ax3d")("IE_PROTO"),s=function(){},u=function(){var t,e=n("ON07")("iframe"),r=o.length;for(e.style.display="none", n("RPLV").appendChild(e), e.src="javascript:", t=e.contentWindow.document, t.open(), t.write("<script>document.F=Object<\/script>"), t.close(), u=t.F;r--;)delete u.prototype[o[r]];return u()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=r(t), n=new s, s.prototype=null, n[a]=t):n=u(), void 0===e?n:i(n,e)};},YsVG:function(t,e,n){var r=n("z4hc"),i=n("S7p9"),o=n("Dc0G"),a=o&&o.isTypedArray,s=a?i(a):r;t.exports=s;},Z2pD:function(t,e,n){function r(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1, n[t]=i&&void 0===e?o:e, this}var i=n("dCZQ"),o="__lodash_hash_undefined__";t.exports=r;},ZGh9:function(t,e){function n(t,e){return!!(e=null==e?r:e)&&("number"==typeof t||i.test(t))&&t>-1&&t%1==0&&t<e}var r=9007199254740991,i=/^(?:0|[1-9]\d*)$/;t.exports=n;},ZT2e:function(t,e,n){function r(t){return null==t?"":i(t)}var i=n("o2mx");t.exports=r;},ZsEX:function(t,e,n){var r=n("p2oj");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("0c89204e",r,!0,{});},Zzip:function(t,e,n){t.exports={default:n("/n6Q"),__esModule:!0};},aCM0:function(t,e,n){function r(t){return null==t?void 0===t?u:s:c&&c in Object(t)?o(t):a(t)}var i=n("NkRn"),o=n("uLhX"),a=n("+66z"),s="[object Null]",u="[object Undefined]",c=i?i.toStringTag:void 0;t.exports=r;},aQOO:function(t,e){function n(t){return this.__data__.has(t)}t.exports=n;},agim:function(t,e,n){function r(t){return i(this,t).has(t)}var i=n("pTUa");t.exports=r;},ax3d:function(t,e,n){var r=n("e8AB")("keys"),i=n("3Eo+");t.exports=function(t){return r[t]||(r[t]=i(t))};},bGc4:function(t,e,n){function r(t){return null!=t&&o(t.length)&&!i(t)}var i=n("gGqR"),o=n("Rh28");t.exports=r;},bIbi:function(t,e,n){var r=n("ICSD"),i=n("TQ3y"),o=r(i,"WeakMap");t.exports=o;},bIjD:function(t,e,n){function r(t,e){return i(t)?t:o(t,e)?[t]:a(s(t))}var i=n("NGEn"),o=n("hIPy"),a=n("UnLw"),s=n("ZT2e");t.exports=r;},bJWQ:function(t,e,n){function r(t){var e=this.__data__=new i(t);this.size=e.size;}var i=n("duB3"),o=n("KmWZ"),a=n("NqZt"),s=n("E4Hj"),u=n("G2xm"),c=n("zpVT");r.prototype.clear=o, r.prototype.delete=a, r.prototype.get=s, r.prototype.has=u, r.prototype.set=c, t.exports=r;},bMfN:function(t,e,n){var r=function(){var t=this,e=t.$createElement;return(t._self._c||e)("section",{staticClass:"aui-page-panel-content"},[t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},bO0Y:function(t,e,n){var r=n("ICSD"),i=n("TQ3y"),o=r(i,"Promise");t.exports=o;},bOdI:function(t,e,n){e.__esModule=!0;var r=n("C4MV"),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e,n){return e in t?(0, i.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n, t};},blYT:function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n;}).call(e,n("DuR2"));},bnAi:function(t,e,n){e.a={props:{subtle:Boolean,type:{type:String,validator:function(t){return["success","error","current","complete","moved"].indexOf(t)>=0}}},computed:{classObject:function(){return{"aui-lozenge":!0,"aui-lozenge-subtle":this.subtle,"aui-lozenge-success":"success"===this.type,"aui-lozenge-error":"error"===this.type,"aui-lozenge-current":"current"===this.type,"aui-lozenge-complete":"complete"===this.type,"aui-lozenge-moved":"moved"===this.type}}}};},cdq7:function(t,e){function n(t,e,n,r){for(var i=t.length,o=n+(r?1:-1);r?o--:++o<i;)if(e(t[o],o,t))return o;return-1}t.exports=n;},chwb:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{class:{"aui-nav-selected":this.selected}},[n("a",{attrs:{href:t.href}},[t._v(t._s(t.name))])])},i=[],o={render:r,staticRenderFns:i};e.a=o;},crlp:function(t,e,n){var r=n("7KvD"),i=n("FeBl"),o=n("O4g8"),a=n("Kh4W"),s=n("evD5").f;t.exports=function(t){var e=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:a.f(t)});};},"d+aQ":function(t,e,n){function r(t){var e=o(t);return 1==e.length&&e[0][2]?a(e[0][0],e[0][1]):function(n){return n===t||i(n,t,e)}}var i=n("hbAh"),o=n("16tV"),a=n("sJvV");t.exports=r;},d4US:function(t,e,n){var r=n("ICSD"),i=n("TQ3y"),o=r(i,"DataView");t.exports=o;},dCZQ:function(t,e,n){var r=n("ICSD"),i=r(Object,"create");t.exports=i;},dFpP:function(t,e,n){function r(t){var e=this.__data__,n=i(e,t);return!(n<0)&&(n==e.length-1?e.pop():a.call(e,n,1), --this.size, !0)}var i=n("imBK"),o=Array.prototype,a=o.splice;t.exports=r;},dSzd:function(t,e,n){var r=n("e8AB")("wks"),i=n("3Eo+"),o=n("7KvD").Symbol,a="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=a&&o[t]||(a?o:i)("Symbol."+t))}).store=r;},deUO:function(t,e,n){function r(t,e){var n=this.__data__,r=i(n,t);return r<0?(++this.size, n.push([t,e])):n[r][1]=e, this}var i=n("imBK");t.exports=r;},dmQx:function(t,e){function n(t,e){return t.has(e)}t.exports=n;},duB3:function(t,e,n){function r(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}var i=n("WxI4"),o=n("dFpP"),a=n("JBvZ"),s=n("2Hvv"),u=n("deUO");r.prototype.clear=i, r.prototype.delete=o, r.prototype.get=a, r.prototype.has=s, r.prototype.set=u, t.exports=r;},e6n0:function(t,e,n){var r=n("evD5").f,i=n("D2L2"),o=n("dSzd")("toStringTag");t.exports=function(t,e,n){t&&!i(t=n?t:t.prototype,o)&&r(t,o,{configurable:!0,value:e});};},e8AB:function(t,e,n){var r=n("7KvD"),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return i[t]||(i[t]={})};},eFps:function(t,e,n){function r(t){return!!o&&o in t}var i=n("+gg+"),o=function(){var t=/[^.]+$/.exec(i&&i.keys&&i.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();t.exports=r;},"eG8/":function(t,e){function n(t){return function(e){return null==e?void 0:e[t]}}t.exports=n;},eHwr:function(t,e,n){function r(t){return function(e,n,r){var s=Object(e);if(!o(e)){var u=i(n,3);e=a(e), n=function(t){return u(s[t],t,s)};}var c=t(e,n,r);return c>-1?s[u?e[c]:c]:void 0}}var i=n("JyYQ"),o=n("bGc4"),a=n("ktak");t.exports=r;},eKBv:function(t,e,n){function r(t,e){return s(t)&&u(e)?c(l(t),e):function(n){var r=o(n,t);return void 0===r&&r===e?a(n,t):i(e,r,f|p)}}var i=n("YDHx"),o=n("Q7hp"),a=n("RfZv"),s=n("hIPy"),u=n("tO4o"),c=n("sJvV"),l=n("Ubhr"),f=1,p=2;t.exports=r;},eTqe:function(t,e,n){function r(t){n("VXIy");}var i=n("r/N8"),o=n("k35P"),a=n("VU/8"),s=r,u=a(i.a,o.a,!1,s,"data-v-2a24725d",null);e.a=u.exports;},eVIm:function(t,e,n){function r(t){var e=this.__data__;if(i){var n=e[t];return n===o?void 0:n}return s.call(e,t)?e[t]:void 0}var i=n("dCZQ"),o="__lodash_hash_undefined__",a=Object.prototype,s=a.hasOwnProperty;t.exports=r;},el1m:function(t,e,n){var r=n("uyp8"),i=n("oY4E");e.a={props:{tabsMode:Boolean},functional:!0,render:function(t,e){return e.props.tabsMode?t(i.a,e.data,e.children):t(r.a,e.data,e.children)}};},evD5:function(t,e,n){var r=n("77Pl"),i=n("SfB7"),o=n("MmMw"),a=Object.defineProperty;e.f=n("+E39")?Object.defineProperty:function(t,e,n){if(r(t), e=o(e,!0), r(n), i)try{return a(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value), t};},f27Z:function(t,e,n){var r=n("3GFx"),i=n("vefd"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},f931:function(t,e){function n(t,e){return function(n){return t(e(n))}}t.exports=n;},fMqj:function(t,e,n){function r(t){var e=i(t,function(t){return n.size===o&&n.clear(), t}),n=e.cache;return e}var i=n("zGZ6"),o=500;t.exports=r;},fWfb:function(t,e,n){var r=n("7KvD"),i=n("D2L2"),o=n("+E39"),a=n("kM2E"),s=n("880/"),u=n("06OY").KEY,c=n("S82l"),l=n("e8AB"),f=n("e6n0"),p=n("3Eo+"),d=n("dSzd"),v=n("Kh4W"),h=n("crlp"),m=n("Xc4G"),g=n("7UMu"),y=n("77Pl"),b=n("EqjI"),_=n("TcQ7"),x=n("MmMw"),A=n("X8DO"),w=n("Yobk"),C=n("Rrel"),O=n("LKZe"),$=n("evD5"),S=n("lktj"),k=O.f,j=$.f,T=C.f,E=r.Symbol,I=r.JSON,M=I&&I.stringify,D=d("_hidden"),B=d("toPrimitive"),N={}.propertyIsEnumerable,P=l("symbol-registry"),L=l("symbols"),F=l("op-symbols"),R=Object.prototype,U="function"==typeof E,V=r.QObject,z=!V||!V.prototype||!V.prototype.findChild,H=o&&c(function(){return 7!=w(j({},"a",{get:function(){return j(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=k(R,e);r&&delete R[e], j(t,e,n), r&&t!==R&&j(R,e,r);}:j,G=function(t){var e=L[t]=w(E.prototype);return e._k=t, e},Q=U&&"symbol"==typeof E.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof E},W=function(t,e,n){return t===R&&W(F,e,n), y(t), e=x(e,!0), y(n), i(L,e)?(n.enumerable?(i(t,D)&&t[D][e]&&(t[D][e]=!1), n=w(n,{enumerable:A(0,!1)})):(i(t,D)||j(t,D,A(1,{})), t[D][e]=!0), H(t,e,n)):j(t,e,n)},J=function(t,e){y(t);for(var n,r=m(e=_(e)),i=0,o=r.length;o>i;)W(t,n=r[i++],e[n]);return t},Z=function(t,e){return void 0===e?w(t):J(w(t),e)},Y=function(t){var e=N.call(this,t=x(t,!0));return!(this===R&&i(L,t)&&!i(F,t))&&(!(e||!i(this,t)||!i(L,t)||i(this,D)&&this[D][t])||e)},K=function(t,e){if(t=_(t), e=x(e,!0), t!==R||!i(L,e)||i(F,e)){var n=k(t,e);return!n||!i(L,e)||i(t,D)&&t[D][e]||(n.enumerable=!0), n}},q=function(t){for(var e,n=T(_(t)),r=[],o=0;n.length>o;)i(L,e=n[o++])||e==D||e==u||r.push(e);return r},X=function(t){for(var e,n=t===R,r=T(n?F:_(t)),o=[],a=0;r.length>a;)!i(L,e=r[a++])||n&&!i(R,e)||o.push(L[e]);return o};U||(E=function(){if(this instanceof E)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===R&&e.call(F,n), i(this,D)&&i(this[D],t)&&(this[D][t]=!1), H(this,t,A(1,n));};return o&&z&&H(R,t,{configurable:!0,set:e}), G(t)}, s(E.prototype,"toString",function(){return this._k}), O.f=K, $.f=W, n("n0T6").f=C.f=q, n("NpIQ").f=Y, n("1kS7").f=X, o&&!n("O4g8")&&s(R,"propertyIsEnumerable",Y,!0), v.f=function(t){return G(d(t))}), a(a.G+a.W+a.F*!U,{Symbol:E});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)d(tt[et++]);for(var nt=S(d.store),rt=0;nt.length>rt;)h(nt[rt++]);a(a.S+a.F*!U,"Symbol",{for:function(t){return i(P,t+="")?P[t]:P[t]=E(t)},keyFor:function(t){if(!Q(t))throw TypeError(t+" is not a symbol!");for(var e in P)if(P[e]===t)return e},useSetter:function(){z=!0;},useSimple:function(){z=!1;}}), a(a.S+a.F*!U,"Object",{create:Z,defineProperty:W,defineProperties:J,getOwnPropertyDescriptor:K,getOwnPropertyNames:q,getOwnPropertySymbols:X}), I&&a(a.S+a.F*(!U||c(function(){var t=E();return"[null]"!=M([t])||"{}"!=M({a:t})||"{}"!=M(Object(t))})),"JSON",{stringify:function(t){for(var e,n,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);if(n=e=r[1], (b(e)||void 0!==t)&&!Q(t))return g(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)), !Q(e))return e}), r[1]=e, M.apply(I,r)}}), E.prototype[B]||n("hJx8")(E.prototype,B,E.prototype.valueOf), f(E,"Symbol"), f(Math,"Math",!0), f(r.JSON,"JSON",!0);},fkB2:function(t,e,n){var r=n("UuGF"),i=Math.max,o=Math.min;t.exports=function(t,e){return t=r(t), t<0?i(t+e,0):o(t,e)};},fxRn:function(t,e,n){n("+tPU"), n("zQR9"), t.exports=n("g8Ux");},g8Ux:function(t,e,n){var r=n("77Pl"),i=n("3fs2");t.exports=n("FeBl").getIterator=function(t){var e=i(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return r(e.call(t))};},gGqR:function(t,e,n){function r(t){if(!o(t))return!1;var e=i(t);return e==s||e==u||e==a||e==c}var i=n("aCM0"),o=n("yCNF"),a="[object AsyncFunction]",s="[object Function]",u="[object GeneratorFunction]",c="[object Proxy]";t.exports=r;},gHOb:function(t,e,n){var r=n("d4US"),i=n("POb3"),o=n("bO0Y"),a=n("5N57"),s=n("bIbi"),u=n("aCM0"),c=n("Ai/T"),l=c(r),f=c(i),p=c(o),d=c(a),v=c(s),h=u;(r&&"[object DataView]"!=h(new r(new ArrayBuffer(1)))||i&&"[object Map]"!=h(new i)||o&&"[object Promise]"!=h(o.resolve())||a&&"[object Set]"!=h(new a)||s&&"[object WeakMap]"!=h(new s))&&(h=function(t){var e=u(t),n="[object Object]"==e?t.constructor:void 0,r=n?c(n):"";if(r)switch(r){case l:return"[object DataView]";case f:return"[object Map]";case p:return"[object Promise]";case d:return"[object Set]";case v:return"[object WeakMap]"}return e}), t.exports=h;},gXOt:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.classObject},[t.title?n("p",{staticClass:"title"},[n("strong",[t._v(t._s(t.title))])]):t._e(),t._v(" "),t._t("default")],2)},i=[],o={render:r,staticRenderFns:i};e.a=o;},ggOT:function(t,e,n){(function(t){var r=n("TQ3y"),i=n("gwcX"),o="object"==typeof e&&e&&!e.nodeType&&e,a=o&&"object"==typeof t&&t&&!t.nodeType&&t,s=a&&a.exports===o,u=s?r.Buffer:void 0,c=u?u.isBuffer:void 0,l=c||i;t.exports=l;}).call(e,n("3IRH")(t));},gwcX:function(t,e){function n(){return!1}t.exports=n;},h65t:function(t,e,n){var r=n("UuGF"),i=n("52gC");t.exports=function(t){return function(e,n){var o,a,s=String(i(e)),u=r(n),c=s.length;return u<0||u>=c?t?"":void 0:(o=s.charCodeAt(u), o<55296||o>56319||u+1===c||(a=s.charCodeAt(u+1))<56320||a>57343?t?s.charAt(u):o:t?s.slice(u,u+2):a-56320+(o-55296<<10)+65536)}};},hIPy:function(t,e,n){function r(t,e){if(i(t))return!1;var n=typeof t;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!o(t))||(s.test(t)||!a.test(t)||null!=e&&t in Object(e))}var i=n("NGEn"),o=n("6MiT"),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,s=/^\w*$/;t.exports=r;},hJx8:function(t,e,n){var r=n("evD5"),i=n("X8DO");t.exports=n("+E39")?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n, t};},hQeI:function(t,e,n){var r=n("UTO1");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("01dbdd6c",r,!0,{});},hbAh:function(t,e,n){function r(t,e,n,r){var u=n.length,c=u,l=!r;if(null==t)return!c;for(t=Object(t);u--;){var f=n[u];if(l&&f[2]?f[1]!==t[f[0]]:!(f[0]in t))return!1}for(;++u<c;){f=n[u];var p=f[0],d=t[p],v=f[1];if(l&&f[2]){if(void 0===d&&!(p in t))return!1}else{var h=new i;if(r)var m=r(d,v,p,t,e,h);if(!(void 0===m?o(v,d,a|s,r,h):m))return!1}}return!0}var i=n("bJWQ"),o=n("YDHx"),a=1,s=2;t.exports=r;},iL3P:function(t,e,n){function r(t){return a(t)?i(s(t)):o(t)}var i=n("eG8/"),o=n("3Did"),a=n("hIPy"),s=n("Ubhr");t.exports=r;},imBK:function(t,e,n){function r(t,e){for(var n=t.length;n--;)if(i(t[n][0],e))return n;return-1}var i=n("22B7");t.exports=r;},jyVo:function(t,e,n){n.d(e,"a",function(){return r});var r=function(t){return(t||"id")+"-"+Math.random().toString(36).substring(2,10)};},k35P:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{class:t.classObject,style:{width:t.width},attrs:{role:"dialog"}},[n("header",{staticClass:"aui-dialog2-header"},[n("h2",{staticClass:"aui-dialog2-header-main"},[t._v("\n      "+t._s(t.title)+"\n    ")]),t._v(" "),n("div",{staticClass:"dialog-header-actions"},[t._t("header-actions")],2),t._v(" "),n("a",{directives:[{name:"show",rawName:"v-show",value:t.showCloseButton,expression:"showCloseButton"}],staticClass:"aui-dialog2-header-close",on:{click:function(e){e.stopPropagation(), t.closeDialogHandler(e);}}},[n("span",{staticClass:"aui-icon aui-icon-small aui-iconfont-close-dialog"},[t._v("Close")])])]),t._v(" "),n("div",{staticClass:"aui-dialog2-content",class:{"no-padding":t.noPadding},style:{height:t.height,"max-height":t.maxHeight}},[t._t("default")],2),t._v(" "),n("footer",{staticClass:"aui-dialog2-footer"},[n("div",{staticClass:"aui-dialog2-footer-actions"},[t._t("footer-actions"),t._v(" "),t.cancelButton?n("button",{staticClass:"aui-button aui-button-link",on:{click:t.closeDialogHandler}},[t._v(t._s(t.cancelButton)+"\n      ")]):t._e()],2),t._v(" "),n("div",{staticClass:"aui-dialog2-footer-hint"},[t._t("footer-hint")],2)])])},i=[],o={render:r,staticRenderFns:i};e.a=o;},kM2E:function(t,e,n){var r=n("7KvD"),i=n("FeBl"),o=n("+ZMJ"),a=n("hJx8"),s=function(t,e,n){var u,c,l,f=t&s.F,p=t&s.G,d=t&s.S,v=t&s.P,h=t&s.B,m=t&s.W,g=p?i:i[e]||(i[e]={}),y=g.prototype,b=p?r:d?r[e]:(r[e]||{}).prototype;p&&(n=e);for(u in n)(c=!f&&b&&void 0!==b[u])&&u in g||(l=c?b[u]:n[u], g[u]=p&&"function"!=typeof b[u]?n[u]:h&&c?o(l,r):m&&b[u]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype, e}(l):v&&"function"==typeof l?o(Function.call,l):l, v&&((g.virtual||(g.virtual={}))[u]=l, t&s.R&&y&&!y[u]&&a(y,u,l)));};s.F=1, s.G=2, s.S=4, s.P=8, s.B=16, s.W=32, s.U=64, s.R=128, t.exports=s;},"kbi+":function(t,e,n){var r=n("eHwr"),i=n("KgVm"),o=r(i);t.exports=o;},ktak:function(t,e,n){function r(t){return a(t)?i(t):o(t)}var i=n("7e4z"),o=n("/GnY"),a=n("bGc4");t.exports=r;},kxzG:function(t,e,n){function r(t){if("number"==typeof t)return t;if(o(t))return a;if(i(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=i(e)?e+"":e;}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(s,"");var n=c.test(t);return n||l.test(t)?f(t.slice(2),n?2:8):u.test(t)?a:+t}var i=n("yCNF"),o=n("6MiT"),a=NaN,s=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,l=/^0o[0-7]+$/i,f=parseInt;t.exports=r;},l9Lx:function(t,e,n){var r=n("lb6C"),i=n("C0hh"),o=Object.prototype,a=o.propertyIsEnumerable,s=Object.getOwnPropertySymbols,u=s?function(t){return null==t?[]:(t=Object(t), r(s(t),function(e){return a.call(t,e)}))}:i;t.exports=u;},lEvY:function(t,e,n){var r=n("bOdI"),i=n.n(r);e.a={props:{closeable:Boolean,title:String,type:{type:String,default:"info",validator:function(t){return"error"===t||"warning"===t||"success"===t||"info"===t}}},computed:{classObject:function(){var t;return t={"aui-message":!0}, i()(t,"aui-message-"+this.type,!0), i()(t,"closeable",this.closeable), t}},mounted:function(){AJS.messages.makeCloseable();}};},lOnJ:function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t};},lb6C:function(t,e){function n(t,e){for(var n=-1,r=null==t?0:t.length,i=0,o=[];++n<r;){var a=t[n];e(a,n,t)&&(o[i++]=a);}return o}t.exports=n;},lktj:function(t,e,n){var r=n("Ibhu"),i=n("xnc9");t.exports=Object.keys||function(t){return r(t,i)};},lxbN:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",{class:["aui-avatar","aui-avatar-"+t.size,this.squared?"aui-avatar-squared":""]},[n("span",{staticClass:"aui-avatar-inner"},[n("img",{attrs:{src:t.src}})])])},i=[],o={render:r,staticRenderFns:i};e.a=o;},mClu:function(t,e,n){var r=n("kM2E");r(r.S+r.F*!n("+E39"),"Object",{defineProperty:n("evD5").f});},mTAn:function(t,e){function n(t,e){return null==t?void 0:t[e]}t.exports=n;},mgnk:function(t,e,n){function r(t){return o(t)&&i(t)==a}var i=n("aCM0"),o=n("UnEC"),a="[object Arguments]";t.exports=r;},mnC9:function(t,e,n){e.a={render:function(t){var e=this.$slots.default[0].text;return t("span",{class:["aui-icon","wait"===e?"aui-icon-wait":"aui-iconfont-"+e,"aui-icon-"+this.size]})},props:{size:{type:String,validator:function(t){return["small","large"].indexOf(t)>=0},default:"small"}},computed:{classObject:function(){return["aui-icon","aui-icon-"+this.$slots.default[0].text]}}};},mypn:function(t,e,n){(function(t,e){!function(t,n){function r(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var r={callback:t,args:e};return c[u]=r, s(u), u++}function i(t){delete c[t];}function o(t){var e=t.callback,r=t.args;switch(r.length){case 0:e();break;case 1:e(r[0]);break;case 2:e(r[0],r[1]);break;case 3:e(r[0],r[1],r[2]);break;default:e.apply(n,r);}}function a(t){if(l)setTimeout(a,0,t);else{var e=c[t];if(e){l=!0;try{o(e);}finally{i(t), l=!1;}}}}if(!t.setImmediate){var s,u=1,c={},l=!1,f=t.document,p=Object.getPrototypeOf&&Object.getPrototypeOf(t);p=p&&p.setTimeout?p:t, "[object process]"==={}.toString.call(t.process)?function(){s=function(t){e.nextTick(function(){a(t);});};}():function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1;}, t.postMessage("","*"), t.onmessage=n, e}}()?function(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"==typeof n.data&&0===n.data.indexOf(e)&&a(+n.data.slice(e.length));};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n), s=function(n){t.postMessage(e+n,"*");};}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){a(t.data);}, s=function(e){t.port2.postMessage(e);};}():f&&"onreadystatechange"in f.createElement("script")?function(){var t=f.documentElement;s=function(e){var n=f.createElement("script");n.onreadystatechange=function(){a(e), n.onreadystatechange=null, t.removeChild(n), n=null;}, t.appendChild(n);};}():function(){s=function(t){setTimeout(a,0,t);};}(), p.setImmediate=r, p.clearImmediate=i;}}("undefined"==typeof self?void 0===t?this:t:self);}).call(e,n("DuR2"),n("W2nU"));},n0T6:function(t,e,n){var r=n("Ibhu"),i=n("xnc9").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,i)};},nHtQ:function(t,e,n){e.a={};},o2mx:function(t,e,n){function r(t){if("string"==typeof t)return t;if(a(t))return o(t,r)+"";if(s(t))return l?l.call(t):"";var e=t+"";return"0"==e&&1/t==-u?"-0":e}var i=n("NkRn"),o=n("Hxdr"),a=n("NGEn"),s=n("6MiT"),u=1/0,c=i?i.prototype:void 0,l=c?c.toString:void 0;t.exports=r;},oJS2:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,".vue-aui-multi-select2 .select2-search-choice.select2-locked{padding:1px 5px!important}","",{version:3,sources:["/Users/damian/vue-aui/src/components/select2/AuiSelect2Multi.vue"],names:[],mappings:"AA0DA,6DACE,yBAA4B,CAC7B",file:"AuiSelect2Multi.vue",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Override AUI too high locked items*/\n.vue-aui-multi-select2 .select2-search-choice.select2-locked {\n  padding: 1px 5px !important;\n}\n"],sourceRoot:""}]);},oQaK:function(t,e,n){var r=n("0ZHD");"string"==typeof r&&(r=[[t.i,r,""]]), r.locals&&(t.exports=r.locals);n("rjj0")("3bd03957",r,!0,{});},oY4E:function(t,e,n){var r=n("uyp8"),i=n("EDRE");e.a={render:function(t){var e=this,n=this.getGroupsAndHeaders().map(function(t){if("aui-nav-group"===t.componentOptions.tag){(t.componentOptions&&t.componentOptions.children||[]).filter(function(t){return t.componentOptions&&"aui-nav-item"===t.componentOptions.tag}).forEach(function(t){t.componentOptions.propsData.selected=t.componentOptions.propsData.name===e.selectedTab, t.data.on={click:function(){return e.selectedTab=t.componentOptions.propsData.name}};});}return t}),o=this.getItems().filter(function(t){return t.componentOptions.propsData.name===e.selectedTab})[0]||this.getItems()[0],a=t(i.a,o&&o.componentOptions.children);return t("div",[t("div",{class:"aui-page-panel-nav"},[t(r.a,[n])]),a])},data:function(){return{selectedTab:void 0}},created:function(){var t=this.getItems()[0];this.selectedTab=t.componentOptions.propsData.name;},methods:{clicked:function(t){this.selectedTab=t.data.attrs.name;},getGroupsAndHeaders:function(){return this.$slots.default.filter(function(t){return t.componentOptions}).filter(function(t){return"aui-nav-group"===t.componentOptions.tag||"aui-nav-header"===t.componentOptions.tag})},getItems:function(){return this.getGroupsAndHeaders().reduce(function(t,e){return e.componentOptions.children?t.concat(e.componentOptions.children):t},[]).filter(function(t){return t.componentOptions}).filter(function(t){return"aui-nav-item"===t.componentOptions.tag})}}};},octw:function(t,e){function n(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t;}), n}t.exports=n;},p2oj:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,"aui-inline-dialog.vue-inline-dialog .aui-inline-dialog-contents:nth-last-child(2){display:none}aui-inline-dialog.vue-inline-dialog .aui-inline-dialog-contents .aui-inline-dialog-contents{background:none;border:none;border-radius:0;-webkit-box-shadow:none;box-shadow:none;overflow:auto;padding:0}","",{version:3,sources:["/Users/damian/vue-aui/src/components/AuiInlineDialog.vue"],names:[],mappings:"AAoEA,kFACE,YAAc,CACf,AACD,4FACE,gBAAiB,AACjB,YAAa,AACb,gBAAiB,AACjB,wBAAyB,AACjB,gBAAiB,AACzB,cAAe,AACf,SAAW,CACZ",file:"AuiInlineDialog.vue",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Fix for Chrome - elements are not added properly inside the wrapper */\naui-inline-dialog.vue-inline-dialog .aui-inline-dialog-contents:nth-last-child(2) {\n  display: none;\n}\naui-inline-dialog.vue-inline-dialog .aui-inline-dialog-contents .aui-inline-dialog-contents {\n  background: none;\n  border: none;\n  border-radius: 0;\n  -webkit-box-shadow: none;\n          box-shadow: none;\n  overflow: auto;\n  padding: 0;\n}\n"],sourceRoot:""}]);},pFYg:function(t,e,n){function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var i=n("Zzip"),o=r(i),a=n("5QVw"),s=r(a),u="function"==typeof s.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":typeof t};e.default="function"==typeof s.default&&"symbol"===u(o.default)?function(t){return void 0===t?"undefined":u(t)}:function(t){return t&&"function"==typeof s.default&&t.constructor===s.default&&t!==s.default.prototype?"symbol":void 0===t?"undefined":u(t)};},pTUa:function(t,e,n){function r(t,e){var n=t.__data__;return i(e)?n["string"==typeof e?"string":"hash"]:n.map}var i=n("/I3N");t.exports=r;},ptQi:function(t,e,n){function r(t){var e=AJS.$(t);e.tooltip("hide"), e.removeData("tipsy"), e.unbind(".tipsy");}function i(t,e){var n=e.value,i=e.modifiers,o=n,s=i,c=["nw","n","ne","w","e","sw","s","se"],l={gravity:c.filter(function(t){return s[t]})[0],html:s.html};o="object"===(void 0===o?"undefined":u()(o))?a()({},l,o):a()({},l,{title:o}), r(t), o.title&&(AJS.$(t).attr("data-tooltip",o.title), AJS.$(t).tooltip(a()({},o,{title:function(){return o.title}})));}var o=n("Dd8w"),a=n.n(o),s=n("pFYg"),u=n.n(s);e.a={bind:function(t,e){e.value!==e.oldValue&&i(t,e);},unbind:function(t){r(t);},update:function(t,e){e.value!==e.oldValue&&i(t,e);}};},pxkB:function(t,e,n){var r=n("BO1k"),i=n.n(r),o=n("jyVo");e.a={mounted:function(){var t=AJS.$(this.$el).find(".menu-item a")[0],e=AJS.$(t);AJS.tabs.change(e), AJS.tabs.setup();},computed:{tabs:function(){var t=this.$slots.default.filter(function(t){return t.componentOptions&&"aui-tab"===t.componentOptions.tag}),e=!0,n=!1,r=void 0;try{for(var a,s=i()(t);!(e=(a=s.next()).done);e=!0){var u=a.value;u.tab_id||(u.tab_id=Object(o.a)("tab"), u.componentOptions.propsData.tabId=u.tab_id);}}catch(t){n=!0, r=t;}finally{try{!e&&s.return&&s.return();}finally{if(n)throw r}}return t}}};},qXVY:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,"a[data-v-f86fda6a]{cursor:pointer}","",{version:3,sources:["/Users/damian/vue-aui/src/components/navigation/AuiNavItem.vue"],names:[],mappings:"AACA,mBACE,cAAgB,CACjB",file:"AuiNavItem.vue",sourcesContent:["\na[data-v-f86fda6a] {\n  cursor: pointer;\n}\n"],sourceRoot:""}]);},"qh/x":function(t,e,n){e.a={props:{name:String}};},qio6:function(t,e,n){var r=n("evD5"),i=n("77Pl"),o=n("lktj");t.exports=n("+E39")?Object.defineProperties:function(t,e){i(t);for(var n,a=o(e),s=a.length,u=0;s>u;)r.f(t,n=a[u++],e[n]);return t};},qwTf:function(t,e,n){var r=n("TQ3y"),i=r.Uint8Array;t.exports=i;},"r/N8":function(t,e,n){e.a={props:{cancelButton:String,floating:Boolean,height:String,isVisible:{type:Boolean,default:!0},maxHeight:String,noPadding:Boolean,showCloseButton:Boolean,size:{type:String,validator:function(t){return["small","medium","large","xlarge"].indexOf(t)>=0},default:"medium"},title:String,warning:Boolean,width:String},computed:{classObject:function(){var t={"aui-dialog2-warning":this.warning,"aui-dialog2":!0};return t["aui-dialog2-"+this.size]=!0, t}},watch:{isVisible:{immediate:!0,handler:function(){var t=this;this.floating&&(this.isVisible?this.$nextTick(function(){return AJS.dialog2(t.$el).show()}):this.$nextTick(function(){return AJS.dialog2(t.$el).hide()}));}}},mounted:function(){var t=this;AJS.whenIType("Esc").execute(function(){t.$el.contains(document.activeElement)&&t.closeDialogHandler();}), this.floating&&(AJS.dialog2(this.$el).on("hide",function(){return t.$emit("update:isVisible",!1)}), AJS.dialog2(this.$el).on("show",function(){return t.$emit("update:isVisible",!0)}));},methods:{closeDialogHandler:function(){this.$emit("onClose"), this.$emit("close");}}};},rdWa:function(t,e,n){e.a={props:{tabId:String},data:function(){return{id:this.tabId}}};},rjj0:function(t,e,n){function r(t){for(var e=0;e<t.length;e++){var n=t[e],r=l[n.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](n.parts[i]);for(;i<n.parts.length;i++)r.parts.push(o(n.parts[i]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length);}else{for(var a=[],i=0;i<n.parts.length;i++)a.push(o(n.parts[i]));l[n.id]={id:n.id,refs:1,parts:a};}}}function i(){var t=document.createElement("style");return t.type="text/css", f.appendChild(t), t}function o(t){var e,n,r=document.querySelector("style["+g+'~="'+t.id+'"]');if(r){if(v)return h;r.parentNode.removeChild(r);}if(y){var o=d++;r=p||(p=i()), e=a.bind(null,r,o,!1), n=a.bind(null,r,o,!0);}else r=i(), e=s.bind(null,r), n=function(){r.parentNode.removeChild(r);};return e(t), function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r);}else n();}}function a(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=b(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]), a.length?t.insertBefore(o,a[e]):t.appendChild(o);}}function s(t,e){var n=e.css,r=e.media,i=e.sourceMap;if(r&&t.setAttribute("media",r), m.ssrId&&t.setAttribute(ssridKey,e.id), i&&(n+="\n/*# sourceURL="+i.sources[0]+" */", n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"), t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n));}}var u="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!u)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var c=n("tTVk"),l={},f=u&&(document.head||document.getElementsByTagName("head")[0]),p=null,d=0,v=!1,h=function(){},m=null,g="data-vue-ssr-id",y="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,n,i){v=n, m=i||{};var o=c(t,e);return r(o), function(e){for(var n=[],i=0;i<o.length;i++){var a=o[i],s=l[a.id];s.refs--, n.push(s);}e?(o=c(t,e), r(o)):o=[];for(var i=0;i<n.length;i++){var s=n[i];if(0===s.refs){for(var u=0;u<s.parts.length;u++)s.parts[u]();delete l[s.id];}}}};var b=function(){var t=[];return function(e,n){return t[e]=n, t.filter(Boolean).join("\n")}}();},sB3e:function(t,e,n){var r=n("52gC");t.exports=function(t){return Object(r(t))};},sBat:function(t,e,n){function r(t){if(!t)return 0===t?t:0;if((t=i(t))===o||t===-o){return(t<0?-1:1)*a}return t===t?t:0}var i=n("kxzG"),o=1/0,a=1.7976931348623157e308;t.exports=r;},sJvV:function(t,e){function n(t,e){return function(n){return null!=n&&(n[t]===e&&(void 0!==e||t in Object(n)))}}t.exports=n;},sMXM:function(t,e,n){e=t.exports=n("FZ+f")(!0), e.push([t.i,".aui-avatar-squared .aui-avatar-inner[data-v-348780a9]{border-radius:3px}","",{version:3,sources:["/Users/damian/vue-aui/src/components/AuiAvatar.vue"],names:[],mappings:"AACA,uDACE,iBAAmB,CACpB",file:"AuiAvatar.vue",sourcesContent:["\n.aui-avatar-squared .aui-avatar-inner[data-v-348780a9] {\n  border-radius: 3px;\n}\n"],sourceRoot:""}]);},sPfX:function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n("8J60"),i=n("Bdsj"),o=n("f27Z"),a=n("G3/m"),s=n("EXMZ"),u=n("ANu0"),c=n("EDRE"),l=n("el1m"),f=n("Pfi1"),p=n("QY80"),d=n("A/bR"),v=n("9yDk"),h=n("C0/+"),m=n("UptX"),g=n("eTqe"),y=n("mnC9"),b=n("MDxl"),_=n("SeI6"),x=n("Rnw4"),A=n("B/s1"),w=n("ptQi"),C=n("OCYs");n.d(e,"AuiButton",function(){return r.a}), n.d(e,"AuiButtons",function(){return i.a}), n.d(e,"AuiToggleButton",function(){return o.a}), n.d(e,"AuiNavGroup",function(){return a.a}), n.d(e,"AuiNavHeader",function(){return s.a}), n.d(e,"AuiNavItem",function(){return u.a}), n.d(e,"AuiNavTab",function(){return c.a}), n.d(e,"AuiNavVerticalRouter",function(){return l.a}), n.d(e,"AuiSelect2Multi",function(){return f.a}), n.d(e,"AuiSelect2Option",function(){return p.a}), n.d(e,"AuiSelect2Single",function(){return d.a}), n.d(e,"AuiTab",function(){return v.a}), n.d(e,"AuiTabs",function(){return h.a}), n.d(e,"AuiAvatar",function(){return m.a}), n.d(e,"AuiDialog",function(){return g.a}), n.d(e,"AuiIcon",function(){return y.a}), n.d(e,"AuiLozenge",function(){return b.a}), n.d(e,"AuiMessage",function(){return _.a}), n.d(e,"AuiProgressIndicator",function(){return x.a}), n.d(e,"AuiSpinner",function(){return A.a}), n.d(e,"AuiTooltip",function(){return w.a}), n.d(e,"AuiInlineDialog",function(){return C.a}), e.default={install:function(t,e){t.component("aui-button",r.a), t.component("aui-buttons",i.a), t.component("aui-toggle-button",o.a), t.component("aui-nav-group",a.a), t.component("aui-nav-header",s.a), t.component("aui-nav-item",u.a), t.component("aui-nav-tab",c.a), t.component("aui-nav-vertical",l.a), t.component("aui-select2-multi",f.a), t.component("aui-select2-option",p.a), t.component("aui-tabs",h.a), t.component("aui-tab",v.a), t.component("aui-select2-single",d.a), t.component("aui-avatar",m.a), t.component("aui-dialog",g.a), t.component("aui-icon",y.a), t.component("aui-lozenge",b.a), t.component("aui-message",_.a), t.component("aui-progress-indicator",x.a), t.component("aui-spinner",A.a), t.component("va-inline-dialog",C.a), t.directive("aui-tooltip",w.a);}};},tO4o:function(t,e,n){function r(t){return t===t&&!i(t)}var i=n("yCNF");t.exports=r;},tTVk:function(t,e){t.exports=function(t,e){for(var n=[],r={},i=0;i<e.length;i++){var o=e[i],a=o[0],s=o[1],u=o[2],c=o[3],l={id:t+":"+i,css:s,media:u,sourceMap:c};r[a]?r[a].parts.push(l):n.push(r[a]={id:a,parts:[l]});}return n};},uCi2:function(t,e,n){function r(t,e){e=i(e,t);for(var n=0,r=e.length;null!=t&&n<r;)t=t[o(e[n++])];return n&&n==r?t:void 0}var i=n("bIjD"),o=n("Ubhr");t.exports=r;},uIr7:function(t,e){function n(t,e){for(var n=-1,r=e.length,i=t.length;++n<r;)t[i+n]=e[n];return t}t.exports=n;},uLhX:function(t,e,n){function r(t){var e=a.call(t,u),n=t[u];try{t[u]=void 0;var r=!0;}catch(t){}var i=s.call(t);return r&&(e?t[u]=n:delete t[u]), i}var i=n("NkRn"),o=Object.prototype,a=o.hasOwnProperty,s=o.toString,u=i?i.toStringTag:void 0;t.exports=r;},"ue/d":function(t,e){function n(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0, e}t.exports=n;},uieL:function(t,e){function n(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}t.exports=n;},unPb:function(t,e,n){e.a={};},uyp8:function(t,e,n){var r=n("Hz6t"),i=n("0xhf"),o=n("VU/8"),a=o(r.a,i.a,!1,null,null,null);e.a=a.exports;},v8Dt:function(t,e,n){function r(t){return i(this,t).get(t)}var i=n("pTUa");t.exports=r;},"vFc/":function(t,e,n){var r=n("TcQ7"),i=n("QRG4"),o=n("fkB2");t.exports=function(t){return function(e,n,a){var s,u=r(e),c=i(u.length),l=o(a,c);if(t&&n!=n){for(;c>l;)if((s=u[l++])!=s)return!0}else for(;c>l;l++)if((t||l in u)&&u[l]===n)return t||l||0;return!t&&-1}};},"vIB/":function(t,e,n){var r=n("O4g8"),i=n("kM2E"),o=n("880/"),a=n("hJx8"),s=n("D2L2"),u=n("/bQp"),c=n("94VQ"),l=n("e6n0"),f=n("PzxK"),p=n("dSzd")("iterator"),d=!([].keys&&"next"in[].keys()),v=function(){return this};t.exports=function(t,e,n,h,m,g,y){c(n,e,h);var b,_,x,A=function(t){if(!d&&t in $)return $[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",C="values"==m,O=!1,$=t.prototype,S=$[p]||$["@@iterator"]||m&&$[m],k=!d&&S||A(m),j=m?C?A("entries"):k:void 0,T="Array"==e?$.entries||S:S;if(T&&(x=f(T.call(new t)))!==Object.prototype&&x.next&&(l(x,w,!0), r||s(x,p)||a(x,p,v)), C&&S&&"values"!==S.name&&(O=!0, k=function(){return S.call(this)}), r&&!y||!d&&!O&&$[p]||a($,p,k), u[e]=k, u[w]=v, m)if(b={values:C?k:A("values"),keys:g?k:A("keys"),entries:j}, y)for(_ in b)_ in $||o($,_,b[_]);else i(i.P+i.F*(d||O),e,b);return b};},vefd:function(t,e,n){var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("span",[t.label?n("aui-label",{attrs:{for:t.id}},[t._v(t._s(t.label))]):t._e(),t._v(" "),n("aui-toggle",{ref:"toggle",attrs:{id:t.id,"tooltip-on":t.tooltipOn||"Enabled","tooltip-off":t.tooltipOff||"Disabled",disabled:t.disabled,label:t.label||"",checked:t.value}})],1)},i=[],o={render:r,staticRenderFns:i};e.a=o;},wSKX:function(t,e){function n(t){return t}t.exports=n;},woOf:function(t,e,n){t.exports={default:n("V3tA"),__esModule:!0};},xGkn:function(t,e,n){var r=n("4mcu"),i=n("EGZi"),o=n("/bQp"),a=n("TcQ7");t.exports=n("vIB/")(Array,"Array",function(t,e){this._t=a(t), this._i=0, this._k=e;},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0, i(1)):"keys"==e?i(0,n):"values"==e?i(0,t[n]):i(0,[n,t[n]])},"values"), o.Arguments=o.Array, r("keys"), r("values"), r("entries");},xnc9:function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");},yCNF:function(t,e){function n(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}t.exports=n;},z4hc:function(t,e,n){function r(t){return a(t)&&o(t.length)&&!!s[i(t)]}var i=n("aCM0"),o=n("Rh28"),a=n("UnEC"),s={};s["[object Float32Array]"]=s["[object Float64Array]"]=s["[object Int8Array]"]=s["[object Int16Array]"]=s["[object Int32Array]"]=s["[object Uint8Array]"]=s["[object Uint8ClampedArray]"]=s["[object Uint16Array]"]=s["[object Uint32Array]"]=!0, s["[object Arguments]"]=s["[object Array]"]=s["[object ArrayBuffer]"]=s["[object Boolean]"]=s["[object DataView]"]=s["[object Date]"]=s["[object Error]"]=s["[object Function]"]=s["[object Map]"]=s["[object Number]"]=s["[object Object]"]=s["[object RegExp]"]=s["[object Set]"]=s["[object String]"]=s["[object WeakMap]"]=!1, t.exports=r;},zGZ6:function(t,e,n){function r(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(o);var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],o=n.cache;if(o.has(i))return o.get(i);var a=t.apply(this,r);return n.cache=o.set(i,a)||o, a};return n.cache=new(r.Cache||i), n}var i=n("YeCl"),o="Expected a function";r.Cache=i, t.exports=r;},zQR9:function(t,e,n){var r=n("h65t")(!0);n("vIB/")(String,"String",function(t){this._t=String(t), this._i=0;},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n), this._i+=t.length, {value:t,done:!1})});},zpVT:function(t,e,n){function r(t,e){var n=this.__data__;if(n instanceof i){var r=n.__data__;if(!o||r.length<s-1)return r.push([t,e]), this.size=++n.size, this;n=this.__data__=new a(r);}return n.set(t,e), this.size=n.size, this}var i=n("duB3"),o=n("POb3"),a=n("YeCl"),s=200;t.exports=r;}})});

});

var VueAui = unwrapExports(vueAui);
var vueAui_1 = vueAui.VueAui;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$3.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$1(value) {
  return value;
}

var identity_1 = identity$1;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
  return _defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$4.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$6.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */
var assignIn = _createAssigner(function(object, source) {
  _copyObject(source, keysIn_1(source), object);
});

var assignIn_1 = assignIn;

var extend$1 = assignIn_1;

function ajax(options) {
    return new Promise(function (resolve, reject) {
        var defaultOptions = {
            success: function success(response) {
                resolve(response ? JSON.parse(response) : undefined);
            },
            error: function error(_error) {
                reject(_error);
            }
        };
        var finalOptions = extend$1(defaultOptions, options);

        AP.request(finalOptions);
    });
}

function put(url, data) {
    return ajax({
        type: "PUT",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

function post(url, data) {
    return ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

function get(url) {
    return ajax({ url: url });
}

var JiraCloudApi = Object.freeze({
	put: put,
	post: post,
	get: get
});

function get$1() {
    // return AP.request(...)
}

var JiraServerApi = Object.freeze({
	get: get$1
});

var projects = [{
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10706",
    "id": "10706",
    "key": "AG",
    "name": "Agility",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10706&avatarId=10847",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10706&avatarId=10847",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10706&avatarId=10847",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10706&avatarId=10847"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10705",
    "id": "10705",
    "key": "A2",
    "name": "Agility 2",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10705&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10705&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10705&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10705&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10704",
    "id": "10704",
    "key": "AB",
    "name": "Agility Board",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10704&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10704&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10704&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10704&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}, {
    "expand": "description,lead,issueTypes,url,projectKeys",
    "self": "https://dskrodzki.atlassian.net/rest/api/2/project/10651",
    "id": "10651",
    "key": "MOLEST65",
    "name": "Awesome Granite Fish",
    "avatarUrls": {
        "48x48": "https://dskrodzki.atlassian.net/secure/projectavatar?pid=10651&avatarId=10846",
        "24x24": "https://dskrodzki.atlassian.net/secure/projectavatar?size=small&pid=10651&avatarId=10846",
        "16x16": "https://dskrodzki.atlassian.net/secure/projectavatar?size=xsmall&pid=10651&avatarId=10846",
        "32x32": "https://dskrodzki.atlassian.net/secure/projectavatar?size=medium&pid=10651&avatarId=10846"
    },
    "projectTypeKey": "software",
    "simplified": false
}];

function get$2(url, payload) {
    var response = void 0;
    if (url === '/rest/api/2/project') {
        response = projects;
    } else if (url.match(/\/rest\/api\/2\/project\/\d+/)) {
        var projectId = url.split('/')[url.split('/').length - 1];
        response = projects.filter(function (project) {
            return project.id === projectId;
        })[0];
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            return resolve(response, 100);
        });
    });
}

var JiraMocksApi = Object.freeze({
	get: get$2
});

function detectApi() {
    if (window.AP && AP.jira && AP.user) {
        return JiraCloudApi;
    } else if (window.JIRA && JIRA.API) {
        return JiraServerApi;
    }
    return JiraMocksApi;
}

var api = detectApi();

function getProjects() {
    return api.get('/rest/api/2/project');
}

function getProject(projectKeyOrId) {
    return api.get('/rest/api/2/project/' + projectKeyOrId);
}

var JiraApi = Object.freeze({
	detectApi: detectApi,
	getProjects: getProjects,
	getProject: getProject
});

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto$1 = Array.prototype;

/** Built-in value references. */
var splice = arrayProto$1.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$8.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]';
var dateTag$1 = '[object Date]';
var errorTag$1 = '[object Error]';
var mapTag$1 = '[object Map]';
var numberTag$1 = '[object Number]';
var regexpTag$1 = '[object RegExp]';
var setTag$1 = '[object Set]';
var stringTag$1 = '[object String]';
var symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]';
var dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined;
var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$10.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$11 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$11.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$12 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$12.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$10.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = _getNative(_root, 'Set');

var _Set$1 = Set$1;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]';
var objectTag$1 = '[object Object]';
var promiseTag = '[object Promise]';
var setTag$2 = '[object Set]';
var weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView);
var mapCtorString = _toSource(_Map);
var promiseCtorString = _toSource(_Promise);
var setCtorString = _toSource(_Set$1);
var weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set$1 && getTag(new _Set$1) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';
var arrayTag$1 = '[object Array]';
var objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var objectProto$13 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$11 = objectProto$13.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$11.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$11.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var reLeadingDot = /^\./;
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined;
var symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString$1;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$3(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$3;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_1(collection)) {
      var iteratee = _baseIteratee(predicate, 3);
      collection = keys_1(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

var _createFind = createFind;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;
var MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY$2 || value === -INFINITY$2) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax$1 = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
  if (index < 0) {
    index = nativeMax$1(length + index, 0);
  }
  return _baseFindIndex(array, _baseIteratee(predicate, 3), index);
}

var findIndex_1 = findIndex;

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = _createFind(findIndex_1);

var find_1 = find;

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = " .result-project[data-v-48769a5e] { align-items: center; display: flex; padding: 3px 2px; } .result-project-avatar[data-v-48769a5e] { margin-right: 5px; } .result-project-name[data-v-48769a5e] { text-overflow: ellipsis; overflow: hidden; } ";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

// TODO add recently accessed section

var ProjectPicker = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return !_vm.multiple ? _c('aui-select2-single', { attrs: { "disabled": _vm.disabled, "value": _vm.value, "placeholder": _vm.placeholder, "query": _vm.queryValues, "init-selection": _vm.initialValue }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } }, scopedSlots: _vm._u([{ key: "formatSelection", fn: function fn(option) {
                    return _c('span', {}, [_c('aui-avatar', { attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" " + _vm._s(option.data.name) + " ")], 1);
                } }, { key: "formatResult", fn: function fn(option) {
                    return _c('span', { staticClass: "result-project" }, [_c('aui-avatar', { staticClass: "result-project-avatar", attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" "), _c('span', { staticClass: "result-project-name" }, [_vm._v(_vm._s(option.data.name))])], 1);
                } }]) }) : _c('aui-select2-multi', { attrs: { "disabled": _vm.disabled, "value": _vm.value, "placeholder": _vm.placeholder, "query": _vm.queryValues, "init-selection": _vm.initialValues }, on: { "input": function input($event) {
                    _vm.$emit('input', $event);
                } }, scopedSlots: _vm._u([{ key: "formatSelection", fn: function fn(option) {
                    return _c('span', {}, [_c('aui-avatar', { attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" " + _vm._s(option.data.name) + " ")], 1);
                } }, { key: "formatResult", fn: function fn(option) {
                    return _c('span', { staticClass: "result-project" }, [_c('aui-avatar', { staticClass: "result-project-avatar", attrs: { "squared": "", "size": "xsmall", "src": option.data.avatarUrls['48x48'] } }), _vm._v(" "), _c('span', { staticClass: "result-project-name" }, [_vm._v(_vm._s(option.data.name))])], 1);
                } }]) });
    }, staticRenderFns: [], _scopeId: 'data-v-48769a5e',
    props: {
        disabled: Boolean,
        multiple: Boolean,
        placeholder: String,
        value: [String, Array]
    },

    created: function created() {
        this.getProjectsPromise = this.$jira.getProjects();
    },


    methods: {
        mapProjectToProjectOption: function mapProjectToProjectOption(project) {
            return {
                id: project.id,
                text: project.name + ' (' + project.key + ')',
                data: project
            };
        },
        queryValues: function queryValues(query) {
            var _this = this;

            if (query.term === undefined) {} else {
                this.getProjectsPromise.then(function (projects) {
                    var projectItems = projects.filter(function (project) {
                        return project.key === query.term.toUpperCase() || project.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0;
                    }).map(function (project) {
                        return _this.mapProjectToProjectOption(project);
                    });
                    query.callback({ results: projectItems });
                });
            }
        },
        initialValue: function initialValue(element, callback) {
            var _this2 = this;

            if (element.val()) {
                this.$jira.getProject(element.val()).then(function (project) {
                    callback(_this2.mapProjectToProjectOption(project));
                });
            }
        },
        initialValues: function initialValues(element, callback) {
            var _this3 = this;

            if (element.val()) {
                var projectIds = element.val().split(',');
                this.getProjectsPromise.then(function (projects) {
                    var projectItems = projectIds.map(function (projectId) {
                        return find_1(projects, { id: projectId });
                    }).map(function (project) {
                        return _this3.mapProjectToProjectOption(project);
                    });
                    callback(projectItems);
                });
            } else {
                callback([]);
            }
        }
    }
};

var VueAuiJiraExtras = {
    install: function install(Vue, options) {
        Vue.component('va-project-picker', ProjectPicker);

        Vue.prototype.$jira = JiraApi;
    }
};

(function () {
    if (typeof document !== 'undefined') {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = "";style.type = 'text/css';if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }head.appendChild(style);
    }
})();

var App = { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "page" } }, [_vm._m(0), _vm._v(" "), _c('section', [_c('div', { staticClass: "aui-page-panel" }, [_c('div', { staticClass: "aui-page-panel-inner" }, [_c('section', { staticClass: "aui-page-panel-content" }, [_c('h2', [_vm._v("Jira Project Picker")]), _vm._v(" "), _c('p', [_c('va-project-picker', { attrs: { "placeholder": "Select a project..." }, model: { value: _vm.projectId, callback: function callback($$v) {
                    _vm.projectId = $$v;
                }, expression: "projectId" } }), _vm._v(" "), _c('aui-button', { attrs: { "type": "link" }, on: { "click": function click($event) {
                    _vm.projectId = undefined;
                } } }, [_vm._v("Clear")])], 1), _vm._v(" "), _c('form', { staticClass: "aui" }, [_c('va-project-picker', { attrs: { "multiple": "multiple", "placeholder": "Select a project..." }, model: { value: _vm.projectIds, callback: function callback($$v) {
                    _vm.projectIds = $$v;
                }, expression: "projectIds" } })], 1), _vm._v(" "), _c('aui-button', { attrs: { "type": "link" }, on: { "click": function click($event) {
                    _vm.projectIds = [];
                } } }, [_vm._v("Clear")])], 1)])])])]);
    }, staticRenderFns: [function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('header', { attrs: { "id": "header", "role": "banner" } }, [_c('nav', { staticClass: "aui-header aui-dropdown2-trigger-group", attrs: { "role": "navigation" } }, [_c('div', { staticClass: "aui-header-inner" }, [_c('div', { staticClass: "aui-header-primary" }, [_c('h1', { staticClass: "aui-header-logo", attrs: { "id": "logo" } }, [_c('a', { attrs: { "href": "http://example.com/" } }, [_c('span', { staticClass: "aui-header-logo-device" }, [_vm._v("AUI")])])]), _vm._v(" "), _c('ul', { staticClass: "aui-nav" }, [_c('li', [_c('a', { attrs: { "href": "http://example.com/" } }, [_vm._v("Nav")])])])])])])]);
    }],
    data: function data() {
        return {
            projectId: "10706",
            projectIds: ["10705"]
        };
    }
};

Vue$3.use(VueAui);
Vue$3.use(VueAuiJiraExtras);

new Vue$3({
    el: '#app',
    render: function render(h) {
        return h(App);
    }
});
