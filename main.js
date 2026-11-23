var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MobileHubPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian12 = require("obsidian");

// src/types.ts
var DEFAULT_SETTINGS = {
  memoFolder: "\u5907\u5FD8\u5F55",
  diaryFolder: "\u65E5\u8BB0",
  excludedFolders: ["assets", ".obsidian"],
  autoOpenOnMobile: true,
  disableLeftDrawerSwipe: true,
  weekStartsMonday: true,
  customOrder: {}
};

// src/views/MobileHubView.tsx
var import_obsidian10 = require("obsidian");

// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var a;
var s;
var h;
var p;
var v;
var y;
var d = {};
var w = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function b(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function k(l3, u4, t3) {
  var i4, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i4 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return x(l3, e3, i4, r3, null);
}
function x(n2, t3, i4, r3, o3) {
  var e3 = { type: n2, props: t3, key: i4, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function S(n2) {
  return n2.children;
}
function C(n2, l3) {
  this.props = n2, this.context = l3;
}
function $(n2, l3) {
  if (null == l3) return n2.__ ? $(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? $(n2) : null;
}
function I(n2) {
  if (n2.__P && n2.__d) {
    var u4 = n2.__v, t3 = u4.__e, i4 = [], r3 = [], o3 = m({}, u4);
    o3.__v = u4.__v + 1, l.vnode && l.vnode(o3), q(n2.__P, o3, u4, n2.__n, n2.__P.namespaceURI, 32 & u4.__u ? [t3] : null, i4, null == t3 ? $(u4) : t3, !!(32 & u4.__u), r3), o3.__v = u4.__v, o3.__.__k[o3.__i] = o3, D(i4, o3, r3), u4.__e = u4.__ = null, o3.__e != t3 && P(o3);
  }
}
function P(n2) {
  if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
    if (null != l3 && null != l3.__e) return n2.__e = n2.__c.base = l3.__e;
  }), P(n2);
}
function A(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n2, l3 = 1; i.length; ) i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, I(n2);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n2, l3, u4, t3, i4, r3, o3, e3, f4, c3, a3) {
  var s3, h3, p3, v3, y3, _2, g2 = t3 && t3.__k || w, m3 = l3.length;
  for (f4 = T(u4, l3, g2, f4, m3), s3 = 0; s3 < m3; s3++) null != (p3 = u4.__k[s3]) && (h3 = -1 != p3.__i && g2[p3.__i] || d, p3.__i = s3, _2 = q(n2, p3, h3, i4, r3, o3, e3, f4, c3, a3), v3 = p3.__e, p3.ref && h3.ref != p3.ref && (h3.ref && J(h3.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y3 && null != v3 && (y3 = v3), 4 & p3.__u ? (f4 = j(p3, f4, n2), h3.__e && (h3.__e = null)) : "function" == typeof p3.type && void 0 !== _2 ? f4 = _2 : v3 && (f4 = v3.nextSibling), p3.__u &= -7);
  return u4.__e = y3, f4;
}
function T(n2, l3, u4, t3, i4) {
  var r3, o3, e3, f4, c3, a3 = u4.length, s3 = a3, h3 = 0;
  for (n2.__k = new Array(i4), r3 = 0; r3 < i4; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n2.__k[r3] = x(null, o3, null, null, null) : g(o3) ? o3 = n2.__k[r3] = x(S, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n2.__k[r3] = x(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n2.__k[r3] = o3, f4 = r3 + h3, o3.__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = O(o3, u4, f4, s3)) && (s3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i4 > a3 ? h3-- : i4 < a3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (s3) for (r3 = 0; r3 < a3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = $(e3)), K(e3, e3));
  return t3;
}
function j(n2, l3, u4) {
  var t3, i4;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i4 = 0; t3 && i4 < t3.length; i4++) t3[i4] && (t3[i4].__ = n2, l3 = j(t3[i4], l3, u4));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !l3.parentNode && (l3 = $(n2)), l3 = u4.insertBefore(n2.__e, l3 || null));
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function O(n2, l3, u4, t3) {
  var i4, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], a3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == e3 || a3 && e3 == c3.key && f4 == c3.type) return u4;
  if (t3 > (a3 ? 1 : 0)) {
    for (i4 = u4 - 1, r3 = u4 + 1; i4 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i4 >= 0 ? i4-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
  }
  return -1;
}
function z(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || _.test(l3) ? u4 : u4 + "px";
}
function N(n2, l3, u4, t3, i4) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || z(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || z(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4[a] = t3[a] : (u4[a] = h, n2.addEventListener(l3, r3 ? v : p, r3)) : n2.removeEventListener(l3, r3 ? v : p, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u4 ? "" : u4;
      break n;
    } catch (n3) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function V(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4[c]) u4[c] = h++;
      else if (u4[c] < t3[a]) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function q(n2, u4, t3, i4, r3, o3, e3, f4, c3, a3) {
  var s3, h3, p3, v3, y3, d3, _2, k3, x2, M, I2, P2, A3, H2, T3, j3, F = u4.type;
  if (void 0 !== u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (s3 = l.__b) && s3(u4);
  n: if ("function" == typeof F) {
    h3 = e3.length;
    try {
      if (x2 = u4.props, M = F.prototype && F.prototype.render, I2 = (s3 = F.contextType) && i4[s3.__c], P2 = s3 ? I2 ? I2.props.value : s3.__ : i4, t3.__c ? k3 = (p3 = u4.__c = t3.__c).__ = p3.__E : (M ? u4.__c = p3 = new F(x2, P2) : (u4.__c = p3 = new C(x2, P2), p3.constructor = F, p3.render = Q), I2 && I2.sub(p3), p3.state || (p3.state = {}), p3.__n = i4, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M && null == p3.__s && (p3.__s = p3.state), M && null != F.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m({}, p3.__s)), m(p3.__s, F.getDerivedStateFromProps(x2, p3.__s))), y3 = p3.props, d3 = p3.state, p3.__v = u4, v3) M && null == F.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
      else {
        if (M && null == F.getDerivedStateFromProps && x2 !== y3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x2, P2), u4.__v == t3.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x2, p3.__s, P2)) {
          u4.__v != t3.__v && (p3.props = x2, p3.state = p3.__s, p3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
            n3 && (n3.__ = u4);
          }), w.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f4 = $(t3);
          break n;
        }
        null != p3.componentWillUpdate && p3.componentWillUpdate(x2, p3.__s, P2), M && null != p3.componentDidUpdate && p3.__h.push(function() {
          p3.componentDidUpdate(y3, d3, _2);
        });
      }
      if (p3.context = P2, p3.props = x2, p3.__P = n2, p3.__e = false, A3 = l.__r, H2 = 0, M) p3.state = p3.__s, p3.__d = false, A3 && A3(u4), s3 = p3.render(p3.props, p3.state, p3.context), w.push.apply(p3.__h, p3._sb), p3._sb = [];
      else do {
        p3.__d = false, A3 && A3(u4), s3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
      } while (p3.__d && ++H2 < 25);
      p3.state = p3.__s, null != p3.getChildContext && (i4 = m(m({}, i4), p3.getChildContext())), M && !v3 && null != p3.getSnapshotBeforeUpdate && (_2 = p3.getSnapshotBeforeUpdate(y3, d3)), T3 = null != s3 && s3.type === S && null == s3.key ? E(s3.props.children) : s3, f4 = L(n2, g(T3) ? T3 : [T3], u4, t3, i4, r3, o3, e3, f4, c3, a3), p3.base = u4.__e, u4.__u &= -161, p3.__h.length && e3.push(p3), k3 && (p3.__E = p3.__ = null);
    } catch (n3) {
      if (e3.length = h3, u4.__v = null, c3 || null != o3) {
        if (n3.then) {
          for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
          null != o3 && (o3[o3.indexOf(f4)] = null), u4.__e = f4;
        } else if (null != o3) for (j3 = o3.length; j3--; ) b(o3[j3]);
      } else u4.__e = t3.__e;
      null == u4.__k && (u4.__k = t3.__k || []), n3.then || B(u4), l.__e(n3, u4, t3);
    }
  } else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = G(t3.__e, u4, t3, i4, r3, o3, e3, c3, a3);
  return (s3 = l.diffed) && s3(u4), 128 & u4.__u ? void 0 : f4;
}
function B(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
}
function D(n2, u4, t3) {
  for (var i4 = 0; i4 < t3.length; i4++) J(t3[i4], t3[++i4], t3[++i4]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function E(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
}
function G(u4, t3, i4, r3, o3, e3, f4, c3, a3) {
  var s3, h3, p3, v3, y3, w3, _2, m3 = i4.props || d, k3 = t3.props, x2 = t3.type;
  if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (s3 = 0; s3 < e3.length; s3++) if ((y3 = e3[s3]) && "setAttribute" in y3 == !!x2 && (x2 ? y3.localName == x2 : 3 == y3.nodeType)) {
      u4 = y3, e3[s3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x2) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x2) m3 === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = "textarea" == x2 && null != k3.defaultValue ? null : e3 && n.call(u4.childNodes), !c3 && null != e3) for (m3 = {}, s3 = 0; s3 < u4.attributes.length; s3++) m3[(y3 = u4.attributes[s3]).name] = y3.value;
    for (s3 in m3) y3 = m3[s3], "dangerouslySetInnerHTML" == s3 ? p3 = y3 : "children" == s3 || s3 in k3 || "value" == s3 && "defaultValue" in k3 || "checked" == s3 && "defaultChecked" in k3 || N(u4, s3, null, y3, o3);
    for (s3 in k3) y3 = k3[s3], "children" == s3 ? v3 = y3 : "dangerouslySetInnerHTML" == s3 ? h3 = y3 : "value" == s3 ? w3 = y3 : "checked" == s3 ? _2 = y3 : c3 && "function" != typeof y3 || m3[s3] === y3 || N(u4, s3, y3, m3[s3], o3);
    if (h3) c3 || p3 && (h3.__html == p3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (p3 && (u4.innerHTML = ""), L("template" == t3.type ? u4.content : u4, g(v3) ? v3 : [v3], t3, i4, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i4.__k && $(i4, 0), c3, a3), null != e3) for (s3 = e3.length; s3--; ) b(e3[s3]);
    c3 && "textarea" != x2 || (s3 = "value", "progress" == x2 && null == w3 ? u4.removeAttribute("value") : null != w3 && (w3 !== u4[s3] || "progress" == x2 && !w3 || "option" == x2 && w3 != m3[s3]) && N(u4, s3, w3, m3[s3], o3), s3 = "checked", null != _2 && _2 != u4[s3] && N(u4, s3, _2, m3[s3], o3));
  }
  return u4;
}
function J(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i4 = "function" == typeof n2.__u;
      i4 && n2.__u(), i4 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function K(n2, u4, t3) {
  var i4, r3;
  if (l.unmount && l.unmount(n2), (i4 = n2.ref) && (i4.current && i4.current != n2.__e || J(i4, null, u4)), null != (i4 = n2.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i4.base = i4.__P = i4.__n = null;
  }
  if (i4 = n2.__k) for (r3 = 0; r3 < i4.length; r3++) i4[r3] && K(i4[r3], u4, t3 || "function" != typeof n2.type);
  t3 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function Q(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function R(u4, t3, i4) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i4) ? null : i4 && i4.__k || t3.__k, e3 = [], f4 = [], q(t3, u4 = (!r3 && i4 || t3).__k = k(S, null, [u4]), o3 || d, d, t3.namespaceURI, !r3 && i4 ? [i4] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i4 ? i4 : o3 ? o3.__e : t3.firstChild, r3, f4), D(e3, u4, f4), u4.props.children = null;
}
n = w.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i4, r3, o3; l3 = l3.__; ) if ((i4 = l3.__c) && !i4.__) try {
    if ((r3 = i4.constructor) && null != r3.getDerivedStateFromError && (i4.setState(r3.getDerivedStateFromError(n2)), o3 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n2, t3 || {}), o3 = i4.__d), o3) return i4.__E = i4;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, C.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u4), this.props)), n2 && m(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), A(this));
}, C.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
}, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var p2 = c2.__;
function s2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function d2(n2) {
  return o2 = 1, y2(D2, n2);
}
function y2(n2, u4, i4) {
  var o3 = s2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i4 ? i4(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H) return true;
      var u5 = false, i5 = o3.__c.props !== n3;
      if (o3.__c.__H.__.some(function(n4) {
        if (n4.__N) {
          u5 = true;
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i5 = true);
        }
      }), c3) {
        var f5 = c3.call(this, n3, t3, r3);
        return u5 ? f5 || i5 : f5;
      }
      return !u5 || i5;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function h2(n2, u4) {
  var i4 = s2(t2++, 3);
  !c2.__s && C2(i4.__H, u4) && (i4.__ = n2, i4.u = u4, r2.__H.__h.push(i4));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u4 = s2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); ) {
    var t3 = n2.__H;
    if (n2.__P && t3) try {
      t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
    } catch (r3) {
      t3.__h = [], c2.__e(r3, n2.__v);
    }
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), p2 && p2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i4 = (r2 = n2.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i4.__h.some(z2), i4.__h.some(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u, n3.u = void 0);
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.some(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// src/utils/obsidian.ts
var import_obsidian = require("obsidian");
function openObsidianSettings(app) {
  const anyApp = app;
  if (anyApp.setting?.open) {
    anyApp.setting.open();
    return;
  }
  anyApp.commands?.executeCommandById?.("app:open-settings");
}
function openObsidianSwitcher(app) {
  const anyApp = app;
  anyApp.commands?.executeCommandById?.("switcher:open");
}
async function openFileInEditor(app, file) {
  const leaf = app.workspace.getLeaf(false);
  await leaf.openFile(file, { active: true });
}
async function ensureFolder(app, folderPath) {
  const normalized = (0, import_obsidian.normalizePath)(folderPath);
  const existing = app.vault.getAbstractFileByPath(normalized);
  if (existing instanceof import_obsidian.TFolder) return existing;
  await app.vault.createFolder(normalized);
  const created = app.vault.getAbstractFileByPath(normalized);
  if (created instanceof import_obsidian.TFolder) return created;
  throw new Error(`Failed to create folder: ${normalized}`);
}
function pad2(n2) {
  return n2 < 10 ? `0${n2}` : `${n2}`;
}
function formatDateKey(d3) {
  return `${d3.getFullYear()}-${pad2(d3.getMonth() + 1)}-${pad2(d3.getDate())}`;
}
function formatDateTime(ts) {
  const d3 = new Date(ts);
  return `${d3.getFullYear()}-${pad2(d3.getMonth() + 1)}-${pad2(d3.getDate())} ${pad2(d3.getHours())}:${pad2(d3.getMinutes())}`;
}
function formatShortDateTime(ts) {
  const d3 = new Date(ts);
  const now = /* @__PURE__ */ new Date();
  if (d3.getFullYear() === now.getFullYear()) {
    return `${pad2(d3.getMonth() + 1)}-${pad2(d3.getDate())} ${pad2(d3.getHours())}:${pad2(d3.getMinutes())}`;
  }
  return formatDateTime(ts);
}
function stripFrontmatter(content) {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) return content.trim();
  const endIdx = trimmed.indexOf("\n---", 3);
  if (endIdx === -1) return content.trim();
  return trimmed.slice(endIdx + 4).trim();
}
function cleanMarkdownPreview(content, maxLines = 8) {
  const body = stripFrontmatter(content).replace(/!\[\[[^\]]+\]\]/g, "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/\uFFFC/g, "").trim();
  if (!body) return "";
  const lines = body.split(/\r?\n/).map((l3) => l3.trimEnd()).filter((l3, idx, arr) => l3.length > 0 || idx > 0 && arr[idx - 1].length > 0);
  return lines.slice(0, maxLines).join("\n");
}
function extractImagesFromContent(app, content, sourcePath, limit = 3) {
  const urls = [];
  const wikiImgRegex = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const tryAdd = (link) => {
    if (urls.length >= limit) return;
    const cleaned = link.trim();
    if (!cleaned) return;
    if (/^https?:\/\//i.test(cleaned)) {
      urls.push(cleaned);
      return;
    }
    const resolved = app.metadataCache.getFirstLinkpathDest(cleaned, sourcePath);
    if (resolved instanceof import_obsidian.TFile) {
      urls.push(app.vault.getResourcePath(resolved));
    }
  };
  let match;
  while ((match = wikiImgRegex.exec(content)) !== null) {
    tryAdd(match[1]);
    if (urls.length >= limit) return urls;
  }
  while ((match = mdImgRegex.exec(content)) !== null) {
    tryAdd(match[1]);
    if (urls.length >= limit) return urls;
  }
  return urls;
}
function resolveDiaryDateTime(app, file) {
  const cache = app.metadataCache.getFileCache(file);
  const fm = cache?.frontmatter;
  const fmRaw = fm?.date ?? fm?.created;
  if (fmRaw !== void 0 && fmRaw !== null) {
    const parsed = parseDateTimeString(String(fmRaw));
    if (parsed) return parsed;
  }
  const fromName = parseDateTimeString(file.basename);
  if (fromName) return fromName;
  const d3 = new Date(file.stat.ctime);
  return {
    dateKey: formatDateKey(d3),
    timeText: `${pad2(d3.getHours())}:${pad2(d3.getMinutes())}`,
    sortKey: d3.getTime()
  };
}
function parseDateTimeString(raw) {
  const str = raw.trim();
  const m3 = str.match(
    /(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s_]+(\d{1,2})[:\-._](\d{1,2}))?/
  );
  if (!m3) return null;
  const year = Number(m3[1]);
  const month = Number(m3[2]);
  const day = Number(m3[3]);
  const hour = m3[4] !== void 0 ? Number(m3[4]) : 0;
  const minute = m3[5] !== void 0 ? Number(m3[5]) : 0;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d3 = new Date(year, month - 1, day, hour, minute, 0, 0);
  return {
    dateKey: `${year}-${pad2(month)}-${pad2(day)}`,
    timeText: `${pad2(hour)}:${pad2(minute)}`,
    sortKey: d3.getTime()
  };
}
function getFilesInFolderRecursive(folder) {
  const result = [];
  const walk = (f4) => {
    for (const child of f4.children) {
      if (child instanceof import_obsidian.TFile) {
        result.push(child);
      } else if (child instanceof import_obsidian.TFolder) {
        walk(child);
      }
    }
  };
  walk(folder);
  return result;
}
function getMarkdownFilesInFolder(app, folderPath) {
  const normalized = (0, import_obsidian.normalizePath)(folderPath);
  const target = app.vault.getAbstractFileByPath(normalized);
  if (!(target instanceof import_obsidian.TFolder)) return [];
  return getFilesInFolderRecursive(target).filter((f4) => f4.extension === "md");
}
async function getUniqueFilePath(app, folderPath, baseName, ext = "md") {
  const cleanFolder = folderPath ? (0, import_obsidian.normalizePath)(folderPath) : "";
  const prefix = cleanFolder ? `${cleanFolder}/` : "";
  const suffix = ext ? `.${ext}` : "";
  let candidate = (0, import_obsidian.normalizePath)(`${prefix}${baseName}${suffix}`);
  let idx = 1;
  while (app.vault.getAbstractFileByPath(candidate)) {
    candidate = (0, import_obsidian.normalizePath)(`${prefix}${baseName} ${idx}${suffix}`);
    idx++;
  }
  return candidate;
}
function sortChildrenWithCustomOrder(children, orderList) {
  const orderMap = /* @__PURE__ */ new Map();
  if (orderList) {
    orderList.forEach((name, idx) => orderMap.set(name, idx));
  }
  return [...children].sort((a3, b2) => {
    const ia = orderMap.has(a3.name) ? orderMap.get(a3.name) : Number.MAX_SAFE_INTEGER;
    const ib = orderMap.has(b2.name) ? orderMap.get(b2.name) : Number.MAX_SAFE_INTEGER;
    if (ia !== ib) return ia - ib;
    const aIsFolder = a3 instanceof import_obsidian.TFolder ? 0 : 1;
    const bIsFolder = b2 instanceof import_obsidian.TFolder ? 0 : 1;
    if (aIsFolder !== bIsFolder) return aIsFolder - bIsFolder;
    return a3.name.localeCompare(b2.name, "zh-CN");
  });
}
function isDescendantPath(parentPath, childPath) {
  const normParent = (0, import_obsidian.normalizePath)(parentPath);
  const normChild = (0, import_obsidian.normalizePath)(childPath);
  return normChild === normParent || normChild.startsWith(`${normParent}/`);
}

