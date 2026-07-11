import {
  require_react
} from "./chunk-NO6UH6X3.js";
import {
  __commonJS,
  __toESM
} from "./chunk-5WRI5ZAA.js";

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(
        React,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// node_modules/react-mobile-picker/dist/react-mobile-picker.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react = __toESM(require_react());
var rt = 216;
var ot = 36;
var ct = "off";
var U = (0, import_react.createContext)(null);
U.displayName = "PickerDataContext";
function Y(c) {
  const r = (0, import_react.useContext)(U);
  if (r === null) {
    const e = new Error(`<${c} /> is missing a parent <Picker /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(e, Y), e;
  }
  return r;
}
var F = (0, import_react.createContext)(null);
F.displayName = "PickerActionsContext";
function G(c) {
  const r = (0, import_react.useContext)(F);
  if (r === null) {
    const e = new Error(`<${c} /> is missing a parent <Picker /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(e, G), e;
  }
  return r;
}
function it(c, r = (e) => e) {
  return c.slice().sort((e, i) => {
    const o = r(e), n = r(i);
    if (o === null || n === null)
      return 0;
    const s = o.compareDocumentPosition(n);
    return s & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : s & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function st(c, r) {
  switch (r.type) {
    case "REGISTER_OPTION": {
      const { key: e, option: i } = r;
      let o = [...c[e] || [], i];
      return o = it(o, (n) => n.element.current), {
        ...c,
        [e]: o
      };
    }
    case "UNREGISTER_OPTION": {
      const { key: e, option: i } = r;
      return {
        ...c,
        [e]: (c[e] || []).filter((o) => o !== i)
      };
    }
    default:
      throw Error(`Unknown action: ${r.type}`);
  }
}
function at(c) {
  const {
    style: r,
    children: e,
    value: i,
    onChange: o,
    height: n = rt,
    itemHeight: s = ot,
    wheelMode: d = ct,
    ...p
  } = c, v = (0, import_react.useMemo)(
    () => ({
      height: s,
      marginTop: -(s / 2),
      position: "absolute",
      top: "50%",
      left: 0,
      width: "100%",
      pointerEvents: "none"
    }),
    [s]
  ), h = (0, import_react.useMemo)(
    () => ({
      height: `${n}px`,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      maskImage: "linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)",
      WebkitMaskImage: "linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)"
    }),
    [n]
  ), [x, g] = (0, import_react.useReducer)(st, {}), T = (0, import_react.useMemo)(
    () => ({ height: n, itemHeight: s, wheelMode: d, value: i, optionGroups: x }),
    [n, s, i, x, d]
  ), f = (0, import_react.useCallback)((E, m) => {
    if (i[E] === m)
      return false;
    const C = { ...i, [E]: m };
    return o(C, E), true;
  }, [o, i]), P = (0, import_react.useCallback)((E, m) => (g({ type: "REGISTER_OPTION", key: E, option: m }), () => g({ type: "UNREGISTER_OPTION", key: E, option: m })), []), w = (0, import_react.useMemo)(
    () => ({ registerOption: P, change: f }),
    [P, f]
  );
  return (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        ...h,
        ...r
      },
      ...p,
      children: [
        (0, import_jsx_runtime.jsx)(F.Provider, { value: w, children: (0, import_jsx_runtime.jsx)(U.Provider, { value: T, children: e }) }),
        (0, import_jsx_runtime.jsxs)(
          "div",
          {
            style: v,
            children: [
              (0, import_jsx_runtime.jsx)(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    bottom: "auto",
                    left: 0,
                    right: "auto",
                    width: "100%",
                    height: "1px",
                    background: "#d9d9d9",
                    transform: "scaleY(0.5)"
                  }
                }
              ),
              (0, import_jsx_runtime.jsx)(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "auto",
                    bottom: 0,
                    left: 0,
                    right: "auto",
                    width: "100%",
                    height: "1px",
                    background: "#d9d9d9",
                    transform: "scaleY(0.5)"
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
}
var W = (0, import_react.createContext)(null);
W.displayName = "PickerColumnDataContext";
function J(c) {
  const r = (0, import_react.useContext)(W);
  if (r === null) {
    const e = new Error(`<${c} /> is missing a parent <Picker.Column /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(e, J), e;
  }
  return r;
}
function lt({
  style: c,
  children: r,
  name: e,
  ...i
}) {
  const { height: o, itemHeight: n, wheelMode: s, value: d, optionGroups: p } = Y("Picker.Column"), v = (0, import_react.useMemo)(
    () => d[e],
    [d, e]
  ), h = (0, import_react.useMemo)(
    () => p[e] || [],
    [e, p]
  ), x = (0, import_react.useMemo)(
    () => {
      let t = h.findIndex((a) => a.value === v);
      return t < 0 && (t = 0), t;
    },
    [h, v]
  ), g = (0, import_react.useMemo)(
    () => o / 2 - n * h.length + n / 2,
    [o, n, h]
  ), T = (0, import_react.useMemo)(
    () => o / 2 - n / 2,
    [o, n]
  ), [f, P] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    P(o / 2 - n / 2 - x * n);
  }, [o, n, x]);
  const w = G("Picker.Column"), E = (0, import_react.useRef)(f);
  E.current = f;
  const m = (0, import_react.useCallback)(() => {
    let t = 0;
    const a = E.current;
    a >= T ? t = 0 : a <= g ? t = h.length - 1 : t = -Math.round((a - T) / n), w.change(e, h[t].value) || P(o / 2 - n / 2 - t * n);
  }, [w, o, n, e, T, g, h]), [C, N] = (0, import_react.useState)(0), [k, M] = (0, import_react.useState)(false), [$, R] = (0, import_react.useState)(0), S = (0, import_react.useCallback)((t) => {
    t < g ? t = g - Math.pow(g - t, 0.8) : t > T && (t = T + Math.pow(t - T, 0.8)), P(t);
  }, [T, g]), Q = (0, import_react.useCallback)((t) => {
    R(t.targetTouches[0].pageY), N(f);
  }, [f]), b = (0, import_react.useCallback)((t) => {
    t.cancelable && t.preventDefault(), k || M(true);
    const a = C + t.targetTouches[0].pageY - $;
    S(a);
  }, [k, C, $, S]), X = (0, import_react.useCallback)(() => {
    k && (M(false), R(0), N(0), m());
  }, [m, k]), Z = (0, import_react.useCallback)(() => {
    k && (M(false), R(0), P(C), N(0));
  }, [k, C]), D = (0, import_react.useRef)(null), j = (0, import_react.useCallback)((t) => {
    if (t.deltaY === 0)
      return;
    let a = t.deltaY * 0.1;
    Math.abs(a) < n && (a = n * Math.sign(a)), s === "normal" && (a = -a);
    const B = f + a;
    S(B);
  }, [n, f, S, s]), z = (0, import_react.useCallback)(() => {
    m();
  }, [m]), _ = (0, import_react.useCallback)((t) => {
    s !== "off" && (t.cancelable && t.preventDefault(), j(t), D.current && clearTimeout(D.current), D.current = setTimeout(() => {
      z();
    }, 200));
  }, [z, j, D, s]), V = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const t = V.current;
    return t && (t.addEventListener("touchmove", b, { passive: false }), t.addEventListener("wheel", _, { passive: false })), () => {
      t && (t.removeEventListener("touchmove", b), t.removeEventListener("wheel", _));
    };
  }, [b, _]);
  const tt = (0, import_react.useMemo)(
    () => ({
      flex: "1 1 0%",
      maxHeight: "100%",
      transitionProperty: "transform",
      transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
      transitionDuration: k ? "0ms" : "300ms",
      transform: `translate3d(0, ${f}px, 0)`
    }),
    [f, k]
  ), et = (0, import_react.useMemo)(
    () => ({ key: e }),
    [e]
  );
  return (0, import_jsx_runtime.jsx)(
    "div",
    {
      style: {
        ...tt,
        ...c
      },
      ref: V,
      onTouchStart: Q,
      onTouchEnd: X,
      onTouchCancel: Z,
      ...i,
      children: (0, import_jsx_runtime.jsx)(W.Provider, { value: et, children: r })
    }
  );
}
function ut(c) {
  return typeof c == "function";
}
function ht({
  style: c,
  children: r,
  value: e,
  ...i
}) {
  const o = (0, import_react.useRef)(null), { itemHeight: n, value: s } = Y("Picker.Item"), d = G("Picker.Item"), { key: p } = J("Picker.Item");
  (0, import_react.useEffect)(
    () => d.registerOption(p, { value: e, element: o }),
    [p, d, e]
  );
  const v = (0, import_react.useMemo)(
    () => ({
      height: `${n}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }),
    [n]
  ), h = (0, import_react.useCallback)(() => {
    d.change(p, e);
  }, [d, p, e]);
  return (0, import_jsx_runtime.jsx)(
    "div",
    {
      style: {
        ...v,
        ...c
      },
      ref: o,
      onClick: h,
      ...i,
      children: ut(r) ? r({ selected: s[p] === e }) : r
    }
  );
}
var K = at;
K.Column = lt;
K.Item = ht;
export {
  K as default
};
//# sourceMappingURL=react-mobile-picker.js.map