// src/components/ObsidianIcon.tsx
var import_obsidian2 = require("obsidian");

// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
var i3 = Array.isArray;
function u3(e3, t3, n2, o3, i4, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i4, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// src/components/ObsidianIcon.tsx
function ObsidianIcon({ name, size = 18, className = "" }) {
  const ref = A2(null);
  h2(() => {
    if (!ref.current) return;
    ref.current.empty?.();
    ref.current.innerHTML = "";
    (0, import_obsidian2.setIcon)(ref.current, name);
    const svg = ref.current.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
    }
  }, [name, size]);
  return /* @__PURE__ */ u3(
    "span",
    {
      ref,
      class: `mh-icon ${className}`,
      style: { width: `${size}px`, height: `${size}px` },
      "aria-hidden": "true"
    }
  );
}

// src/tabs/MemoTab.tsx
var import_obsidian3 = require("obsidian");

// src/components/BottomSheet.tsx
function BottomSheet({
  open,
  onClose,
  title,
  showCancel = false,
  cancelText = "\u53D6\u6D88",
  children
}) {
  const [rendered, setRendered] = d2(open);
  const [closing, setClosing] = d2(false);
  const [dragOffsetY, setDragOffsetY] = d2(0);
  const dragStartY = A2(null);
  const panelRef = A2(null);
  h2(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      setDragOffsetY(0);
    } else if (rendered) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        setRendered(false);
        setClosing(false);
        setDragOffsetY(0);
      }, 190);
      return () => window.clearTimeout(timer);
    }
  }, [open]);
  if (!rendered) return null;
  const handleTouchStart = (e3) => {
    if (e3.touches.length !== 1) return;
    const panel = panelRef.current;
    if (panel && panel.scrollTop > 0) return;
    dragStartY.current = e3.touches[0].clientY;
  };
  const handleTouchMove = (e3) => {
    if (dragStartY.current === null || e3.touches.length !== 1) return;
    const dy = e3.touches[0].clientY - dragStartY.current;
    if (dy > 0) {
      setDragOffsetY(dy);
    }
  };
  const handleTouchEnd = () => {
    if (dragStartY.current === null) return;
    dragStartY.current = null;
    if (dragOffsetY > 75) {
      setDragOffsetY(0);
      onClose();
    } else {
      setDragOffsetY(0);
    }
  };
  return /* @__PURE__ */ u3(
    "div",
    {
      class: `mh-sheet-backdrop ${closing ? "is-closing" : ""}`,
      onClick: (e3) => {
        if (e3.target === e3.currentTarget) onClose();
      },
      children: /* @__PURE__ */ u3(
        "div",
        {
          ref: panelRef,
          class: `mh-sheet-panel ${closing ? "is-closing" : ""}`,
          style: dragOffsetY > 0 ? { transform: `translateY(${dragOffsetY}px)`, transition: "none" } : void 0,
          role: "dialog",
          "aria-modal": "true",
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          children: [
            title && /* @__PURE__ */ u3("div", { class: "mh-sheet-title", children: title }),
            /* @__PURE__ */ u3("div", { class: "mh-sheet-body", children }),
            showCancel && /* @__PURE__ */ u3("button", { type: "button", class: "mh-sheet-cancel", onClick: onClose, children: cancelText })
          ]
        }
      )
    }
  );
}

// src/components/PromptModal.tsx
function PromptModal({
  open,
  title,
  placeholder = "",
  initialValue = "",
  confirmText = "\u786E\u5B9A",
  danger = false,
  confirmOnly = false,
  message,
  onCancel,
  onConfirm
}) {
  const [value, setValue] = d2(initialValue);
  const inputRef = A2(null);
  h2(() => {
    if (open) {
      setValue(initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
    }
  }, [open, initialValue]);
  if (!open) return null;
  const submit = () => {
    if (!confirmOnly && !value.trim()) return;
    onConfirm(value.trim());
  };
  return /* @__PURE__ */ u3(
    "div",
    {
      class: "mh-modal-backdrop",
      onClick: (e3) => {
        if (e3.target === e3.currentTarget) onCancel();
      },
      children: /* @__PURE__ */ u3("div", { class: "mh-modal-card", role: "dialog", "aria-modal": "true", children: [
        /* @__PURE__ */ u3("div", { class: "mh-modal-title", children: title }),
        message && /* @__PURE__ */ u3("div", { class: "mh-modal-message", children: message }),
        !confirmOnly && /* @__PURE__ */ u3(
          "input",
          {
            ref: inputRef,
            type: "text",
            class: "mh-modal-input",
            placeholder,
            value,
            onInput: (e3) => setValue(e3.target.value),
            onKeyDown: (e3) => {
              if (e3.key === "Enter") submit();
              if (e3.key === "Escape") onCancel();
            }
          }
        ),
        /* @__PURE__ */ u3("div", { class: "mh-modal-actions", children: [
          /* @__PURE__ */ u3("button", { type: "button", class: "mh-btn mh-btn-ghost", onClick: onCancel, children: "\u53D6\u6D88" }),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: `mh-btn ${danger ? "mh-btn-danger" : "mh-btn-primary"}`,
              onClick: submit,
              children: confirmText
            }
          )
        ] })
      ] })
    }
  );
}

// src/tabs/MemoTab.tsx
var INITIAL_FAST_COUNT = 8;
var PAGE_SIZE = 20;
function MemoTab({
  app,
  settings,
  hubState,
  refreshTick,
  onTrackDraft
}) {
  const [visibleCount, setVisibleCount] = d2(PAGE_SIZE);
  const [items, setItems] = d2([]);
  const [loading, setLoading] = d2(true);
  const [menuItem, setMenuItem] = d2(null);
  const [renameTarget, setRenameTarget] = d2(null);
  const [deleteTarget, setDeleteTarget] = d2(null);
  const pageRef = A2(null);
  const sentinelRef = A2(null);
  const allFiles = T2(() => {
    const files = getMarkdownFilesInFolder(app, settings.memoFolder);
    files.sort((a3, b2) => b2.stat.mtime - a3.stat.mtime);
    return files;
  }, [app, settings.memoFolder, refreshTick]);
  h2(() => {
    let cancelled = false;
    const readFile = async (f4) => {
      const raw = await app.vault.cachedRead(f4);
      const preview = cleanMarkdownPreview(raw, 10) || f4.basename;
      return {
        path: f4.path,
        basename: f4.basename,
        preview,
        timeText: formatDateTime(f4.stat.mtime),
        mtime: f4.stat.mtime,
        ctime: f4.stat.ctime
      };
    };
    const load = async () => {
      const slice = allFiles.slice(0, visibleCount);
      if (slice.length === 0) {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
        return;
      }
      const firstBatch = slice.slice(0, INITIAL_FAST_COUNT);
      const firstLoaded = await Promise.all(firstBatch.map(readFile));
      if (cancelled) return;
      setItems(firstLoaded);
      setLoading(false);
      if (slice.length > INITIAL_FAST_COUNT) {
        const restBatch = slice.slice(INITIAL_FAST_COUNT);
        const restLoaded = await Promise.all(restBatch.map(readFile));
        if (!cancelled) {
          setItems([...firstLoaded, ...restLoaded]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [app, allFiles, visibleCount]);
  h2(() => {
    if (!loading && pageRef.current && hubState.memoScrollTop > 0) {
      pageRef.current.scrollTop = hubState.memoScrollTop;
    }
  }, [loading]);
  h2(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= allFiles.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e3) => e3.isIntersecting)) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allFiles.length));
        }
      },
      { root: pageRef.current, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allFiles.length, visibleCount]);
  const handleOpen = async (path) => {
    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian3.TFile) {
      await openFileInEditor(app, file);
    }
  };
  const handleCreateMemo = async () => {
    try {
      await ensureFolder(app, settings.memoFolder);
      const now = /* @__PURE__ */ new Date();
      const base = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}-${pad2(now.getMinutes())}`;
      const newPath = await getUniqueFilePath(app, settings.memoFolder, base, "md");
      const file = await app.vault.create(newPath, "");
      onTrackDraft(file.path);
      await openFileInEditor(app, file);
    } catch (err) {
      new import_obsidian3.Notice(`\u65B0\u5EFA\u5907\u5FD8\u5F55\u5931\u8D25: ${String(err)}`);
    }
  };
  const handleRename = async (newName) => {
    if (!renameTarget) return;
    const file = app.vault.getAbstractFileByPath(renameTarget.path);
    if (file instanceof import_obsidian3.TFile) {
      const parentPath = file.parent ? file.parent.path : settings.memoFolder;
      const targetPath = parentPath ? `${parentPath}/${newName}.md` : `${newName}.md`;
      if (targetPath !== file.path && app.vault.getAbstractFileByPath(targetPath)) {
        new import_obsidian3.Notice("\u540C\u540D\u5907\u5FD8\u5F55\u5DF2\u5B58\u5728");
        return;
      }
      try {
        await app.fileManager.renameFile(file, targetPath);
        new import_obsidian3.Notice("\u5DF2\u91CD\u547D\u540D");
      } catch (err) {
        new import_obsidian3.Notice(`\u91CD\u547D\u540D\u5931\u8D25: ${String(err)}`);
      }
    }
    setRenameTarget(null);
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const file = app.vault.getAbstractFileByPath(deleteTarget.path);
    try {
      if (file instanceof import_obsidian3.TFile) {
        await app.vault.trash(file, true);
        new import_obsidian3.Notice("\u5DF2\u79FB\u81F3\u56DE\u6536\u7AD9");
      }
    } catch (err) {
      new import_obsidian3.Notice(`\u5220\u9664\u5931\u8D25: ${String(err)}`);
    }
    setDeleteTarget(null);
  };
  return /* @__PURE__ */ u3(
    "div",
    {
      ref: pageRef,
      class: "mh-tab-page mh-memo-page",
      onScroll: (e3) => {
        hubState.memoScrollTop = e3.currentTarget.scrollTop;
      },
      children: [
        !loading && items.length === 0 ? /* @__PURE__ */ u3("div", { class: "mh-empty-state", children: [
          /* @__PURE__ */ u3(ObsidianIcon, { name: "sticky-note", size: 40, className: "mh-empty-icon" }),
          /* @__PURE__ */ u3("div", { class: "mh-empty-text", children: "\u6682\u65E0\u5907\u5FD8\u5F55" }),
          /* @__PURE__ */ u3("div", { class: "mh-empty-sub", children: "\u70B9\u51FB\u4E0B\u65B9 + \u8BB0\u5F55\u7B2C\u4E00\u6761\u7075\u611F" })
        ] }) : /* @__PURE__ */ u3("div", { class: "mh-memo-list", children: [
          items.map((item) => /* @__PURE__ */ u3(
            "article",
            {
              class: "mh-memo-card",
              onClick: () => handleOpen(item.path),
              children: [
                /* @__PURE__ */ u3("div", { class: "mh-memo-preview", children: item.preview }),
                /* @__PURE__ */ u3("div", { class: "mh-memo-footer", children: [
                  /* @__PURE__ */ u3("span", { class: "mh-memo-time", children: item.timeText }),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      class: "mh-icon-btn mh-more-btn",
                      "aria-label": "\u66F4\u591A\u64CD\u4F5C",
                      onClick: (e3) => {
                        e3.stopPropagation();
                        setMenuItem(item);
                      },
                      children: /* @__PURE__ */ u3(ObsidianIcon, { name: "more-horizontal", size: 18 })
                    }
                  )
                ] })
              ]
            },
            item.path
          )),
          visibleCount < allFiles.length && /* @__PURE__ */ u3("div", { ref: sentinelRef, class: "mh-load-more", children: "\u52A0\u8F7D\u66F4\u591A..." })
        ] }),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            class: "mh-fab",
            "aria-label": "\u65B0\u5EFA\u5907\u5FD8\u5F55",
            onClick: handleCreateMemo,
            children: /* @__PURE__ */ u3(ObsidianIcon, { name: "plus", size: 24 })
          }
        ),
        /* @__PURE__ */ u3(
          BottomSheet,
          {
            open: menuItem !== null,
            onClose: () => setMenuItem(null),
            showCancel: true,
            children: menuItem && /* @__PURE__ */ u3("div", { class: "mh-row-sheet-content", children: [
              /* @__PURE__ */ u3("div", { class: "mh-quick-grid", children: /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  class: "mh-quick-tile",
                  onClick: () => {
                    const target = menuItem;
                    setMenuItem(null);
                    handleOpen(target.path);
                  },
                  children: [
                    /* @__PURE__ */ u3(ObsidianIcon, { name: "pencil", size: 22 }),
                    /* @__PURE__ */ u3("span", { children: "\u7F16\u8F91" })
                  ]
                }
              ) }),
              /* @__PURE__ */ u3("div", { class: "mh-action-list", children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: "mh-action-item",
                    onClick: () => {
                      const target = menuItem;
                      setMenuItem(null);
                      setRenameTarget(target);
                    },
                    children: [
                      /* @__PURE__ */ u3("span", { children: "\u91CD\u547D\u540D" }),
                      /* @__PURE__ */ u3(ObsidianIcon, { name: "edit-3", size: 18 })
                    ]
                  }
                ),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: "mh-action-item is-danger",
                    onClick: () => {
                      const target = menuItem;
                      setMenuItem(null);
                      setDeleteTarget(target);
                    },
                    children: [
                      /* @__PURE__ */ u3("span", { children: "\u5220\u9664" }),
                      /* @__PURE__ */ u3(ObsidianIcon, { name: "trash-2", size: 18 })
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ u3(
          PromptModal,
          {
            open: renameTarget !== null,
            title: "\u91CD\u547D\u540D\u5907\u5FD8\u5F55",
            initialValue: renameTarget?.basename ?? "",
            placeholder: "\u8F93\u5165\u65B0\u540D\u79F0",
            onCancel: () => setRenameTarget(null),
            onConfirm: handleRename
          }
        ),
        /* @__PURE__ */ u3(
          PromptModal,
          {
            open: deleteTarget !== null,
            title: "\u5220\u9664\u5907\u5FD8\u5F55",
            message: `\u786E\u5B9A\u5C06\u300C${deleteTarget?.basename ?? ""}\u300D\u79FB\u81F3\u56DE\u6536\u7AD9\u5417\uFF1F`,
            confirmText: "\u5220\u9664",
            danger: true,
            confirmOnly: true,
            onCancel: () => setDeleteTarget(null),
            onConfirm: handleDelete
          }
        )
      ]
    }
  );
}

// src/tabs/DiaryTab.tsx
var import_obsidian6 = require("obsidian");

// src/components/CalendarPanel.tsx
var MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
function CalendarPanel({
  selectedDate,
  onSelectDate,
  markedDates,
  collapsible = false,
  initialCollapsed = false,
  onCollapsedChange,
  weekStartsMonday = true
}) {
  const initialDate = T2(() => {
    const [y3, m3] = selectedDate.split("-").map(Number);
    return { year: y3 || (/* @__PURE__ */ new Date()).getFullYear(), month: (m3 || 1) - 1 };
  }, []);
  const [viewYear, setViewYear] = d2(initialDate.year);
  const [viewMonth, setViewMonth] = d2(initialDate.month);
  const [collapsed, setCollapsedState] = d2(initialCollapsed);
  const [transitionKey, setTransitionKey] = d2(0);
  const [pickerOpen, setPickerOpen] = d2(false);
  const [pickerTab, setPickerTab] = d2("month");
  const handlerDragStartY = A2(null);
  const swipeStart = A2(null);
  const activeYearBtnRef = A2(null);
  const todayKey = formatDateKey(/* @__PURE__ */ new Date());
  const setCollapsed = (next) => {
    setCollapsedState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      onCollapsedChange?.(resolved);
      return resolved;
    });
  };
  h2(() => {
    if (pickerOpen && pickerTab === "year") {
      requestAnimationFrame(() => {
        activeYearBtnRef.current?.scrollIntoView({ block: "center" });
      });
    }
  }, [pickerOpen, pickerTab]);
  const yearOptions = T2(() => {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const list = [];
    for (let y3 = currentYear + 5; y3 >= currentYear - 30; y3--) {
      list.push(y3);
    }
    return list;
  }, []);
  const weekHeaders = weekStartsMonday ? ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"] : ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
  const weeks = T2(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let offset = firstDay.getDay();
    if (weekStartsMonday) {
      offset = (offset + 6) % 7;
    }
    const startDate = new Date(viewYear, viewMonth, 1 - offset);
    const rows = [];
    for (let w3 = 0; w3 < 6; w3++) {
      const row = [];
      for (let d3 = 0; d3 < 7; d3++) {
        const cur = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + w3 * 7 + d3
        );
        const key = formatDateKey(cur);
        row.push({
          dateKey: key,
          day: cur.getDate(),
          inCurrentMonth: cur.getMonth() === viewMonth,
          isToday: key === todayKey
        });
      }
      rows.push(row);
    }
    if (rows.length === 6 && rows[5].every((c3) => !c3.inCurrentMonth)) {
      rows.pop();
    }
    return rows;
  }, [viewYear, viewMonth, weekStartsMonday, todayKey]);
  const activeWeekIndex = T2(() => {
    const idx = weeks.findIndex((row) => row.some((c3) => c3.dateKey === selectedDate));
    return idx >= 0 ? idx : 0;
  }, [weeks, selectedDate]);
  const visibleWeeks = collapsed ? [weeks[activeWeekIndex]] : weeks;
  const shiftPeriod = (delta) => {
    setTransitionKey((k3) => k3 + 1);
    if (collapsed) {
      const [y3, m3, d3] = selectedDate.split("-").map(Number);
      const next2 = new Date(y3, m3 - 1, d3 + delta * 7);
      setViewYear(next2.getFullYear());
      setViewMonth(next2.getMonth());
      onSelectDate(formatDateKey(next2));
      return;
    }
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };
  const goToday = () => {
    const now = /* @__PURE__ */ new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onSelectDate(formatDateKey(now));
    setTransitionKey((k3) => k3 + 1);
    setPickerOpen(false);
  };
  const handleSwipeStart = (clientX, clientY) => {
    swipeStart.current = { x: clientX, y: clientY };
  };
  const handleSwipeEnd = (clientX, clientY) => {
    if (!swipeStart.current) return;
    const dx = clientX - swipeStart.current.x;
    const dy = clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      shiftPeriod(dx < 0 ? 1 : -1);
    }
  };
  const handleHandlerPointerDown = (e3) => {
    if (!collapsible) return;
    e3.stopPropagation();
    handlerDragStartY.current = e3.clientY;
    try {
      e3.currentTarget.setPointerCapture?.(e3.pointerId);
    } catch {
    }
  };
  const handleHandlerPointerUp = (e3) => {
    if (!collapsible || handlerDragStartY.current === null) return;
    e3.stopPropagation();
    const dy = e3.clientY - handlerDragStartY.current;
    handlerDragStartY.current = null;
    if (dy < -20) {
      setCollapsed(true);
    } else if (dy > 20) {
      setCollapsed(false);
    } else {
      setCollapsed((prev) => !prev);
    }
  };
  const openPicker = () => {
    setPickerTab("month");
    setPickerOpen(true);
  };
  return /* @__PURE__ */ u3(
    "div",
    {
      class: `mh-calendar ${collapsed ? "is-collapsed" : ""}`,
      onTouchStart: (e3) => {
        if (e3.touches.length === 1) {
          handleSwipeStart(e3.touches[0].clientX, e3.touches[0].clientY);
        }
      },
      onTouchEnd: (e3) => {
        if (e3.changedTouches.length === 1) {
          handleSwipeEnd(e3.changedTouches[0].clientX, e3.changedTouches[0].clientY);
        }
      },
      onPointerDown: (e3) => {
        if (e3.pointerType === "mouse") {
          handleSwipeStart(e3.clientX, e3.clientY);
        }
      },
      onPointerUp: (e3) => {
        if (e3.pointerType === "mouse") {
          handleSwipeEnd(e3.clientX, e3.clientY);
        }
      },
      children: [
        /* @__PURE__ */ u3("div", { class: "mh-cal-header", children: /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            class: "mh-cal-month-trigger",
            onClick: openPicker,
            children: /* @__PURE__ */ u3("span", { children: [
              viewYear,
              "\u5E74",
              viewMonth + 1,
              "\u6708"
            ] })
          }
        ) }),
        /* @__PURE__ */ u3("div", { class: "mh-cal-weekdays", children: weekHeaders.map((w3) => /* @__PURE__ */ u3("div", { class: "mh-cal-weekday", children: w3 }, w3)) }),
        /* @__PURE__ */ u3("div", { class: "mh-cal-grid mh-cal-grid-animate", children: visibleWeeks.map((row, rIdx) => /* @__PURE__ */ u3("div", { class: "mh-cal-row", children: row.map((cell) => {
          const isSelected = cell.dateKey === selectedDate;
          const hasMark = markedDates.has(cell.dateKey);
          return /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: [
                "mh-cal-cell",
                !cell.inCurrentMonth && !collapsed ? "is-outside" : "",
                cell.isToday ? "is-today" : "",
                isSelected ? "is-selected" : ""
              ].filter(Boolean).join(" "),
              onClick: () => {
                onSelectDate(cell.dateKey);
                if (!cell.inCurrentMonth) {
                  const [y3, m3] = cell.dateKey.split("-").map(Number);
                  setViewYear(y3);
                  setViewMonth(m3 - 1);
                }
              },
              children: [
                /* @__PURE__ */ u3("span", { class: "mh-cal-day-num", children: cell.day }),
                /* @__PURE__ */ u3("span", { class: `mh-cal-dot ${hasMark ? "is-visible" : ""}` })
              ]
            },
            cell.dateKey
          );
        }) }, rIdx)) }, transitionKey),
        collapsible && /* @__PURE__ */ u3(
          "div",
          {
            class: "mh-cal-handler-area",
            role: "button",
            "aria-label": collapsed ? "\u5C55\u5F00\u6708\u5386" : "\u6536\u8D77\u4E3A\u5468\u5386",
            onPointerDown: handleHandlerPointerDown,
            onPointerUp: handleHandlerPointerUp,
            children: /* @__PURE__ */ u3("div", { class: "mh-cal-handler-bar" })
          }
        ),
        pickerOpen && /* @__PURE__ */ u3(
          "div",
          {
            class: "mh-modal-backdrop",
            onClick: (e3) => {
              if (e3.target === e3.currentTarget) setPickerOpen(false);
            },
            children: /* @__PURE__ */ u3("div", { class: "mh-ym-modal", role: "dialog", "aria-modal": "true", children: [
              /* @__PURE__ */ u3("div", { class: "mh-ym-header", children: [
                /* @__PURE__ */ u3("div", { class: "mh-ym-tabs", children: [
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      class: `mh-ym-tab ${pickerTab === "month" ? "is-active" : ""}`,
                      onClick: () => setPickerTab("month"),
                      children: [
                        viewMonth + 1,
                        "\u6708"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      class: `mh-ym-tab ${pickerTab === "year" ? "is-active" : ""}`,
                      onClick: () => setPickerTab("year"),
                      children: viewYear
                    }
                  )
                ] }),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: "mh-icon-btn mh-ym-reset-btn",
                    "aria-label": "\u56DE\u5230\u4ECA\u5929",
                    title: "\u56DE\u5230\u4ECA\u5929",
                    onClick: goToday,
                    children: /* @__PURE__ */ u3(ObsidianIcon, { name: "rotate-ccw", size: 20 })
                  }
                )
              ] }),
              pickerTab === "month" ? /* @__PURE__ */ u3("div", { class: "mh-ym-month-grid", children: MONTHS.map((m3) => {
                const active = m3 - 1 === viewMonth;
                return /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: `mh-ym-month-cell ${active ? "is-active" : ""}`,
                    onClick: () => {
                      setViewMonth(m3 - 1);
                      setTransitionKey((k3) => k3 + 1);
                      setPickerOpen(false);
                    },
                    children: [
                      m3,
                      "\u6708"
                    ]
                  },
                  m3
                );
              }) }) : /* @__PURE__ */ u3("div", { class: "mh-ym-year-list", children: yearOptions.map((y3) => {
                const active = y3 === viewYear;
                return /* @__PURE__ */ u3(
                  "button",
                  {
                    ref: active ? activeYearBtnRef : void 0,
                    type: "button",
                    class: `mh-ym-year-item ${active ? "is-active" : ""}`,
                    onClick: () => {
                      setViewYear(y3);
                      setPickerTab("month");
                    },
                    children: y3
                  },
                  y3
                );
              }) })
            ] })
          }
        )
      ]
    }
  );
}

// src/tabs/DiaryTab.tsx
function DiaryTab({
  app,
  settings,
  hubState,
  refreshTick,
  onTrackDraft
}) {
  const [selectedDate, setSelectedDateState] = d2(
    () => hubState.diarySelectedDate
  );
  const [dayDiaries, setDayDiaries] = d2([]);
  const [loading, setLoading] = d2(true);
  const [menuDiary, setMenuDiary] = d2(null);
  const [deleteTarget, setDeleteTarget] = d2(null);
  const [lightbox, setLightbox] = d2(
    null
  );
  const bodyRef = A2(null);
  const longPressTimer = A2(null);
  const longPressTriggered = A2(false);
  const pressStart = A2(null);
  const setSelectedDate = (dateKey) => {
    setSelectedDateState(dateKey);
    hubState.diarySelectedDate = dateKey;
  };
  const allMetas = T2(() => {
    const files = getMarkdownFilesInFolder(app, settings.diaryFolder);
    const list = files.map((file) => {
      const { dateKey, timeText, sortKey } = resolveDiaryDateTime(app, file);
      return { file, dateKey, timeText, sortKey };
    });
    list.sort((a3, b2) => a3.sortKey - b2.sortKey);
    return list;
  }, [app, settings.diaryFolder, refreshTick]);
  const markedDates = T2(() => {
    const set = /* @__PURE__ */ new Set();
    for (const m3 of allMetas) {
      set.add(m3.dateKey);
    }
    return set;
  }, [allMetas]);
  h2(() => {
    let cancelled = false;
    const loadDay = async () => {
      const metas = allMetas.filter((m3) => m3.dateKey === selectedDate);
      const loaded = await Promise.all(
        metas.map(async (m3) => {
          const raw = await app.vault.cachedRead(m3.file);
          const preview = cleanMarkdownPreview(raw, 6);
          const allImages = extractImagesFromContent(app, raw, m3.file.path, 20);
          return {
            path: m3.file.path,
            basename: m3.file.basename,
            dateKey: m3.dateKey,
            timeText: m3.timeText,
            sortKey: m3.sortKey,
            preview,
            images: allImages.slice(0, 3),
            allImages
          };
        })
      );
      if (!cancelled) {
        setDayDiaries(loaded);
        setLoading(false);
      }
    };
    loadDay();
    return () => {
      cancelled = true;
    };
  }, [app, allMetas, selectedDate]);
  h2(() => {
    if (!loading && bodyRef.current && hubState.diaryScrollTop > 0) {
      bodyRef.current.scrollTop = hubState.diaryScrollTop;
    }
  }, [loading]);
  const handleOpen = async (path) => {
    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian6.TFile) {
      await openFileInEditor(app, file);
    }
  };
  const handleCreateDiary = async () => {
    try {
      await ensureFolder(app, settings.diaryFolder);
      const now = /* @__PURE__ */ new Date();
      const hh = pad2(now.getHours());
      const mm = pad2(now.getMinutes());
      const base = `${selectedDate} ${hh}-${mm}`;
      const newPath = await getUniqueFilePath(app, settings.diaryFolder, base, "md");
      const frontmatter = `---
date: ${selectedDate} ${hh}:${mm}
---

`;
      const file = await app.vault.create(newPath, frontmatter);
      onTrackDraft(file.path);
      await openFileInEditor(app, file);
    } catch (err) {
      new import_obsidian6.Notice(`\u65B0\u5EFA\u65E5\u8BB0\u5931\u8D25: ${String(err)}`);
    }
  };
  const handleDeleteDiary = async () => {
    if (!deleteTarget) return;
    const file = app.vault.getAbstractFileByPath(deleteTarget.path);
    try {
      if (file instanceof import_obsidian6.TFile) {
        await app.vault.trash(file, true);
        new import_obsidian6.Notice("\u5DF2\u79FB\u81F3\u56DE\u6536\u7AD9");
      }
    } catch (err) {
      new import_obsidian6.Notice(`\u5220\u9664\u5931\u8D25: ${String(err)}`);
    }
    setDeleteTarget(null);
  };
  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleCardPointerDown = (entry, e3) => {
    clearLongPress();
    longPressTriggered.current = false;
    pressStart.current = { x: e3.clientX, y: e3.clientY };
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      longPressTriggered.current = true;
      navigator.vibrate?.(15);
      setMenuDiary(entry);
    }, 380);
  };
  const handleCardPointerMove = (e3) => {
    if (!pressStart.current) return;
    const dx = Math.abs(e3.clientX - pressStart.current.x);
    const dy = Math.abs(e3.clientY - pressStart.current.y);
    if (dx > 10 || dy > 10) {
      clearLongPress();
      pressStart.current = null;
    }
  };
  const handleCardPointerUp = () => {
    clearLongPress();
    pressStart.current = null;
  };
  return /* @__PURE__ */ u3("div", { class: "mh-tab-page mh-diary-page", children: [
    /* @__PURE__ */ u3("div", { class: "mh-calendar-sticky", children: /* @__PURE__ */ u3(
      CalendarPanel,
      {
        selectedDate,
        onSelectDate: setSelectedDate,
        markedDates,
        collapsible: true,
        initialCollapsed: hubState.diaryCollapsed,
        onCollapsedChange: (c3) => {
          hubState.diaryCollapsed = c3;
        },
        weekStartsMonday: settings.weekStartsMonday
      }
    ) }),
    /* @__PURE__ */ u3(
      "div",
      {
        ref: bodyRef,
        class: "mh-diary-body",
        onScroll: (e3) => {
          hubState.diaryScrollTop = e3.currentTarget.scrollTop;
        },
        children: !loading && dayDiaries.length === 0 ? /* @__PURE__ */ u3("div", { class: "mh-empty-state", children: [
          /* @__PURE__ */ u3(ObsidianIcon, { name: "inbox", size: 44, className: "mh-empty-icon" }),
          /* @__PURE__ */ u3("div", { class: "mh-empty-text", children: "\u6682\u65E0\u65E5\u8BB0" })
        ] }) : /* @__PURE__ */ u3("div", { class: "mh-timeline", children: dayDiaries.map((entry) => {
          const extraImages = Math.max(0, entry.allImages.length - 3);
          return /* @__PURE__ */ u3("div", { class: "mh-timeline-item", children: [
            /* @__PURE__ */ u3("div", { class: "mh-timeline-rail", children: [
              /* @__PURE__ */ u3("span", { class: "mh-timeline-dot" }),
              /* @__PURE__ */ u3("span", { class: "mh-timeline-line" })
            ] }),
            /* @__PURE__ */ u3("div", { class: "mh-timeline-content", children: [
              /* @__PURE__ */ u3("div", { class: "mh-timeline-header", children: [
                /* @__PURE__ */ u3("span", { class: "mh-timeline-time", children: entry.timeText }),
                /* @__PURE__ */ u3("span", { class: "mh-timeline-sub", children: entry.basename })
              ] }),
              /* @__PURE__ */ u3(
                "article",
                {
                  class: "mh-diary-card",
                  onPointerDown: (e3) => handleCardPointerDown(entry, e3),
                  onPointerMove: handleCardPointerMove,
                  onPointerUp: handleCardPointerUp,
                  onPointerCancel: handleCardPointerUp,
                  onContextMenu: (e3) => {
                    e3.preventDefault();
                    setMenuDiary(entry);
                  },
                  onClick: () => {
                    if (longPressTriggered.current) {
                      longPressTriggered.current = false;
                      return;
                    }
                    handleOpen(entry.path);
                  },
                  children: [
                    entry.images.length > 0 && /* @__PURE__ */ u3("div", { class: "mh-diary-images", children: entry.images.map((src, i4) => /* @__PURE__ */ u3(
                      "div",
                      {
                        class: "mh-diary-thumb-wrap",
                        onClick: (e3) => {
                          e3.stopPropagation();
                          if (longPressTriggered.current) {
                            longPressTriggered.current = false;
                            return;
                          }
                          setLightbox({ images: entry.allImages, index: i4 });
                        },
                        children: [
                          /* @__PURE__ */ u3(
                            "img",
                            {
                              src,
                              class: "mh-diary-thumb",
                              loading: "lazy",
                              draggable: false,
                              alt: ""
                            }
                          ),
                          i4 === 2 && extraImages > 0 && /* @__PURE__ */ u3("span", { class: "mh-diary-thumb-more", children: [
                            "+",
                            extraImages
                          ] })
                        ]
                      },
                      i4
                    )) }),
                    entry.preview ? /* @__PURE__ */ u3("div", { class: "mh-diary-text", children: entry.preview }) : entry.images.length === 0 ? /* @__PURE__ */ u3("div", { class: "mh-diary-text is-muted", children: "\uFF08\u7A7A\u767D\u65E5\u8BB0\uFF09" }) : null
                  ]
                }
              )
            ] })
          ] }, entry.path);
        }) })
      }
    ),
    /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        class: "mh-fab",
        "aria-label": "\u5199\u65E5\u8BB0",
        onClick: handleCreateDiary,
        children: /* @__PURE__ */ u3(ObsidianIcon, { name: "pencil", size: 22 })
      }
    ),
    lightbox && /* @__PURE__ */ u3(
      "div",
      {
        class: "mh-lightbox-backdrop",
        onClick: () => setLightbox(null),
        children: [
          /* @__PURE__ */ u3(
            "img",
            {
              src: lightbox.images[lightbox.index],
              class: "mh-lightbox-img",
              alt: "",
              onClick: (e3) => e3.stopPropagation()
            }
          ),
          lightbox.images.length > 1 && /* @__PURE__ */ u3(
            "div",
            {
              class: "mh-lightbox-controls",
              onClick: (e3) => e3.stopPropagation(),
              children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: "mh-lightbox-nav",
                    "aria-label": "\u4E0A\u4E00\u5F20",
                    onClick: () => setLightbox(
                      (prev) => prev ? {
                        ...prev,
                        index: (prev.index - 1 + prev.images.length) % prev.images.length
                      } : null
                    ),
                    children: /* @__PURE__ */ u3(ObsidianIcon, { name: "chevron-left", size: 22 })
                  }
                ),
                /* @__PURE__ */ u3("span", { class: "mh-lightbox-counter", children: [
                  lightbox.index + 1,
                  " / ",
                  lightbox.images.length
                ] }),
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    class: "mh-lightbox-nav",
                    "aria-label": "\u4E0B\u4E00\u5F20",
                    onClick: () => setLightbox(
                      (prev) => prev ? {
                        ...prev,
                        index: (prev.index + 1) % prev.images.length
                      } : null
                    ),
                    children: /* @__PURE__ */ u3(ObsidianIcon, { name: "chevron-right", size: 22 })
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ u3(
      BottomSheet,
      {
        open: menuDiary !== null,
        onClose: () => setMenuDiary(null),
        showCancel: true,
        children: menuDiary && /* @__PURE__ */ u3("div", { class: "mh-row-sheet-content", children: [
          /* @__PURE__ */ u3("div", { class: "mh-quick-grid", children: /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-quick-tile",
              onClick: () => {
                const target = menuDiary;
                setMenuDiary(null);
                handleOpen(target.path);
              },
              children: [
                /* @__PURE__ */ u3(ObsidianIcon, { name: "pencil", size: 22 }),
                /* @__PURE__ */ u3("span", { children: "\u7F16\u8F91" })
              ]
            }
          ) }),
          /* @__PURE__ */ u3("div", { class: "mh-action-list", children: /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-action-item is-danger",
              onClick: () => {
                const target = menuDiary;
                setMenuDiary(null);
                setDeleteTarget(target);
              },
              children: [
                /* @__PURE__ */ u3("span", { children: "\u5220\u9664" }),
                /* @__PURE__ */ u3(ObsidianIcon, { name: "trash-2", size: 18 })
              ]
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ u3(
      PromptModal,
      {
        open: deleteTarget !== null,
        title: "\u5220\u9664\u65E5\u8BB0",
        message: `\u786E\u5B9A\u5C06\u65E5\u8BB0\u300C${deleteTarget?.basename ?? ""}\u300D\u79FB\u81F3\u56DE\u6536\u7AD9\u5417\uFF1F`,
        confirmText: "\u5220\u9664",
        danger: true,
        confirmOnly: true,
        onCancel: () => setDeleteTarget(null),
        onConfirm: handleDeleteDiary
      }
    )
  ] });
}

// src/tabs/KnowledgeTab.tsx
var import_obsidian8 = require("obsidian");
var IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"]);
function getFileIconName(file) {
  if (file instanceof import_obsidian8.TFolder) return "folder";
  if (file instanceof import_obsidian8.TFile) {
    const ext = file.extension.toLowerCase();
    if (ext === "md") return "file-text";
    if (IMAGE_EXTS.has(ext)) return "image";
  }
  return "file";
}
function KnowledgeTab({
  app,
  settings,
  hubState,
  refreshTick,
  onRootPathChange,
  onUpdateCustomOrder,
  onReplaceCustomOrderMap
}) {
  const [activeRootPath, setActiveRootPathState] = d2(
    () => hubState.kbRootPath
  );
  const [expandedPaths, setExpandedPathsState] = d2(
    () => new Set(hubState.kbExpandedPaths)
  );
  const [fabSheetOpen, setFabSheetOpen] = d2(false);
  const [rowMenuTarget, setRowMenuTarget] = d2(null);
  const [promptAction, setPromptAction] = d2(null);
  const [dragState, setDragState] = d2(null);
  const longPressTimer = A2(null);
  const dragStartPos = A2(null);
  const justDraggedRef = A2(false);
  const pointerYRef = A2(0);
  const autoScrollRafRef = A2(null);
  const treeListRef = A2(null);
  const rootListRef = A2(null);
  const setActiveRootPath = (path) => {
    setActiveRootPathState(path);
    onRootPathChange(path);
  };
  const setExpandedPaths = (updater) => {
    setExpandedPathsState((prev) => {
      const next = updater(prev);
      hubState.kbExpandedPaths = Array.from(next);
      return next;
    });
  };
  const excludedSet = T2(() => {
    return /* @__PURE__ */ new Set([
      settings.memoFolder,
      settings.diaryFolder,
      ...settings.excludedFolders
    ]);
  }, [settings]);
  const rootItems = T2(() => {
    const root = app.vault.getRoot();
    const folders = root.children.filter(
      (c3) => c3 instanceof import_obsidian8.TFolder && !c3.name.startsWith(".") && !excludedSet.has(c3.name)
    );
    const sorted = sortChildrenWithCustomOrder(
      folders,
      settings.customOrder[""]
    );
    return sorted.map((folder) => {
      const files = getFilesInFolderRecursive(folder).filter(
        (f4) => f4.extension === "md"
      );
      let latest = 0;
      for (const f4 of files) {
        if (f4.stat.mtime > latest) latest = f4.stat.mtime;
      }
      return {
        path: folder.path,
        name: folder.name,
        docCount: files.length,
        latestMtime: latest,
        latestTimeText: latest ? formatShortDateTime(latest) : "\u6682\u65E0\u66F4\u65B0"
      };
    });
  }, [app, excludedSet, settings.customOrder, refreshTick]);
  const activeRootFolder = T2(() => {
    if (!activeRootPath) return null;
    const f4 = app.vault.getAbstractFileByPath(activeRootPath);
    return f4 instanceof import_obsidian8.TFolder ? f4 : null;
  }, [app, activeRootPath, refreshTick]);
  h2(() => {
    if (activeRootPath && !activeRootFolder) {
      setActiveRootPath(null);
    }
  }, [activeRootPath, activeRootFolder]);
  h2(() => {
    const el = activeRootFolder ? treeListRef.current : rootListRef.current;
    if (el && hubState.kbScrollTop > 0) {
      el.scrollTop = hubState.kbScrollTop;
    }
  }, [activeRootFolder]);
  h2(() => {
    if (!dragState) {
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
      return;
    }
    const preventTouchMove = (e3) => {
      e3.preventDefault();
    };
    window.addEventListener("touchmove", preventTouchMove, { passive: false });
    const tickScroll = () => {
      const list = treeListRef.current;
      if (list) {
        const rect = list.getBoundingClientRect();
        const y3 = pointerYRef.current;
        const edge = 64;
        if (y3 < rect.top + edge) {
          const factor = Math.max(0.2, (rect.top + edge - y3) / edge);
          list.scrollTop -= Math.round(10 * factor);
        } else if (y3 > rect.bottom - edge) {
          const factor = Math.max(0.2, (y3 - (rect.bottom - edge)) / edge);
          list.scrollTop += Math.round(10 * factor);
        }
      }
      autoScrollRafRef.current = requestAnimationFrame(tickScroll);
    };
    autoScrollRafRef.current = requestAnimationFrame(tickScroll);
    return () => {
      window.removeEventListener("touchmove", preventTouchMove);
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
        autoScrollRafRef.current = null;
      }
    };
  }, [Boolean(dragState)]);
  const treeRows = T2(() => {
    if (!activeRootFolder) return [];
    const rows = [];
    const walk = (folder, depth) => {
      const children = folder.children.filter((c3) => !c3.name.startsWith("."));
      const sorted = sortChildrenWithCustomOrder(
        children,
        settings.customOrder[folder.path]
      );
      for (const child of sorted) {
        const isFolder = child instanceof import_obsidian8.TFolder;
        const expanded = isFolder && expandedPaths.has(child.path);
        const displayName = child instanceof import_obsidian8.TFile && child.extension === "md" ? child.basename : child.name;
        rows.push({
          file: child,
          path: child.path,
          parentPath: folder.path,
          name: child.name,
          displayName,
          isFolder,
          iconName: getFileIconName(child),
          depth,
          expanded
        });
        if (isFolder && expanded) {
          walk(child, depth + 1);
        }
      }
    };
    walk(activeRootFolder, 0);
    return rows;
  }, [activeRootFolder, expandedPaths, settings.customOrder, refreshTick]);
  const toggleExpand = (folderPath) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) next.delete(folderPath);
      else next.add(folderPath);
      return next;
    });
  };
  const handleMoveRootFolder = async (folderName, delta) => {
    const names = rootItems.map((r3) => r3.name);
    const idx = names.indexOf(folderName);
    const targetIdx = idx + delta;
    if (idx === -1 || targetIdx < 0 || targetIdx >= names.length) return;
    [names[idx], names[targetIdx]] = [names[targetIdx], names[idx]];
    await onUpdateCustomOrder("", names);
  };
  const executePrompt = async (value) => {
    if (!promptAction) return;
    const action = promptAction;
    setPromptAction(null);
    try {
      if (action.type === "new-note") {
        const path = await getUniqueFilePath(app, action.parentPath, value, "md");
        const file = await app.vault.create(path, "");
        if (action.parentPath) {
          setExpandedPaths((prev) => new Set(prev).add(action.parentPath));
        }
        await openFileInEditor(app, file);
      } else if (action.type === "new-folder") {
        const targetPath = action.parentPath ? (0, import_obsidian8.normalizePath)(`${action.parentPath}/${value}`) : (0, import_obsidian8.normalizePath)(value);
        if (app.vault.getAbstractFileByPath(targetPath)) {
          new import_obsidian8.Notice("\u540C\u540D\u6587\u4EF6\u5939\u5DF2\u5B58\u5728");
          return;
        }
        await app.vault.createFolder(targetPath);
        if (action.parentPath) {
          setExpandedPaths((prev) => new Set(prev).add(action.parentPath));
        }
        new import_obsidian8.Notice("\u5DF2\u521B\u5EFA\u6587\u4EF6\u5939");
      } else if (action.type === "rename") {
        const oldPath = action.target.path;
        const oldName = action.target.name;
        const parentPath = action.target.parent?.path ?? "";
        const ext = action.target instanceof import_obsidian8.TFile && action.target.extension ? `.${action.target.extension}` : "";
        const newName = ext && value.endsWith(ext) ? value : `${value}${ext}`;
        const nextPath = parentPath ? (0, import_obsidian8.normalizePath)(`${parentPath}/${newName}`) : (0, import_obsidian8.normalizePath)(newName);
        if (nextPath === oldPath) return;
        if (app.vault.getAbstractFileByPath(nextPath)) {
          new import_obsidian8.Notice("\u540C\u540D\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u5B58\u5728");
          return;
        }
        await app.fileManager.renameFile(action.target, nextPath);
        const nextOrderMap = {};
        for (const [key, list] of Object.entries(settings.customOrder)) {
          let newKey = key;
          if (action.target instanceof import_obsidian8.TFolder) {
            if (key === oldPath) newKey = nextPath;
            else if (key.startsWith(`${oldPath}/`)) {
              newKey = `${nextPath}${key.slice(oldPath.length)}`;
            }
          }
          nextOrderMap[newKey] = key === parentPath ? list.map((n2) => n2 === oldName ? newName : n2) : list;
        }
        await onReplaceCustomOrderMap(nextOrderMap);
        if (activeRootPath === oldPath) {
          setActiveRootPath(nextPath);
        }
        new import_obsidian8.Notice("\u5DF2\u91CD\u547D\u540D");
      } else if (action.type === "delete") {
        await app.vault.trash(action.target, true);
        new import_obsidian8.Notice("\u5DF2\u79FB\u81F3\u56DE\u6536\u7AD9");
      }
    } catch (err) {
      new import_obsidian8.Notice(`\u64CD\u4F5C\u5931\u8D25: ${String(err)}`);
    }
  };
  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleRowPointerDown = (row, e3) => {
    if (e3.target.closest(".mh-more-btn")) return;
    clearLongPress();
    justDraggedRef.current = false;
    dragStartPos.current = { x: e3.clientX, y: e3.clientY };
    pointerYRef.current = e3.clientY;
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      justDraggedRef.current = true;
      navigator.vibrate?.(15);
      setDragState({
        sourcePath: row.path,
        sourceName: row.displayName,
        targetPath: null,
        position: null,
        pointerX: e3.clientX,
        pointerY: e3.clientY
      });
    }, 280);
  };
  const handleTreePointerMove = (e3) => {
    if (!dragState) {
      if (dragStartPos.current) {
        const dx = Math.abs(e3.clientX - dragStartPos.current.x);
        const dy = Math.abs(e3.clientY - dragStartPos.current.y);
        if (dx > 8 || dy > 8) {
          clearLongPress();
          dragStartPos.current = null;
        }
      }
      return;
    }
    e3.preventDefault();
    pointerYRef.current = e3.clientY;
    const rowEls = treeListRef.current?.querySelectorAll(
      "[data-tree-path]"
    );
    if (!rowEls) return;
    let hitPath = null;
    let hitPos = null;
    for (const el of Array.from(rowEls)) {
      const rect = el.getBoundingClientRect();
      if (e3.clientY >= rect.top && e3.clientY <= rect.bottom) {
        const path = el.dataset.treePath || "";
        const isFolder = el.dataset.isFolder === "true";
        if (path === dragState.sourcePath || isDescendantPath(dragState.sourcePath, path)) {
          break;
        }
        const ratio = (e3.clientY - rect.top) / Math.max(rect.height, 1);
        hitPath = path;
        if (isFolder) {
          if (ratio < 0.25) hitPos = "before";
          else if (ratio > 0.75) hitPos = "after";
          else hitPos = "inside";
        } else {
          hitPos = ratio < 0.5 ? "before" : "after";
        }
        break;
      }
    }
    setDragState(
      (prev) => prev ? {
        ...prev,
        targetPath: hitPath,
        position: hitPos,
        pointerX: e3.clientX,
        pointerY: e3.clientY
      } : null
    );
  };
  const handleTreePointerUp = async () => {
    clearLongPress();
    dragStartPos.current = null;
    if (!dragState) return;
    const { sourcePath, targetPath, position } = dragState;
    setDragState(null);
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 80);
    if (!targetPath || !position || sourcePath === targetPath) return;
    if (isDescendantPath(sourcePath, targetPath)) return;
    const sourceFile = app.vault.getAbstractFileByPath(sourcePath);
    const targetFile = app.vault.getAbstractFileByPath(targetPath);
    if (!sourceFile || !targetFile) return;
    try {
      if (position === "inside" && targetFile instanceof import_obsidian8.TFolder) {
        const destPath = (0, import_obsidian8.normalizePath)(`${targetFile.path}/${sourceFile.name}`);
        if (destPath !== sourceFile.path) {
          await app.fileManager.renameFile(sourceFile, destPath);
          setExpandedPaths((prev) => new Set(prev).add(targetFile.path));
        }
        return;
      }
      const targetParent = targetFile.parent;
      if (!targetParent) return;
      if (sourceFile.parent?.path !== targetParent.path) {
        const destPath = targetParent.path ? (0, import_obsidian8.normalizePath)(`${targetParent.path}/${sourceFile.name}`) : (0, import_obsidian8.normalizePath)(sourceFile.name);
        await app.fileManager.renameFile(sourceFile, destPath);
      }
      const siblings = sortChildrenWithCustomOrder(
        targetParent.children.filter((c3) => !c3.name.startsWith(".")),
        settings.customOrder[targetParent.path]
      ).map((c3) => c3.name);
      const filtered = siblings.filter((n2) => n2 !== sourceFile.name);
      const targetIdx = filtered.indexOf(targetFile.name);
      if (targetIdx === -1) return;
      const insertIdx = position === "before" ? targetIdx : targetIdx + 1;
      filtered.splice(insertIdx, 0, sourceFile.name);
      await onUpdateCustomOrder(targetParent.path, filtered);
    } catch (err) {
      new import_obsidian8.Notice(`\u79FB\u52A8\u6216\u6392\u5E8F\u5931\u8D25: ${String(err)}`);
    }
  };
  const currentCreateParent = activeRootFolder ? activeRootFolder.path : "";
  const getRowActionParent = (target) => {
    if (target instanceof import_obsidian8.TFolder) return target.path;
    return target.parent?.path ?? "";
  };
  const isMenuTargetRootKb = rowMenuTarget !== null && !activeRootFolder && rowMenuTarget instanceof import_obsidian8.TFolder && rowMenuTarget.parent?.isRoot();
  const rootKbIndex = isMenuTargetRootKb ? rootItems.findIndex((r3) => r3.name === rowMenuTarget.name) : -1;
  return /* @__PURE__ */ u3("div", { class: "mh-tab-page mh-kb-page", children: [
    !activeRootFolder ? /* @__PURE__ */ u3(
      "div",
      {
        ref: rootListRef,
        class: "mh-kb-list",
        onScroll: (e3) => {
          hubState.kbScrollTop = e3.currentTarget.scrollTop;
        },
        children: rootItems.length === 0 ? /* @__PURE__ */ u3("div", { class: "mh-empty-state", children: [
          /* @__PURE__ */ u3(ObsidianIcon, { name: "book-open", size: 40, className: "mh-empty-icon" }),
          /* @__PURE__ */ u3("div", { class: "mh-empty-text", children: "\u6682\u65E0\u77E5\u8BC6\u5E93" }),
          /* @__PURE__ */ u3("div", { class: "mh-empty-sub", children: "\u70B9\u51FB\u4E0B\u65B9 + \u65B0\u5EFA\u6587\u4EF6\u5939\u4F5C\u4E3A\u77E5\u8BC6\u5E93" })
        ] }) : rootItems.map((kb) => /* @__PURE__ */ u3(
          "div",
          {
            class: "mh-kb-item",
            onClick: () => {
              hubState.kbScrollTop = 0;
              setActiveRootPath(kb.path);
            },
            children: [
              /* @__PURE__ */ u3("div", { class: "mh-kb-icon-box", children: /* @__PURE__ */ u3(ObsidianIcon, { name: "book-marked", size: 20 }) }),
              /* @__PURE__ */ u3("div", { class: "mh-kb-info", children: [
                /* @__PURE__ */ u3("div", { class: "mh-kb-name", children: kb.name }),
                /* @__PURE__ */ u3("div", { class: "mh-kb-meta", children: [
                  "\u5171 ",
                  kb.docCount,
                  " \u7BC7\u6587\u6863 \xB7 ",
                  kb.latestTimeText
                ] })
              ] }),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  class: "mh-icon-btn mh-more-btn",
                  "aria-label": "\u77E5\u8BC6\u5E93\u83DC\u5355",
                  onClick: (e3) => {
                    e3.stopPropagation();
                    const f4 = app.vault.getAbstractFileByPath(kb.path);
                    if (f4) setRowMenuTarget(f4);
                  },
                  children: /* @__PURE__ */ u3(ObsidianIcon, { name: "more-horizontal", size: 18 })
                }
              )
            ]
          },
          kb.path
        ))
      }
    ) : /* @__PURE__ */ u3(
      "div",
      {
        class: `mh-kb-tree-view ${dragState ? "is-dragging" : ""}`,
        onPointerMove: handleTreePointerMove,
        onPointerUp: handleTreePointerUp,
        onPointerCancel: handleTreePointerUp,
        children: [
          /* @__PURE__ */ u3("div", { class: "mh-kb-tree-header", children: [
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-icon-btn mh-back-btn",
                "aria-label": "\u8FD4\u56DE\u77E5\u8BC6\u5E93\u5217\u8868",
                onClick: () => {
                  hubState.kbScrollTop = 0;
                  setActiveRootPath(null);
                },
                children: /* @__PURE__ */ u3(ObsidianIcon, { name: "chevron-left", size: 22 })
              }
            ),
            /* @__PURE__ */ u3("div", { class: "mh-kb-tree-title", children: activeRootFolder.name }),
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-icon-btn mh-kb-header-more-btn",
                "aria-label": "\u6587\u4EF6\u5939\u64CD\u4F5C",
                onClick: () => setRowMenuTarget(activeRootFolder),
                children: /* @__PURE__ */ u3(ObsidianIcon, { name: "more-horizontal", size: 20 })
              }
            )
          ] }),
          /* @__PURE__ */ u3(
            "div",
            {
              ref: treeListRef,
              class: "mh-kb-tree-list",
              onScroll: (e3) => {
                hubState.kbScrollTop = e3.currentTarget.scrollTop;
              },
              children: treeRows.length === 0 ? /* @__PURE__ */ u3("div", { class: "mh-empty-state", children: [
                /* @__PURE__ */ u3(ObsidianIcon, { name: "folder-open", size: 38, className: "mh-empty-icon" }),
                /* @__PURE__ */ u3("div", { class: "mh-empty-text", children: "\u76EE\u5F55\u4E3A\u7A7A" }),
                /* @__PURE__ */ u3("div", { class: "mh-empty-sub", children: "\u70B9\u51FB\u4E0B\u65B9 + \u65B0\u589E\u7B14\u8BB0\u6216\u6587\u4EF6\u5939" })
              ] }) : treeRows.map((row) => {
                const isSource = dragState?.sourcePath === row.path;
                const isDropBefore = dragState?.targetPath === row.path && dragState.position === "before";
                const isDropAfter = dragState?.targetPath === row.path && dragState.position === "after";
                const isDropInside = dragState?.targetPath === row.path && dragState.position === "inside";
                return /* @__PURE__ */ u3(
                  "div",
                  {
                    "data-tree-path": row.path,
                    "data-is-folder": String(row.isFolder),
                    class: [
                      "mh-tree-row",
                      row.isFolder ? "is-folder" : "is-file",
                      isSource ? "is-drag-source" : "",
                      isDropBefore ? "is-drop-before" : "",
                      isDropAfter ? "is-drop-after" : "",
                      isDropInside ? "is-drop-inside" : ""
                    ].filter(Boolean).join(" "),
                    style: { paddingLeft: `${16 + row.depth * 22}px` },
                    onPointerDown: (e3) => handleRowPointerDown(row, e3),
                    onContextMenu: (e3) => {
                      e3.preventDefault();
                    },
                    onClick: () => {
                      if (dragState || justDraggedRef.current) return;
                      if (row.isFolder) {
                        toggleExpand(row.path);
                      } else if (row.file instanceof import_obsidian8.TFile) {
                        openFileInEditor(app, row.file);
                      }
                    },
                    children: [
                      /* @__PURE__ */ u3("span", { class: "mh-tree-chevron", children: row.isFolder ? /* @__PURE__ */ u3(
                        ObsidianIcon,
                        {
                          name: row.expanded ? "chevron-down" : "chevron-right",
                          size: 15
                        }
                      ) : /* @__PURE__ */ u3(
                        ObsidianIcon,
                        {
                          name: row.iconName,
                          size: 14,
                          className: "mh-tree-file-icon"
                        }
                      ) }),
                      /* @__PURE__ */ u3("span", { class: "mh-tree-label", children: row.displayName }),
                      /* @__PURE__ */ u3(
                        "button",
                        {
                          type: "button",
                          class: "mh-icon-btn mh-more-btn",
                          "aria-label": "\u66F4\u591A\u64CD\u4F5C",
                          onClick: (e3) => {
                            e3.stopPropagation();
                            setRowMenuTarget(row.file);
                          },
                          children: /* @__PURE__ */ u3(ObsidianIcon, { name: "more-horizontal", size: 18 })
                        }
                      )
                    ]
                  },
                  row.path
                );
              })
            }
          ),
          dragState && /* @__PURE__ */ u3(
            "div",
            {
              class: "mh-drag-ghost",
              style: {
                left: `${dragState.pointerX}px`,
                top: `${dragState.pointerY}px`
              },
              children: /* @__PURE__ */ u3("span", { children: dragState.sourceName })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ u3("div", { class: "mh-kb-floating-pill", children: [
      /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          class: "mh-pill-btn",
          "aria-label": "\u641C\u7D22",
          onClick: () => openObsidianSwitcher(app),
          children: /* @__PURE__ */ u3(ObsidianIcon, { name: "search", size: 20 })
        }
      ),
      /* @__PURE__ */ u3("span", { class: "mh-pill-divider" }),
      /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          class: "mh-pill-btn",
          "aria-label": "\u65B0\u5EFA",
          onClick: () => setFabSheetOpen(true),
          children: /* @__PURE__ */ u3(ObsidianIcon, { name: "plus-circle", size: 21 })
        }
      )
    ] }),
    /* @__PURE__ */ u3(
      BottomSheet,
      {
        open: fabSheetOpen,
        onClose: () => setFabSheetOpen(false),
        showCancel: true,
        children: /* @__PURE__ */ u3("div", { class: "mh-create-grid", children: [
          activeRootFolder && /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-create-tile",
              onClick: () => {
                setFabSheetOpen(false);
                setPromptAction({ type: "new-note", parentPath: currentCreateParent });
              },
              children: [
                /* @__PURE__ */ u3(ObsidianIcon, { name: "file-plus", size: 24 }),
                /* @__PURE__ */ u3("span", { children: "\u7B14\u8BB0" })
              ]
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-create-tile",
              onClick: () => {
                setFabSheetOpen(false);
                setPromptAction({ type: "new-folder", parentPath: currentCreateParent });
              },
              children: [
                /* @__PURE__ */ u3(ObsidianIcon, { name: "folder-plus", size: 24 }),
                /* @__PURE__ */ u3("span", { children: activeRootFolder ? "\u6587\u4EF6\u5939" : "\u65B0\u5EFA\u77E5\u8BC6\u5E93" })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ u3(
      BottomSheet,
      {
        open: rowMenuTarget !== null,
        onClose: () => setRowMenuTarget(null),
        showCancel: true,
        children: rowMenuTarget && /* @__PURE__ */ u3("div", { class: "mh-row-sheet-content", children: [
          /* @__PURE__ */ u3("div", { class: "mh-quick-grid", children: [
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-quick-tile",
                onClick: () => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({
                    type: "new-note",
                    parentPath: getRowActionParent(target)
                  });
                },
                children: [
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "file-plus", size: 22 }),
                  /* @__PURE__ */ u3("span", { children: "\u65B0\u589E\u7B14\u8BB0" })
                ]
              }
            ),
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-quick-tile",
                onClick: () => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({
                    type: "new-folder",
                    parentPath: getRowActionParent(target)
                  });
                },
                children: [
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "folder-plus", size: 22 }),
                  /* @__PURE__ */ u3("span", { children: "\u65B0\u589E\u6587\u4EF6\u5939" })
                ]
              }
            ),
            isMenuTargetRootKb && rootKbIndex > 0 && /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-quick-tile",
                onClick: () => {
                  const name = rowMenuTarget.name;
                  setRowMenuTarget(null);
                  handleMoveRootFolder(name, -1);
                },
                children: [
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "arrow-up", size: 22 }),
                  /* @__PURE__ */ u3("span", { children: "\u4E0A\u79FB" })
                ]
              }
            ),
            isMenuTargetRootKb && rootKbIndex >= 0 && rootKbIndex < rootItems.length - 1 && /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-quick-tile",
                onClick: () => {
                  const name = rowMenuTarget.name;
                  setRowMenuTarget(null);
                  handleMoveRootFolder(name, 1);
                },
                children: [
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "arrow-down", size: 22 }),
                  /* @__PURE__ */ u3("span", { children: "\u4E0B\u79FB" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { class: "mh-action-list", children: [
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-action-item",
                onClick: () => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({ type: "rename", target });
                },
                children: [
                  /* @__PURE__ */ u3("span", { children: "\u91CD\u547D\u540D" }),
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "edit-3", size: 18 })
                ]
              }
            ),
            /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                class: "mh-action-item is-danger",
                onClick: () => {
                  const target = rowMenuTarget;
                  setRowMenuTarget(null);
                  setPromptAction({ type: "delete", target });
                },
                children: [
                  /* @__PURE__ */ u3("span", { children: "\u5220\u9664" }),
                  /* @__PURE__ */ u3(ObsidianIcon, { name: "trash-2", size: 18 })
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ u3(
      PromptModal,
      {
        open: promptAction !== null,
        title: promptAction?.type === "new-note" ? "\u65B0\u589E\u7B14\u8BB0" : promptAction?.type === "new-folder" ? activeRootFolder ? "\u65B0\u589E\u6587\u4EF6\u5939" : "\u65B0\u5EFA\u77E5\u8BC6\u5E93" : promptAction?.type === "rename" ? "\u91CD\u547D\u540D" : "\u786E\u8BA4\u5220\u9664",
        placeholder: promptAction?.type === "new-note" ? "\u8F93\u5165\u7B14\u8BB0\u540D\u79F0" : promptAction?.type === "new-folder" ? "\u8F93\u5165\u6587\u4EF6\u5939\u540D\u79F0" : "\u8F93\u5165\u65B0\u540D\u79F0",
        initialValue: promptAction?.type === "rename" ? promptAction.target instanceof import_obsidian8.TFile && promptAction.target.extension === "md" ? promptAction.target.basename : promptAction.target.name : "",
        message: promptAction?.type === "delete" ? `\u786E\u5B9A\u5C06\u300C${promptAction.target.name}\u300D\u79FB\u81F3\u56DE\u6536\u7AD9\u5417\uFF1F` : void 0,
        confirmText: promptAction?.type === "delete" ? "\u5220\u9664" : "\u786E\u5B9A",
        danger: promptAction?.type === "delete",
        confirmOnly: promptAction?.type === "delete",
        onCancel: () => setPromptAction(null),
        onConfirm: executePrompt
      }
    )
  ] });
}

// src/views/MobileHubView.tsx
var VIEW_TYPE_MOBILE_HUB = "obsidian-mobile-hub-view";
var TABS = [
  { id: "memo", label: "\u5907\u5FD8\u5F55" },
  { id: "diary", label: "\u65E5\u8BB0" },
  { id: "knowledge", label: "\u77E5\u8BC6\u5E93" }
];
function MobileHubRoot({ plugin, subscribeRefresh }) {
  const [activeTab, setActiveTab] = d2(plugin.hubState.lastTab);
  const [kbInSubPage, setKbInSubPage] = d2(
    Boolean(plugin.hubState.kbRootPath)
  );
  const [refreshTick, setRefreshTick] = d2(0);
  const [settings, setSettings] = d2(() => ({
    ...plugin.settings
  }));
  const [mountedTabs, setMountedTabs] = d2(
    () => /* @__PURE__ */ new Set([plugin.hubState.lastTab])
  );
  const [dragDx, setDragDx] = d2(0);
  const [isDraggingPager, setIsDraggingPager] = d2(false);
  const pagerRef = A2(null);
  const swipeRef = A2(null);
  h2(() => {
    return subscribeRefresh(() => {
      setSettings({ ...plugin.settings });
      setRefreshTick((t3) => t3 + 1);
    });
  }, [plugin, subscribeRefresh]);
  const ensureMounted = (tab) => {
    setMountedTabs((prev) => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  };
  const selectTab = (tab) => {
    ensureMounted(tab);
    setActiveTab(tab);
    plugin.hubState.lastTab = tab;
  };
  const handleUpdateCustomOrder = async (folderPath, orderedNames) => {
    plugin.settings.customOrder[folderPath] = orderedNames;
    await plugin.saveSettings();
    setSettings({ ...plugin.settings });
    setRefreshTick((t3) => t3 + 1);
  };
  const handleReplaceCustomOrderMap = async (nextMap) => {
    plugin.settings.customOrder = nextMap;
    await plugin.saveSettings();
    setSettings({ ...plugin.settings });
    setRefreshTick((t3) => t3 + 1);
  };
  const hideMainTopbar = activeTab === "knowledge" && kbInSubPage;
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t3) => t3.id === activeTab)
  );
  const handleRootTouchStart = (e3) => {
    e3.stopPropagation();
    if (e3.touches.length !== 1) return;
    const target = e3.target;
    const blocked = hideMainTopbar || Boolean(
      target?.closest(
        ".mh-calendar, .mh-sheet-backdrop, .mh-modal-backdrop, .mh-lightbox-backdrop, .mh-kb-tree-view.is-dragging"
      )
    );
    swipeRef.current = {
      startX: e3.touches[0].clientX,
      startY: e3.touches[0].clientY,
      startTime: Date.now(),
      locked: "none",
      blocked
    };
  };
  const handleRootTouchMove = (e3) => {
    e3.stopPropagation();
    const s3 = swipeRef.current;
    if (!s3 || s3.blocked || e3.touches.length !== 1) return;
    const dx = e3.touches[0].clientX - s3.startX;
    const dy = e3.touches[0].clientY - s3.startY;
    if (s3.locked === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.15) {
        s3.locked = "horizontal";
        setIsDraggingPager(true);
        if (dx < 0 && activeIndex < TABS.length - 1) {
          ensureMounted(TABS[activeIndex + 1].id);
        } else if (dx > 0 && activeIndex > 0) {
          ensureMounted(TABS[activeIndex - 1].id);
        }
      } else {
        s3.locked = "vertical";
        return;
      }
    }
    if (s3.locked === "horizontal") {
      let effectiveDx = dx;
      if (activeIndex === 0 && dx > 0 || activeIndex === TABS.length - 1 && dx < 0) {
        effectiveDx = dx * 0.25;
      }
      setDragDx(effectiveDx);
    }
  };
  const handleRootTouchEnd = (e3) => {
    e3.stopPropagation();
    const s3 = swipeRef.current;
    swipeRef.current = null;
    if (!s3 || s3.locked !== "horizontal") {
      if (isDraggingPager) {
        setIsDraggingPager(false);
        setDragDx(0);
      }
      return;
    }
    const endX = e3.changedTouches.length > 0 ? e3.changedTouches[0].clientX : s3.startX;
    const rawDx = endX - s3.startX;
    const dt = Math.max(1, Date.now() - s3.startTime);
    const velocity = Math.abs(rawDx) / dt;
    const width = pagerRef.current?.clientWidth || window.innerWidth || 360;
    const shouldSwitch = Math.abs(rawDx) > width * 0.22 || velocity > 0.35;
    if (shouldSwitch) {
      if (rawDx < 0 && activeIndex < TABS.length - 1) {
        selectTab(TABS[activeIndex + 1].id);
      } else if (rawDx > 0 && activeIndex > 0) {
        selectTab(TABS[activeIndex - 1].id);
      }
    }
    setIsDraggingPager(false);
    setDragDx(0);
  };
  const trackTransform = isDraggingPager ? `translate3d(calc(${-activeIndex * 100}% + ${dragDx}px), 0, 0)` : `translate3d(${-activeIndex * 100}%, 0, 0)`;
  return /* @__PURE__ */ u3(
    "div",
    {
      class: "mh-root",
      "data-active-tab": activeTab,
      onTouchStart: handleRootTouchStart,
      onTouchMove: handleRootTouchMove,
      onTouchEnd: handleRootTouchEnd,
      onTouchCancel: handleRootTouchEnd,
      children: [
        !hideMainTopbar && /* @__PURE__ */ u3("header", { class: "mh-topbar", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-settings-circle-btn",
              "aria-label": "\u6253\u5F00\u8BBE\u7F6E",
              onClick: () => openObsidianSettings(plugin.app),
              children: /* @__PURE__ */ u3(ObsidianIcon, { name: "settings", size: 19 })
            }
          ),
          /* @__PURE__ */ u3("nav", { class: "mh-tabs", role: "tablist", "aria-label": "\u4E3B\u5BFC\u822A", children: TABS.map((t3) => /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": activeTab === t3.id,
              class: `mh-tab-btn ${activeTab === t3.id ? "is-active" : ""}`,
              onClick: () => selectTab(t3.id),
              children: t3.label
            },
            t3.id
          )) }),
          activeTab !== "knowledge" && /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              class: "mh-icon-btn mh-topbar-search-btn",
              "aria-label": "\u5168\u5C40\u641C\u7D22",
              onClick: () => openObsidianSwitcher(plugin.app),
              children: /* @__PURE__ */ u3(ObsidianIcon, { name: "search", size: 19 })
            }
          )
        ] }),
        /* @__PURE__ */ u3("main", { ref: pagerRef, class: "mh-content mh-pager-viewport", children: /* @__PURE__ */ u3(
          "div",
          {
            class: `mh-pager-track ${isDraggingPager ? "is-dragging" : ""}`,
            style: { transform: trackTransform },
            children: [
              /* @__PURE__ */ u3("section", { class: "mh-pager-slide", children: mountedTabs.has("memo") && /* @__PURE__ */ u3(
                MemoTab,
                {
                  app: plugin.app,
                  settings,
                  hubState: plugin.hubState,
                  refreshTick,
                  onTrackDraft: (path) => {
                    plugin.pendingDraftPath = path;
                  }
                }
              ) }),
              /* @__PURE__ */ u3("section", { class: "mh-pager-slide", children: mountedTabs.has("diary") && /* @__PURE__ */ u3(
                DiaryTab,
                {
                  app: plugin.app,
                  settings,
                  hubState: plugin.hubState,
                  refreshTick,
                  onTrackDraft: (path) => {
                    plugin.pendingDraftPath = path;
                  }
                }
              ) }),
              /* @__PURE__ */ u3("section", { class: "mh-pager-slide", children: mountedTabs.has("knowledge") && /* @__PURE__ */ u3(
                KnowledgeTab,
                {
                  app: plugin.app,
                  settings,
                  hubState: plugin.hubState,
                  refreshTick,
                  onRootPathChange: (path) => {
                    plugin.hubState.kbRootPath = path;
                    setKbInSubPage(Boolean(path));
                  },
                  onUpdateCustomOrder: handleUpdateCustomOrder,
                  onReplaceCustomOrderMap: handleReplaceCustomOrderMap
                }
              ) })
            ]
          }
        ) })
      ]
    }
  );
}
var MobileHubView = class extends import_obsidian10.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.listeners = /* @__PURE__ */ new Set();
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_MOBILE_HUB;
  }
  getDisplayText() {
    return "Mobile Hub";
  }
  getIcon() {
    return "layout-grid";
  }
  triggerRefresh() {
    for (const cb of this.listeners) {
      cb();
    }
  }
  async onOpen() {
    this.plugin.syncBodyClasses(this.leaf);
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("mh-view-container");
    R(
      /* @__PURE__ */ u3(
        MobileHubRoot,
        {
          plugin: this.plugin,
          subscribeRefresh: (cb) => {
            this.listeners.add(cb);
            return () => this.listeners.delete(cb);
          }
        }
      ),
      container
    );
  }
  async onClose() {
    const container = this.containerEl.children[1];
    if (container) {
      R(null, container);
    }
    this.listeners.clear();
  }
};

// src/main.ts
var MobileHubPlugin = class extends import_obsidian12.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.pendingDraftPath = null;
    this.hubState = {
      lastTab: "memo",
      memoScrollTop: 0,
      diarySelectedDate: formatDateKey(/* @__PURE__ */ new Date()),
      diaryCollapsed: false,
      diaryScrollTop: 0,
      kbRootPath: null,
      kbExpandedPaths: [],
      kbScrollTop: 0
    };
    this.refreshTimer = null;
    this.editorBackBarEl = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.boundTouchStart = null;
    this.boundTouchMove = null;
  }
  async onload() {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_MOBILE_HUB,
      (leaf) => new MobileHubView(leaf, this)
    );
    this.addCommand({
      id: "open-mobile-hub",
      name: "\u6253\u5F00 Mobile Hub \u4E3B\u754C\u9762",
      callback: () => this.activateHubView()
    });
    this.addRibbonIcon("layout-grid", "Mobile Hub", () => {
      this.activateHubView();
    });
    this.addSettingTab(new MobileHubSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        this.syncBodyClasses(leaf);
      })
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.syncBodyClasses(this.app.workspace.activeLeaf);
      })
    );
    const scheduleRefreshForFile = (file) => {
      const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
      if (leaves.length === 0) return;
      if (file) {
        const path = typeof file === "string" ? file : file.path;
        if (!this.isPathRelevantToActiveTab(path)) return;
      }
      if (this.refreshTimer !== null) {
        window.clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = window.setTimeout(() => {
        this.refreshTimer = null;
        this.refreshAllHubViews();
      }, 160);
    };
    this.registerEvent(this.app.vault.on("create", (f4) => scheduleRefreshForFile(f4)));
    this.registerEvent(this.app.vault.on("delete", (f4) => scheduleRefreshForFile(f4)));
    this.registerEvent(
      this.app.vault.on("rename", (f4, oldPath) => {
        if (this.isPathRelevantToActiveTab(f4.path) || this.isPathRelevantToActiveTab(oldPath)) {
          scheduleRefreshForFile();
        }
      })
    );
    this.registerEvent(this.app.vault.on("modify", (f4) => scheduleRefreshForFile(f4)));
    this.registerEvent(
      this.app.metadataCache.on("changed", (f4) => scheduleRefreshForFile(f4))
    );
    this.installLeftSwipeBlocker();
    this.mountEditorBackBar();
    this.app.workspace.onLayoutReady(() => {
      const isMobileMode = import_obsidian12.Platform.isMobile || document.body.classList.contains("is-mobile");
      if (this.settings.autoOpenOnMobile && isMobileMode) {
        this.activateHubView();
      }
      this.syncBodyClasses(this.app.workspace.activeLeaf);
    });
  }
  onunload() {
    document.body.classList.remove(
      "mh-hub-active",
      "mh-editor-active",
      "mh-disable-left-drawer"
    );
    this.editorBackBarEl?.remove();
    this.editorBackBarEl = null;
    this.uninstallLeftSwipeBlocker();
    if (this.refreshTimer !== null) {
      window.clearTimeout(this.refreshTimer);
    }
  }
  isPathRelevantToActiveTab(rawPath) {
    const p3 = (0, import_obsidian12.normalizePath)(rawPath);
    const tab = this.hubState.lastTab;
    const memoPrefix = `${(0, import_obsidian12.normalizePath)(this.settings.memoFolder)}/`;
    const diaryPrefix = `${(0, import_obsidian12.normalizePath)(this.settings.diaryFolder)}/`;
    if (tab === "memo") return p3 === this.settings.memoFolder || p3.startsWith(memoPrefix);
    if (tab === "diary") return p3 === this.settings.diaryFolder || p3.startsWith(diaryPrefix);
    return !p3.startsWith(memoPrefix) && !p3.startsWith(diaryPrefix);
  }
  mountEditorBackBar() {
    if (this.editorBackBarEl) return;
    const bar = document.createElement("div");
    bar.className = "mh-editor-backbar";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mh-editor-back-btn";
    btn.setAttribute("aria-label", "\u8FD4\u56DE");
    (0, import_obsidian12.setIcon)(btn, "chevron-left");
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
    }
    btn.addEventListener("click", async () => {
      await this.cleanupEmptyDraftIfNeeded();
      await this.activateHubView();
    });
    bar.appendChild(btn);
    document.body.appendChild(bar);
    this.editorBackBarEl = bar;
  }
  syncBodyClasses(activeLeaf) {
    const viewType = activeLeaf?.view?.getViewType();
    const isHubActive = viewType === VIEW_TYPE_MOBILE_HUB;
    const isEditorActive = viewType === "markdown";
    document.body.classList.toggle("mh-hub-active", Boolean(isHubActive));
    document.body.classList.toggle("mh-editor-active", Boolean(isEditorActive));
    document.body.classList.toggle(
      "mh-disable-left-drawer",
      this.settings.disableLeftDrawerSwipe
    );
  }
  /**
   * Intercept ONLY left-edge right-swipe gestures (<= 32px from left edge) while on Mobile Hub view.
   * Never blocks editor text selection, wide tables, or calendar horizontal swipes.
   */
  installLeftSwipeBlocker() {
    this.boundTouchStart = (e3) => {
      if (!this.settings.disableLeftDrawerSwipe) return;
      if (e3.touches.length !== 1) return;
      this.touchStartX = e3.touches[0].clientX;
      this.touchStartY = e3.touches[0].clientY;
    };
    this.boundTouchMove = (e3) => {
      if (!this.settings.disableLeftDrawerSwipe) return;
      if (!document.body.classList.contains("is-mobile")) return;
      if (!document.body.classList.contains("mh-hub-active")) return;
      if (e3.touches.length !== 1) return;
      if (this.touchStartX > 32) return;
      const dx = e3.touches[0].clientX - this.touchStartX;
      const dy = e3.touches[0].clientY - this.touchStartY;
      if (dx > 10 && Math.abs(dx) > Math.abs(dy) * 1.1) {
        const leftSplit = this.app.workspace.leftSplit;
        if (leftSplit?.collapsed !== false) {
          e3.stopPropagation();
          e3.stopImmediatePropagation();
        }
      }
    };
    window.addEventListener("touchstart", this.boundTouchStart, {
      capture: true,
      passive: true
    });
    window.addEventListener("touchmove", this.boundTouchMove, {
      capture: true,
      passive: true
    });
  }
  uninstallLeftSwipeBlocker() {
    if (this.boundTouchStart) {
      window.removeEventListener("touchstart", this.boundTouchStart, {
        capture: true
      });
      this.boundTouchStart = null;
    }
    if (this.boundTouchMove) {
      window.removeEventListener("touchmove", this.boundTouchMove, {
        capture: true
      });
      this.boundTouchMove = null;
    }
  }
  async cleanupEmptyDraftIfNeeded() {
    const draftPath = this.pendingDraftPath;
    if (!draftPath) return;
    this.pendingDraftPath = null;
    const af = this.app.vault.getAbstractFileByPath(draftPath);
    if (!(af instanceof import_obsidian12.TFile)) return;
    try {
      const content = await this.app.vault.read(af);
      const body = stripFrontmatter(content).trim();
      if (!body) {
        await this.app.vault.delete(af);
      }
    } catch {
    }
  }
  async activateHubView() {
    await this.cleanupEmptyDraftIfNeeded();
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
    let leaf;
    if (existing.length > 0) {
      leaf = existing[0];
    } else {
      leaf = this.app.workspace.getLeaf(false);
      await leaf.setViewState({
        type: VIEW_TYPE_MOBILE_HUB,
        active: true
      });
    }
    this.app.workspace.revealLeaf(leaf);
    if (this.settings.disableLeftDrawerSwipe) {
      const leftSplit = this.app.workspace.leftSplit;
      const rightSplit = this.app.workspace.rightSplit;
      leftSplit?.collapse?.();
      rightSplit?.collapse?.();
    }
    this.syncBodyClasses(leaf);
  }
  refreshAllHubViews() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MOBILE_HUB);
    for (const leaf of leaves) {
      if (leaf.view instanceof MobileHubView) {
        leaf.view.triggerRefresh();
      }
    }
  }
  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    if (!this.settings.customOrder) {
      this.settings.customOrder = {};
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.syncBodyClasses(this.app.workspace.activeLeaf);
    this.refreshAllHubViews();
  }
};
var MobileHubSettingTab = class extends import_obsidian12.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Mobile Hub \u8BBE\u7F6E" });
    new import_obsidian12.Setting(containerEl).setName("\u5907\u5FD8\u5F55\u6587\u4EF6\u5939").setDesc("\u5907\u5FD8\u5F55 Tab \u8BFB\u53D6\u7684\u6570\u636E\u76EE\u5F55").addText(
      (text) => text.setValue(this.plugin.settings.memoFolder).onChange(async (val) => {
        this.plugin.settings.memoFolder = val.trim() || "\u5907\u5FD8\u5F55";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian12.Setting(containerEl).setName("\u65E5\u8BB0\u6587\u4EF6\u5939").setDesc("\u65E5\u8BB0 Tab \u8BFB\u53D6\u7684\u6570\u636E\u76EE\u5F55").addText(
      (text) => text.setValue(this.plugin.settings.diaryFolder).onChange(async (val) => {
        this.plugin.settings.diaryFolder = val.trim() || "\u65E5\u8BB0";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian12.Setting(containerEl).setName("\u77E5\u8BC6\u5E93\u6392\u9664\u6587\u4EF6\u5939").setDesc("\u9017\u53F7\u5206\u9694\uFF0C\u4E0D\u663E\u793A\u5728\u77E5\u8BC6\u5E93\u5217\u8868\u4E2D\u7684\u6839\u76EE\u5F55\u6587\u4EF6\u5939").addText(
      (text) => text.setValue(this.plugin.settings.excludedFolders.join(", ")).onChange(async (val) => {
        this.plugin.settings.excludedFolders = val.split(",").map((s3) => s3.trim()).filter(Boolean);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian12.Setting(containerEl).setName("\u65E5\u5386\u6BCF\u5468\u4EE5\u5468\u4E00\u5F00\u59CB").setDesc("\u65E5\u8BB0\u4E0E\u4EFB\u52A1 Tab \u7684\u65E5\u5386\u7EDF\u4E00\u751F\u6548").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.weekStartsMonday).onChange(async (val) => {
        this.plugin.settings.weekStartsMonday = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian12.Setting(containerEl).setName("\u79FB\u52A8\u7AEF\u542F\u52A8\u65F6\u81EA\u52A8\u6253\u5F00\u4E3B\u754C\u9762").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoOpenOnMobile).onChange(async (val) => {
        this.plugin.settings.autoOpenOnMobile = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian12.Setting(containerEl).setName("\u7981\u7528\u4ECE\u5DE6\u8FB9\u7F18\u5411\u53F3\u6ED1\u52A8\u62C9\u51FA\u5DE6\u4FA7\u62BD\u5C49").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.disableLeftDrawerSwipe).onChange(async (val) => {
        this.plugin.settings.disableLeftDrawerSwipe = val;
        await this.plugin.saveSettings();
      })
    );
  }
};
