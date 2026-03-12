var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/code.js
var require_code = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return {
          [this.str]: 1
        };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [
          code
        ] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1) return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a2;
        return (_a2 = this._str) !== null && _a2 !== void 0 ? _a2 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a2;
        return (_a2 = this._names) !== null && _a2 !== void 0 ? _a2 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [
        strs[0]
      ];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [
        safeStringify(strs[0])
      ];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code) code.push(...arg._items);
      else if (arg instanceof Name) code.push(arg);
      else code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""') return a;
      if (a === '""') return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"') return;
        if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"') return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify3(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify3;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a2, _b2;
        if (((_b2 = (_a2 = this._parent) === null || _a2 === void 0 ? void 0 : _a2._prefixes) === null || _b2 === void 0 ? void 0 : _b2.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = {
          prefix,
          index: 0
        };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = {
          ...opts,
          _n: opts.lines ? line : code_1.nil
        };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a2;
        if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a2 = value.key) !== null && _a2 !== void 0 ? _a2 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name) return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, {
          property: prefix,
          itemIndex
        });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs) return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values2 = this._values) {
        return this._reduceValues(values2, (name) => {
          if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values2 = this._values, usedValues, getCode) {
        return this._reduceValues(values2, (name) => {
          if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values2, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values2) {
          const vs = values2[prefix];
          if (!vs) continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name)) return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", {
      enumerable: true,
      get: function() {
        return code_2._;
      }
    });
    Object.defineProperty(exports, "str", {
      enumerable: true,
      get: function() {
        return code_2.str;
      }
    });
    Object.defineProperty(exports, "strConcat", {
      enumerable: true,
      get: function() {
        return code_2.strConcat;
      }
    });
    Object.defineProperty(exports, "nil", {
      enumerable: true,
      get: function() {
        return code_2.nil;
      }
    });
    Object.defineProperty(exports, "getProperty", {
      enumerable: true,
      get: function() {
        return code_2.getProperty;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return code_2.stringify;
      }
    });
    Object.defineProperty(exports, "regexpCode", {
      enumerable: true,
      get: function() {
        return code_2.regexpCode;
      }
    });
    Object.defineProperty(exports, "Name", {
      enumerable: true,
      get: function() {
        return code_2.Name;
      }
    });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", {
      enumerable: true,
      get: function() {
        return scope_2.Scope;
      }
    });
    Object.defineProperty(exports, "ValueScope", {
      enumerable: true,
      get: function() {
        return scope_2.ValueScope;
      }
    });
    Object.defineProperty(exports, "ValueScopeName", {
      enumerable: true,
      get: function() {
        return scope_2.ValueScopeName;
      }
    });
    Object.defineProperty(exports, "varKinds", {
      enumerable: true,
      get: function() {
        return scope_2.varKinds;
      }
    });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str]) return;
        if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : {
          ...this.lhs.names
        };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n)) nodes.splice(i, 1, ...n);
          else if (n) nodes[i] = n;
          else nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants)) continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else) code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true) return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false) return e instanceof _If ? e : e.nodes;
          if (this.nodes.length) return this;
          return new _If(not(cond), e instanceof _If ? [
            e
          ] : e.nodes);
        }
        if (cond === false || !this.nodes.length) return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a2;
        this.else = (_a2 = this.else) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else)) return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else) addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants)) return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants)) return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch) code += this.catch.render(opts);
        if (this.finally) code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a2, _b2;
        super.optimizeNodes();
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNodes();
        (_b2 = this.finally) === null || _b2 === void 0 ? void 0 : _b2.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a2, _b2;
        super.optimizeNames(names, constants);
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        (_b2 = this.finally) === null || _b2 === void 0 ? void 0 : _b2.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch) addNames(names, this.catch.names);
        if (this.finally) addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = {
          ...opts,
          _n: opts.lines ? "\n" : ""
        };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({
          parent: extScope
        });
        this._nodes = [
          new Root()
        ];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function") c();
        else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = [
          "{"
        ];
        for (const [key, value] of keyValues) {
          if (code.length > 1) code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody) this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1) throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode) throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body) this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody) this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N22) {
        const n = this._currNode;
        if (n instanceof N1 || N22 && n instanceof N22) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N22 ? `${N1.kind}/${N22.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name) return replaceName(expr);
      if (!canOptimize(expr)) return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name) c = replaceName(c);
        if (c instanceof code_1._Code) items.push(...c._items);
        else items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1) return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/util.js
var require_util = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr) hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean") return schema;
      if (Object.keys(schema).length === 0) return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self: self2 } = it;
      if (!opts.strictSchema) return;
      if (typeof schema === "boolean") return;
      const rules = self2.RULES.keywords;
      for (const key in schema) {
        if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean") return !schema;
      for (const key in schema) if (rules[key]) return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean") return !schema;
      for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean") return schema;
        if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number") return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs) f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : {
          ...from,
          ...to
        },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true) return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0) setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode) return;
      msg = `strict mode: ${msg}`;
      if (mode === true) throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/names.js
var require_names = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      errors: new codegen_1.Name("errors"),
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/errors.js
var require_errors = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0) throw new Error("ajv implementation error");
      const err3 = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err3, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err3}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err3}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err3}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err3}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err3}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err3 = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err3}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err3})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false) return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [
        names_1.default.instancePath,
        (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)
      ];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [
        E.schemaPath,
        schPath
      ];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([
        E.keyword,
        keyword
      ], [
        E.params,
        typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`
      ]);
      if (opts.messages) {
        keyValues.push([
          E.message,
          typeof message == "function" ? message(cxt) : message
        ]);
      }
      if (opts.verbose) {
        keyValues.push([
          E.schema,
          schemaValue
        ], [
          E.parentSchema,
          (0, codegen_1._)`${topSchemaRef}${schemaPath}`
        ], [
          names_1.default.data,
          data
        ]);
      }
      if (propertyName) keyValues.push([
        E.propertyName,
        propertyName
      ]);
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/rules.js
var require_rules = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = [
      "string",
      "number",
      "integer",
      "boolean",
      "null",
      "object",
      "array"
    ];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: {
          type: "number",
          rules: []
        },
        string: {
          type: "string",
          rules: []
        },
        array: {
          type: "array",
          rules: []
        },
        object: {
          type: "object",
          rules: []
        }
      };
      return {
        types: {
          ...groups,
          integer: true,
          boolean: true,
          null: true
        },
        rules: [
          {
            rules: []
          },
          groups.number,
          groups.string,
          groups.array,
          groups.object
        ],
        post: {
          rules: []
        },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self: self2 }, type) {
      const group = self2.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a2;
      return schema[rule.keyword] !== void 0 || ((_a2 = rule.definition.implements) === null || _a2 === void 0 ? void 0 : _a2.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true) types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [
        ts
      ] : [];
      if (types.every(rules_1.isJSONType)) return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length) coerceData(it, types, coerceTo);
          else reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set([
      "string",
      "number",
      "integer",
      "boolean",
      "null"
    ]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number) delete types.integer;
      for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0) return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({
          missingProperty: (0, codegen_1._)`${prop}`
        }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({
        missingProperty: missing
      }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [
          names_1.default.instancePath,
          (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)
        ],
        [
          names_1.default.parentData,
          it.parentData
        ],
        [
          names_1.default.parentDataProperty,
          it.parentDataProperty
        ],
        [
          names_1.default.rootData,
          names_1.default.rootData
        ]
      ];
      if (it.opts.dynamicRef) valCxt.push([
        names_1.default.dynamicAnchors,
        names_1.default.dynamicAnchors
      ]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema)) throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated) return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged) gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a2;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate2 = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate2);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying) modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying) modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a3;
        gen.if((0, codegen_1.not)((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? {
        ref: result
      } : {
        ref: result,
        code: (0, codegen_1.stringify)(result)
      });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self: self2, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self2.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log") self2.logger.error(msg);
          else throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [
          ...dataPathArr,
          subschema.parentDataProperty
        ];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0) subschema.propertyName = propertyName;
      }
      if (dataTypes) subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [
          ...it.dataNames,
          _nextData
        ];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
      if (createErrors !== void 0) subschema.createErrors = createErrors;
      if (allErrors !== void 0) subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/fast-deep-equal/3.1.3/index.js
var require__ = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/fast-deep-equal/3.1.3/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys2;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys2 = Object.keys(a);
        length = keys2.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys2[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys2[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/json-schema-traverse/1.0.0/index.js
var require__2 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/json-schema-traverse/1.0.0/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/resolve.js
var require_resolve = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require__();
    var traverse = require__2();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean") return true;
      if (limit === true) return !hasRef(schema);
      if (!limit) return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key)) return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef)) return true;
        if (typeof sch == "object" && hasRef(sch)) return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref") return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key)) continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity) return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize2) {
      if (normalize2 !== false) id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean") return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = {
        "": schId
      };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, {
        allKeys: true
      }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0) return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref)) throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/index.js
var require_validate = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment) commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated) resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self: self2 }) {
      if (typeof schema == "boolean") return !schema;
      for (const key in schema) if (self2.RULES.all[key]) return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment) commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self: self2 } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self2.RULES)) {
        self2.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", {
          ref: schemaEnv.root
        });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated) assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self: self2 } = it;
      const { RULES } = self2;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd) checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules) groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes) return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length) return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t)) ts.push(t);
        else if (withTypes.includes("integer") && t === "number") ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction) failAction();
        else this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors) this.gen.endIf();
        } else {
          if (this.allErrors) this.gen.endIf();
          else this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors) this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors) this.gen.endIf();
        else this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data) return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0) throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors) this.gen.if(cond);
      }
      setParams(obj, assign2) {
        if (assign2) Object.assign(this.params, obj);
        else this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data) return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil) gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil) gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [
              schemaType
            ];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", {
              ref: def.validateSchema
            });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = {
          ...this.it,
          ...subschema,
          items: void 0,
          props: void 0
        };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated) return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "") return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel) throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer) return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/index.js
var require_compile = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a2;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object") schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a2 = env.baseId) !== null && _a2 !== void 0 ? _a2 : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch) return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, {
        es5,
        lines,
        ownProperties
      });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [
          names_1.default.data
        ],
        dataPathArr: [
          codegen_1.nil
        ],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
          ref: sch.schema,
          code: (0, codegen_1.stringify)(sch.schema)
        } : {
          ref: sch.schema
        }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate2 = makeValidate(this, this.scope.get());
        this.scope.value(validateName, {
          ref: validate2
        });
        validate2.errors = null;
        validate2.schema = sch.schema;
        validate2.schemaEnv = sch;
        if (sch.$async) validate2.$async = true;
        if (this.opts.code.source === true) {
          validate2.source = {
            validateName,
            validateCode,
            scopeValues: gen._values
          };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate2.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate2.source) validate2.source.evaluated = (0, codegen_1.stringify)(validate2.evaluated);
        }
        sch.validate = validate2;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a2;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc) return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a2 = root.localRefs) === null || _a2 === void 0 ? void 0 : _a2[ref];
        const { schemaId } = this.opts;
        if (schema) _sch = new SchemaEnv({
          schema,
          schemaId,
          root,
          baseId
        });
      }
      if (_sch === void 0) return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv)) return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string") ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
      if (!schOrRef.validate) compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({
          schema,
          schemaId,
          root,
          baseId
        });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a2;
      if (((_a2 = parsedRef.fragment) === null || _a2 === void 0 ? void 0 : _a2[0]) !== "/") return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean") return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0) return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({
        schema,
        schemaId,
        root,
        baseId
      });
      if (env.schema !== env.root.schema) return env;
      return void 0;
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/refs/data.json
var require_data = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/lib/utils.js
var require_utils = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function consumeIsZone(buffer) {
      buffer.length = 0;
      return true;
    }
    function consumeHextets(buffer, address, output) {
      if (buffer.length) {
        const hex = stringArrayToHexStripped(buffer);
        if (hex !== "") {
          address.push(hex);
        } else {
          output.error = true;
          return false;
        }
        buffer.length = 0;
      }
      return true;
    }
    function getIPV6(input) {
      let tokenCount = 0;
      const output = {
        error: false,
        address: "",
        zone: ""
      };
      const address = [];
      const buffer = [];
      let endipv6Encountered = false;
      let endIpv6 = false;
      let consume = consumeHextets;
      for (let i = 0; i < input.length; i++) {
        const cursor = input[i];
        if (cursor === "[" || cursor === "]") {
          continue;
        }
        if (cursor === ":") {
          if (endipv6Encountered === true) {
            endIpv6 = true;
          }
          if (!consume(buffer, address, output)) {
            break;
          }
          if (++tokenCount > 7) {
            output.error = true;
            break;
          }
          if (i > 0 && input[i - 1] === ":") {
            endipv6Encountered = true;
          }
          address.push(":");
          continue;
        } else if (cursor === "%") {
          if (!consume(buffer, address, output)) {
            break;
          }
          consume = consumeIsZone;
        } else {
          buffer.push(cursor);
          continue;
        }
      }
      if (buffer.length) {
        if (consume === consumeIsZone) {
          output.zone = buffer.join("");
        } else if (endIpv6) {
          address.push(buffer.join(""));
        } else {
          address.push(stringArrayToHexStripped(buffer));
        }
      }
      output.address = address.join("");
      return output;
    }
    function normalizeIPv6(host) {
      if (findToken(host, ":") < 2) {
        return {
          host,
          isIPV6: false
        };
      }
      const ipv6 = getIPV6(host);
      if (!ipv6.error) {
        let newHost = ipv6.address;
        let escapedHost = ipv6.address;
        if (ipv6.zone) {
          newHost += "%" + ipv6.zone;
          escapedHost += "%25" + ipv6.zone;
        }
        return {
          host: newHost,
          isIPV6: true,
          escapedHost
        };
      } else {
        return {
          host,
          isIPV6: false
        };
      }
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    function normalizeComponentEncoding(component, esc) {
      const func = esc !== true ? escape : unescape;
      if (component.scheme !== void 0) {
        component.scheme = func(component.scheme);
      }
      if (component.userinfo !== void 0) {
        component.userinfo = func(component.userinfo);
      }
      if (component.host !== void 0) {
        component.host = func(component.host);
      }
      if (component.path !== void 0) {
        component.path = func(component.path);
      }
      if (component.query !== void 0) {
        component.query = func(component.query);
      }
      if (component.fragment !== void 0) {
        component.fragment = func(component.fragment);
      }
      return component;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(component.userinfo);
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = unescape(component.host);
        if (!isIPv4(host)) {
          const ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = component.host;
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(component.port));
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      normalizeComponentEncoding,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/lib/schemes.js
var require_schemes = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const [path, query] = wsComponent.resourceName.split("?");
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = query;
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/index.js
var require__3 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/fast-uri/3.1.0/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizeComponentEncoding, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    function normalize2(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        serialize(parse2(uri, options), options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse2(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({
        scheme: "null"
      }, options) : {
        scheme: "null"
      };
      const resolved = resolveComponent(parse2(baseURI, schemelessOptions), parse2(relativeURI, schemelessOptions), schemelessOptions, true);
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse2(serialize(base, options), options);
        relative = parse2(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      if (typeof uriA === "string") {
        uriA = unescape(uriA);
        uriA = serialize(normalizeComponentEncoding(parse2(uriA, options), true), {
          ...options,
          skipEscape: true
        });
      } else if (typeof uriA === "object") {
        uriA = serialize(normalizeComponentEncoding(uriA, true), {
          ...options,
          skipEscape: true
        });
      }
      if (typeof uriB === "string") {
        uriB = unescape(uriB);
        uriB = serialize(normalizeComponentEncoding(parse2(uriB, options), true), {
          ...options,
          skipEscape: true
        });
      } else if (typeof uriB === "object") {
        uriB = serialize(normalizeComponentEncoding(uriB, true), {
          ...options,
          skipEscape: true
        });
      }
      return uriA.toLowerCase() === uriB.toLowerCase();
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = escape(component.path);
          if (component.scheme !== void 0) {
            component.path = component.path.split("%3A").join(":");
          }
        } else {
          component.path = unescape(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", component.query);
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", component.fragment);
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function parse2(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const ipv6result = normalizeIPv6(parsed.host);
            parsed.host = ipv6result.host.toLowerCase();
            isIP = ipv6result.isIPV6;
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
          if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
            try {
              parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
            } catch (e) {
              parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
            }
          }
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.scheme !== void 0) {
              parsed.scheme = unescape(parsed.scheme);
            }
            if (parsed.host !== void 0) {
              parsed.host = unescape(parsed.host);
            }
          }
          if (parsed.path) {
            parsed.path = escape(unescape(parsed.path));
          }
          if (parsed.fragment) {
            parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return parsed;
    }
    var fastUri = {
      SCHEMES,
      normalize: normalize2,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse: parse2
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/uri.js
var require_uri = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var uri = require__3();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/core.js
var require_core = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", {
      enumerable: true,
      get: function() {
        return validate_1.KeywordCxt;
      }
    });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", {
      enumerable: true,
      get: function() {
        return codegen_1._;
      }
    });
    Object.defineProperty(exports, "str", {
      enumerable: true,
      get: function() {
        return codegen_1.str;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return codegen_1.stringify;
      }
    });
    Object.defineProperty(exports, "nil", {
      enumerable: true,
      get: function() {
        return codegen_1.nil;
      }
    });
    Object.defineProperty(exports, "Name", {
      enumerable: true,
      get: function() {
        return codegen_1.Name;
      }
    });
    Object.defineProperty(exports, "CodeGen", {
      enumerable: true,
      get: function() {
        return codegen_1.CodeGen;
      }
    });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags2) => new RegExp(str, flags2);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = [
      "removeAdditional",
      "useDefaults",
      "coerceTypes"
    ];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a2, _b2, _c, _d2, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a2 = o.code) === null || _a2 === void 0 ? void 0 : _a2.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b2 = o.code) === null || _b2 === void 0 ? void 0 : _b2.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d2 = o.uriResolver) !== null && _d2 !== void 0 ? _d2 : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? {
          ...o.code,
          optimize,
          regExp
        } : {
          optimize,
          regExp
        },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = {
          ...opts,
          ...requiredOptions(opts)
        };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({
          scope: {},
          prefixes: EXT_SCOPE_NAMES,
          es5,
          lines
        });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats) addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = {
            ...$dataRefSchema
          };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v)) this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, {
              $ref
            }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default)) throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p) return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean") return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log") this.logger.error(message);
          else throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({
            schema: {},
            schemaId
          });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch) return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object") this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions) this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0) group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string") format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0) return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments) keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object") continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema) keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd) throw new Error("schema must be object");
          else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0) return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({
          schema,
          schemaId,
          meta,
          baseId,
          localRefs
        });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId) this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema) this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta) this._compileMetaSchema(sch);
        else compile_1.compileSchema.call(this, sch);
        if (!sch.validate) throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts2, options, msg, log = "error") {
      for (const key in checkOpts2) {
        const opt = key;
        if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts2[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas) return;
      if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
      else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format) this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword) def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = {
        ...this.opts
      };
      for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = {
      log() {
      },
      warn() {
      },
      error() {
      }
    };
    function getLogger(logger) {
      if (logger === false) return noLogs;
      if (logger === void 0) return console;
      if (logger.log && logger.warn && logger.error) return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def) return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a2;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post) throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = {
          type: dataType,
          rules: []
        };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition) return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a2 = definition.implements) === null || _a2 === void 0 ? void 0 : _a2.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0) return;
      if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return {
        anyOf: [
          schema,
          $dataRef
        ]
      };
    }
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self: self2 } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self2, root, baseId, $ref);
        if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root) return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", {
            ref: root
          });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? {
            ref: sch,
            code: (0, codegen_1.stringify)(sch)
          } : {
            ref: sch
          });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", {
        ref: sch.validate
      }) : (0, codegen_1._)`${gen.scopeValue("wrapper", {
        ref: sch
      })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async) callAsyncRef();
      else callSyncRef();
      function callAsyncRef() {
        if (!env.$async) throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors) gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors) gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a2;
        if (!it.opts.unevaluated) return;
        const schEvaluated = (_a2 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a2 === void 0 ? void 0 : _a2.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      {
        keyword: "$comment"
      },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: {
        okStr: "<=",
        ok: ops.LTE,
        fail: ops.GT
      },
      minimum: {
        okStr: ">=",
        ok: ops.GTE,
        fail: ops.LT
      },
      exclusiveMaximum: {
        okStr: "<",
        ok: ops.LT,
        fail: ops.GTE
      },
      exclusiveMinimum: {
        okStr: ">",
        ok: ops.GT,
        fail: ops.LTE
      }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320) pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: [
        "maxLength",
        "minLength"
      ],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: [
        "maxProperties",
        "minProperties"
      ],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0) return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors) allErrorsMode();
        else exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({
              missingProperty: prop
            });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({
            missingProperty: missing
          });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: [
        "maxItems",
        "minItems"
      ],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/equal.js
var require_equal = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var equal = require__();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema) return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({
            i,
            j
          });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema)) throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      {
        keyword: "type",
        schemaType: [
          "string",
          "array"
        ]
      },
      {
        keyword: "nullable",
        schemaType: "boolean"
      },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: [
        "boolean",
        "object"
      ],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({
          len: items.length
        });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: [
        "object",
        "array",
        "boolean"
      ],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema)) return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch)) return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: [
        "array"
      ],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: [
        "object",
        "boolean"
      ],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema)) return;
        if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: [
        "object",
        "boolean"
      ],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({
          min,
          max
        });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1) gen.assign(valid, true);
            else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__") continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [
        propertyDeps,
        schemaDeps
      ];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0) return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0) continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({
              keyword,
              schemaProp: prop
            }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: [
        "object",
        "boolean"
      ],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({
            propertyName: key
          });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: [
              "string"
            ],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors) gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: [
        "object"
      ],
      schemaType: [
        "boolean",
        "object"
      ],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount) throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length) additionalPropertyCode(key);
            else gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({
              additionalProperty: key
            });
            cxt.error();
            if (!allErrors) gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0) return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors) gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties) checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: [
        "object",
        "boolean"
      ],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: {
        message: "must NOT be valid"
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: {
        message: "must match a schema in anyOf"
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema)) throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator) return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({
          passing
        });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema)) throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch)) return;
          const schCxt = cxt.subschema({
            keyword: "allOf",
            schemaProp: i
          }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: [
        "object",
        "boolean"
      ],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse) return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({
            ifClause
          });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({
              keyword
            }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else cxt.setParams({
              ifClause: keyword
            });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var util_1 = require_util();
    var def = {
      keyword: [
        "then",
        "else"
      ],
      schemaType: [
        "object",
        "boolean"
      ],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
      else applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: [
        "number",
        "string"
      ],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self: self2 } = it;
        if (!opts.validateFormats) return;
        if ($data) validate$DataFormat();
        else validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self2.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false) return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self2.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true) return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType) cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self2.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", {
              key: schema,
              ref: fmtDef,
              code
            });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [
                fmtDef.type || "string",
                fmtDef.validate,
                (0, codegen_1._)`${fmt}.validate`
              ];
            }
            return [
              "string",
              fmtDef,
              fmt
            ];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async) throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var format_1 = require_format();
    var format = [
      format_1.default
    ];
    exports.default = format;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
        if (schema.mapping) throw new Error("discriminator: mapping is not supported");
        if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
          discrError: types_1.DiscrError.Tag,
          tag,
          tagName
        }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, {
            discrError: types_1.DiscrError.Mapping,
            tag,
            tagName
          });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({
            keyword: "oneOf",
            schemaProp
          }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a2;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
              if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a2 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a2 === void 0 ? void 0 : _a2[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/ajv.js
var require_ajv = __commonJS({
  "../../../Library/Caches/deno/npm/registry.npmjs.org/ajv/8.18.0/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = [
      "/properties"
    ];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta) return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv;
    module.exports = exports = Ajv;
    module.exports.Ajv = Ajv;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = Ajv;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", {
      enumerable: true,
      get: function() {
        return validate_1.KeywordCxt;
      }
    });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", {
      enumerable: true,
      get: function() {
        return codegen_1._;
      }
    });
    Object.defineProperty(exports, "str", {
      enumerable: true,
      get: function() {
        return codegen_1.str;
      }
    });
    Object.defineProperty(exports, "stringify", {
      enumerable: true,
      get: function() {
        return codegen_1.stringify;
      }
    });
    Object.defineProperty(exports, "nil", {
      enumerable: true,
      get: function() {
        return codegen_1.nil;
      }
    });
    Object.defineProperty(exports, "Name", {
      enumerable: true,
      get: function() {
        return codegen_1.Name;
      }
    });
    Object.defineProperty(exports, "CodeGen", {
      enumerable: true,
      get: function() {
        return codegen_1.CodeGen;
      }
    });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", {
      enumerable: true,
      get: function() {
        return validation_error_1.default;
      }
    });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", {
      enumerable: true,
      get: function() {
        return ref_error_1.default;
      }
    });
  }
});

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto_Ed25519.ts
var Crypto_Ed25519_exports = {};
__export(Crypto_Ed25519_exports, {
  INDEX: () => INDEX,
  NAME: () => NAME,
  PRIMARY_KEY_LENGTH: () => PRIMARY_KEY_LENGTH,
  PRIVATE_KEY_LENGTH: () => PRIVATE_KEY_LENGTH,
  PUBLIC_KEY_LENGTH: () => PUBLIC_KEY_LENGTH,
  SIGNATURE_LENGTH: () => SIGNATURE_LENGTH,
  appendCryptoIndexToPrimaryChars: () => appendCryptoIndexToPrimaryChars2,
  derivePublicKeyFromXPub: () => derivePublicKeyFromXPub2,
  displayPrivateKey: () => displayPrivateKey3,
  displayPublicKey: () => displayPublicKey3,
  displaySignature: () => displaySignature2,
  generateKeyPair: () => generateKeyPair2,
  isPrimaryKey: () => isPrimaryKey2,
  isPrivateKey: () => isPrivateKey2,
  isPrivateKeyDisplay: () => isPrivateKeyDisplay2,
  isPublicKey: () => isPublicKey2,
  isPublicKeyDisplay: () => isPublicKeyDisplay2,
  isSignature: () => isSignature2,
  isSignatureDisplay: () => isSignatureDisplay2,
  keyPairFromMnemonic: () => keyPairFromMnemonic2,
  keyPairFromPrivateKey: () => keyPairFromPrivateKey2,
  primaryKeyToPublicKey: () => primaryKeyToPublicKey2,
  publicKeyToPrimaryKey: () => publicKeyToPrimaryKey2,
  sign: () => sign2,
  splitPrimaryKeyAndCryptoIndex: () => splitPrimaryKeyAndCryptoIndex2,
  verify: () => verify2
});

// deno:https://jsr.io/@noble/ed25519/3.0.0/index.ts
var ed25519_CURVE = {
  p: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,
  n: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
  h: 8n,
  a: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,
  d: 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,
  Gx: 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
  Gy: 0x6666666666666666666666666666666666666666666666666666666666666658n
};
var { p: P, n: N, Gx, Gy, a: _a, d: _d, h } = ed25519_CURVE;
var L = 32;
var L2 = 64;
var captureTrace = (...args) => {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
};
var err = (message = "") => {
  const e = new Error(message);
  captureTrace(e, err);
  throw e;
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes = (value, length, title = "") => {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    err(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
};
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex = (b) => Array.from(abytes(b)).map((e) => padh(e, 2)).join("");
var C = {
  _0: 48,
  _9: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9) return ch - C._0;
  if (ch >= C.A && ch <= C.F) return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f) return ch - (C.a - 10);
  return;
};
var hexToBytes = (hex) => {
  const e = "hex invalid";
  if (!isStr(hex)) return err(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var cr = () => globalThis?.crypto;
var subtle = () => cr()?.subtle ?? err("crypto.subtle must be defined, consider polyfill");
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + abytes(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var big = BigInt;
var assertRange = (n, min, max, msg = "bad number: out of range") => isBig(n) && min <= n && n < max ? n : err(msg);
var M = (a, b = P) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
var modN = (a) => M(a, N);
var invert = (num, md) => {
  if (num === 0n || md <= 0n) err("no inverse n=" + num + " mod=" + md);
  let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q8 = b / a, r = b % a;
    const m = x - u * q8, n = y - v * q8;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var callHash = (name) => {
  const fn2 = hashes[name];
  if (typeof fn2 !== "function") err("hashes." + name + " not set");
  return fn2;
};
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var B256 = 2n ** 256n;
var Point = class _Point {
  static BASE;
  static ZERO;
  X;
  Y;
  Z;
  T;
  constructor(X2, Y, Z, T) {
    const max = B256;
    this.X = assertRange(X2, 0n, max);
    this.Y = assertRange(Y, 0n, max);
    this.Z = assertRange(Z, 1n, max);
    this.T = assertRange(T, 0n, max);
    Object.freeze(this);
  }
  static CURVE() {
    return ed25519_CURVE;
  }
  static fromAffine(p) {
    return new _Point(p.x, p.y, 1n, M(p.x * p.y));
  }
  /** RFC8032 5.1.3: Uint8Array to Point. */
  static fromBytes(hex, zip215 = false) {
    const d = _d;
    const normed = u8fr(abytes(hex, L));
    const lastByte = hex[31];
    normed[31] = lastByte & ~128;
    const y = bytesToNumLE(normed);
    const max = zip215 ? B256 : P;
    assertRange(y, 0n, max);
    const y2 = M(y * y);
    const u = M(y2 - 1n);
    const v = M(d * y2 + 1n);
    let { isValid, value: x } = uvRatio(u, v);
    if (!isValid) err("bad point: y not sqrt");
    const isXOdd = (x & 1n) === 1n;
    const isLastByteOdd = (lastByte & 128) !== 0;
    if (!zip215 && x === 0n && isLastByteOdd) err("bad point: x==0, isLastByteOdd");
    if (isLastByteOdd !== isXOdd) x = M(-x);
    return new _Point(x, y, 1n, M(x * y));
  }
  static fromHex(hex, zip215) {
    return _Point.fromBytes(hexToBytes(hex), zip215);
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const a = _a;
    const d = _d;
    const p = this;
    if (p.is0()) return err("bad point: ZERO");
    const { X: X2, Y, Z, T } = p;
    const X22 = M(X2 * X2);
    const Y2 = M(Y * Y);
    const Z2 = M(Z * Z);
    const Z4 = M(Z2 * Z2);
    const aX2 = M(X22 * a);
    const left = M(Z2 * M(aX2 + Y2));
    const right = M(Z4 + M(d * M(X22 * Y2)));
    if (left !== right) return err("bad point: equation left != right (1)");
    const XY = M(X2 * Y);
    const ZT = M(Z * T);
    if (XY !== ZT) return err("bad point: equation left != right (2)");
    return this;
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2);
    const X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2);
    const Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point(M(-this.X), this.Y, this.Z, M(-this.T));
  }
  /** Point doubling. Complete formula. Cost: `4M + 4S + 1*a + 6add + 1*2`. */
  double() {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const a = _a;
    const A = M(X1 * X1);
    const B = M(Y1 * Y1);
    const C3 = M(2n * M(Z1 * Z1));
    const D = M(a * A);
    const x1y1 = X1 + Y1;
    const E = M(M(x1y1 * x1y1) - A - B);
    const G3 = D + B;
    const F = G3 - C3;
    const H = D - B;
    const X3 = M(E * F);
    const Y3 = M(G3 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G3);
    return new _Point(X3, Y3, Z3, T3);
  }
  /** Point addition. Complete formula. Cost: `8M + 1*k + 8add + 1*2`. */
  add(other) {
    const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
    const { X: X2, Y: Y2, Z: Z2, T: T2 } = apoint(other);
    const a = _a;
    const d = _d;
    const A = M(X1 * X2);
    const B = M(Y1 * Y2);
    const C3 = M(T1 * d * T2);
    const D = M(Z1 * Z2);
    const E = M((X1 + Y1) * (X2 + Y2) - A - B);
    const F = M(D - C3);
    const G3 = M(D + C3);
    const H = M(B - a * A);
    const X3 = M(E * F);
    const Y3 = M(G3 * H);
    const T3 = M(E * H);
    const Z3 = M(F * G3);
    return new _Point(X3, Y3, Z3, T3);
  }
  subtract(other) {
    return this.add(apoint(other).negate());
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n, safe = true) {
    if (!safe && (n === 0n || this.is0())) return I;
    assertRange(n, 1n, N);
    if (n === 1n) return this;
    if (this.equals(G)) return wNAF(n).p;
    let p = I;
    let f = G;
    for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n) p = p.add(d);
      else if (safe) f = f.add(d);
    }
    return p;
  }
  multiplyUnsafe(scalar) {
    return this.multiply(scalar, false);
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { X: X2, Y, Z } = this;
    if (this.equals(I)) return {
      x: 0n,
      y: 1n
    };
    const iz = invert(Z, P);
    if (M(Z * iz) !== 1n) err("invalid inverse");
    const x = M(X2 * iz);
    const y = M(Y * iz);
    return {
      x,
      y
    };
  }
  toBytes() {
    const { x, y } = this.assertValidity().toAffine();
    const b = numTo32bLE(y);
    b[31] |= x & 1n ? 128 : 0;
    return b;
  }
  toHex() {
    return bytesToHex(this.toBytes());
  }
  clearCofactor() {
    return this.multiply(big(h), false);
  }
  isSmallOrder() {
    return this.clearCofactor().is0();
  }
  isTorsionFree() {
    let p = this.multiply(N / 2n, false).double();
    if (N % 2n) p = p.add(this);
    return p.is0();
  }
};
var G = new Point(Gx, Gy, 1n, M(Gx * Gy));
var I = new Point(0n, 1n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var numTo32bLE = (num) => hexToBytes(padh(assertRange(num, 0n, B256), L2)).reverse();
var bytesToNumLE = (b) => big("0x" + bytesToHex(u8fr(abytes(b)).reverse()));
var pow2 = (x, power) => {
  let r = x;
  while (power-- > 0n) {
    r *= r;
    r %= P;
  }
  return r;
};
var pow_2_252_3 = (x) => {
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, 2n) * b2 % P;
  const b5 = pow2(b4, 1n) * x % P;
  const b10 = pow2(b5, 5n) * b5 % P;
  const b20 = pow2(b10, 10n) * b10 % P;
  const b40 = pow2(b20, 20n) * b20 % P;
  const b80 = pow2(b40, 40n) * b40 % P;
  const b160 = pow2(b80, 80n) * b80 % P;
  const b240 = pow2(b160, 80n) * b80 % P;
  const b250 = pow2(b240, 10n) * b10 % P;
  const pow_p_5_8 = pow2(b250, 2n) * x % P;
  return {
    pow_p_5_8,
    b2
  };
};
var RM1 = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n;
var uvRatio = (u, v) => {
  const v3 = M(v * v * v);
  const v7 = M(v3 * v3 * v);
  const pow = pow_2_252_3(u * v7).pow_p_5_8;
  let x = M(u * v3 * pow);
  const vx2 = M(v * x * x);
  const root1 = x;
  const root2 = M(x * RM1);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === M(-u);
  const noRoot = vx2 === M(-u * RM1);
  if (useRoot1) x = root1;
  if (useRoot2 || noRoot) x = root2;
  if ((M(x) & 1n) === 1n) x = M(-x);
  return {
    isValid: useRoot1 || useRoot2,
    value: x
  };
};
var modL_LE = (hash) => modN(bytesToNumLE(hash));
var sha512s = (...m) => callHash("sha512")(concatBytes(...m));
var hash2extK = (hashed) => {
  const head = hashed.slice(0, L);
  head[0] &= 248;
  head[31] &= 127;
  head[31] |= 64;
  const prefix = hashed.slice(L, L2);
  const scalar = modL_LE(head);
  const point = G.multiply(scalar);
  const pointBytes = point.toBytes();
  return {
    head,
    prefix,
    scalar,
    point,
    pointBytes
  };
};
var getExtendedPublicKey = (secretKey) => hash2extK(sha512s(abytes(secretKey, L)));
var getPublicKey = (priv) => getExtendedPublicKey(priv).pointBytes;
var hashes = {
  sha512Async: async (message) => {
    const s = subtle();
    const m = concatBytes(message);
    return u8n(await s.digest("SHA-512", m.buffer));
  },
  sha512: void 0
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p = G;
  let b = p;
  for (let w = 0; w < pwindows; w++) {
    b = p;
    points.push(b);
    for (let i = 1; i < pwindowSize; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows = void 0;
var ctneg = (cnd, p) => {
  const n = p.negate();
  return cnd ? n : p;
};
var wNAF = (n) => {
  const comp = Gpows || (Gpows = precompute());
  let p = I;
  let f = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w = 0; w < pwindows; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven2 = w % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg(isEven2, comp[offF]));
    } else {
      p = p.add(ctneg(isNeg, comp[offP]));
    }
  }
  if (n !== 0n) err("invalid wnaf");
  return {
    p,
    f
  };
};

// deno:https://jsr.io/@noble/hashes/1.8.0/src/crypto.ts
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// deno:https://jsr.io/@noble/hashes/1.8.0/src/utils.ts
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes2(b, ...lengths2) {
  if (!isBytes2(b)) throw new Error("Uint8Array expected");
  if (lengths2.length > 0 && !lengths2.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths2 + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes2(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function utf8ToBytes(str) {
  if (typeof str !== "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string") data = utf8ToBytes(data);
  abytes2(data);
  return data;
}
var Hash = class {
};
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}

// deno:https://jsr.io/@noble/hashes/1.8.0/src/_md.ts
function setBigUint64(view, byteOffset, value, isLE) {
  if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
  const _32n3 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n3 & _u32_max);
  const wl = Number(value & _u32_max);
  const h2 = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view.setUint32(byteOffset + h2, wh, isLE);
  view.setUint32(byteOffset + l, wl, isLE);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class extends Hash {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes2(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++) buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen) to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// deno:https://jsr.io/@noble/hashes/1.8.0/src/_u64.ts
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le) return {
    h: Number(n & U32_MASK64),
    l: Number(n >> _32n & U32_MASK64)
  };
  return {
    h: Number(n >> _32n & U32_MASK64) | 0,
    l: Number(n & U32_MASK64) | 0
  };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h: h2, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [
      h2,
      l
    ];
  }
  return [
    Ah,
    Al
  ];
}
var shrSH = (h2, _l, s) => h2 >>> s;
var shrSL = (h2, l, s) => h2 << 32 - s | l >>> s;
var rotrSH = (h2, l, s) => h2 >>> s | l << 32 - s;
var rotrSL = (h2, l, s) => h2 << 32 - s | l >>> s;
var rotrBH = (h2, l, s) => h2 << 64 - s | l >>> s - 32;
var rotrBL = (h2, l, s) => h2 >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return {
    h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
    l: l | 0
  };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// deno:https://jsr.io/@noble/hashes/1.8.0/src/sha2.ts
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B, C: C3, D, E, F, G: G3, H } = this;
    return [
      A,
      B,
      C3,
      D,
      E,
      F,
      G3,
      H
    ];
  }
  // prettier-ignore
  set(A, B, C3, D, E, F, G3, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C3 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G3 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W22 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W22, 17) ^ rotr(W22, 19) ^ W22 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C: C3, D, E, F, G: G3, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G3) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C3) | 0;
      H = G3;
      G3 = F;
      F = E;
      E = D + T1 | 0;
      D = C3;
      C3 = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C3 = C3 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G3 = G3 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C3, D, E, F, G3, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // h -- high 32 bits, l -- low 32 bits
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor(outputLen = 64) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [
      Ah,
      Al,
      Bh,
      Bl,
      Ch,
      Cl,
      Dh,
      Dl,
      Eh,
      El,
      Fh,
      Fl,
      Gh,
      Gl,
      Hh,
      Hl
    ];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
var sha512 = /* @__PURE__ */ createHasher(() => new SHA512());

// deno:https://jsr.io/@noble/hashes/1.8.0/src/sha512.ts
var sha5122 = sha512;

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/isNumber.ts
var isNumber_default = (value) => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/isString.ts
var isString = (value) => {
  return typeof value === "string";
};
var isString_default = isString;

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/CryptoNames.ts
var cryptoNames = [
  "Ed25519",
  "ECDSA",
  "Schnorr"
];
var isCryptoIndex = (value) => {
  return isNumber_default(value) && value >= 0 && value < cryptoNames.length;
};
var parseCryptoIndex = (s) => {
  const index = parseInt(s, 10);
  if (isCryptoIndex(index) === false) {
    throw new Error("Invalid Crypto index");
  }
  return index;
};

// deno:https://jsr.io/@scure/bip39/2.0.1/src/wordlists/english.ts
var wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n");

// deno:https://jsr.io/@noble/hashes/2.0.1/src/utils.ts
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes3(value, length, title = "") {
  const bytes = isBytes3(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function ahash(h2) {
  if (typeof h2 !== "function" || typeof h2.create !== "function") throw new Error("Hash must wrapped by utils.createHasher");
  anumber(h2.outputLen);
  anumber(h2.blockLen);
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
function aoutput2(out, instance) {
  abytes3(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}
function clean2(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr2(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({
  length: 256
}, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex2(bytes) {
  abytes3(bytes);
  if (hasHexBuiltin) return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
var asciis = {
  _0: 48,
  _9: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin) return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string") throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function kdfInputToBytes(data, errorTitle = "") {
  if (typeof data === "string") return utf8ToBytes2(data);
  return abytes3(data, void 0, errorTitle);
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes3(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function checkOpts(defaults, opts) {
  if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]") throw new Error("options must be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function createHasher2(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
function randomBytes(bytesLength = 32) {
  const cr3 = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr3?.getRandomValues !== "function") throw new Error("crypto.getRandomValues must be defined");
  return cr3.getRandomValues(new Uint8Array(bytesLength));
}
var oidNist = (suffix) => ({
  oid: Uint8Array.from([
    6,
    9,
    96,
    134,
    72,
    1,
    101,
    3,
    4,
    2,
    suffix
  ])
});

// deno:https://jsr.io/@noble/hashes/2.0.1/src/hmac.ts
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes3(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function") throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++) pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean2(pad);
  }
  update(buf) {
    aexists2(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists2(this);
    abytes3(out, this.outputLen, "output");
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new _HMAC(hash, key);

// deno:https://jsr.io/@noble/hashes/2.0.1/src/pbkdf2.ts
function pbkdf2Init(hash, _password, _salt, _opts) {
  ahash(hash);
  const opts = checkOpts({
    dkLen: 32,
    asyncTick: 10
  }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c, "c");
  anumber(dkLen, "dkLen");
  anumber(asyncTick, "asyncTick");
  if (c < 1) throw new Error("iterations (c) must be >= 1");
  const password = kdfInputToBytes(_password, "password");
  const salt = kdfInputToBytes(_salt, "salt");
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return {
    c,
    dkLen,
    asyncTick,
    DK,
    PRF,
    PRFSalt
  };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW) prfW.destroy();
  clean2(u);
  return DK;
}
function pbkdf2(hash, password, salt, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView2(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++) Ti[i] ^= u[i];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// deno:https://jsr.io/@noble/hashes/2.0.1/src/_md.ts
function Chi2(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj2(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD2 = class {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView2(this.buffer);
  }
  update(data) {
    aexists2(this);
    abytes3(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView2(data);
        for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists2(this);
    aoutput2(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean2(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++) buffer[i] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView2(out);
    const len = this.outputLen;
    if (len % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen) to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV2 = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV2 = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// deno:https://jsr.io/@noble/hashes/2.0.1/src/_u64.ts
var U32_MASK642 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n2 = /* @__PURE__ */ BigInt(32);
function fromBig2(n, le = false) {
  if (le) return {
    h: Number(n & U32_MASK642),
    l: Number(n >> _32n2 & U32_MASK642)
  };
  return {
    h: Number(n >> _32n2 & U32_MASK642) | 0,
    l: Number(n & U32_MASK642) | 0
  };
}
function split2(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h: h2, l } = fromBig2(lst[i], le);
    [Ah[i], Al[i]] = [
      h2,
      l
    ];
  }
  return [
    Ah,
    Al
  ];
}
var shrSH2 = (h2, _l, s) => h2 >>> s;
var shrSL2 = (h2, l, s) => h2 << 32 - s | l >>> s;
var rotrSH2 = (h2, l, s) => h2 >>> s | l << 32 - s;
var rotrSL2 = (h2, l, s) => h2 << 32 - s | l >>> s;
var rotrBH2 = (h2, l, s) => h2 << 64 - s | l >>> s - 32;
var rotrBL2 = (h2, l, s) => h2 >>> s - 32 | l << 64 - s;
function add2(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return {
    h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
    l: l | 0
  };
}
var add3L2 = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H2 = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L2 = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H2 = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L2 = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H2 = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// deno:https://jsr.io/@noble/hashes/2.0.1/src/sha2.ts
var SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD2 {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B, C: C3, D, E, F, G: G3, H } = this;
    return [
      A,
      B,
      C3,
      D,
      E,
      F,
      G3,
      H
    ];
  }
  // prettier-ignore
  set(A, B, C3, D, E, F, G3, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C3 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G3 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) SHA256_W2[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W2[i - 15];
      const W22 = SHA256_W2[i - 2];
      const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
      const s1 = rotr2(W22, 17) ^ rotr2(W22, 19) ^ W22 >>> 10;
      SHA256_W2[i] = s1 + SHA256_W2[i - 7] + s0 + SHA256_W2[i - 16] | 0;
    }
    let { A, B, C: C3, D, E, F, G: G3, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr2(E, 6) ^ rotr2(E, 11) ^ rotr2(E, 25);
      const T1 = H + sigma1 + Chi2(E, F, G3) + SHA256_K2[i] + SHA256_W2[i] | 0;
      const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
      const T2 = sigma0 + Maj2(A, B, C3) | 0;
      H = G3;
      G3 = F;
      F = E;
      E = D + T1 | 0;
      D = C3;
      C3 = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C3 = C3 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G3 = G3 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C3, D, E, F, G3, H);
  }
  roundClean() {
    clean2(SHA256_W2);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean2(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV2[0] | 0;
  B = SHA256_IV2[1] | 0;
  C = SHA256_IV2[2] | 0;
  D = SHA256_IV2[3] | 0;
  E = SHA256_IV2[4] | 0;
  F = SHA256_IV2[5] | 0;
  G = SHA256_IV2[6] | 0;
  H = SHA256_IV2[7] | 0;
  constructor() {
    super(32);
  }
};
var K5122 = /* @__PURE__ */ (() => split2([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh2 = /* @__PURE__ */ (() => K5122[0])();
var SHA512_Kl2 = /* @__PURE__ */ (() => K5122[1])();
var SHA512_W_H2 = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L2 = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD2 {
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [
      Ah,
      Al,
      Bh,
      Bl,
      Ch,
      Cl,
      Dh,
      Dl,
      Eh,
      El,
      Fh,
      Fl,
      Gh,
      Gl,
      Hh,
      Hl
    ];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H2[i] = view.getUint32(offset);
      SHA512_W_L2[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H2[i - 15] | 0;
      const W15l = SHA512_W_L2[i - 15] | 0;
      const s0h = rotrSH2(W15h, W15l, 1) ^ rotrSH2(W15h, W15l, 8) ^ shrSH2(W15h, W15l, 7);
      const s0l = rotrSL2(W15h, W15l, 1) ^ rotrSL2(W15h, W15l, 8) ^ shrSL2(W15h, W15l, 7);
      const W2h = SHA512_W_H2[i - 2] | 0;
      const W2l = SHA512_W_L2[i - 2] | 0;
      const s1h = rotrSH2(W2h, W2l, 19) ^ rotrBH2(W2h, W2l, 61) ^ shrSH2(W2h, W2l, 6);
      const s1l = rotrSL2(W2h, W2l, 19) ^ rotrBL2(W2h, W2l, 61) ^ shrSL2(W2h, W2l, 6);
      const SUMl = add4L2(s0l, s1l, SHA512_W_L2[i - 7], SHA512_W_L2[i - 16]);
      const SUMh = add4H2(SUMl, s0h, s1h, SHA512_W_H2[i - 7], SHA512_W_H2[i - 16]);
      SHA512_W_H2[i] = SUMh | 0;
      SHA512_W_L2[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH2(Eh, El, 14) ^ rotrSH2(Eh, El, 18) ^ rotrBH2(Eh, El, 41);
      const sigma1l = rotrSL2(Eh, El, 14) ^ rotrSL2(Eh, El, 18) ^ rotrBL2(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L2(Hl, sigma1l, CHIl, SHA512_Kl2[i], SHA512_W_L2[i]);
      const T1h = add5H2(T1ll, Hh, sigma1h, CHIh, SHA512_Kh2[i], SHA512_W_H2[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH2(Ah, Al, 28) ^ rotrBH2(Ah, Al, 34) ^ rotrBH2(Ah, Al, 39);
      const sigma0l = rotrSL2(Ah, Al, 28) ^ rotrBL2(Ah, Al, 34) ^ rotrBL2(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add2(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L2(T1l, sigma0l, MAJl);
      Ah = add3H2(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add2(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add2(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add2(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add2(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add2(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add2(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add2(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add2(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean2(SHA512_W_H2, SHA512_W_L2);
  }
  destroy() {
    clean2(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  Ah = SHA512_IV2[0] | 0;
  Al = SHA512_IV2[1] | 0;
  Bh = SHA512_IV2[2] | 0;
  Bl = SHA512_IV2[3] | 0;
  Ch = SHA512_IV2[4] | 0;
  Cl = SHA512_IV2[5] | 0;
  Dh = SHA512_IV2[6] | 0;
  Dl = SHA512_IV2[7] | 0;
  Eh = SHA512_IV2[8] | 0;
  El = SHA512_IV2[9] | 0;
  Fh = SHA512_IV2[10] | 0;
  Fl = SHA512_IV2[11] | 0;
  Gh = SHA512_IV2[12] | 0;
  Gl = SHA512_IV2[13] | 0;
  Hh = SHA512_IV2[14] | 0;
  Hl = SHA512_IV2[15] | 0;
  constructor() {
    super(64);
  }
};
var sha2562 = /* @__PURE__ */ createHasher2(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
var sha5123 = /* @__PURE__ */ createHasher2(() => new _SHA512(), /* @__PURE__ */ oidNist(3));

// deno:https://jsr.io/@scure/base/2.0.0/index.ts
function isBytes4(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function isArrayOf(isString2, arr) {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return true;
  if (isString2) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function") throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string") throw new Error(`${label}: string expected`);
  return true;
}
function anumber2(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input)) throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input)) throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input)) throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode2 = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode2 = args.map((x) => x.decode).reduce(wrap, id);
  return {
    encode: encode2,
    decode: decode2
  };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [
    l,
    i
  ]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len) throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0) throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber2(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8) data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8) throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0) throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function convertRadix(data, from, to) {
  if (from < 2) throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
  if (to < 2) throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
  aArr(data);
  if (!data.length) return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber2(d);
    if (d < 0 || d >= from) throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to;
      carry = digitBase % to;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase) throw new Error("convertRadix: carry overflow");
      if (!done) continue;
      else if (!rounded) pos = i;
      else done = false;
    }
    res.push(carry);
    if (done) break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++) res.push(0);
  return res.reverse();
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++) res.push(2 ** i);
  return res;
})();
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber2(n);
    if (n >= max) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0) throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from) throw new Error("Excess padding");
  if (!padding2 && carry > 0) throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0) res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix(num) {
  anumber2(num);
  const _256 = 2 ** 8;
  return {
    encode: (bytes) => {
      if (!isBytes4(bytes)) throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes), _256, num);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num, _256));
    }
  };
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber2(bits);
  if (bits <= 0 || bits > 32) throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32) throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes4(bytes)) throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function checksum(len, fn2) {
  anumber2(len);
  afn(fn2);
  return {
    encode(data) {
      if (!isBytes4(data)) throw new Error("checksum.encode: input should be Uint8Array");
      const sum = fn2(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes4(data)) throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = fn2(payload).slice(0, len);
      for (let i = 0; i < len; i++) if (newChecksum[i] !== oldChecksum[i]) throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var utils = {
  alphabet,
  chain,
  checksum,
  convertRadix,
  convertRadix2,
  radix,
  radix2,
  join,
  padding
};
var genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
var base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
var createBase58check = (sha2563) => /* @__PURE__ */ chain(checksum(4, (data) => sha2563(sha2563(data))), base58);

// deno:https://jsr.io/@scure/bip39/2.0.1/src/index.ts
var isJapanese = (wordlist2) => wordlist2[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
function nfkd(str) {
  if (typeof str !== "string") throw new TypeError("invalid mnemonic type: " + typeof str);
  return str.normalize("NFKD");
}
function normalize(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![
    12,
    15,
    18,
    21,
    24
  ].includes(words.length)) throw new Error("Invalid mnemonic");
  return {
    nfkd: norm,
    words
  };
}
function aentropy(ent) {
  abytes3(ent);
  if (![
    16,
    20,
    24,
    28,
    32
  ].includes(ent.length)) throw new Error("invalid entropy length");
}
function generateMnemonic(wordlist2, strength = 128) {
  anumber(strength);
  if (strength % 32 !== 0 || strength > 256) throw new TypeError("Invalid entropy");
  return entropyToMnemonic(randomBytes(strength / 8), wordlist2);
}
var calcChecksum = (entropy) => {
  const bitsLeft = 8 - entropy.length / 4;
  return new Uint8Array([
    sha2562(entropy)[0] >> bitsLeft << bitsLeft
  ]);
};
function getCoder(wordlist2) {
  if (!Array.isArray(wordlist2) || wordlist2.length !== 2048 || typeof wordlist2[0] !== "string") throw new Error("Wordlist: expected array of 2048 strings");
  wordlist2.forEach((i) => {
    if (typeof i !== "string") throw new Error("wordlist: non-string element: " + i);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist2));
}
function entropyToMnemonic(entropy, wordlist2) {
  aentropy(entropy);
  const words = getCoder(wordlist2).encode(entropy);
  return words.join(isJapanese(wordlist2) ? "\u3000" : " ");
}
var psalt = (passphrase) => nfkd("mnemonic" + passphrase);
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha5123, normalize(mnemonic).nfkd, psalt(passphrase), {
    c: 2048,
    dkLen: 64
  });
}

// deno:https://jsr.io/@noble/curves/2.0.1/src/utils.ts
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
function abool(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n)) throw new Error("positive bigint expected, got " + n);
  } else anumber(n);
  return n;
}
function numberToHexUnpadded(num) {
  const hex = abignumber(num).toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex2(copyBytes(abytes3(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber(len);
  n = abignumber(n);
  const res = hexToBytes2(n.toString(16).padStart(len * 2, "0"));
  if (res.length !== len) throw new Error("number too large");
  return res;
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
function asciiToBytes(ascii) {
  return Uint8Array.from(ascii, (c, i) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127) {
      throw new Error(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
    }
    return charCode;
  });
}
var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max)) throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1) ;
  return len;
}
var bitMask = (n) => (_1n << BigInt(n)) - _1n;
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber(hashLen, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function") throw new Error("hmacFn must be a function");
  const u8n3 = (len) => new Uint8Array(len);
  const NULL2 = Uint8Array.of();
  const byte02 = Uint8Array.of(0);
  const byte12 = Uint8Array.of(1);
  const _maxDrbgIters2 = 1e3;
  let v = u8n3(hashLen);
  let k = u8n3(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h2 = (...msgs) => hmacFn(k, concatBytes2(v, ...msgs));
  const reseed = (seed = NULL2) => {
    k = h2(byte02, seed);
    v = h2();
    if (seed.length === 0) return;
    k = h2(byte12, seed);
    v = h2();
  };
  const gen = () => {
    if (i++ >= _maxDrbgIters2) throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h2();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen()))) reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, fields = {}, optFields = {}) {
  if (!object || typeof object !== "object") throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0) return;
    const current = typeof val;
    if (current !== expectedType || val === null) throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}
function memoized(fn2) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0) return val;
    const computed = fn2(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

// deno:https://jsr.io/@noble/curves/2.0.1/src/abstract/modular.ts
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow22(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert2(number, modulo) {
  if (number === _0n2) throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2) throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q8 = b / a;
    const r = b % a;
    const m = x - u * q8;
    const n = y - v * q8;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n2) throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
  if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n2) / _4n;
  const root = Fp.pow(n, p1div4);
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt9mod16(P3) {
  const Fp_ = Field(P3);
  const tn = tonelliShanks(P3);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P3 + _7n) / _16n;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root = Fp.cmov(tv1, tv2, e3);
    assertIsSquare(Fp, root, n);
    return root;
  };
}
function tonelliShanks(P3) {
  if (P3 < _3n) throw new Error("sqrt is not defined for small field");
  let Q = P3 - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P3);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1) return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n)) return n;
    if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
    let M3 = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t)) return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M3) throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M3 - i - 1);
      const b = Fp.pow(c, exponent);
      M3 = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P3) {
  if (P3 % _4n === _3n) return sqrt3mod4;
  if (P3 % _8n === _5n) return sqrt5mod8;
  if (P3 % _16n === _9n) return sqrt9mod16(P3);
  return tonelliShanks(P3);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  validateObject(field, opts);
  return field;
}
function FpPow(Fp, num, power) {
  if (power < _0n2) throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2) return Fp.ONE;
  if (power === _1n2) return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2) p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num)) return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num)) return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n2) / _2n;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0) anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return {
    nBitLength: _nBitLength,
    nByteLength
  };
}
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _sqrt;
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _0n2) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number") _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function") this.sqrt = opts.sqrt;
      if (typeof opts.isLE === "boolean") this.isLE = opts.isLE;
      if (opts.allowedLengths) this._lengths = opts.allowedLengths?.slice();
      if (typeof opts.modFromBytes === "boolean") this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    this._sqrt = void 0;
    Object.preventExtensions(this);
  }
  create(num) {
    return mod(num, this.ORDER);
  }
  isValid(num) {
    if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
    return _0n2 <= num && num < this.ORDER;
  }
  is0(num) {
    return num === _0n2;
  }
  // is valid and invertible
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  isOdd(num) {
    return (num & _1n2) === _1n2;
  }
  neg(num) {
    return mod(-num, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num) {
    return mod(num * num, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  div(lhs, rhs) {
    return mod(lhs * invert2(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num) {
    return num * num;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num) {
    return invert2(num, this.ORDER);
  }
  sqrt(num) {
    if (!this._sqrt) this._sqrt = FpSqrt(this.ORDER);
    return this._sqrt(this, num);
  }
  toBytes(num) {
    return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes3(bytes);
    const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes) scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    return condition ? b : a;
  }
};
function Field(ORDER, opts = {}) {
  return new _Field(ORDER, opts);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
  abytes3(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024) throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// deno:https://jsr.io/@noble/curves/2.0.1/src/abstract/curve.ts
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W3, bits) {
  if (!Number.isSafeInteger(W3) || W3 <= 0 || W3 > bits) throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W3);
}
function calcWOpts(W3, scalarBits3) {
  validateW(W3, scalarBits3);
  const windows = Math.ceil(scalarBits3 / W3) + 1;
  const windowSize = 2 ** (W3 - 1);
  const maxNumber = 2 ** W3;
  const mask = bitMask(W3);
  const shiftBy = BigInt(W3);
  return {
    windows,
    windowSize,
    mask,
    maxNumber,
    shiftBy
  };
}
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  const offsetF = offsetStart;
  return {
    nextN,
    offset,
    isZero,
    isNeg,
    isNegF,
    offsetF
  };
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P3) {
  return pointWindowSizes.get(P3) || 1;
}
function assert0(n) {
  if (n !== _0n3) throw new Error("invalid wNAF");
}
var wNAF2 = class {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point4, bits) {
    this.BASE = Point4.BASE;
    this.ZERO = Point4.ZERO;
    this.Fn = Point4.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d = elm;
    while (n > _0n3) {
      if (n & _1n3) p = p.add(d);
      d = d.double();
      n >>= _1n3;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W3) {
    const { windows, windowSize } = calcWOpts(W3, this.bits);
    const points = [];
    let p = point;
    let base = p;
    for (let window = 0; window < windows; window++) {
      base = p;
      points.push(base);
      for (let i = 1; i < windowSize; i++) {
        base = base.add(p);
        points.push(base);
      }
      p = base.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W3, precomputes, n) {
    if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W3, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return {
      p,
      f
    };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W3, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W3, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      if (n === _0n3) break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W3, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W3);
      if (W3 !== 1) {
        if (typeof transform === "function") comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W3 = getW(point);
    return this.wNAF(W3, this.getPrecomputes(W3, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W3 = getW(point);
    if (W3 === 1) return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W3, this.getPrecomputes(W3, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P3, W3) {
    validateW(W3, this.bits);
    pointWindowSizes.set(P3, W3);
    pointPrecomputes.delete(P3);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
function mulEndoUnsafe(Point4, point, k1, k2) {
  let acc = point;
  let p1 = Point4.ZERO;
  let p2 = Point4.ZERO;
  while (k1 > _0n3 || k2 > _0n3) {
    if (k1 & _1n3) p1 = p1.add(acc);
    if (k2 & _1n3) p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n3;
    k2 >>= _1n3;
  }
  return {
    p1,
    p2
  };
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, {
      isLE
    });
  }
}
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0) FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
  for (const p of [
    "p",
    "n",
    "h"
  ]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n3)) throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b2 = type === "weierstrass" ? "b" : "d";
  const params = [
    "Gx",
    "Gy",
    "a",
    _b2
  ];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return {
    CURVE,
    Fp,
    Fn: Fn2
  };
}
function createKeygen(randomSecretKey2, getPublicKey4) {
  return function keygen3(seed) {
    const secretKey = randomSecretKey2(seed);
    return {
      secretKey,
      publicKey: getPublicKey4(secretKey)
    };
  };
}

// deno:https://jsr.io/@noble/curves/2.0.1/src/abstract/hash-to-curve.ts
var _DST_scalar = asciiToBytes("HashToScalar-");

// deno:https://jsr.io/@noble/curves/2.0.1/src/abstract/weierstrass.ts
var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n2) / den;
function _splitEndoScalar(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n4;
  const k2neg = k2 < _0n4;
  if (k1neg) k1 = -k1;
  if (k2neg) k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n4 || k1 >= MAX_NUM || k2 < _0n4 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  }
  return {
    k1neg,
    k1,
    k2neg,
    k2
  };
}
function validateSigFormat(format) {
  if (![
    "compact",
    "recovered",
    "der"
  ].includes(format)) throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0) validateSigFormat(optsn.format);
  return optsn;
}
var DERErr = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
var DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const { Err: E } = DER;
      if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
      if (data.length & 1) throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128) throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag) throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong) length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen) throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4) throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen) throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0) throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes) length = length << 8 | b;
        pos += lenLen;
        if (length < 128) throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length) throw new E("tlv.decode: wrong value length");
      return {
        v,
        l: data.subarray(pos + length)
      };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const { Err: E } = DER;
      if (num < _0n4) throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8) hex = "00" + hex;
      if (hex.length & 1) throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128) throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128)) throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(bytes) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = abytes3(bytes, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
    return {
      r: int.decode(rBytes),
      s: int.decode(sBytes)
    };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n2 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn: Fn2 } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths2 = getWLengths(Fp, Fn2);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes2(pprefix(hasEvenY), bx);
    } else {
      return concatBytes2(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  function pointFromBytes(bytes) {
    abytes3(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths2;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err3 = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err3);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY) y = Fp.neg(y);
      return {
        x,
        y
      };
    } else if (length === uncomp && head === 4) {
      const L4 = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L4));
      const y = Fp.fromBytes(tail.subarray(L4, L4 * 2));
      if (!isValidXY(x, y)) throw new Error("bad point: is not on curve");
      return {
        x,
        y
      };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes || pointToBytes;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n)) throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point4)) throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises) throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn2.ORDER);
  }
  const toAffineMemo = memoized((p, iz) => {
    const { X: X2, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE)) return {
      x: X2,
      y: Y
    };
    const is0 = p.is0();
    if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X2, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0) return {
      x: Fp.ZERO,
      y: Fp.ZERO
    };
    if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
    return {
      x,
      y
    };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y)) return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point4(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point4 {
    // base / generator point
    static BASE = new Point4(CURVE.Gx, CURVE.Gy, Fp.ONE);
    // zero / infinity / identity point
    static ZERO = new Point4(Fp.ZERO, Fp.ONE, Fp.ZERO);
    // math field
    static Fp = Fp;
    // scalar field
    static Fn = Fn2;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X2, Y, Z) {
      this.X = acoord("x", X2);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
      if (p instanceof Point4) throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y)) return Point4.ZERO;
      return new Point4(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P3 = Point4.fromAffine(decodePoint(abytes3(bytes, void 0, "point")));
      P3.assertValidity();
      return P3;
    }
    static fromHex(hex) {
      return Point4.fromBytes(hexToBytes2(hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy) this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd) throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point4(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point4(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point4(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point4.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2 } = extraOpts;
      if (!Fn2.isValidNot0(scalar)) throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point4, p));
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ(Point4, [
        point,
        fake
      ])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p = this;
      if (!Fn2.isValid(sc)) throw new Error("invalid scalar: out of range");
      if (sc === _0n4 || p.is0()) return Point4.ZERO;
      if (sc === _1n4) return p;
      if (wnaf.hasCache(this)) return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point4, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n4) return true;
      if (isTorsionFree) return isTorsionFree(Point4, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n4) return this;
      if (clearCofactor) return clearCofactor(Point4, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point4, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex2(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const bits = Fn2.BITS;
  const wnaf = new wNAF2(Point4, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point4.BASE.precompute(8);
  return Point4;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn2) {
  return {
    secretKey: Fn2.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn2.BYTES
  };
}
function ecdh(Point4, ecdhOpts = {}) {
  const { Fn: Fn2 } = Point4;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
  const lengths2 = Object.assign(getWLengths(Point4.Fp, Fn2), {
    seed: getMinHashLength(Fn2.ORDER)
  });
  function isValidSecretKey(secretKey) {
    try {
      const num = Fn2.fromBytes(secretKey);
      return Fn2.isValidNot0(num);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths2;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp) return false;
      if (isCompressed === false && l !== publicKeyUncompressed) return false;
      return !!Point4.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  function randomSecretKey2(seed = randomBytes_(lengths2.seed)) {
    return mapHashToField(abytes3(seed, lengths2.seed, "seed"), Fn2.ORDER);
  }
  function getPublicKey4(secretKey, isCompressed = true) {
    return Point4.BASE.multiply(Fn2.fromBytes(secretKey)).toBytes(isCompressed);
  }
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths2;
    if (!isBytes3(item)) return void 0;
    if ("_lengths" in Fn2 && Fn2._lengths || secretKey === publicKey) return void 0;
    const l = abytes3(item, void 0, "key").length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true) throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false) throw new Error("second arg must be public key");
    const s = Fn2.fromBytes(secretKeyA);
    const b = Point4.fromBytes(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  const utils2 = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey: randomSecretKey2
  };
  const keygen3 = createKeygen(randomSecretKey2, getPublicKey4);
  return Object.freeze({
    getPublicKey: getPublicKey4,
    getSharedSecret,
    keygen: keygen3,
    Point: Point4,
    utils: utils2,
    lengths: lengths2
  });
}
function ecdsa(Point4, hash, ecdsaOpts = {}) {
  ahash(hash);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  ecdsaOpts = Object.assign({}, ecdsaOpts);
  const randomBytes3 = ecdsaOpts.randomBytes || randomBytes;
  const hmac2 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
  const { Fp, Fn: Fn2 } = Point4;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn2;
  const { keygen: keygen3, getPublicKey: getPublicKey4, getSharedSecret, utils: utils2, lengths: lengths2 } = ecdh(Point4, ecdsaOpts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeCofactor = CURVE_ORDER * _2n2 < Fp.ORDER;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n4;
    return number > HALF;
  }
  function validateRS(title, num) {
    if (!Fn2.isValidNot0(num)) throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num;
  }
  function assertSmallCofactor() {
    if (hasLargeCofactor) throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths2.signature;
    const sizer = format === "compact" ? size : format === "recovered" ? size + 1 : void 0;
    return abytes3(bytes, sizer);
  }
  class Signature2 {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertSmallCofactor();
        if (![
          0,
          1,
          2,
          3
        ].includes(recovery)) throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r: r2, s: s2 } = DER.toSig(abytes3(bytes));
        return new Signature2(r2, s2);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L4 = lengths2.signature / 2;
      const r = bytes.subarray(0, L4);
      const s = bytes.subarray(L4, L4 * 2);
      return new Signature2(Fn2.fromBytes(r), Fn2.fromBytes(s), recid);
    }
    static fromHex(hex, format) {
      return this.fromBytes(hexToBytes2(hex), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null) throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature2(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj)) throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point4.fromBytes(concatBytes2(pprefix((recovery & 1) === 0), x));
      const ir = Fn2.inv(radj);
      const h2 = bits2int_modN2(abytes3(messageHash, void 0, "msgHash"));
      const u1 = Fn2.create(-h2 * ir);
      const u2 = Fn2.create(s * ir);
      const Q = Point4.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0()) throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der") return hexToBytes2(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn2.toBytes(r);
      const sb = Fn2.toBytes(s);
      if (format === "recovered") {
        assertSmallCofactor();
        return concatBytes2(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes2(rb, sb);
    }
    toHex(format) {
      return bytesToHex2(this.toBytes(format));
    }
  }
  const bits2int2 = ecdsaOpts.bits2int || function bits2int_def(bytes) {
    if (bytes.length > 8192) throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN2 = ecdsaOpts.bits2int_modN || function bits2int_modN_def(bytes) {
    return Fn2.create(bits2int2(bytes));
  };
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num) {
    aInRange("num < 2^" + fnBits, num, _0n4, ORDER_MASK);
    return Fn2.toBytes(num);
  }
  function validateMsgAndHash(message, prehash) {
    abytes3(message, void 0, "message");
    return prehash ? abytes3(hash(message), void 0, "prehashed message") : message;
  }
  function prepSig(message, secretKey, opts) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN2(message);
    const d = Fn2.fromBytes(secretKey);
    if (!Fn2.isValidNot0(d)) throw new Error("invalid private key");
    const seedArgs = [
      int2octets(d),
      int2octets(h1int)
    ];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes3(lengths2.secretKey) : extraEntropy;
      seedArgs.push(abytes3(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int2(kBytes);
      if (!Fn2.isValidNot0(k)) return;
      const ik = Fn2.inv(k);
      const q8 = Point4.BASE.multiply(k).toAffine();
      const r = Fn2.create(q8.x);
      if (r === _0n4) return;
      const s = Fn2.create(ik * Fn2.create(m + r * d));
      if (s === _0n4) return;
      let recovery = (q8.x === r ? 0 : 2) | Number(q8.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn2.neg(s);
        recovery ^= 1;
      }
      return new Signature2(r, normS, hasLargeCofactor ? void 0 : recovery);
    }
    return {
      seed,
      k2sig
    };
  }
  function sign6(message, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg(hash.outputLen, Fn2.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts.format);
  }
  function verify7(signature, message, publicKey, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
    publicKey = abytes3(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes3(signature)) {
      const end = signature instanceof Signature2 ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature2.fromBytes(signature, format);
      const P3 = Point4.fromBytes(publicKey);
      if (lowS && sig.hasHighS()) return false;
      const { r, s } = sig;
      const h2 = bits2int_modN2(message);
      const is2 = Fn2.inv(s);
      const u1 = Fn2.create(h2 * is2);
      const u2 = Fn2.create(r * is2);
      const R = Point4.BASE.multiplyUnsafe(u1).add(P3.multiplyUnsafe(u2));
      if (R.is0()) return false;
      const v = Fn2.create(R.x);
      return v === r;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature2.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen: keygen3,
    getPublicKey: getPublicKey4,
    getSharedSecret,
    utils: utils2,
    lengths: lengths2,
    Point: Point4,
    sign: sign6,
    verify: verify7,
    recoverPublicKey,
    Signature: Signature2,
    hash
  });
}

// deno:https://jsr.io/@noble/curves/2.0.1/src/secp256k1.ts
var secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [
      BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
      -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")
    ],
    [
      BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
      BigInt("0x3086d221a7d46bcde86c90e49284eb15")
    ]
  ]
};
var _2n3 = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P3 = secp256k1_CURVE.p;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P3;
  const b3 = b2 * b2 * y % P3;
  const b6 = pow22(b3, _3n3, P3) * b3 % P3;
  const b9 = pow22(b6, _3n3, P3) * b3 % P3;
  const b11 = pow22(b9, _2n3, P3) * b2 % P3;
  const b22 = pow22(b11, _11n, P3) * b11 % P3;
  const b44 = pow22(b22, _22n, P3) * b22 % P3;
  const b88 = pow22(b44, _44n, P3) * b44 % P3;
  const b176 = pow22(b88, _88n, P3) * b88 % P3;
  const b220 = pow22(b176, _44n, P3) * b44 % P3;
  const b223 = pow22(b220, _3n3, P3) * b3 % P3;
  const t1 = pow22(b223, _23n, P3) * b22 % P3;
  const t2 = pow22(t1, _6n, P3) * b2 % P3;
  const root = pow22(t2, _2n3, P3);
  if (!Fpk1.eql(Fpk1.sqr(root), y)) throw new Error("Cannot find square root");
  return root;
}
var Fpk1 = Field(secp256k1_CURVE.p, {
  sqrt: sqrtMod
});
var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO
});
var secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha2562);

// deno:https://jsr.io/@noble/hashes/2.0.1/src/legacy.ts
var Rho160 = /* @__PURE__ */ Uint8Array.from([
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8
]);
var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
var idxLR = /* @__PURE__ */ (() => {
  const L4 = [
    Id160
  ];
  const R = [
    Pi160
  ];
  const res = [
    L4,
    R
  ];
  for (let i = 0; i < 4; i++) for (let j of res) j.push(j[i].map((k) => Rho160[k]));
  return res;
})();
var idxL = /* @__PURE__ */ (() => idxLR[0])();
var idxR = /* @__PURE__ */ (() => idxLR[1])();
var shifts160 = /* @__PURE__ */ [
  [
    11,
    14,
    15,
    12,
    5,
    8,
    7,
    9,
    11,
    13,
    14,
    15,
    6,
    7,
    9,
    8
  ],
  [
    12,
    13,
    11,
    15,
    6,
    9,
    9,
    7,
    12,
    15,
    11,
    13,
    7,
    8,
    7,
    7
  ],
  [
    13,
    15,
    14,
    11,
    7,
    7,
    6,
    8,
    13,
    14,
    13,
    12,
    5,
    5,
    6,
    9
  ],
  [
    14,
    11,
    12,
    14,
    8,
    6,
    5,
    5,
    15,
    12,
    15,
    14,
    9,
    9,
    8,
    6
  ],
  [
    15,
    12,
    13,
    13,
    9,
    5,
    8,
    6,
    14,
    11,
    12,
    11,
    8,
    6,
    5,
    5
  ]
].map((i) => Uint8Array.from(i));
var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
var Kl160 = /* @__PURE__ */ Uint32Array.from([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]);
var Kr160 = /* @__PURE__ */ Uint32Array.from([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function ripemd_f(group, x, y, z) {
  if (group === 0) return x ^ y ^ z;
  if (group === 1) return x & y | ~x & z;
  if (group === 2) return (x | ~y) ^ z;
  if (group === 3) return x & z | y & ~z;
  return x ^ (y | ~z);
}
var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
var _RIPEMD160 = class extends HashMD2 {
  h0 = 1732584193 | 0;
  h1 = 4023233417 | 0;
  h2 = 2562383102 | 0;
  h3 = 271733878 | 0;
  h4 = 3285377520 | 0;
  constructor() {
    super(64, 20, 8, true);
  }
  get() {
    const { h0, h1, h2, h3, h4 } = this;
    return [
      h0,
      h1,
      h2,
      h3,
      h4
    ];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) BUF_160[i] = view.getUint32(offset, true);
    let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr3 = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group], hbr = Kr160[group];
      const rl = idxL[group], rr = idxR[group];
      const sl = shiftsL160[group], sr = shiftsR160[group];
      for (let i = 0; i < 16; i++) {
        const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
      }
      for (let i = 0; i < 16; i++) {
        const tr = rotl(ar + ripemd_f(rGroup, br, cr3, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = rotl(cr3, 10) | 0, cr3 = br, br = tr;
      }
    }
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr3 | 0);
  }
  roundClean() {
    clean2(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    clean2(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
};
var ripemd160 = /* @__PURE__ */ createHasher2(() => new _RIPEMD160());

// deno:https://jsr.io/@scure/bip32/2.0.1/index.ts
var Point2 = secp256k1.Point;
var { Fn } = Point2;
var base58check = createBase58check(sha2562);
var MASTER_SECRET = Uint8Array.from("Bitcoin seed".split(""), (char) => char.charCodeAt(0));
var BITCOIN_VERSIONS = {
  private: 76066276,
  public: 76067358
};
var HARDENED_OFFSET = 2147483648;
var hash160 = (data) => ripemd160(sha2562(data));
var fromU32 = (data) => createView2(data).getUint32(0, false);
var toU32 = (n) => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
    throw new Error("invalid number, should be from 0 to 2**32-1, got " + n);
  }
  const buf = new Uint8Array(4);
  createView2(buf).setUint32(0, n, false);
  return buf;
};
var HDKey = class _HDKey {
  get fingerprint() {
    if (!this.pubHash) {
      throw new Error("No publicKey set!");
    }
    return fromU32(this.pubHash);
  }
  get identifier() {
    return this.pubHash;
  }
  get pubKeyHash() {
    return this.pubHash;
  }
  get privateKey() {
    return this._privateKey || null;
  }
  get publicKey() {
    return this._publicKey || null;
  }
  get privateExtendedKey() {
    const priv = this._privateKey;
    if (!priv) {
      throw new Error("No private key");
    }
    return base58check.encode(this.serialize(this.versions.private, concatBytes2(Uint8Array.of(0), priv)));
  }
  get publicExtendedKey() {
    if (!this._publicKey) {
      throw new Error("No public key");
    }
    return base58check.encode(this.serialize(this.versions.public, this._publicKey));
  }
  static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
    abytes3(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
    }
    const I3 = hmac(sha5123, MASTER_SECRET, seed);
    const privateKey = I3.slice(0, 32);
    const chainCode = I3.slice(32);
    return new _HDKey({
      versions,
      chainCode,
      privateKey
    });
  }
  static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
    const keyBuffer = base58check.decode(base58key);
    const keyView = createView2(keyBuffer);
    const version = keyView.getUint32(0, false);
    const opt = {
      versions,
      depth: keyBuffer[4],
      parentFingerprint: keyView.getUint32(5, false),
      index: keyView.getUint32(9, false),
      chainCode: keyBuffer.slice(13, 45)
    };
    const key = keyBuffer.slice(45);
    const isPriv = key[0] === 0;
    if (version !== versions[isPriv ? "private" : "public"]) {
      throw new Error("Version mismatch");
    }
    if (isPriv) {
      return new _HDKey({
        ...opt,
        privateKey: key.slice(1)
      });
    } else {
      return new _HDKey({
        ...opt,
        publicKey: key
      });
    }
  }
  static fromJSON(json) {
    return _HDKey.fromExtendedKey(json.xpriv);
  }
  versions;
  depth = 0;
  index = 0;
  chainCode = null;
  parentFingerprint = 0;
  _privateKey;
  _publicKey;
  pubHash;
  constructor(opt) {
    if (!opt || typeof opt !== "object") {
      throw new Error("HDKey.constructor must not be called directly");
    }
    this.versions = opt.versions || BITCOIN_VERSIONS;
    this.depth = opt.depth || 0;
    this.chainCode = opt.chainCode || null;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) {
        throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
      }
    }
    if (this.depth > 255) {
      throw new Error("HDKey: depth exceeds the serializable value 255");
    }
    if (opt.publicKey && opt.privateKey) {
      throw new Error("HDKey: publicKey and privateKey at same time.");
    }
    if (opt.privateKey) {
      if (!secp256k1.utils.isValidSecretKey(opt.privateKey)) throw new Error("Invalid private key");
      this._privateKey = opt.privateKey;
      this._publicKey = secp256k1.getPublicKey(opt.privateKey, true);
    } else if (opt.publicKey) {
      this._publicKey = Point2.fromBytes(opt.publicKey).toBytes(true);
    } else {
      throw new Error("HDKey: no public or private key provided");
    }
    this.pubHash = hash160(this._publicKey);
  }
  derive(path) {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, "").split("/");
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      const m1 = m && m[1];
      if (!m || m.length !== 3 || typeof m1 !== "string") throw new Error("invalid child index: " + c);
      let idx = +m1;
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
        throw new Error("Invalid index");
      }
      if (m[2] === "'") {
        idx += HARDENED_OFFSET;
      }
      child = child.deriveChild(idx);
    }
    return child;
  }
  deriveChild(index) {
    if (!this._publicKey || !this.chainCode) {
      throw new Error("No publicKey or chainCode set");
    }
    let data = toU32(index);
    if (index >= HARDENED_OFFSET) {
      const priv = this._privateKey;
      if (!priv) {
        throw new Error("Could not derive hardened child key");
      }
      data = concatBytes2(Uint8Array.of(0), priv, data);
    } else {
      data = concatBytes2(this._publicKey, data);
    }
    const I3 = hmac(sha5123, this.chainCode, data);
    const childTweak = I3.slice(0, 32);
    const chainCode = I3.slice(32);
    if (!secp256k1.utils.isValidSecretKey(childTweak)) {
      throw new Error("Tweak bigger than curve order");
    }
    const opt = {
      versions: this.versions,
      chainCode,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index
    };
    const ctweak = Fn.fromBytes(childTweak);
    try {
      if (this._privateKey) {
        const added = Fn.create(Fn.fromBytes(this._privateKey) + ctweak);
        if (!Fn.isValidNot0(added)) {
          throw new Error("The tweak was out of range or the resulted private key is invalid");
        }
        opt.privateKey = Fn.toBytes(added);
      } else {
        const added = Point2.fromBytes(this._publicKey).add(Point2.BASE.multiply(ctweak));
        if (added.equals(Point2.ZERO)) {
          throw new Error("The tweak was equal to negative P, which made the result key invalid");
        }
        opt.publicKey = added.toBytes(true);
      }
      return new _HDKey(opt);
    } catch (err3) {
      return this.deriveChild(index + 1);
    }
  }
  sign(hash) {
    if (!this._privateKey) {
      throw new Error("No privateKey set!");
    }
    abytes3(hash, 32);
    return secp256k1.sign(hash, this._privateKey, {
      prehash: false
    });
  }
  verify(hash, signature) {
    abytes3(hash, 32);
    abytes3(signature, 64);
    if (!this._publicKey) {
      throw new Error("No publicKey set!");
    }
    return secp256k1.verify(signature, hash, this._publicKey, {
      prehash: false
    });
  }
  wipePrivateData() {
    if (this._privateKey) {
      this._privateKey.fill(0);
      this._privateKey = void 0;
    }
    return this;
  }
  toJSON() {
    return {
      xpriv: this.privateExtendedKey,
      xpub: this.publicExtendedKey
    };
  }
  serialize(version, key) {
    if (!this.chainCode) {
      throw new Error("No chainCode set");
    }
    abytes3(key, 33);
    return concatBytes2(toU32(version), new Uint8Array([
      this.depth
    ]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
  }
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/isArray.ts
var isArray_default = (value) => Array.isArray(value);

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Mnemonic.ts
var displayMnemonic = (mnemonic) => {
  return mnemonic.join(" ");
};
var generateMnemonic2 = (length = 12) => {
  const strength = length / 3 * 32;
  const mnemonicString = generateMnemonic(wordlist, strength);
  return mnemonicString.split(" ");
};
var mnemonicToPrivateKey = (mnemonic, passphrase) => {
  const mnemonicString = displayMnemonic(mnemonic);
  const seed = mnemonicToSeedSync(mnemonicString, passphrase);
  const hdkey = HDKey.fromMasterSeed(seed);
  const privateKey = hdkey.privateKey;
  if (privateKey === null) throw new Error("Failed to derive private key");
  return privateKey;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/Hex.ts
var isHexString = (value) => {
  return isString_default(value) && value.length % 2 === 0 && /^[0-9a-f]*$/.test(value);
};
var toHex = (arr) => {
  return Array.from(arr).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
var fromHex = (hex) => {
  const s = hex.length % 2 === 0 ? hex : "0" + hex;
  const bytes = [];
  for (let i = 0; i < s.length; i += 2) {
    bytes.push(parseInt(s.slice(i, i + 2), 16));
  }
  return new Uint8Array(bytes);
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/KeyPair.ts
var displayPublicKey = (publicKey) => {
  return toHex(publicKey);
};
var displayPrivateKey = (privateKey) => {
  return toHex(privateKey);
};
var fromPrivateKeyDisplay = (privateKeyDisplay) => {
  return fromHex(privateKeyDisplay);
};
var displayKeyPair = (keyPair) => {
  const { mnemonic, publicKey, privateKey } = keyPair;
  const mnemonicDisplay = mnemonic !== void 0 ? displayMnemonic(mnemonic) : void 0;
  const publicKeyDisplay = displayPublicKey(publicKey);
  const privateKeyDisplay = displayPrivateKey(privateKey);
  return {
    ...keyPair,
    publicKeyDisplay,
    privateKeyDisplay,
    mnemonicDisplay
  };
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/characters.json
var characters_default = [
  { index: 0, primary: "0", secondary: "Oo_", fingerprint: [{ character: "\u{1F600}", codePoints: ["U+1F600"] }, { character: "\u{1F60A}", codePoints: ["U+1F60A"] }] },
  { index: 1, primary: "1", secondary: "IiLl", fingerprint: [{ character: "\u2712\uFE0F", codePoints: ["U+2712", "U+FE0F"] }, { character: "\u2712", codePoints: ["U+2712"] }] },
  { index: 2, primary: "2", secondary: "Zz", fingerprint: [{ character: "\u{1F374}", codePoints: ["U+1F374"] }] },
  { index: 3, primary: "3", secondary: "", fingerprint: [{ character: "\u2764\uFE0F", codePoints: ["U+2764", "U+FE0F"] }, { character: "\u2764", codePoints: ["U+2764"] }] },
  { index: 4, primary: "4", secondary: "", fingerprint: [{ character: "\u{1F4AA}", codePoints: ["U+1F4AA"] }] },
  { index: 5, primary: "5", secondary: "", fingerprint: [{ character: "\u2B50", codePoints: ["U+2B50"] }] },
  { index: 6, primary: "6", secondary: "", fingerprint: [{ character: "\u{1F44D}", codePoints: ["U+1F44D"] }] },
  { index: 7, primary: "7", secondary: "", fingerprint: [{ character: "\u{1F64F}", codePoints: ["U+1F64F"] }] },
  { index: 8, primary: "8", secondary: "", fingerprint: [{ character: "\u2603\uFE0F", codePoints: ["U+2603", "U+FE0F"] }, { character: "\u2603", codePoints: ["U+2603"] }, { character: "\u26C4", codePoints: ["U+26C4"] }] },
  { index: 9, primary: "9", secondary: "", fingerprint: [{ character: "\u{1F3C1}", codePoints: ["U+1F3C1"] }] },
  { index: 10, primary: "A", secondary: "a", fingerprint: [{ character: "\u2708\uFE0F", codePoints: ["U+2708", "U+FE0F"] }, { character: "\u2708", codePoints: ["U+2708"] }] },
  { index: 11, primary: "B", secondary: "b", fingerprint: [{ character: "\u26BD", codePoints: ["U+26BD"] }] },
  { index: 12, primary: "C", secondary: "c", fingerprint: [{ character: "\u{1F697}", codePoints: ["U+1F697"] }] },
  { index: 13, primary: "D", secondary: "d", fingerprint: [{ character: "\u{1F319}", codePoints: ["U+1F319"] }] },
  { index: 14, primary: "E", secondary: "e", fingerprint: [{ character: "\u26A1\uFE0F", codePoints: ["U+26A1", "U+FE0F"] }, { character: "\u26A1", codePoints: ["U+26A1"] }] },
  { index: 15, primary: "F", secondary: "f", fingerprint: [{ character: "\u{1F525}", codePoints: ["U+1F525"] }] },
  { index: 16, primary: "G", secondary: "g", fingerprint: [{ character: "\u{1F381}", codePoints: ["U+1F381"] }] },
  { index: 17, primary: "H", secondary: "h", fingerprint: [{ character: "\u{1F3E0}", codePoints: ["U+1F3E0"] }] },
  { index: 18, primary: "J", secondary: "j", fingerprint: [{ character: "\u{1F511}", codePoints: ["U+1F511"] }] },
  { index: 19, primary: "K", secondary: "k", fingerprint: [{ character: "\u{1F451}", codePoints: ["U+1F451"] }] },
  { index: 20, primary: "M", secondary: "m", fingerprint: [{ character: "\u{1F3B5}", codePoints: ["U+1F3B5"] }] },
  { index: 21, primary: "N", secondary: "n", fingerprint: [{ character: "\u{1F4A1}", codePoints: ["U+1F4A1"] }] },
  { index: 22, primary: "P", secondary: "p", fingerprint: [{ character: "\u{1F389}", codePoints: ["U+1F389"] }] },
  { index: 23, primary: "Q", secondary: "q", fingerprint: [{ character: "\u2615\uFE0F", codePoints: ["U+2615", "U+FE0F"] }, { character: "\u2615", codePoints: ["U+2615"] }] },
  { index: 24, primary: "R", secondary: "r", fingerprint: [{ character: "\u{1F680}", codePoints: ["U+1F680"] }] },
  { index: 25, primary: "S", secondary: "s", fingerprint: [{ character: "\u2600\uFE0F", codePoints: ["U+2600", "U+FE0F"] }, { character: "\u2600", codePoints: ["U+2600"] }] },
  { index: 26, primary: "T", secondary: "t", fingerprint: [{ character: "\u{1F384}", codePoints: ["U+1F384"] }] },
  { index: 27, primary: "U", secondary: "u", fingerprint: [{ character: "\u2614\uFE0F", codePoints: ["U+2614", "U+FE0F"] }, { character: "\u2614", codePoints: ["U+2614"] }, { character: "\u2602\uFE0F", codePoints: ["U+2602", "U+FE0F"] }] },
  { index: 28, primary: "V", secondary: "v", fingerprint: [{ character: "\u{1F338}", codePoints: ["U+1F338"] }] },
  { index: 29, primary: "W", secondary: "w", fingerprint: [{ character: "\u{1F98B}", codePoints: ["U+1F98B"] }] },
  { index: 30, primary: "X", secondary: "x", fingerprint: [{ character: "\u2601\uFE0F", codePoints: ["U+2601", "U+FE0F"] }, { character: "\u2601", codePoints: ["U+2601"] }] },
  { index: 31, primary: "Y", secondary: "y", fingerprint: [{ character: "\u23F0", codePoints: ["U+23F0"] }] }
];

// deno:https://jsr.io/@vanice/types/0.2.44/lib/characters.ts
var createCharsString = (key) => {
  return characters_default.map((c) => c[key]).join("");
};
var primaryChars = createCharsString("primary");
var secondaryChars = createCharsString("secondary");
var fingerprintChars = characters_default.map((c) => c.fingerprint.map((entry) => entry.character));
var primaryCharsRegex = new RegExp(`^[${primaryChars}]+$`);
var nameRegex = new RegExp(`^[${primaryChars}${secondaryChars}]+$`);
var nameStartRegex = new RegExp(`^[${primaryChars}${secondaryChars}]+`);
var primaryAlphabet = primaryChars;
var isPrimaryChars = (value) => {
  return isString_default(value) && primaryCharsRegex.test(value);
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/getUTF8StringLength.ts
var getUTF8StringLength_default = (str) => {
  const segmenter = new Intl.Segmenter("en", {
    granularity: "grapheme"
  });
  return [
    ...segmenter.segment(str)
  ].length;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/Base32.ts
var isBase32 = (value) => {
  return isNumber_default(value) && Number.isInteger(value) && value >= 0 && value < 32;
};
var isBase32Array = (value) => {
  return isArray_default(value) && value.every(isBase32);
};
var isBase32Alphabet = (value) => {
  return isString_default(value) && getUTF8StringLength_default(value) === 32;
};
var toBase32Length = (byteLength) => {
  return Math.ceil(byteLength * 8 / 5);
};
var uint8ArrayToBase32Array = (input) => {
  const result = [];
  let bits = 0;
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = value << 8 | input[i];
    bits += 8;
    while (bits >= 5) {
      result.push(value >>> bits - 5 & 31);
      bits -= 5;
    }
  }
  if (bits > 0) {
    result.push(value << 5 - bits & 31);
  }
  return result;
};
var base32ToUint8Array = (input) => {
  const result = [];
  let bits = 0;
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = value << 5 | input[i] & 31;
    bits += 5;
    while (bits >= 8) {
      result.push(value >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(result);
};
var encode = (arr, alphabet2) => {
  if (!isBase32Array(arr)) {
    throw new Error("Input is not a valid Base32 array");
  }
  if (!isBase32Alphabet(alphabet2)) {
    throw new Error("Alphabet must be a string of exactly 32 characters");
  }
  const chars = Array.from(alphabet2);
  return arr.map((v) => chars[v]).join("");
};
var decode = (str, alphabet2) => {
  if (!isBase32Alphabet(alphabet2)) {
    throw new Error("Alphabet must be a string of exactly 32 characters");
  }
  const chars = Array.from(alphabet2);
  return Array.from(str).map((char) => {
    const index = chars.indexOf(char);
    if (index === -1) {
      throw new Error(`Character not in alphabet: ${char}`);
    }
    return index;
  });
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/codec.ts
var hashToFingerprint = (hash) => {
  return uint8ArrayToBase32Array(hash);
};
var publicKeyToPrimaryChars = (publicKey) => {
  return encode(uint8ArrayToBase32Array(publicKey), primaryAlphabet);
};
var primaryCharsToUint8Array = (chars) => {
  return base32ToUint8Array(decode(chars, primaryAlphabet));
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/isUint8Array.ts
var isUint8Array = (value) => {
  return value instanceof Uint8Array;
};
var isUint8ArrayOfLength = (value, length) => {
  return isUint8Array(value) && value.length === length;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/last.ts
var last_default = (s, n = 0) => {
  if (n > s.length) throw new Error("Index out of range");
  const i = Math.abs(n);
  if (i === 0) {
    return s.slice(-1);
  } else {
    return s.slice(-i - 1, -i);
  }
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/digest.ts
var digest_default = async (arr) => {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(arr)));
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/Hash.ts
var isHash = (value) => {
  return isHexString(value) && value.length === 64;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto.ts
var isPublicKey = (length) => (value) => {
  return isUint8ArrayOfLength(value, length);
};
var displayPublicKey2 = (publicKey) => {
  return toHex(publicKey);
};
var isPublicKeyDisplay = (length) => (value) => {
  return isHexString(value) && fromHex(value).length === length;
};
var isPrivateKey = (length) => (value) => {
  return isUint8ArrayOfLength(value, length);
};
var displayPrivateKey2 = (privateKey) => {
  return toHex(privateKey);
};
var isPrivateKeyDisplay = (length) => (value) => {
  return isHexString(value) && fromHex(value).length === length;
};
var publicKeyToPrimaryKey = (length, index) => (publicKey) => {
  if (isPublicKey(length)(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  return appendCryptoIndexToPrimaryChars(index)(publicKeyToPrimaryChars(publicKey));
};
var primaryKeyToPublicKey = (length, index) => (primaryKey) => {
  if (isPrimaryKey(length, index)(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const primaryChars2 = primaryKey.slice(0, -1);
  return primaryCharsToUint8Array(primaryChars2);
};
var isSignature = (length) => (value) => {
  return isUint8ArrayOfLength(value, length);
};
var displaySignature = (length) => (signature) => {
  if (isSignature(length)(signature) === false) {
    throw new Error("Invalid Signature");
  }
  return toHex(signature);
};
var isSignatureDisplay = (length) => (value) => {
  return isHexString(value) && fromHex(value).length === length;
};
var isPrimaryKey = (length, index) => (value) => {
  return isPrimaryChars(value) && value.length === length && parseCryptoIndex(last_default(value)) === index;
};
var appendCryptoIndexToPrimaryChars = (index) => (primaryChars2) => {
  return primaryChars2 + index.toString();
};
var splitPrimaryKeyAndCryptoIndex = (length, index) => (primaryKey) => {
  if (isPrimaryKey(length, index)(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const indexString = last_default(primaryKey);
  if (indexString !== index.toString()) {
    throw new Error("Invalid Crypto index in PrimaryKey");
  }
  const primaryChars2 = primaryKey.slice(0, -1);
  return [
    primaryChars2,
    index
  ];
};
var sign = (length, sign6) => async (hash, privateKey) => {
  if (!isHash(hash)) throw new Error("Invalid Hash");
  if (!isPrivateKey(length)(privateKey)) throw new Error("Invalid PrivateKey");
  return await sign6(fromHex(hash), privateKey);
};
var verify = (signatureLength, publicKeyLength, verify7) => (hash, signature, publicKey) => {
  if (isHash(hash) === false) throw new Error("Invalid Hash");
  if (isSignature(signatureLength)(signature) === false) throw new Error("Invalid Signature");
  if (isPublicKey(publicKeyLength)(publicKey) === false) throw new Error("Invalid PublicKey");
  return verify7(signature, fromHex(hash), publicKey);
};
var generateKeyPair = (cryptoName, getPublicKey4, keygen3) => (mnemonicLength, mnemonicPassphrase) => {
  if (mnemonicLength) {
    const mnemonic = generateMnemonic2(mnemonicLength);
    const mnemonicDisplay = displayMnemonic(mnemonic);
    const seed = mnemonicToSeedSync(mnemonicDisplay, mnemonicPassphrase);
    const hdkey = HDKey.fromMasterSeed(seed);
    const { privateKey } = hdkey;
    if (privateKey == null) throw new Error("Failed to derive private key");
    const publicKey = getPublicKey4(privateKey);
    return displayKeyPair({
      cryptoName,
      publicKey,
      privateKey,
      mnemonic
    });
  } else {
    const { secretKey: privateKey, publicKey } = keygen3();
    return displayKeyPair({
      cryptoName,
      publicKey,
      privateKey
    });
  }
};
var derivePublicKeyFromXPub = (cryptoName) => (xpub, index) => {
  if (cryptoName === "Ed25519") throw new Error("derivePublicKeyFromXPub not implemented for Ed25519");
  const hdkey = HDKey.fromExtendedKey(xpub);
  const childKey = hdkey.deriveChild(index);
  if (childKey.publicKey === null) {
    throw new Error("Failed to derive child public key");
  }
  const publicKey = cryptoName === "Schnorr" ? childKey.publicKey.slice(1) : childKey.publicKey;
  return publicKey;
};
var keyPairFromPrivateKey = (cryptoName, getPublicKey4) => (privateKey) => {
  const publicKey = getPublicKey4(privateKey);
  return displayKeyPair({
    cryptoName,
    publicKey,
    privateKey
  });
};
var keyPairFromMnemonic = (cryptoName, keyPairFromPrivateKey6) => (mnemonic, mnemonicPassphrase) => {
  if (cryptoName === "Ed25519") throw new Error("keyPairFromMnemonic is not supported for Ed25519");
  const privateKey = mnemonicToPrivateKey(mnemonic, mnemonicPassphrase);
  const keyPair = keyPairFromPrivateKey6(privateKey);
  return displayKeyPair({
    ...keyPair,
    mnemonic
  });
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/toPrimaryKeyLength.ts
var toPrimaryKeyLength = (bytesLength) => {
  return toBase32Length(bytesLength) + 1;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/utils/toBuffer.ts
var toBuffer_default = (arr) => {
  return new Uint8Array(arr).buffer;
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto_Ed25519.ts
var NAME = "Ed25519";
var INDEX = cryptoNames.indexOf(NAME);
var PUBLIC_KEY_LENGTH = 32;
var PRIVATE_KEY_LENGTH = 48;
var SIGNATURE_LENGTH = 64;
var PRIMARY_KEY_LENGTH = toPrimaryKeyLength(PUBLIC_KEY_LENGTH);
if (hashes.sha512 === void 0) {
  hashes.sha512 = sha5122;
}
var isPublicKey2 = isPublicKey(PUBLIC_KEY_LENGTH);
var displayPublicKey3 = displayPublicKey2;
var isPublicKeyDisplay2 = isPublicKeyDisplay(PUBLIC_KEY_LENGTH);
var isPrivateKey2 = isPrivateKey(PRIVATE_KEY_LENGTH);
var displayPrivateKey3 = displayPrivateKey2;
var isPrivateKeyDisplay2 = isPrivateKeyDisplay(PRIVATE_KEY_LENGTH);
var publicKeyToPrimaryKey2 = publicKeyToPrimaryKey(PUBLIC_KEY_LENGTH, INDEX);
var primaryKeyToPublicKey2 = primaryKeyToPublicKey(PRIMARY_KEY_LENGTH, INDEX);
var isSignature2 = isSignature(SIGNATURE_LENGTH);
var displaySignature2 = displaySignature(SIGNATURE_LENGTH);
var isSignatureDisplay2 = isSignatureDisplay(SIGNATURE_LENGTH);
var isPrimaryKey2 = isPrimaryKey(PRIMARY_KEY_LENGTH, INDEX);
var appendCryptoIndexToPrimaryChars2 = appendCryptoIndexToPrimaryChars(INDEX);
var splitPrimaryKeyAndCryptoIndex2 = splitPrimaryKeyAndCryptoIndex(PRIMARY_KEY_LENGTH, INDEX);
var derivePublicKeyFromXPub2 = derivePublicKeyFromXPub(NAME);
var sign2 = async (hash, privateKey) => {
  if (isHash(hash) === false) throw new Error("Invalid Hash");
  if (isPrivateKey2(privateKey) === false) throw new Error("Invalid PrivateKey");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", toBuffer_default(privateKey), "Ed25519", false, [
    "sign"
  ]);
  const signatureBuffer = await crypto.subtle.sign("Ed25519", cryptoKey, toBuffer_default(fromHex(hash)));
  return new Uint8Array(signatureBuffer);
};
var verify2 = async (hash, signature, publicKey) => {
  if (isHash(hash) === false) throw new Error("Invalid Hash");
  if (isSignature2(signature) === false) throw new Error("Invalid Signature");
  if (isPublicKey2(publicKey) === false) throw new Error("Invalid PublicKey");
  const cryptoKey = await crypto.subtle.importKey("raw", toBuffer_default(publicKey), "Ed25519", false, [
    "verify"
  ]);
  const isValid = await crypto.subtle.verify("Ed25519", cryptoKey, toBuffer_default(signature), toBuffer_default(fromHex(hash)));
  return isValid;
};
var generateKeyPair2 = async () => {
  const keyPair = await crypto.subtle.generateKey("Ed25519", true, [
    "sign",
    "verify"
  ]);
  const publicKeyRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const publicKey = new Uint8Array(publicKeyRaw);
  const privateKeyRaw = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKey = new Uint8Array(privateKeyRaw);
  return displayKeyPair({
    cryptoName: NAME,
    publicKey,
    privateKey
  });
};
var keyPairFromPrivateKey_ = keyPairFromPrivateKey(NAME, getPublicKey);
var keyPairFromPrivateKey2 = (privateKeyDisplay) => {
  const privateKey = isHexString(privateKeyDisplay) ? fromPrivateKeyDisplay(privateKeyDisplay) : privateKeyDisplay;
  const keyPair = keyPairFromPrivateKey_(privateKey.slice(-32));
  return {
    ...keyPair,
    privateKey,
    privateKeyDisplay: displayPrivateKey3(privateKey)
  };
};
var keyPairFromMnemonic2 = keyPairFromMnemonic(NAME, keyPairFromPrivateKey2);

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto_ECDSA.ts
var Crypto_ECDSA_exports = {};
__export(Crypto_ECDSA_exports, {
  INDEX: () => INDEX2,
  NAME: () => NAME2,
  PRIMARY_KEY_LENGTH: () => PRIMARY_KEY_LENGTH2,
  PRIVATE_KEY_LENGTH: () => PRIVATE_KEY_LENGTH2,
  PUBLIC_KEY_LENGTH: () => PUBLIC_KEY_LENGTH2,
  PUBLIC_KEY_X_LENGTH: () => PUBLIC_KEY_X_LENGTH,
  SIGNATURE_LENGTH: () => SIGNATURE_LENGTH2,
  appendCryptoIndexToPrimaryChars: () => appendCryptoIndexToPrimaryChars3,
  appendFlagToPrimaryChars: () => appendFlagToPrimaryChars,
  derivePublicKeyFromXPub: () => derivePublicKeyFromXPub3,
  displayPrivateKey: () => displayPrivateKey4,
  displayPublicKey: () => displayPublicKey4,
  displaySignature: () => displaySignature3,
  fromPublicKeyUncompressed: () => fromPublicKeyUncompressed,
  generateKeyPair: () => generateKeyPair3,
  isFlag: () => isFlag,
  isPrimaryKey: () => isPrimaryKey3,
  isPrivateKey: () => isPrivateKey3,
  isPrivateKeyDisplay: () => isPrivateKeyDisplay3,
  isPublicKey: () => isPublicKey3,
  isPublicKeyDisplay: () => isPublicKeyDisplay3,
  isPublicKeyUncompressed: () => isPublicKeyUncompressed,
  isPublicKeyX: () => isPublicKeyX,
  isSignature: () => isSignature3,
  isSignatureDisplay: () => isSignatureDisplay3,
  keyPairFromMnemonic: () => keyPairFromMnemonic3,
  keyPairFromPrivateKey: () => keyPairFromPrivateKey3,
  parseFlag: () => parseFlag,
  prependFlagToPublicKeyX: () => prependFlagToPublicKeyX,
  primaryKeyToPublicKey: () => primaryKeyToPublicKey3,
  publicKeyToPrimaryKey: () => publicKeyToPrimaryKey3,
  readFlagFromPublicKey: () => readFlagFromPublicKey,
  readPublicKeyXFromPublicKey: () => readPublicKeyXFromPublicKey,
  sign: () => sign3,
  splitPrimaryKey: () => splitPrimaryKey,
  splitPrimaryKeyAndCryptoIndex: () => splitPrimaryKeyAndCryptoIndex3,
  splitPublicKey: () => splitPublicKey,
  toPublicKeyUncompressed: () => toPublicKeyUncompressed,
  verify: () => verify4
});

// deno:https://jsr.io/@noble/secp256k1/3.0.0/index.ts
var secp256k1_CURVE2 = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  h: 1n,
  a: 0n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P2, n: N2, Gx: Gx2, Gy: Gy2, b: _b } = secp256k1_CURVE2;
var L3 = 32;
var L22 = 64;
var lengths = {
  publicKey: L3 + 1,
  publicKeyUncompressed: L22 + 1,
  signature: L22,
  seed: L3 + L3 / 2
};
var captureTrace2 = (...args) => {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
};
var err2 = (message = "") => {
  const e = new Error(message);
  captureTrace2(e, err2);
  throw e;
};
var isBig2 = (n) => typeof n === "bigint";
var isStr2 = (s) => typeof s === "string";
var isBytes5 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes4 = (value, length, title = "") => {
  const bytes = isBytes5(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    err2(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
};
var u8n2 = (len) => new Uint8Array(len);
var padh2 = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex3 = (b) => Array.from(abytes4(b)).map((e) => padh2(e, 2)).join("");
var C2 = {
  _0: 48,
  _9: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
var _ch2 = (ch) => {
  if (ch >= C2._0 && ch <= C2._9) return ch - C2._0;
  if (ch >= C2.A && ch <= C2.F) return ch - (C2.A - 10);
  if (ch >= C2.a && ch <= C2.f) return ch - (C2.a - 10);
  return;
};
var hexToBytes3 = (hex) => {
  const e = "hex invalid";
  if (!isStr2(hex)) return err2(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) return err2(e);
  const array = u8n2(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch2(hex.charCodeAt(hi));
    const n2 = _ch2(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) return err2(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var cr2 = () => globalThis?.crypto;
var subtle2 = () => cr2()?.subtle ?? err2("crypto.subtle must be defined, consider polyfill");
var concatBytes3 = (...arrs) => {
  const r = u8n2(arrs.reduce((sum, a) => sum + abytes4(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes2 = (len = L3) => {
  const c = cr2();
  return c.getRandomValues(u8n2(len));
};
var big2 = BigInt;
var arange = (n, min, max, msg = "bad number: out of range") => isBig2(n) && min <= n && n < max ? n : err2(msg);
var M2 = (a, b = P2) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
var modN2 = (a) => M2(a, N2);
var invert3 = (num, md) => {
  if (num === 0n || md <= 0n) err2("no inverse n=" + num + " mod=" + md);
  let a = M2(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q8 = b / a, r = b % a;
    const m = x - u * q8, n = y - v * q8;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M2(x, md) : err2("no inverse");
};
var callHash2 = (name) => {
  const fn2 = hashes2[name];
  if (typeof fn2 !== "function") err2("hashes." + name + " not set");
  return fn2;
};
var apoint2 = (p) => p instanceof Point3 ? p : err2("Point expected");
var koblitz = (x) => M2(M2(x * x) * x + _b);
var FpIsValid = (n) => arange(n, 0n, P2);
var FpIsValidNot0 = (n) => arange(n, 1n, P2);
var FnIsValidNot0 = (n) => arange(n, 1n, N2);
var isEven = (y) => (y & 1n) === 0n;
var u8of = (n) => Uint8Array.of(n);
var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
var lift_x = (x) => {
  const c = koblitz(FpIsValidNot0(x));
  let r = 1n;
  for (let num = c, e = (P2 + 1n) / 4n; e > 0n; e >>= 1n) {
    if (e & 1n) r = r * num % P2;
    num = num * num % P2;
  }
  return M2(r * r) === c ? r : err2("sqrt invalid");
};
var Point3 = class _Point {
  static BASE;
  static ZERO;
  X;
  Y;
  Z;
  constructor(X2, Y, Z) {
    this.X = FpIsValid(X2);
    this.Y = FpIsValidNot0(Y);
    this.Z = FpIsValid(Z);
    Object.freeze(this);
  }
  static CURVE() {
    return secp256k1_CURVE2;
  }
  /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I2 : new _Point(x, y, 1n);
  }
  /** Convert Uint8Array or hex string to Point. */
  static fromBytes(bytes) {
    abytes4(bytes);
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    let p = void 0;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    const x = sliceBytesNumBE(tail, 0, L3);
    if (length === comp && (head === 2 || head === 3)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big2(head));
      if (evenH !== evenY) y = M2(-y);
      p = new _Point(x, y, 1n);
    }
    if (length === uncomp && head === 4) p = new _Point(x, sliceBytesNumBE(tail, L3, L22), 1n);
    return p ? p.assertValidity() : err2("bad point: not on curve");
  }
  static fromHex(hex) {
    return _Point.fromBytes(hexToBytes3(hex));
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint2(other);
    const X1Z2 = M2(X1 * Z2);
    const X2Z1 = M2(X2 * Z1);
    const Y1Z2 = M2(Y1 * Z2);
    const Y2Z1 = M2(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I2);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point(this.X, M2(-this.Y), this.Z);
  }
  /** Point doubling: P+P, complete formula. */
  double() {
    return this.add(this);
  }
  /**
   * Point addition: P+Q, complete, exception-free formula
   * (Renes-Costello-Batina, algo 1 of [2015/1060](https://eprint.iacr.org/2015/1060)).
   * Cost: `12M + 0S + 3*a + 3*b3 + 23add`.
   */
  // prettier-ignore
  add(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint2(other);
    const a = 0n;
    const b = _b;
    let X3 = 0n, Y3 = 0n, Z3 = 0n;
    const b3 = M2(b * 3n);
    let t0 = M2(X1 * X2), t1 = M2(Y1 * Y2), t2 = M2(Z1 * Z2), t3 = M2(X1 + Y1);
    let t4 = M2(X2 + Y2);
    t3 = M2(t3 * t4);
    t4 = M2(t0 + t1);
    t3 = M2(t3 - t4);
    t4 = M2(X1 + Z1);
    let t5 = M2(X2 + Z2);
    t4 = M2(t4 * t5);
    t5 = M2(t0 + t2);
    t4 = M2(t4 - t5);
    t5 = M2(Y1 + Z1);
    X3 = M2(Y2 + Z2);
    t5 = M2(t5 * X3);
    X3 = M2(t1 + t2);
    t5 = M2(t5 - X3);
    Z3 = M2(a * t4);
    X3 = M2(b3 * t2);
    Z3 = M2(X3 + Z3);
    X3 = M2(t1 - Z3);
    Z3 = M2(t1 + Z3);
    Y3 = M2(X3 * Z3);
    t1 = M2(t0 + t0);
    t1 = M2(t1 + t0);
    t2 = M2(a * t2);
    t4 = M2(b3 * t4);
    t1 = M2(t1 + t2);
    t2 = M2(t0 - t2);
    t2 = M2(a * t2);
    t4 = M2(t4 + t2);
    t0 = M2(t1 * t4);
    Y3 = M2(Y3 + t0);
    t0 = M2(t5 * t4);
    X3 = M2(t3 * X3);
    X3 = M2(X3 - t0);
    t0 = M2(t3 * t1);
    Z3 = M2(t5 * Z3);
    Z3 = M2(Z3 + t0);
    return new _Point(X3, Y3, Z3);
  }
  subtract(other) {
    return this.add(apoint2(other).negate());
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n, safe = true) {
    if (!safe && n === 0n) return I2;
    FnIsValidNot0(n);
    if (n === 1n) return this;
    if (this.equals(G2)) return wNAF3(n).p;
    let p = I2;
    let f = G2;
    for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n) p = p.add(d);
      else if (safe) f = f.add(d);
    }
    return p;
  }
  multiplyUnsafe(scalar) {
    return this.multiply(scalar, false);
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { X: x, Y: y, Z: z } = this;
    if (this.equals(I2)) return {
      x: 0n,
      y: 0n
    };
    if (z === 1n) return {
      x,
      y
    };
    const iz = invert3(z, P2);
    if (M2(z * iz) !== 1n) err2("inverse invalid");
    return {
      x: M2(x * iz),
      y: M2(y * iz)
    };
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const { x, y } = this.toAffine();
    FpIsValidNot0(x);
    FpIsValidNot0(y);
    return M2(y * y) === koblitz(x) ? this : err2("bad point: not on curve");
  }
  /** Converts point to 33/65-byte Uint8Array. */
  toBytes(isCompressed = true) {
    const { x, y } = this.assertValidity().toAffine();
    const x32b = numTo32b(x);
    if (isCompressed) return concatBytes3(getPrefix(y), x32b);
    return concatBytes3(u8of(4), x32b, numTo32b(y));
  }
  toHex(isCompressed) {
    return bytesToHex3(this.toBytes(isCompressed));
  }
};
var G2 = new Point3(Gx2, Gy2, 1n);
var I2 = new Point3(0n, 1n, 0n);
Point3.BASE = G2;
Point3.ZERO = I2;
var doubleScalarMulUns = (R, u1, u2) => {
  return G2.multiply(u1, false).add(R.multiply(u2, false)).assertValidity();
};
var bytesToNumBE = (b) => big2("0x" + (bytesToHex3(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B2562 = 2n ** 256n;
var numTo32b = (num) => hexToBytes3(padh2(arange(num, 0n, B2562), L22));
var secretKeyToScalar = (secretKey) => {
  const num = bytesToNumBE(abytes4(secretKey, L3, "secret key"));
  return arange(num, 1n, N2, "invalid secret key: outside of range");
};
var highS = (n) => n > N2 >> 1n;
var getPublicKey2 = (privKey, isCompressed = true) => {
  return G2.multiply(secretKeyToScalar(privKey)).toBytes(isCompressed);
};
var assertRecoveryBit = (recovery) => {
  if (![
    0,
    1,
    2,
    3
  ].includes(recovery)) err2("recovery id must be valid and present");
};
var assertSigFormat = (format) => {
  if (format != null && !ALL_SIG.includes(format)) err2(`Signature format must be one of: ${ALL_SIG.join(", ")}`);
  if (format === SIG_DER) err2('Signature format "der" is not supported: switch to noble-curves');
};
var assertSigLength = (sig, format = SIG_COMPACT) => {
  assertSigFormat(format);
  const SL = lengths.signature;
  const RL = SL + 1;
  let msg = `Signature format "${format}" expects Uint8Array with length `;
  if (format === SIG_COMPACT && sig.length !== SL) err2(msg + SL);
  if (format === SIG_RECOVERED && sig.length !== RL) err2(msg + RL);
};
var Signature = class _Signature {
  r;
  s;
  recovery;
  constructor(r, s, recovery) {
    this.r = FnIsValidNot0(r);
    this.s = FnIsValidNot0(s);
    if (recovery != null) this.recovery = recovery;
    Object.freeze(this);
  }
  static fromBytes(b, format = SIG_COMPACT) {
    assertSigLength(b, format);
    let rec;
    if (format === SIG_RECOVERED) {
      rec = b[0];
      b = b.subarray(1);
    }
    const r = sliceBytesNumBE(b, 0, L3);
    const s = sliceBytesNumBE(b, L3, L22);
    return new _Signature(r, s, rec);
  }
  addRecoveryBit(bit) {
    return new _Signature(this.r, this.s, bit);
  }
  hasHighS() {
    return highS(this.s);
  }
  toBytes(format = SIG_COMPACT) {
    const { r, s, recovery } = this;
    const res = concatBytes3(numTo32b(r), numTo32b(s));
    if (format === SIG_RECOVERED) {
      assertRecoveryBit(recovery);
      return concatBytes3(Uint8Array.of(recovery), res);
    }
    return res;
  }
};
var bits2int = (bytes) => {
  const delta = bytes.length * 8 - 256;
  if (delta > 1024) err2("msg invalid");
  const num = bytesToNumBE(bytes);
  return delta > 0 ? num >> big2(delta) : num;
};
var bits2int_modN = (bytes) => modN2(bits2int(abytes4(bytes)));
var SIG_COMPACT = "compact";
var SIG_RECOVERED = "recovered";
var SIG_DER = "der";
var ALL_SIG = [
  SIG_COMPACT,
  SIG_RECOVERED,
  SIG_DER
];
var defaultSignOpts = {
  lowS: true,
  prehash: true,
  format: SIG_COMPACT,
  extraEntropy: false
};
var _sha = "SHA-256";
var hashes2 = {
  hmacSha256Async: async (key, message) => {
    const s = subtle2();
    const name = "HMAC";
    const k = await s.importKey("raw", key, {
      name,
      hash: {
        name: _sha
      }
    }, false, [
      "sign"
    ]);
    return u8n2(await s.sign(name, k, message));
  },
  hmacSha256: void 0,
  sha256Async: async (msg) => u8n2(await subtle2().digest(_sha, msg)),
  sha256: void 0
};
var prepMsg = (msg, opts, async_) => {
  abytes4(msg, void 0, "message");
  if (!opts.prehash) return msg;
  return async_ ? hashes2.sha256Async(msg) : callHash2("sha256")(msg);
};
var NULL = u8n2(0);
var byte0 = u8of(0);
var byte1 = u8of(1);
var _maxDrbgIters = 1e3;
var _drbgErr = "drbg: tried max amount of iterations";
var hmacDrbgAsync = async (seed, pred) => {
  let v = u8n2(L3);
  let k = u8n2(L3);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
  };
  const h2 = (...b) => hashes2.hmacSha256Async(k, concatBytes3(v, ...b));
  const reseed = async (seed2 = NULL) => {
    k = await h2(byte0, seed2);
    v = await h2();
    if (seed2.length === 0) return;
    k = await h2(byte1, seed2);
    v = await h2();
  };
  const gen = async () => {
    if (i++ >= _maxDrbgIters) err2(_drbgErr);
    v = await h2();
    return v;
  };
  reset();
  await reseed(seed);
  let res = void 0;
  while (!(res = pred(await gen()))) await reseed();
  reset();
  return res;
};
var _sign = (messageHash, secretKey, opts, hmacDrbg) => {
  let { lowS, extraEntropy } = opts;
  const int2octets = numTo32b;
  const h1i = bits2int_modN(messageHash);
  const h1o = int2octets(h1i);
  const d = secretKeyToScalar(secretKey);
  const seedArgs = [
    int2octets(d),
    h1o
  ];
  if (extraEntropy != null && extraEntropy !== false) {
    const e = extraEntropy === true ? randomBytes2(L3) : extraEntropy;
    seedArgs.push(abytes4(e, void 0, "extraEntropy"));
  }
  const seed = concatBytes3(...seedArgs);
  const m = h1i;
  const k2sig = (kBytes) => {
    const k = bits2int(kBytes);
    if (!(1n <= k && k < N2)) return;
    const ik = invert3(k, N2);
    const q8 = G2.multiply(k).toAffine();
    const r = modN2(q8.x);
    if (r === 0n) return;
    const s = modN2(ik * modN2(m + r * d));
    if (s === 0n) return;
    let recovery = (q8.x === r ? 0 : 2) | Number(q8.y & 1n);
    let normS = s;
    if (lowS && highS(s)) {
      normS = modN2(-s);
      recovery ^= 1;
    }
    const sig = new Signature(r, normS, recovery);
    return sig.toBytes(opts.format);
  };
  return hmacDrbg(seed, k2sig);
};
var _verify = (sig, messageHash, publicKey, opts = {}) => {
  const { lowS, format } = opts;
  if (sig instanceof Signature) err2("Signature must be in Uint8Array, use .toBytes()");
  assertSigLength(sig, format);
  abytes4(publicKey, void 0, "publicKey");
  try {
    const { r, s } = Signature.fromBytes(sig, format);
    const h2 = bits2int_modN(messageHash);
    const P3 = Point3.fromBytes(publicKey);
    if (lowS && highS(s)) return false;
    const is2 = invert3(s, N2);
    const u1 = modN2(h2 * is2);
    const u2 = modN2(r * is2);
    const R = doubleScalarMulUns(P3, u1, u2).toAffine();
    const v = modN2(R.x);
    return v === r;
  } catch (error) {
    return false;
  }
};
var setDefaults = (opts) => {
  const res = {};
  Object.keys(defaultSignOpts).forEach((k) => {
    res[k] = opts[k] ?? defaultSignOpts[k];
  });
  return res;
};
var signAsync = async (message, secretKey, opts = {}) => {
  opts = setDefaults(opts);
  message = await prepMsg(message, opts, true);
  return _sign(message, secretKey, opts, hmacDrbgAsync);
};
var verify3 = (signature, message, publicKey, opts = {}) => {
  opts = setDefaults(opts);
  message = prepMsg(message, opts, false);
  return _verify(signature, message, publicKey, opts);
};
var randomSecretKey = (seed = randomBytes2(lengths.seed)) => {
  abytes4(seed);
  if (seed.length < lengths.seed || seed.length > 1024) err2("expected 40-1024b");
  const num = M2(bytesToNumBE(seed), N2 - 1n);
  return numTo32b(num + 1n);
};
var createKeygen2 = (getPublicKey4) => (seed) => {
  const secretKey = randomSecretKey(seed);
  return {
    secretKey,
    publicKey: getPublicKey4(secretKey)
  };
};
var keygen = createKeygen2(getPublicKey2);
var getTag = (tag) => Uint8Array.from("BIP0340/" + tag, (c) => c.charCodeAt(0));
var T_AUX = "aux";
var T_NONCE = "nonce";
var T_CHALLENGE = "challenge";
var taggedHash = (tag, ...messages) => {
  const fn2 = callHash2("sha256");
  const tagH = fn2(getTag(tag));
  return fn2(concatBytes3(tagH, tagH, ...messages));
};
var taggedHashAsync = async (tag, ...messages) => {
  const fn2 = hashes2.sha256Async;
  const tagH = await fn2(getTag(tag));
  return await fn2(concatBytes3(tagH, tagH, ...messages));
};
var extpubSchnorr = (priv) => {
  const d_ = secretKeyToScalar(priv);
  const p = G2.multiply(d_);
  const { x, y } = p.assertValidity().toAffine();
  const d = isEven(y) ? d_ : modN2(-d_);
  const px = numTo32b(x);
  return {
    d,
    px
  };
};
var bytesModN = (bytes) => modN2(bytesToNumBE(bytes));
var challenge = (...args) => bytesModN(taggedHash(T_CHALLENGE, ...args));
var challengeAsync = async (...args) => bytesModN(await taggedHashAsync(T_CHALLENGE, ...args));
var pubSchnorr = (secretKey) => {
  return extpubSchnorr(secretKey).px;
};
var keygenSchnorr = createKeygen2(pubSchnorr);
var prepSigSchnorr = (message, secretKey, auxRand) => {
  const { px, d } = extpubSchnorr(secretKey);
  return {
    m: abytes4(message),
    px,
    d,
    a: abytes4(auxRand, L3)
  };
};
var extractK = (rand) => {
  const k_ = bytesModN(rand);
  if (k_ === 0n) err2("sign failed: k is zero");
  const { px, d } = extpubSchnorr(numTo32b(k_));
  return {
    rx: px,
    k: d
  };
};
var createSigSchnorr = (k, px, e, d) => {
  return concatBytes3(px, numTo32b(modN2(k + e * d)));
};
var E_INVSIG = "invalid signature produced";
var signSchnorr = (message, secretKey, auxRand = randomBytes2(L3)) => {
  const { m, px, d, a } = prepSigSchnorr(message, secretKey, auxRand);
  const aux = taggedHash(T_AUX, a);
  const t = numTo32b(d ^ bytesToNumBE(aux));
  const rand = taggedHash(T_NONCE, t, px, m);
  const { rx, k } = extractK(rand);
  const e = challenge(rx, px, m);
  const sig = createSigSchnorr(k, rx, e, d);
  if (!verifySchnorr(sig, m, px)) err2(E_INVSIG);
  return sig;
};
var signSchnorrAsync = async (message, secretKey, auxRand = randomBytes2(L3)) => {
  const { m, px, d, a } = prepSigSchnorr(message, secretKey, auxRand);
  const aux = await taggedHashAsync(T_AUX, a);
  const t = numTo32b(d ^ bytesToNumBE(aux));
  const rand = await taggedHashAsync(T_NONCE, t, px, m);
  const { rx, k } = extractK(rand);
  const e = await challengeAsync(rx, px, m);
  const sig = createSigSchnorr(k, rx, e, d);
  if (!await verifySchnorrAsync(sig, m, px)) err2(E_INVSIG);
  return sig;
};
var callSyncAsyncFn = (res, later) => {
  return res instanceof Promise ? res.then(later) : later(res);
};
var _verifSchnorr = (signature, message, publicKey, challengeFn) => {
  const sig = abytes4(signature, L22, "signature");
  const msg = abytes4(message, void 0, "message");
  const pub = abytes4(publicKey, L3, "publicKey");
  try {
    const x = bytesToNumBE(pub);
    const y = lift_x(x);
    const y_ = isEven(y) ? y : M2(-y);
    const P_ = new Point3(x, y_, 1n).assertValidity();
    const px = numTo32b(P_.toAffine().x);
    const r = sliceBytesNumBE(sig, 0, L3);
    arange(r, 1n, P2);
    const s = sliceBytesNumBE(sig, L3, L22);
    arange(s, 1n, N2);
    const i = concatBytes3(numTo32b(r), px, msg);
    return callSyncAsyncFn(challengeFn(i), (e) => {
      const { x: x2, y: y2 } = doubleScalarMulUns(P_, s, modN2(-e)).toAffine();
      if (!isEven(y2) || x2 !== r) return false;
      return true;
    });
  } catch (error) {
    return false;
  }
};
var verifySchnorr = (s, m, p) => _verifSchnorr(s, m, p, challenge);
var verifySchnorrAsync = async (s, m, p) => _verifSchnorr(s, m, p, challengeAsync);
var schnorr = {
  keygen: keygenSchnorr,
  getPublicKey: pubSchnorr,
  sign: signSchnorr,
  verify: verifySchnorr,
  signAsync: signSchnorrAsync,
  verifyAsync: verifySchnorrAsync
};
var W2 = 8;
var scalarBits2 = 256;
var pwindows2 = Math.ceil(scalarBits2 / W2) + 1;
var pwindowSize2 = 2 ** (W2 - 1);
var precompute2 = () => {
  const points = [];
  let p = G2;
  let b = p;
  for (let w = 0; w < pwindows2; w++) {
    b = p;
    points.push(b);
    for (let i = 1; i < pwindowSize2; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows2 = void 0;
var ctneg2 = (cnd, p) => {
  const n = p.negate();
  return cnd ? n : p;
};
var wNAF3 = (n) => {
  const comp = Gpows2 || (Gpows2 = precompute2());
  let p = I2;
  let f = G2;
  const pow_2_w = 2 ** W2;
  const maxNum = pow_2_w;
  const mask = big2(pow_2_w - 1);
  const shiftBy = big2(W2);
  for (let w = 0; w < pwindows2; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize2) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize2;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven2 = w % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg2(isEven2, comp[offF]));
    } else {
      p = p.add(ctneg2(isNeg, comp[offP]));
    }
  }
  if (n !== 0n) err2("invalid wnaf");
  return {
    p,
    f
  };
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto_ECDSA.ts
var NAME2 = "ECDSA";
var INDEX2 = cryptoNames.indexOf(NAME2);
var PRIVATE_KEY_LENGTH2 = 32;
var PUBLIC_KEY_X_LENGTH = 32;
var PUBLIC_KEY_LENGTH2 = 1 + PUBLIC_KEY_X_LENGTH;
var PRIMARY_KEY_LENGTH2 = toPrimaryKeyLength(PUBLIC_KEY_LENGTH2);
var SIGNATURE_LENGTH2 = 64;
if (hashes2.sha256 === void 0) {
  hashes2.sha256 = sha256;
}
var flags = [
  2,
  3
];
var displayPublicKey4 = displayPublicKey2;
var isPublicKeyDisplay3 = isPublicKeyDisplay(PUBLIC_KEY_LENGTH2);
var isPrivateKey3 = isPrivateKey(PRIVATE_KEY_LENGTH2);
var displayPrivateKey4 = displayPrivateKey2;
var isPrivateKeyDisplay3 = isPrivateKeyDisplay(PRIVATE_KEY_LENGTH2);
var isSignature3 = isSignature(SIGNATURE_LENGTH2);
var displaySignature3 = displaySignature(SIGNATURE_LENGTH2);
var isSignatureDisplay3 = isSignatureDisplay(SIGNATURE_LENGTH2);
var appendCryptoIndexToPrimaryChars3 = appendCryptoIndexToPrimaryChars(INDEX2);
var splitPrimaryKeyAndCryptoIndex3 = splitPrimaryKeyAndCryptoIndex(PRIMARY_KEY_LENGTH2, INDEX2);
var sign3 = sign(PRIVATE_KEY_LENGTH2, signAsync);
var verify4 = verify(SIGNATURE_LENGTH2, PUBLIC_KEY_LENGTH2, verify3);
var generateKeyPair3 = generateKeyPair(NAME2, getPublicKey2, keygen);
var keyPairFromPrivateKey3 = keyPairFromPrivateKey(NAME2, getPublicKey2);
var keyPairFromMnemonic3 = keyPairFromMnemonic(NAME2, keyPairFromPrivateKey3);
var derivePublicKeyFromXPub3 = derivePublicKeyFromXPub(NAME2);
var isFlag = (value) => {
  return isNumber_default(value) && flags.includes(value);
};
var parseFlag = (s) => {
  const flag = parseInt(s, 10);
  if (isFlag(flag) === false) {
    throw new Error("Invalid Flag");
  }
  return flag;
};
var isPublicKey3 = (value) => {
  return isPublicKey(PUBLIC_KEY_LENGTH2)(value) && isFlag(value[0]);
};
var isPublicKeyX = (value) => {
  return isUint8ArrayOfLength(value, PUBLIC_KEY_X_LENGTH);
};
var isPublicKeyUncompressed = (value) => {
  return isUint8ArrayOfLength(value, 65) && value[0] === 4;
};
var toPublicKeyUncompressed = (publicKey) => {
  if (isPublicKey3(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const point = Point3.fromBytes(publicKey);
  const uncompressed = point.toBytes(false);
  if (!isPublicKeyUncompressed(uncompressed)) {
    throw new Error("Failed to convert to uncompressed public key");
  }
  return uncompressed;
};
var fromPublicKeyUncompressed = (publicKeyUncompressed) => {
  if (!isPublicKeyUncompressed(publicKeyUncompressed)) {
    throw new Error("Invalid PublicKeyUncompressed");
  }
  const point = Point3.fromBytes(publicKeyUncompressed);
  const compressed = point.toBytes(true);
  if (!isPublicKey3(compressed)) {
    throw new Error("Failed to convert to compressed public key");
  }
  return compressed;
};
var readFlagFromPublicKey = (publicKey) => {
  const flag = publicKey[0];
  if (isFlag(flag) === false) {
    throw new Error("Invalid PublicKey flag");
  }
  return flag;
};
var readPublicKeyXFromPublicKey = (publicKey) => {
  const publicKeyX = publicKey.subarray(1);
  if (isPublicKeyX(publicKeyX) === false) {
    throw new Error("Invalid PublicKeyX");
  }
  return publicKeyX;
};
var isPrimaryKey3 = (value) => {
  return isPrimaryKey(PRIMARY_KEY_LENGTH2, INDEX2)(value) && isFlag(parseFlag(last_default(value, 1)));
};
var splitPublicKey = (publicKey) => {
  if (isPublicKey3(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const flag = readFlagFromPublicKey(publicKey);
  const publicKeyX = readPublicKeyXFromPublicKey(publicKey);
  return [
    flag,
    publicKeyX
  ];
};
var splitPrimaryKey = (primaryKey) => {
  if (isPrimaryKey3(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const [primaryCharsAndFlag, index] = splitPrimaryKeyAndCryptoIndex(PRIMARY_KEY_LENGTH2, INDEX2)(primaryKey);
  const flag = parseFlag(last_default(primaryCharsAndFlag));
  if (isFlag(flag) === false) {
    throw new Error("Invalid PrimaryKey flag");
  }
  const primaryChars2 = primaryCharsAndFlag.slice(0, -1);
  return [
    primaryChars2,
    flag,
    index
  ];
};
var prependFlagToPublicKeyX = (arr, flag) => {
  return new Uint8Array([
    flag,
    ...arr
  ]);
};
var appendFlagToPrimaryChars = (primaryChars2, flag) => {
  return `${primaryChars2}${flag}`;
};
var publicKeyToPrimaryKey3 = (publicKey) => {
  if (isPublicKey3(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const [flag, publicKeyX] = splitPublicKey(publicKey);
  return appendCryptoIndexToPrimaryChars(INDEX2)(appendFlagToPrimaryChars(publicKeyToPrimaryChars(publicKeyX), flag));
};
var primaryKeyToPublicKey3 = (primaryKey) => {
  if (isPrimaryKey3(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const [primaryChars2, flag] = splitPrimaryKey(primaryKey);
  return prependFlagToPublicKeyX(primaryCharsToUint8Array(primaryChars2), flag);
};

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Crypto_Schnorr.ts
var Crypto_Schnorr_exports = {};
__export(Crypto_Schnorr_exports, {
  INDEX: () => INDEX3,
  NAME: () => NAME3,
  PRIMARY_KEY_LENGTH: () => PRIMARY_KEY_LENGTH3,
  PRIVATE_KEY_LENGTH: () => PRIVATE_KEY_LENGTH3,
  PUBLIC_KEY_LENGTH: () => PUBLIC_KEY_LENGTH3,
  SIGNATURE_LENGTH: () => SIGNATURE_LENGTH3,
  appendCryptoIndexToPrimaryChars: () => appendCryptoIndexToPrimaryChars4,
  derivePublicKeyFromXPub: () => derivePublicKeyFromXPub4,
  displayPrivateKey: () => displayPrivateKey5,
  displayPublicKey: () => displayPublicKey5,
  displaySignature: () => displaySignature4,
  generateKeyPair: () => generateKeyPair4,
  isPrimaryKey: () => isPrimaryKey4,
  isPrivateKey: () => isPrivateKey4,
  isPrivateKeyDisplay: () => isPrivateKeyDisplay4,
  isPublicKey: () => isPublicKey4,
  isPublicKeyDisplay: () => isPublicKeyDisplay4,
  isSignature: () => isSignature4,
  isSignatureDisplay: () => isSignatureDisplay4,
  keyPairFromMnemonic: () => keyPairFromMnemonic4,
  keyPairFromPrivateKey: () => keyPairFromPrivateKey4,
  primaryKeyToPublicKey: () => primaryKeyToPublicKey4,
  publicKeyToPrimaryKey: () => publicKeyToPrimaryKey4,
  sign: () => sign4,
  splitPrimaryKeyAndCryptoIndex: () => splitPrimaryKeyAndCryptoIndex4,
  verify: () => verify5
});
var { getPublicKey: getPublicKey3, signAsync: signAsync2, verify: secpVerify, keygen: keygen2 } = schnorr;
var NAME3 = "Schnorr";
var INDEX3 = cryptoNames.indexOf(NAME3);
var PUBLIC_KEY_LENGTH3 = 32;
var PRIVATE_KEY_LENGTH3 = 32;
var SIGNATURE_LENGTH3 = 64;
var PRIMARY_KEY_LENGTH3 = toPrimaryKeyLength(PUBLIC_KEY_LENGTH3);
var isPublicKey4 = isPublicKey(PUBLIC_KEY_LENGTH3);
var displayPublicKey5 = displayPublicKey2;
var isPublicKeyDisplay4 = isPublicKeyDisplay(PUBLIC_KEY_LENGTH3);
var isPrivateKey4 = isPrivateKey(PRIVATE_KEY_LENGTH3);
var displayPrivateKey5 = displayPrivateKey2;
var isPrivateKeyDisplay4 = isPrivateKeyDisplay(PRIVATE_KEY_LENGTH3);
var publicKeyToPrimaryKey4 = publicKeyToPrimaryKey(PUBLIC_KEY_LENGTH3, INDEX3);
var primaryKeyToPublicKey4 = primaryKeyToPublicKey(PRIMARY_KEY_LENGTH3, INDEX3);
var isSignature4 = isSignature(SIGNATURE_LENGTH3);
var displaySignature4 = displaySignature(SIGNATURE_LENGTH3);
var isSignatureDisplay4 = isSignatureDisplay(SIGNATURE_LENGTH3);
var isPrimaryKey4 = isPrimaryKey(PRIMARY_KEY_LENGTH3, INDEX3);
var appendCryptoIndexToPrimaryChars4 = appendCryptoIndexToPrimaryChars(INDEX3);
var splitPrimaryKeyAndCryptoIndex4 = splitPrimaryKeyAndCryptoIndex(PRIMARY_KEY_LENGTH3, INDEX3);
var sign4 = sign(PRIVATE_KEY_LENGTH3, signAsync2);
var verify5 = verify(SIGNATURE_LENGTH3, PUBLIC_KEY_LENGTH3, secpVerify);
var generateKeyPair4 = generateKeyPair(NAME3, getPublicKey3, keygen2);
var keyPairFromPrivateKey4 = keyPairFromPrivateKey(NAME3, getPublicKey3);
var keyPairFromMnemonic4 = keyPairFromMnemonic(NAME3, keyPairFromPrivateKey4);
var derivePublicKeyFromXPub4 = derivePublicKeyFromXPub(NAME3);

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/Cryptos.ts
var cryptos = {
  Ed25519: Crypto_Ed25519_exports,
  ECDSA: Crypto_ECDSA_exports,
  Schnorr: Crypto_Schnorr_exports
};
var isPublicKeyByCryptoName = (name, value) => {
  return cryptos[name].isPublicKey(value);
};
var displayPublicKeyByCryptoName = (name, publicKey) => {
  return cryptos[name].displayPublicKey(publicKey);
};
var publicKeyToPrimaryKey5 = (name, publicKey) => {
  return cryptos[name].publicKeyToPrimaryKey(publicKey);
};
var generateKeyPair5 = async (name, length, mnemonicPassphrase) => {
  return await cryptos[name].generateKeyPair(length, mnemonicPassphrase);
};
var derivePublicKeyFromXPub5 = (name, xpub, index) => {
  return cryptos[name].derivePublicKeyFromXPub(xpub, index);
};

// deno:https://jsr.io/@vanice/types/0.2.44/Fingerprint.ts
var uint8ArrayToFingerprint = async (uint8Array) => {
  const hash = await digest_default(uint8Array);
  return hashToFingerprint(hash);
};
var publicKeyToFingerprint = async (publicKey) => {
  return await uint8ArrayToFingerprint(publicKey);
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/commons.js
var universalThis = globalThis;
var { Array: Array2, ArrayBuffer: ArrayBuffer2, Date: Date2, FinalizationRegistry, Float32Array, JSON: JSON2, Map: Map2, Math: Math2, Number: Number2, Object: Object2, Promise: Promise2, Proxy: Proxy2, Reflect: Reflect2, RegExp: FERAL_REG_EXP, Set: Set2, String: String2, Symbol: Symbol2, Uint8Array: Uint8Array2, WeakMap: WeakMap2, WeakSet: WeakSet2 } = globalThis;
var {
  // The feral Error constructor is safe for internal use, but must not be
  // revealed to post-lockdown code in any compartment including the start
  // compartment since in V8 at least it bears stack inspection capabilities.
  Error: FERAL_ERROR,
  RangeError: RangeError2,
  ReferenceError: ReferenceError2,
  SyntaxError: SyntaxError2,
  TypeError: TypeError2,
  AggregateError: AggregateError2
} = globalThis;
var { assign, create, defineProperties, entries, freeze, getOwnPropertyDescriptor, getOwnPropertyDescriptors, getOwnPropertyNames, getPrototypeOf, is, isFrozen, isSealed, isExtensible, keys, prototype: objectPrototype, seal, preventExtensions, setPrototypeOf, values, fromEntries } = Object2;
var { species: speciesSymbol, toStringTag: toStringTagSymbol, iterator: iteratorSymbol, matchAll: matchAllSymbol, replace: replaceSymbol, unscopables: unscopablesSymbol, keyFor: symbolKeyFor, for: symbolFor } = Symbol2;
var { isInteger } = Number2;
var { stringify: stringifyJson } = JSON2;
var { defineProperty: originalDefineProperty } = Object2;
var defineProperty = (object, prop, descriptor) => {
  const result = originalDefineProperty(object, prop, descriptor);
  if (result !== object) {
    throw TypeError2(`Please report that the original defineProperty silently failed to set ${stringifyJson(String2(prop))}. (SES_DEFINE_PROPERTY_FAILED_SILENTLY)`);
  }
  return result;
};
var { apply, construct, get: reflectGet, getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor, has: reflectHas, isExtensible: reflectIsExtensible, ownKeys, preventExtensions: reflectPreventExtensions, set: reflectSet } = Reflect2;
var { isArray, prototype: arrayPrototype } = Array2;
var { prototype: arrayBufferPrototype } = ArrayBuffer2;
var { prototype: mapPrototype } = Map2;
var { revocable: proxyRevocable } = Proxy2;
var { prototype: regexpPrototype } = RegExp;
var { prototype: setPrototype } = Set2;
var { prototype: stringPrototype } = String2;
var { prototype: weakmapPrototype } = WeakMap2;
var { prototype: weaksetPrototype } = WeakSet2;
var { prototype: functionPrototype } = Function;
var { prototype: promisePrototype } = Promise2;
var { prototype: generatorPrototype } = getPrototypeOf(
  // eslint-disable-next-line no-empty-function, func-names
  function* () {
  }
);
var iteratorPrototype = getPrototypeOf(
  // eslint-disable-next-line @endo/no-polymorphic-call
  getPrototypeOf(arrayPrototype.values())
);
var typedArrayPrototype = getPrototypeOf(Uint8Array2.prototype);
var { bind } = functionPrototype;
var uncurryThis = bind.bind(bind.call);
if (!("hasOwn" in Object2)) {
  const ObjectPrototypeHasOwnProperty = objectPrototype.hasOwnProperty;
  const hasOwnShim = (obj, key) => {
    if (obj === void 0 || obj === null) {
      throw TypeError2("Cannot convert undefined or null to object");
    }
    return apply(ObjectPrototypeHasOwnProperty, obj, [
      key
    ]);
  };
  defineProperty(Object2, "hasOwn", {
    value: hasOwnShim,
    writable: true,
    enumerable: false,
    configurable: true
  });
}
var { hasOwn } = Object2;
var arrayFilter = uncurryThis(arrayPrototype.filter);
var arrayForEach = uncurryThis(arrayPrototype.forEach);
var arrayIncludes = uncurryThis(arrayPrototype.includes);
var arrayJoin = uncurryThis(arrayPrototype.join);
var arrayMap = (
  /** @type {any} */
  uncurryThis(arrayPrototype.map)
);
var arrayFlatMap = (
  /** @type {any} */
  uncurryThis(arrayPrototype.flatMap)
);
var arrayPop = uncurryThis(arrayPrototype.pop);
var arrayPush = uncurryThis(arrayPrototype.push);
var arraySlice = uncurryThis(arrayPrototype.slice);
var arraySome = uncurryThis(arrayPrototype.some);
var arraySort = uncurryThis(arrayPrototype.sort);
var iterateArray = uncurryThis(arrayPrototype[iteratorSymbol]);
var arrayBufferSlice = uncurryThis(arrayBufferPrototype.slice);
var arrayBufferGetByteLength = uncurryThis(
  // @ts-expect-error we know it is there on all conforming platforms
  getOwnPropertyDescriptor(arrayBufferPrototype, "byteLength").get
);
var typedArraySet = uncurryThis(typedArrayPrototype.set);
var mapSet = uncurryThis(mapPrototype.set);
var mapGet = uncurryThis(mapPrototype.get);
var mapHas = uncurryThis(mapPrototype.has);
var mapDelete = uncurryThis(mapPrototype.delete);
var mapEntries = uncurryThis(mapPrototype.entries);
var iterateMap = uncurryThis(mapPrototype[iteratorSymbol]);
var setAdd = uncurryThis(setPrototype.add);
var setDelete = uncurryThis(setPrototype.delete);
var setForEach = uncurryThis(setPrototype.forEach);
var setHas = uncurryThis(setPrototype.has);
var iterateSet = uncurryThis(setPrototype[iteratorSymbol]);
var regexpExec = uncurryThis(regexpPrototype.exec);
var regexpReplace = (
  /** @type {any} */
  uncurryThis(regexpPrototype[replaceSymbol])
);
var matchAllRegExp = uncurryThis(regexpPrototype[matchAllSymbol]);
var { _regexpConstructor, ...regexpDescriptors } = getOwnPropertyDescriptors(regexpPrototype);
arrayForEach(ownKeys(regexpDescriptors), (key) => {
  const desc = regexpDescriptors[
    /** @type {any} */
    key
  ];
  desc.configurable = false;
  if (desc.writable) desc.writable = false;
});
var sealRegexp = (regexp) => seal(defineProperties(regexp, regexpDescriptors));
var stringEndsWith = uncurryThis(stringPrototype.endsWith);
var stringIncludes = uncurryThis(stringPrototype.includes);
var stringIndexOf = uncurryThis(stringPrototype.indexOf);
var stringMatch = uncurryThis(stringPrototype.match);
var stringSearch = uncurryThis(stringPrototype.search);
var stringSlice = uncurryThis(stringPrototype.slice);
var stringSplit = (
  /** @type {any} */
  uncurryThis(stringPrototype.split)
);
var stringStartsWith = uncurryThis(stringPrototype.startsWith);
var iterateString = uncurryThis(stringPrototype[iteratorSymbol]);
var weakmapDelete = uncurryThis(weakmapPrototype.delete);
var weakmapGet = uncurryThis(weakmapPrototype.get);
var weakmapHas = uncurryThis(weakmapPrototype.has);
var weakmapSet = uncurryThis(weakmapPrototype.set);
var weaksetAdd = uncurryThis(weaksetPrototype.add);
var weaksetHas = uncurryThis(weaksetPrototype.has);
var functionToString = uncurryThis(functionPrototype.toString);
var functionBind = uncurryThis(bind);
var generatorNext = uncurryThis(generatorPrototype.next);
var generatorThrow = uncurryThis(generatorPrototype.throw);
var { all } = Promise2;
var promiseCatch = uncurryThis(promisePrototype.catch);
var promiseThen = (
  /** @type {any} */
  uncurryThis(promisePrototype.then)
);
var finalizationRegistryRegister = FinalizationRegistry && uncurryThis(FinalizationRegistry.prototype.register);
var finalizationRegistryUnregister = FinalizationRegistry && uncurryThis(FinalizationRegistry.prototype.unregister);
var isPrimitive = (val) => !val || typeof val !== "object" && typeof val !== "function";
var isError = (value) => value instanceof FERAL_ERROR;
var identity = (x) => x;
var FERAL_EVAL = eval;
var FERAL_FUNCTION = Function;
var noEvalEvaluate = () => {
  throw TypeError2('Cannot eval with evalTaming set to "no-eval" (SES_NO_EVAL)');
};
var makeTypeError = () => {
  try {
    null.null;
    throw TypeError2("obligatory");
  } catch (error) {
    return error;
  }
};
var errorStackDesc = getOwnPropertyDescriptor(Error("obligatory"), "stack");
var typeErrorStackDesc = getOwnPropertyDescriptor(makeTypeError(), "stack");
var feralStackGetter;
var feralStackSetter;
if (typeErrorStackDesc && typeErrorStackDesc.get) {
  if (
    // In the v8 case as we understand it, all errors have an own stack
    // accessor property, but within the same realm, all these accessor
    // properties have the same getter and have the same setter.
    // This is therefore the case that we repair.
    errorStackDesc && typeof typeErrorStackDesc.get === "function" && typeErrorStackDesc.get === errorStackDesc.get && typeof typeErrorStackDesc.set === "function" && typeErrorStackDesc.set === errorStackDesc.set
  ) {
    feralStackGetter = freeze(typeErrorStackDesc.get);
    feralStackSetter = freeze(typeErrorStackDesc.set);
  } else {
    throw TypeError2("Unexpected Error own stack accessor functions (SES_UNEXPECTED_ERROR_OWN_STACK_ACCESSOR)");
  }
}
var FERAL_STACK_GETTER = feralStackGetter;
var FERAL_STACK_SETTER = feralStackSetter;
var getAsyncGeneratorFunctionInstance = () => {
  try {
    return new FERAL_FUNCTION("return (async function* AsyncGeneratorFunctionInstance() {})")();
  } catch (error) {
    if (error.name === "SyntaxError") {
      return void 0;
    } else if (error.name === "EvalError") {
      return async function* AsyncGeneratorFunctionInstance2() {
      };
    } else {
      throw error;
    }
  }
};
var AsyncGeneratorFunctionInstance = getAsyncGeneratorFunctionInstance();

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/assert-sloppy-mode.js
function getThis() {
  return this;
}
if (getThis()) {
  throw TypeError2(`SES failed to initialize, sloppy mode (SES_NO_SLOPPY)`);
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/@endo/env-options/1.1.11/src/env-options.js
var localThis = globalThis;
var { Object: Object3, Reflect: Reflect3, Array: Array3, String: String3, JSON: JSON3, Error: Error2 } = localThis;
var { freeze: freeze2 } = Object3;
var { apply: apply2 } = Reflect3;
var uncurryThis2 = (fn2) => (receiver, ...args) => apply2(fn2, receiver, args);
var arrayPush2 = uncurryThis2(Array3.prototype.push);
var arrayIncludes2 = uncurryThis2(Array3.prototype.includes);
var stringSplit2 = uncurryThis2(String3.prototype.split);
var q = JSON3.stringify;
var Fail = (literals, ...args) => {
  let msg = literals[0];
  for (let i = 0; i < args.length; i += 1) {
    msg = `${msg}${args[i]}${literals[i + 1]}`;
  }
  throw Error2(msg);
};
var makeEnvironmentCaptor = (aGlobal, dropNames = false) => {
  const capturedEnvironmentOptionNames = [];
  const getEnvironmentOption2 = (optionName, defaultSetting, optOtherValues = void 0) => {
    typeof optionName === "string" || Fail`Environment option name ${q(optionName)} must be a string.`;
    typeof defaultSetting === "string" || Fail`Environment option default setting ${q(defaultSetting)} must be a string.`;
    let setting = defaultSetting;
    const globalProcess = aGlobal.process || void 0;
    const globalEnv = typeof globalProcess === "object" && globalProcess.env || void 0;
    if (typeof globalEnv === "object") {
      if (optionName in globalEnv) {
        if (!dropNames) {
          arrayPush2(capturedEnvironmentOptionNames, optionName);
        }
        const optionValue = globalEnv[optionName];
        typeof optionValue === "string" || Fail`Environment option named ${q(optionName)}, if present, must have a corresponding string value, got ${q(optionValue)}`;
        setting = optionValue;
      }
    }
    optOtherValues === void 0 || setting === defaultSetting || arrayIncludes2(optOtherValues, setting) || Fail`Unrecognized ${q(optionName)} value ${q(setting)}. Expected one of ${q([
      defaultSetting,
      ...optOtherValues
    ])}`;
    return setting;
  };
  freeze2(getEnvironmentOption2);
  const getEnvironmentOptionsList2 = (optionName) => {
    const option = getEnvironmentOption2(optionName, "");
    return freeze2(option === "" ? [] : stringSplit2(option, ","));
  };
  freeze2(getEnvironmentOptionsList2);
  const environmentOptionsListHas2 = (optionName, element) => arrayIncludes2(getEnvironmentOptionsList2(optionName), element);
  const getCapturedEnvironmentOptionNames = () => {
    return freeze2([
      ...capturedEnvironmentOptionNames
    ]);
  };
  freeze2(getCapturedEnvironmentOptionNames);
  return freeze2({
    getEnvironmentOption: getEnvironmentOption2,
    getEnvironmentOptionsList: getEnvironmentOptionsList2,
    environmentOptionsListHas: environmentOptionsListHas2,
    getCapturedEnvironmentOptionNames
  });
};
freeze2(makeEnvironmentCaptor);
var { getEnvironmentOption, getEnvironmentOptionsList, environmentOptionsListHas } = makeEnvironmentCaptor(localThis, true);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/@endo/immutable-arraybuffer/1.1.2/src/immutable-arraybuffer-pony.js
var {
  ArrayBuffer: ArrayBuffer3,
  Object: Object4,
  Reflect: Reflect4,
  Symbol: Symbol3,
  TypeError: TypeError3,
  Uint8Array: Uint8Array3,
  WeakMap: WeakMap3,
  // Capture structuredClone before it can be scuttled.
  structuredClone: optStructuredClone
} = globalThis;
var { freeze: freeze3, defineProperty: defineProperty2, getPrototypeOf: getPrototypeOf2, getOwnPropertyDescriptor: getOwnPropertyDescriptor2 } = Object4;
var { apply: apply3, ownKeys: ownKeys2 } = Reflect4;
var { toStringTag } = Symbol3;
var { prototype: arrayBufferPrototype2 } = ArrayBuffer3;
var { slice, transfer: optTransfer } = arrayBufferPrototype2;
var { get: arrayBufferByteLength } = getOwnPropertyDescriptor2(arrayBufferPrototype2, "byteLength");
var typedArrayPrototype2 = getPrototypeOf2(Uint8Array3.prototype);
var { set: uint8ArraySet } = typedArrayPrototype2;
var { get: uint8ArrayBuffer } = getOwnPropertyDescriptor2(typedArrayPrototype2, "buffer");
var arrayBufferSlice2 = (realBuffer, start = void 0, end = void 0) => apply3(slice, realBuffer, [
  start,
  end
]);
var optArrayBufferTransfer;
if (optTransfer) {
  optArrayBufferTransfer = (arrayBuffer) => apply3(optTransfer, arrayBuffer, []);
} else if (optStructuredClone) {
  optArrayBufferTransfer = (arrayBuffer) => {
    arrayBufferSlice2(arrayBuffer, 0, 0);
    return optStructuredClone(arrayBuffer, {
      transfer: [
        arrayBuffer
      ]
    });
  };
} else {
  optArrayBufferTransfer = void 0;
}
var buffers = new WeakMap3();
for (const methodName of [
  "get",
  "has",
  "set"
]) {
  defineProperty2(buffers, methodName, {
    value: buffers[methodName]
  });
}
var getBuffer = (immuAB) => {
  const result = buffers.get(immuAB);
  if (result) {
    return result;
  }
  throw TypeError3("Not an emulated Immutable ArrayBuffer");
};
var ImmutableArrayBufferInternalPrototype = {
  __proto__: arrayBufferPrototype2,
  get byteLength() {
    return apply3(arrayBufferByteLength, getBuffer(this), []);
  },
  get detached() {
    getBuffer(this);
    return false;
  },
  get maxByteLength() {
    return apply3(arrayBufferByteLength, getBuffer(this), []);
  },
  get resizable() {
    getBuffer(this);
    return false;
  },
  get immutable() {
    getBuffer(this);
    return true;
  },
  slice(start = void 0, end = void 0) {
    return arrayBufferSlice2(getBuffer(this), start, end);
  },
  sliceToImmutable(start = void 0, end = void 0) {
    return sliceBufferToImmutable(getBuffer(this), start, end);
  },
  resize(_newByteLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot resize an immutable ArrayBuffer");
  },
  transfer(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  transferToFixedLength(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  transferToImmutable(_newLength = void 0) {
    getBuffer(this);
    throw TypeError3("Cannot detach an immutable ArrayBuffer");
  },
  /**
   * See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
   */
  [toStringTag]: "ImmutableArrayBuffer"
};
for (const key of ownKeys2(ImmutableArrayBufferInternalPrototype)) {
  defineProperty2(ImmutableArrayBufferInternalPrototype, key, {
    enumerable: false
  });
}
var makeImmutableArrayBufferInternal = (realBuffer) => {
  const result = (
    /** @type {ArrayBuffer} */
    /** @type {unknown} */
    {
      __proto__: ImmutableArrayBufferInternalPrototype
    }
  );
  buffers.set(result, realBuffer);
  return result;
};
freeze3(makeImmutableArrayBufferInternal);
var isBufferImmutable = (buffer) => buffers.has(buffer);
var sliceBufferToImmutable = (buffer, start = void 0, end = void 0) => {
  let realBuffer = buffers.get(buffer);
  if (realBuffer === void 0) {
    realBuffer = buffer;
  }
  return makeImmutableArrayBufferInternal(arrayBufferSlice2(realBuffer, start, end));
};
var transferBufferToImmutable;
if (optArrayBufferTransfer) {
  transferBufferToImmutable = (buffer, newLength = void 0) => {
    if (newLength === void 0) {
      buffer = optArrayBufferTransfer(buffer);
    } else if (optTransfer) {
      buffer = apply3(optTransfer, buffer, [
        newLength
      ]);
    } else {
      buffer = optArrayBufferTransfer(buffer);
      const oldLength = buffer.byteLength;
      if (newLength <= oldLength) {
        buffer = arrayBufferSlice2(buffer, 0, newLength);
      } else {
        const oldTA = new Uint8Array3(buffer);
        const newTA = new Uint8Array3(newLength);
        apply3(uint8ArraySet, newTA, [
          oldTA
        ]);
        buffer = apply3(uint8ArrayBuffer, newTA, []);
      }
    }
    const result = makeImmutableArrayBufferInternal(buffer);
    return (
      /** @type {ArrayBuffer} */
      /** @type {unknown} */
      result
    );
  };
} else {
  transferBufferToImmutable = void 0;
}
var optTransferBufferToImmutable = transferBufferToImmutable;

// ../../../Library/Caches/deno/npm/registry.npmjs.org/@endo/immutable-arraybuffer/1.1.2/src/immutable-arraybuffer-shim.js
var { ArrayBuffer: ArrayBuffer4, JSON: JSON4, Object: Object5, Reflect: Reflect5 } = globalThis;
var optTransferBufferToImmutable2 = optTransferBufferToImmutable;
var { getOwnPropertyDescriptors: getOwnPropertyDescriptors2, defineProperties: defineProperties2, defineProperty: defineProperty3 } = Object5;
var { ownKeys: ownKeys3 } = Reflect5;
var { prototype: arrayBufferPrototype3 } = ArrayBuffer4;
var { stringify } = JSON4;
var arrayBufferMethods = {
  /**
   * Creates an immutable slice of the given buffer.
   *
   * @this {ArrayBuffer} buffer The original buffer.
   * @param {number} [start] The start index.
   * @param {number} [end] The end index.
   * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
   */
  sliceToImmutable(start = void 0, end = void 0) {
    return sliceBufferToImmutable(this, start, end);
  },
  /**
   * @this {ArrayBuffer}
   */
  get immutable() {
    return isBufferImmutable(this);
  },
  ...optTransferBufferToImmutable2 ? {
    /**
         * Transfer the contents to a new Immutable ArrayBuffer
         *
         * @this {ArrayBuffer} buffer The original buffer.
         * @param {number} [newLength] The start index.
         * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
         */
    transferToImmutable(newLength = void 0) {
      return optTransferBufferToImmutable2(this, newLength);
    }
  } : {}
};
for (const key of ownKeys3(arrayBufferMethods)) {
  defineProperty3(arrayBufferMethods, key, {
    enumerable: false
  });
}
var overwrites = ownKeys3(arrayBufferMethods).filter((key) => key in arrayBufferPrototype3);
if (overwrites.length > 0) {
  console.warn(`About to overwrite ArrayBuffer.prototype properties ${stringify(overwrites)}`);
}
defineProperties2(arrayBufferPrototype3, getOwnPropertyDescriptors2(arrayBufferMethods));

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/stringify-utils.js
var an = (str) => {
  str = `${str}`;
  if (str.length >= 1 && stringIncludes("aeiouAEIOU", str[0])) {
    return `an ${str}`;
  }
  return `a ${str}`;
};
freeze(an);
var bestEffortStringify = (payload, spaces = void 0) => {
  const seenSet = new Set2();
  const replacer = (_, val) => {
    switch (typeof val) {
      case "object": {
        if (val === null) {
          return null;
        }
        if (setHas(seenSet, val)) {
          return "[Seen]";
        }
        setAdd(seenSet, val);
        if (isError(val)) {
          return `[${val.name}: ${val.message}]`;
        }
        if (toStringTagSymbol in val) {
          return `[${val[toStringTagSymbol]}]`;
        }
        if (isArray(val)) {
          return val;
        }
        const names = keys(val);
        if (names.length < 2) {
          return val;
        }
        let sorted = true;
        for (let i = 1; i < names.length; i += 1) {
          if (names[i - 1] >= names[i]) {
            sorted = false;
            break;
          }
        }
        if (sorted) {
          return val;
        }
        arraySort(names);
        const entries2 = arrayMap(names, (name) => [
          name,
          val[name]
        ]);
        return fromEntries(entries2);
      }
      case "function": {
        return `[Function ${val.name || "<anon>"}]`;
      }
      case "string": {
        if (stringStartsWith(val, "[")) {
          return `[${val}]`;
        }
        return val;
      }
      case "undefined":
      case "symbol": {
        return `[${String2(val)}]`;
      }
      case "bigint": {
        return `[${val}n]`;
      }
      case "number": {
        if (is(val, NaN)) {
          return "[NaN]";
        } else if (val === Infinity) {
          return "[Infinity]";
        } else if (val === -Infinity) {
          return "[-Infinity]";
        }
        return val;
      }
      default: {
        return val;
      }
    }
  };
  try {
    return stringifyJson(payload, replacer, spaces);
  } catch (_err) {
    return "[Something that failed to stringify]";
  }
};
freeze(bestEffortStringify);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/@endo/cache-map/1.1.0/src/cachemap.js
var { Error: Error3, TypeError: TypeError4, WeakMap: WeakMap4 } = globalThis;
var { parse, stringify: stringify2 } = JSON;
var { isSafeInteger } = Number;
var { freeze: freeze4 } = Object;
var { toStringTag: toStringTagSymbol2 } = Symbol;
var UNKNOWN_KEY = Symbol("UNKNOWN_KEY");
var deepCopyJsonable = (value, reviver) => {
  const encoded = stringify2(value);
  const decoded = parse(encoded, reviver);
  return decoded;
};
var freezingReviver = (_name, value) => freeze4(value);
var deepCopyAndFreezeJsonable = (value) => deepCopyJsonable(value, freezingReviver);
var appendNewCell = (prev, id, data) => {
  const next = prev?.next;
  const cell = {
    id,
    next,
    prev,
    data
  };
  prev.next = cell;
  next.prev = cell;
  return cell;
};
var moveCellAfter = (cell, prev, next = prev.next) => {
  if (cell === prev || cell === next) return;
  const { prev: oldPrev, next: oldNext } = cell;
  oldPrev.next = oldNext;
  oldNext.prev = oldPrev;
  cell.prev = prev;
  cell.next = next;
  prev.next = cell;
  next.prev = cell;
};
var resetCell = (cell, oldKey, makeMap) => {
  if (oldKey !== UNKNOWN_KEY) {
    cell.data.delete(oldKey);
    return;
  }
  if (cell.data.clear) {
    cell.data.clear();
    return;
  }
  if (!makeMap) {
    throw Error3("internal: makeMap is required with UNKNOWN_KEY");
  }
  cell.data = makeMap();
};
var zeroMetrics = freeze4({
  totalQueryCount: 0,
  totalHitCount: 0
});
var makeCacheMapKit = (capacity, options = {}) => {
  if (!isSafeInteger(capacity) || capacity < 0) {
    throw TypeError4("capacity must be a non-negative safe integer number <= 2**53 - 1");
  }
  const makeMap = ((MaybeCtor) => {
    try {
      MaybeCtor();
      return (
        /** @type {any} */
        MaybeCtor
      );
    } catch (err3) {
      const constructNewMap = () => new MaybeCtor();
      return constructNewMap;
    }
  })(options.makeMap ?? WeakMap4);
  const tag = (
    /** @type {any} */
    makeMap().clear === void 0 ? "WeakCacheMap" : "CacheMap"
  );
  const keyToCell = makeMap();
  const head = (
    /** @type {CacheMapCell<K, V>} */
    {
      id: 0,
      // next and prev are established below as self-referential.
      next: void 0,
      prev: void 0,
      data: {
        has: () => {
          throw Error3("internal: sentinel head cell has no data");
        }
      }
    }
  );
  head.next = head;
  head.prev = head;
  let cellCount = 0;
  const metrics = deepCopyJsonable(zeroMetrics);
  const getMetrics = () => deepCopyAndFreezeJsonable(metrics);
  const touchKey = (key) => {
    metrics.totalQueryCount += 1;
    const cell = keyToCell.get(key);
    if (!cell?.data.has(key)) return void 0;
    metrics.totalHitCount += 1;
    moveCellAfter(cell, head);
    return cell;
  };
  const has = (key) => {
    const cell = touchKey(key);
    return cell !== void 0;
  };
  freeze4(has);
  const get = (key) => {
    const cell = touchKey(key);
    return cell?.data.get(key);
  };
  freeze4(get);
  const set = (key, value) => {
    let cell = touchKey(key);
    if (cell) {
      cell.data.set(key, value);
      return implementation;
    }
    if (cellCount < capacity) {
      cell = appendNewCell(head, cellCount + 1, makeMap());
      cellCount += 1;
      cell.data.set(key, value);
    } else if (capacity > 0) {
      cell = head.prev;
      resetCell(
        /** @type {any} */
        cell,
        UNKNOWN_KEY,
        makeMap
      );
      cell.data.set(key, value);
      moveCellAfter(cell, head);
    }
    if (cell) keyToCell.set(key, cell);
    return implementation;
  };
  freeze4(set);
  const { delete: deleteEntry } = {
    /** @type {WeakMapAPI<K, V>['delete']} */
    delete: (key) => {
      const cell = keyToCell.get(key);
      if (!cell?.data.has(key)) {
        keyToCell.delete(key);
        return false;
      }
      moveCellAfter(cell, head.prev);
      resetCell(cell, key);
      keyToCell.delete(key);
      return true;
    }
  };
  freeze4(deleteEntry);
  const implementation = (
    /** @type {WeakMapAPI<K, V>} */
    {
      has,
      get,
      set,
      delete: deleteEntry,
      // eslint-disable-next-line jsdoc/check-types
      [
        /** @type {typeof Symbol.toStringTag} */
        toStringTagSymbol2
      ]: tag
    }
  );
  freeze4(implementation);
  const kit = {
    cache: implementation,
    getMetrics
  };
  return freeze4(kit);
};
freeze4(makeCacheMapKit);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/note-log-args.js
var { freeze: freeze5 } = Object;
var { isSafeInteger: isSafeInteger2 } = Number;
var defaultLoggedErrorsBudget = 1e3;
var defaultArgsPerErrorBudget = 100;
var makeNoteLogArgsArrayKit = (errorsBudget = defaultLoggedErrorsBudget, argsPerErrorBudget = defaultArgsPerErrorBudget) => {
  if (!isSafeInteger2(argsPerErrorBudget) || argsPerErrorBudget < 1) {
    throw TypeError("argsPerErrorBudget must be a safe positive integer number");
  }
  const { cache: noteLogArgsArrayMap } = makeCacheMapKit(errorsBudget);
  const addLogArgs = (error, logArgs) => {
    const logArgsArray = noteLogArgsArrayMap.get(error);
    if (logArgsArray !== void 0) {
      if (logArgsArray.length >= argsPerErrorBudget) {
        logArgsArray.shift();
      }
      logArgsArray.push(logArgs);
    } else {
      noteLogArgsArrayMap.set(error, [
        logArgs
      ]);
    }
  };
  freeze5(addLogArgs);
  const takeLogArgsArray = (error) => {
    const result = noteLogArgsArrayMap.get(error);
    noteLogArgsArrayMap.delete(error);
    return result;
  };
  freeze5(takeLogArgsArray);
  return freeze5({
    addLogArgs,
    takeLogArgsArray
  });
};
freeze5(makeNoteLogArgsArrayKit);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/assert.js
var declassifiers = new WeakMap2();
var quote = (value, spaces = void 0) => {
  const result = freeze({
    toString: freeze(() => bestEffortStringify(value, spaces))
  });
  weakmapSet(declassifiers, result, value);
  return result;
};
freeze(quote);
var canBeBare = freeze(/^[\w:-]( ?[\w:-])*$/);
var bare = (text, spaces = void 0) => {
  if (typeof text !== "string" || !regexpExec(canBeBare, text)) {
    return quote(text, spaces);
  }
  const result = freeze({
    toString: freeze(() => text)
  });
  weakmapSet(declassifiers, result, text);
  return result;
};
freeze(bare);
var hiddenDetailsMap = new WeakMap2();
var getMessageString = ({ template, args }) => {
  const parts = [
    template[0]
  ];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    let argStr;
    if (weakmapHas(declassifiers, arg)) {
      argStr = `${arg}`;
    } else if (isError(arg)) {
      argStr = `(${an(arg.name)})`;
    } else {
      argStr = `(${an(typeof arg)})`;
    }
    arrayPush(parts, argStr, template[i + 1]);
  }
  return arrayJoin(parts, "");
};
var DetailsTokenProto = freeze({
  toString() {
    const hiddenDetails = weakmapGet(hiddenDetailsMap, this);
    if (hiddenDetails === void 0) {
      return "[Not a DetailsToken]";
    }
    return getMessageString(hiddenDetails);
  }
});
freeze(DetailsTokenProto.toString);
var redactedDetails = (template, ...args) => {
  const detailsToken = freeze({
    __proto__: DetailsTokenProto
  });
  weakmapSet(hiddenDetailsMap, detailsToken, {
    template,
    args
  });
  return (
    /** @type {DetailsToken} */
    /** @type {unknown} */
    detailsToken
  );
};
freeze(redactedDetails);
var unredactedDetails = (template, ...args) => {
  args = arrayMap(args, (arg) => weakmapHas(declassifiers, arg) ? arg : quote(arg));
  return redactedDetails(template, ...args);
};
freeze(unredactedDetails);
var leadingSpacePattern = sealRegexp(/^ /);
var trailingSpacePattern = sealRegexp(/ $/);
var getLogArgs = ({ template, args }) => {
  const logArgs = [
    template[0]
  ];
  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];
    if (weakmapHas(declassifiers, arg)) {
      arg = weakmapGet(declassifiers, arg);
    }
    const prevLiteralPart = regexpReplace(trailingSpacePattern, arrayPop(logArgs) || "", "");
    if (prevLiteralPart !== "") {
      arrayPush(logArgs, prevLiteralPart);
    }
    const nextLiteralPart = regexpReplace(leadingSpacePattern, template[i + 1], "");
    arrayPush(logArgs, arg, nextLiteralPart);
  }
  if (logArgs[logArgs.length - 1] === "") {
    arrayPop(logArgs);
  }
  return logArgs;
};
var hiddenMessageLogArgs = new WeakMap2();
var errorTagNum = 0;
var errorTags = new WeakMap2();
var tagError = (err3, optErrorName = err3.name) => {
  let errorTag = weakmapGet(errorTags, err3);
  if (errorTag !== void 0) {
    return errorTag;
  }
  errorTagNum += 1;
  errorTag = `${optErrorName}#${errorTagNum}`;
  weakmapSet(errorTags, err3, errorTag);
  return errorTag;
};
var sanitizeError = (error) => {
  const descs = getOwnPropertyDescriptors(error);
  const { name: _nameDesc, message: _messageDesc, errors: _errorsDesc = void 0, cause: _causeDesc = void 0, stack: _stackDesc = void 0, ...restDescs } = descs;
  const restNames = ownKeys(restDescs);
  if (restNames.length >= 1) {
    for (const name of restNames) {
      delete error[name];
    }
    const dropped = create(objectPrototype, restDescs);
    const droppedDetails = redactedDetails`originally with properties ${quote(dropped)}`;
    note(error, droppedDetails);
  }
  for (const name of ownKeys(error)) {
    const desc = descs[name];
    if (desc && hasOwn(desc, "get")) {
      const value = error[name];
      defineProperty(error, name, {
        value
      });
    }
  }
  freeze(error);
};
var makeError = (optDetails = redactedDetails`Assert failed`, errConstructor = universalThis.Error, { errorName = void 0, cause = void 0, errors = void 0, sanitize = true } = {}) => {
  if (typeof optDetails === "string") {
    optDetails = redactedDetails([
      optDetails
    ]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, optDetails);
  if (hiddenDetails === void 0) {
    throw TypeError2(`unrecognized details ${quote(optDetails)}`);
  }
  const messageString = getMessageString(hiddenDetails);
  const opts = cause && {
    cause
  };
  let error;
  if (typeof AggregateError2 !== "undefined" && errConstructor === AggregateError2) {
    error = AggregateError2(errors || [], messageString, opts);
  } else {
    const ErrorCtor = (
      /** @type {ErrorConstructor} */
      errConstructor
    );
    error = ErrorCtor(messageString, opts);
    if (errors !== void 0) {
      defineProperty(error, "errors", {
        value: errors,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  weakmapSet(hiddenMessageLogArgs, error, getLogArgs(hiddenDetails));
  if (errorName !== void 0) {
    tagError(error, errorName);
  }
  if (sanitize) {
    sanitizeError(error);
  }
  return error;
};
freeze(makeError);
var { addLogArgs: addNoteLogArgs, takeLogArgsArray: takeAllNoteLogArgs } = makeNoteLogArgsArrayKit();
var hiddenNoteCallbacks = new WeakMap2();
var note = (error, detailsNote) => {
  if (typeof detailsNote === "string") {
    detailsNote = redactedDetails([
      detailsNote
    ]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, detailsNote);
  if (hiddenDetails === void 0) {
    throw TypeError2(`unrecognized details ${quote(detailsNote)}`);
  }
  const logArgs = getLogArgs(hiddenDetails);
  const callbacks = weakmapGet(hiddenNoteCallbacks, error);
  if (callbacks !== void 0) {
    for (const callback of callbacks) {
      callback(error, logArgs);
    }
  } else {
    addNoteLogArgs(error, logArgs);
  }
};
freeze(note);
var defaultGetStackString = (error) => {
  if (!("stack" in error)) {
    return "";
  }
  const stackString = `${error.stack}`;
  const pos = stringIndexOf(stackString, "\n");
  if (stringStartsWith(stackString, " ") || pos === -1) {
    return stackString;
  }
  return stringSlice(stackString, pos + 1);
};
var loggedErrorHandler = {
  getStackString: universalThis.getStackString || defaultGetStackString,
  tagError: (error) => tagError(error),
  resetErrorTagNum: () => {
    errorTagNum = 0;
  },
  getMessageLogArgs: (error) => weakmapGet(hiddenMessageLogArgs, error),
  takeMessageLogArgs: (error) => {
    const logArgs = weakmapGet(hiddenMessageLogArgs, error);
    weakmapDelete(hiddenMessageLogArgs, error);
    return logArgs;
  },
  takeNoteLogArgsArray: (error, callback) => {
    const logArgsArray = takeAllNoteLogArgs(error);
    if (callback !== void 0) {
      const callbacks = weakmapGet(hiddenNoteCallbacks, error);
      if (callbacks) {
        arrayPush(callbacks, callback);
      } else {
        weakmapSet(hiddenNoteCallbacks, error, [
          callback
        ]);
      }
    }
    return logArgsArray || [];
  }
};
freeze(loggedErrorHandler);
var makeAssert = (optRaise = void 0, unredacted = false) => {
  const details = unredacted ? unredactedDetails : redactedDetails;
  const assertFailedDetails = details`Check failed`;
  const fail = (optDetails = assertFailedDetails, errConstructor = void 0, options = void 0) => {
    const reason = makeError(optDetails, errConstructor, options);
    if (optRaise !== void 0) {
      optRaise(reason);
    }
    throw reason;
  };
  freeze(fail);
  const Fail9 = (template, ...args) => fail(details(template, ...args));
  const assert2 = (condition, optDetails = void 0, errConstructor = void 0, options = void 0) => {
    condition || fail(optDetails, errConstructor, options);
  };
  const equal = (actual, expected, optDetails = void 0, errConstructor = void 0, options = void 0) => {
    is(actual, expected) || fail(optDetails || details`Expected ${actual} is same as ${expected}`, errConstructor || RangeError2, options);
  };
  freeze(equal);
  const assertTypeof = (specimen, typename, optDetails) => {
    if (typeof specimen === typename) {
      return;
    }
    typeof typename === "string" || Fail9`${quote(typename)} must be a string`;
    if (optDetails === void 0) {
      const typeWithDeterminer = an(typename);
      optDetails = details`${specimen} must be ${bare(typeWithDeterminer)}`;
    }
    fail(optDetails, TypeError2);
  };
  freeze(assertTypeof);
  const assertString = (specimen, optDetails = void 0) => assertTypeof(specimen, "string", optDetails);
  const assertionFunctions = {
    equal,
    typeof: assertTypeof,
    string: assertString,
    fail
  };
  const assertionUtilities = {
    makeError,
    note,
    details,
    Fail: Fail9,
    quote,
    bare
  };
  const deprecated = {
    error: makeError,
    makeAssert
  };
  const finishedAssert = assign(assert2, {
    ...assertionFunctions,
    ...assertionUtilities,
    ...deprecated
  });
  return freeze(finishedAssert);
};
freeze(makeAssert);
var assert = makeAssert();
var assertEqual = assert.equal;

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/make-hardener.js
var typedArrayToStringTag = getOwnPropertyDescriptor(typedArrayPrototype, toStringTagSymbol);
assert(typedArrayToStringTag);
var getTypedArrayToStringTag = typedArrayToStringTag.get;
assert(getTypedArrayToStringTag);
var isTypedArray = (object) => {
  const tag = apply(getTypedArrayToStringTag, object, []);
  return tag !== void 0;
};
var isCanonicalIntegerIndexString = (propertyKey) => {
  const n = +String2(propertyKey);
  return isInteger(n) && String2(n) === propertyKey;
};
var freezeTypedArray = (array) => {
  preventExtensions(array);
  arrayForEach(ownKeys(array), (name) => {
    const desc = getOwnPropertyDescriptor(array, name);
    assert(desc);
    if (!isCanonicalIntegerIndexString(name)) {
      defineProperty(array, name, {
        ...desc,
        writable: false,
        configurable: false
      });
    }
  });
};
var makeHardener = () => {
  if (typeof universalThis.harden === "function") {
    const safeHarden2 = universalThis.harden;
    return safeHarden2;
  }
  const hardened = new WeakSet2();
  const { harden: harden2 } = {
    /**
     * @template T
     * @param {T} root
     * @returns {T}
     */
    harden(root) {
      const toFreeze = new Set2();
      function enqueue(val) {
        if (isPrimitive(val)) {
          return;
        }
        const type = typeof val;
        if (type !== "object" && type !== "function") {
          throw TypeError2(`Unexpected typeof: ${type}`);
        }
        if (weaksetHas(hardened, val) || setHas(toFreeze, val)) {
          return;
        }
        setAdd(toFreeze, val);
      }
      const baseFreezeAndTraverse = (obj) => {
        if (isTypedArray(obj)) {
          freezeTypedArray(obj);
        } else {
          freeze(obj);
        }
        const descs = getOwnPropertyDescriptors(obj);
        const proto = getPrototypeOf(obj);
        enqueue(proto);
        arrayForEach(ownKeys(descs), (name) => {
          const desc = descs[
            /** @type {string} */
            name
          ];
          if (hasOwn(desc, "value")) {
            enqueue(desc.value);
          } else {
            enqueue(desc.get);
            enqueue(desc.set);
          }
        });
      };
      const freezeAndTraverse = FERAL_STACK_GETTER === void 0 && FERAL_STACK_SETTER === void 0 ? (
        // don't pay for any extra overhead.
        baseFreezeAndTraverse
      ) : (obj) => {
        if (isError(obj)) {
          const stackDesc2 = getOwnPropertyDescriptor(obj, "stack");
          if (stackDesc2 && stackDesc2.get === FERAL_STACK_GETTER && stackDesc2.configurable) {
            defineProperty(obj, "stack", {
              // NOTE: Calls getter during harden, which seems dangerous.
              // But we're only calling the problematic getter whose
              // hazards we think we understand.
              // @ts-expect-error TS should know FERAL_STACK_GETTER
              // cannot be `undefined` here.
              // See https://github.com/endojs/endo/pull/2232#discussion_r1575179471
              value: apply(FERAL_STACK_GETTER, obj, [])
            });
          }
        }
        return baseFreezeAndTraverse(obj);
      };
      const dequeue = () => {
        setForEach(toFreeze, freezeAndTraverse);
      };
      const markHardened = (value) => {
        weaksetAdd(hardened, value);
      };
      const commit = () => {
        setForEach(toFreeze, markHardened);
      };
      enqueue(root);
      dequeue();
      commit();
      return root;
    }
  };
  return harden2;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/cauterize-property.js
var cauterizeProperty = (obj, prop, known, subPath, { warn, error }) => {
  if (!known) {
    warn(`Removing ${subPath}`);
  }
  try {
    delete obj[prop];
  } catch (err3) {
    if (hasOwn(obj, prop)) {
      if (typeof obj === "function" && prop === "prototype") {
        obj.prototype = void 0;
        if (obj.prototype === void 0) {
          warn(`Tolerating undeletable ${subPath} === undefined`);
          return;
        }
      }
      error(`failed to delete ${subPath}`, err3);
    } else {
      error(`deleting ${subPath} threw`, err3);
    }
    throw err3;
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/permits.js
var constantProperties = {
  // *** Value Properties of the Global Object
  Infinity: Infinity,
  NaN: NaN,
  undefined: void 0
};
var universalPropertyNames = {
  // *** Function Properties of the Global Object
  isFinite: "isFinite",
  isNaN: "isNaN",
  parseFloat: "parseFloat",
  parseInt: "parseInt",
  decodeURI: "decodeURI",
  decodeURIComponent: "decodeURIComponent",
  encodeURI: "encodeURI",
  encodeURIComponent: "encodeURIComponent",
  // *** Constructor Properties of the Global Object
  Array: "Array",
  ArrayBuffer: "ArrayBuffer",
  BigInt: "BigInt",
  BigInt64Array: "BigInt64Array",
  BigUint64Array: "BigUint64Array",
  Boolean: "Boolean",
  DataView: "DataView",
  EvalError: "EvalError",
  // https://github.com/tc39/proposal-float16array
  Float16Array: "Float16Array",
  Float32Array: "Float32Array",
  Float64Array: "Float64Array",
  Int8Array: "Int8Array",
  Int16Array: "Int16Array",
  Int32Array: "Int32Array",
  Map: "Map",
  Number: "Number",
  Object: "Object",
  Promise: "Promise",
  Proxy: "Proxy",
  RangeError: "RangeError",
  ReferenceError: "ReferenceError",
  Set: "Set",
  String: "String",
  SyntaxError: "SyntaxError",
  TypeError: "TypeError",
  Uint8Array: "Uint8Array",
  Uint8ClampedArray: "Uint8ClampedArray",
  Uint16Array: "Uint16Array",
  Uint32Array: "Uint32Array",
  URIError: "URIError",
  WeakMap: "WeakMap",
  WeakSet: "WeakSet",
  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: "Iterator",
  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: "AsyncIterator",
  // https://github.com/endojs/endo/issues/550
  AggregateError: "AggregateError",
  // https://github.com/tc39/proposal-explicit-resource-management
  // TODO DisposableStack, AsyncDisposableStack
  // DisposableStack: 'DisposableStack',
  // AsyncDisposableStack: 'AsyncDisposableStack',
  // https://tc39.es/proposal-shadowrealm/
  // TODO ShadowRealm
  // ShadowRealm: 'ShadowRealm',
  // *** Other Properties of the Global Object
  JSON: "JSON",
  Reflect: "Reflect",
  // *** Annex B
  escape: "escape",
  unescape: "unescape",
  // ESNext
  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source
  ModuleSource: "ModuleSource",
  lockdown: "lockdown",
  harden: "harden",
  HandledPromise: "HandledPromise"
};
var initialGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object
  Date: "%InitialDate%",
  Error: "%InitialError%",
  RegExp: "%InitialRegExp%",
  // Omit `Symbol`, because we want the original to appear on the
  // start compartment without passing through the permits mechanism, since
  // we want to preserve all its properties, even if we never heard of them.
  // Symbol: '%InitialSymbol%',
  // *** Other Properties of the Global Object
  Math: "%InitialMath%",
  // ESNext
  // From Error-stack proposal
  // Only on initial global. No corresponding
  // powerless form for other globals.
  getStackString: "%InitialGetStackString%"
};
var sharedGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object
  Date: "%SharedDate%",
  Error: "%SharedError%",
  RegExp: "%SharedRegExp%",
  Symbol: "%SharedSymbol%",
  // *** Other Properties of the Global Object
  Math: "%SharedMath%"
};
var NativeErrors = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
];
if (typeof AggregateError !== "undefined") {
  arrayPush(NativeErrors, AggregateError);
}
var FunctionInstance = {
  "[[Proto]]": "%FunctionPrototype%",
  length: "number",
  name: "string"
};
var AsyncFunctionInstance = {
  // This property is not mentioned in ECMA 262, but is present in V8 and
  // necessary for lockdown to succeed.
  "[[Proto]]": "%AsyncFunctionPrototype%"
};
var fn = FunctionInstance;
var asyncFn = AsyncFunctionInstance;
var getter = {
  get: fn,
  set: "undefined"
};
var accessor = {
  get: fn,
  set: fn
};
var strict = function() {
  "use strict";
};
arrayForEach([
  "caller",
  "arguments"
], (prop) => {
  try {
    strict[prop];
  } catch (e) {
    if (e.message === "Restricted in strict mode") {
      FunctionInstance[prop] = accessor;
    }
  }
});
var isAccessorPermit = (permit) => {
  return permit === getter || permit === accessor;
};
function NativeError(prototype) {
  return {
    // Properties of the NativeError Constructors
    "[[Proto]]": "%SharedError%",
    // NativeError.prototype
    prototype
  };
}
function NativeErrorPrototype(constructor) {
  return {
    // Properties of the NativeError Prototype Objects
    "[[Proto]]": "%ErrorPrototype%",
    constructor,
    message: "string",
    name: "string",
    // Redundantly present only on v8. Safe to remove.
    toString: false,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false
  };
}
function TypedArray(prototype) {
  return {
    // Properties of the TypedArray Constructors
    "[[Proto]]": "%TypedArray%",
    BYTES_PER_ELEMENT: "number",
    prototype
  };
}
function TypedArrayPrototype(constructor) {
  return {
    // Properties of the TypedArray Prototype Objects
    "[[Proto]]": "%TypedArrayPrototype%",
    BYTES_PER_ELEMENT: "number",
    constructor
  };
}
var CommonMath = {
  E: "number",
  LN10: "number",
  LN2: "number",
  LOG10E: "number",
  LOG2E: "number",
  PI: "number",
  SQRT1_2: "number",
  SQRT2: "number",
  "@@toStringTag": "string",
  abs: fn,
  acos: fn,
  acosh: fn,
  asin: fn,
  asinh: fn,
  atan: fn,
  atanh: fn,
  atan2: fn,
  cbrt: fn,
  ceil: fn,
  clz32: fn,
  cos: fn,
  cosh: fn,
  exp: fn,
  expm1: fn,
  floor: fn,
  fround: fn,
  hypot: fn,
  imul: fn,
  log: fn,
  log1p: fn,
  log10: fn,
  log2: fn,
  max: fn,
  min: fn,
  pow: fn,
  round: fn,
  sign: fn,
  sin: fn,
  sinh: fn,
  sqrt: fn,
  tan: fn,
  tanh: fn,
  trunc: fn,
  // https://github.com/tc39/proposal-float16array
  f16round: fn,
  // https://github.com/tc39/proposal-math-sum
  sumPrecise: fn,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idivmod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imuldiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  irem: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  mod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
  irandom: false
};
var permitted = {
  // ECMA https://tc39.es/ecma262
  // The intrinsics object has no prototype to avoid conflicts.
  "[[Proto]]": null,
  // %ThrowTypeError%
  "%ThrowTypeError%": fn,
  // *** The Global Object
  // *** Value Properties of the Global Object
  Infinity: "number",
  NaN: "number",
  undefined: "undefined",
  // *** Function Properties of the Global Object
  // eval
  "%UniqueEval%": fn,
  isFinite: fn,
  isNaN: fn,
  parseFloat: fn,
  parseInt: fn,
  decodeURI: fn,
  decodeURIComponent: fn,
  encodeURI: fn,
  encodeURIComponent: fn,
  // *** Fundamental Objects
  Object: {
    // Properties of the Object Constructor
    "[[Proto]]": "%FunctionPrototype%",
    assign: fn,
    create: fn,
    defineProperties: fn,
    defineProperty: fn,
    entries: fn,
    freeze: fn,
    fromEntries: fn,
    getOwnPropertyDescriptor: fn,
    getOwnPropertyDescriptors: fn,
    getOwnPropertyNames: fn,
    getOwnPropertySymbols: fn,
    getPrototypeOf: fn,
    is: fn,
    isExtensible: fn,
    isFrozen: fn,
    isSealed: fn,
    keys: fn,
    preventExtensions: fn,
    prototype: "%ObjectPrototype%",
    seal: fn,
    setPrototypeOf: fn,
    values: fn,
    "RegisteredSymbol(harden)": {
      ...fn,
      // Installed with hardenTaming: 'unsafe'
      isFake: "boolean"
    },
    // https://github.com/tc39/proposal-accessible-object-hasownproperty
    hasOwn: fn,
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn,
    // Seen on QuickJS
    __getClass: false
  },
  "%ObjectPrototype%": {
    // Properties of the Object Prototype Object
    "[[Proto]]": null,
    constructor: "Object",
    hasOwnProperty: fn,
    isPrototypeOf: fn,
    propertyIsEnumerable: fn,
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,
    // Annex B: Additional Properties of the Object.prototype Object
    // See note in header about the difference between [[Proto]] and --proto--
    // special notations.
    "--proto--": accessor,
    __defineGetter__: fn,
    __defineSetter__: fn,
    __lookupGetter__: fn,
    __lookupSetter__: fn
  },
  "%UniqueFunction%": {
    // Properties of the Function Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%FunctionPrototype%"
  },
  "%InertFunction%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%FunctionPrototype%"
  },
  "%FunctionPrototype%": {
    apply: fn,
    bind: fn,
    call: fn,
    constructor: "%InertFunction%",
    toString: fn,
    "@@hasInstance": fn,
    // proposed but not yet std. To be removed if there
    caller: false,
    // proposed but not yet std. To be removed if there
    arguments: false,
    // Seen on QuickJS. TODO grab getter for use by console
    fileName: false,
    // Seen on QuickJS. TODO grab getter for use by console
    lineNumber: false
  },
  Boolean: {
    // Properties of the Boolean Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%BooleanPrototype%"
  },
  "%BooleanPrototype%": {
    constructor: "Boolean",
    toString: fn,
    valueOf: fn
  },
  "%SharedSymbol%": {
    // Properties of the Symbol Constructor
    "[[Proto]]": "%FunctionPrototype%",
    asyncIterator: "symbol",
    for: fn,
    hasInstance: "symbol",
    isConcatSpreadable: "symbol",
    iterator: "symbol",
    keyFor: fn,
    match: "symbol",
    matchAll: "symbol",
    prototype: "%SymbolPrototype%",
    replace: "symbol",
    search: "symbol",
    species: "symbol",
    split: "symbol",
    toPrimitive: "symbol",
    toStringTag: "symbol",
    unscopables: "symbol",
    // https://github.com/tc39/proposal-explicit-resource-management
    asyncDispose: "symbol",
    // https://github.com/tc39/proposal-explicit-resource-management
    dispose: "symbol",
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSimple: false,
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSetter: false,
    // Seen on QuickJS
    operatorSet: false
  },
  "%SymbolPrototype%": {
    // Properties of the Symbol Prototype Object
    constructor: "%SharedSymbol%",
    description: getter,
    toString: fn,
    valueOf: fn,
    "@@toPrimitive": fn,
    "@@toStringTag": "string"
  },
  "%InitialError%": {
    // Properties of the Error Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%ErrorPrototype%",
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn
  },
  "%SharedError%": {
    // Properties of the Error Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%ErrorPrototype%",
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn
  },
  "%ErrorPrototype%": {
    constructor: "%SharedError%",
    message: "string",
    name: "string",
    toString: fn,
    // proposed de-facto, assumed TODO
    // Seen on FF Nightly 88.0a1
    at: false,
    // Seen on FF and XS
    stack: accessor,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false
  },
  // NativeError
  EvalError: NativeError("%EvalErrorPrototype%"),
  RangeError: NativeError("%RangeErrorPrototype%"),
  ReferenceError: NativeError("%ReferenceErrorPrototype%"),
  SyntaxError: NativeError("%SyntaxErrorPrototype%"),
  TypeError: NativeError("%TypeErrorPrototype%"),
  URIError: NativeError("%URIErrorPrototype%"),
  // https://github.com/endojs/endo/issues/550
  AggregateError: NativeError("%AggregateErrorPrototype%"),
  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // SuppressedError: NativeError('%SuppressedErrorPrototype%'),
  "%EvalErrorPrototype%": NativeErrorPrototype("EvalError"),
  "%RangeErrorPrototype%": NativeErrorPrototype("RangeError"),
  "%ReferenceErrorPrototype%": NativeErrorPrototype("ReferenceError"),
  "%SyntaxErrorPrototype%": NativeErrorPrototype("SyntaxError"),
  "%TypeErrorPrototype%": NativeErrorPrototype("TypeError"),
  "%URIErrorPrototype%": NativeErrorPrototype("URIError"),
  // https://github.com/endojs/endo/issues/550
  "%AggregateErrorPrototype%": NativeErrorPrototype("AggregateError"),
  // TODO AggregateError .errors
  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // '%SuppressedErrorPrototype%': NativeErrorPrototype('SuppressedError'),
  // TODO SuppressedError .error
  // TODO SuppressedError .suppressed
  // *** Numbers and Dates
  Number: {
    // Properties of the Number Constructor
    "[[Proto]]": "%FunctionPrototype%",
    EPSILON: "number",
    isFinite: fn,
    isInteger: fn,
    isNaN: fn,
    isSafeInteger: fn,
    MAX_SAFE_INTEGER: "number",
    MAX_VALUE: "number",
    MIN_SAFE_INTEGER: "number",
    MIN_VALUE: "number",
    NaN: "number",
    NEGATIVE_INFINITY: "number",
    parseFloat: fn,
    parseInt: fn,
    POSITIVE_INFINITY: "number",
    prototype: "%NumberPrototype%"
  },
  "%NumberPrototype%": {
    // Properties of the Number Prototype Object
    constructor: "Number",
    toExponential: fn,
    toFixed: fn,
    toLocaleString: fn,
    toPrecision: fn,
    toString: fn,
    valueOf: fn
  },
  BigInt: {
    // Properties of the BigInt Constructor
    "[[Proto]]": "%FunctionPrototype%",
    asIntN: fn,
    asUintN: fn,
    prototype: "%BigIntPrototype%",
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    bitLength: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false,
    // Seen on QuickJS
    tdiv: false,
    // Seen on QuickJS
    fdiv: false,
    // Seen on QuickJS
    cdiv: false,
    // Seen on QuickJS
    ediv: false,
    // Seen on QuickJS
    tdivrem: false,
    // Seen on QuickJS
    fdivrem: false,
    // Seen on QuickJS
    cdivrem: false,
    // Seen on QuickJS
    edivrem: false,
    // Seen on QuickJS
    sqrt: false,
    // Seen on QuickJS
    sqrtrem: false,
    // Seen on QuickJS
    floorLog2: false,
    // Seen on QuickJS
    ctz: false
  },
  "%BigIntPrototype%": {
    constructor: "BigInt",
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,
    "@@toStringTag": "string"
  },
  "%InitialMath%": {
    ...CommonMath,
    // `%InitialMath%.random()` has the standard unsafe behavior
    random: fn
  },
  "%SharedMath%": {
    ...CommonMath,
    // `%SharedMath%.random()` is tamed to always throw
    random: fn
  },
  "%InitialDate%": {
    // Properties of the Date Constructor
    "[[Proto]]": "%FunctionPrototype%",
    now: fn,
    parse: fn,
    prototype: "%DatePrototype%",
    UTC: fn
  },
  "%SharedDate%": {
    // Properties of the Date Constructor
    "[[Proto]]": "%FunctionPrototype%",
    // `%SharedDate%.now()` is tamed to always throw
    now: fn,
    parse: fn,
    prototype: "%DatePrototype%",
    UTC: fn
  },
  "%DatePrototype%": {
    constructor: "%SharedDate%",
    getDate: fn,
    getDay: fn,
    getFullYear: fn,
    getHours: fn,
    getMilliseconds: fn,
    getMinutes: fn,
    getMonth: fn,
    getSeconds: fn,
    getTime: fn,
    getTimezoneOffset: fn,
    getUTCDate: fn,
    getUTCDay: fn,
    getUTCFullYear: fn,
    getUTCHours: fn,
    getUTCMilliseconds: fn,
    getUTCMinutes: fn,
    getUTCMonth: fn,
    getUTCSeconds: fn,
    setDate: fn,
    setFullYear: fn,
    setHours: fn,
    setMilliseconds: fn,
    setMinutes: fn,
    setMonth: fn,
    setSeconds: fn,
    setTime: fn,
    setUTCDate: fn,
    setUTCFullYear: fn,
    setUTCHours: fn,
    setUTCMilliseconds: fn,
    setUTCMinutes: fn,
    setUTCMonth: fn,
    setUTCSeconds: fn,
    toDateString: fn,
    toISOString: fn,
    toJSON: fn,
    toLocaleDateString: fn,
    toLocaleString: fn,
    toLocaleTimeString: fn,
    toString: fn,
    toTimeString: fn,
    toUTCString: fn,
    valueOf: fn,
    "@@toPrimitive": fn,
    // Annex B: Additional Properties of the Date.prototype Object
    getYear: fn,
    setYear: fn,
    toGMTString: fn
  },
  // Text Processing
  String: {
    // Properties of the String Constructor
    "[[Proto]]": "%FunctionPrototype%",
    fromCharCode: fn,
    fromCodePoint: fn,
    prototype: "%StringPrototype%",
    raw: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false
  },
  "%StringPrototype%": {
    // Properties of the String Prototype Object
    length: "number",
    charAt: fn,
    charCodeAt: fn,
    codePointAt: fn,
    concat: fn,
    constructor: "String",
    endsWith: fn,
    includes: fn,
    indexOf: fn,
    lastIndexOf: fn,
    localeCompare: fn,
    match: fn,
    matchAll: fn,
    normalize: fn,
    padEnd: fn,
    padStart: fn,
    repeat: fn,
    replace: fn,
    replaceAll: fn,
    search: fn,
    slice: fn,
    split: fn,
    startsWith: fn,
    substring: fn,
    toLocaleLowerCase: fn,
    toLocaleUpperCase: fn,
    toLowerCase: fn,
    toString: fn,
    toUpperCase: fn,
    trim: fn,
    trimEnd: fn,
    trimStart: fn,
    valueOf: fn,
    "@@iterator": fn,
    // Failed tc39 proposal
    // https://github.com/tc39/proposal-relative-indexing-method
    at: fn,
    // https://github.com/tc39/proposal-is-usv-string
    isWellFormed: fn,
    toWellFormed: fn,
    unicodeSets: fn,
    // Annex B: Additional Properties of the String.prototype Object
    substr: fn,
    anchor: fn,
    big: fn,
    blink: fn,
    bold: fn,
    fixed: fn,
    fontcolor: fn,
    fontsize: fn,
    italics: fn,
    link: fn,
    small: fn,
    strike: fn,
    sub: fn,
    sup: fn,
    trimLeft: fn,
    trimRight: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    compare: false,
    // Seen on QuickJS
    __quote: false
  },
  "%StringIteratorPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  "%InitialRegExp%": {
    // Properties of the RegExp Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%RegExpPrototype%",
    "@@species": getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn,
    // The https://github.com/tc39/proposal-regexp-legacy-features
    // are all optional, unsafe, and omitted
    input: false,
    $_: false,
    lastMatch: false,
    "$&": false,
    lastParen: false,
    "$+": false,
    leftContext: false,
    "$`": false,
    rightContext: false,
    "$'": false,
    $1: false,
    $2: false,
    $3: false,
    $4: false,
    $5: false,
    $6: false,
    $7: false,
    $8: false,
    $9: false
  },
  "%SharedRegExp%": {
    // Properties of the RegExp Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%RegExpPrototype%",
    "@@species": getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn
  },
  "%RegExpPrototype%": {
    // Properties of the RegExp Prototype Object
    constructor: "%SharedRegExp%",
    exec: fn,
    dotAll: getter,
    flags: getter,
    global: getter,
    hasIndices: getter,
    ignoreCase: getter,
    "@@match": fn,
    "@@matchAll": fn,
    multiline: getter,
    "@@replace": fn,
    "@@search": fn,
    source: getter,
    "@@split": fn,
    sticky: getter,
    test: fn,
    toString: fn,
    unicode: getter,
    unicodeSets: getter,
    // Annex B: Additional Properties of the RegExp.prototype Object
    compile: false
  },
  "%RegExpStringIteratorPrototype%": {
    // The %RegExpStringIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  // Indexed Collections
  Array: {
    // Properties of the Array Constructor
    "[[Proto]]": "%FunctionPrototype%",
    from: fn,
    isArray: fn,
    of: fn,
    prototype: "%ArrayPrototype%",
    "@@species": getter,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // https://tc39.es/proposal-array-from-async/
    fromAsync: fn
  },
  "%ArrayPrototype%": {
    // Properties of the Array Prototype Object
    length: "number",
    concat: fn,
    constructor: "Array",
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    flat: fn,
    flatMap: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    map: fn,
    pop: fn,
    push: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    shift: fn,
    slice: fn,
    some: fn,
    sort: fn,
    splice: fn,
    toLocaleString: fn,
    toString: fn,
    unshift: fn,
    values: fn,
    "@@iterator": fn,
    "@@unscopables": {
      "[[Proto]]": null,
      copyWithin: "boolean",
      entries: "boolean",
      fill: "boolean",
      find: "boolean",
      findIndex: "boolean",
      flat: "boolean",
      flatMap: "boolean",
      includes: "boolean",
      keys: "boolean",
      values: "boolean",
      // Failed tc39 proposal
      // https://tc39.es/proposal-relative-indexing-method/
      // Seen on FF Nightly 88.0a1
      at: "boolean",
      // See https://github.com/tc39/proposal-array-find-from-last
      findLast: "boolean",
      findLastIndex: "boolean",
      // https://github.com/tc39/proposal-change-array-by-copy
      toReversed: "boolean",
      toSorted: "boolean",
      toSpliced: "boolean",
      with: "boolean",
      // https://github.com/tc39/proposal-array-grouping
      group: "boolean",
      groupToMap: "boolean",
      groupBy: "boolean"
    },
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    toSpliced: fn,
    with: fn,
    // https://github.com/tc39/proposal-array-grouping
    group: fn,
    groupToMap: fn,
    groupBy: fn,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn
  },
  "%ArrayIteratorPrototype%": {
    // The %ArrayIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  // *** TypedArray Objects
  "%TypedArray%": {
    // Properties of the %TypedArray% Intrinsic Object
    "[[Proto]]": "%FunctionPrototype%",
    from: fn,
    of: fn,
    prototype: "%TypedArrayPrototype%",
    "@@species": getter
  },
  "%TypedArrayPrototype%": {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: "%TypedArray%",
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    length: getter,
    map: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    set: fn,
    slice: fn,
    some: fn,
    sort: fn,
    subarray: fn,
    toLocaleString: fn,
    toString: fn,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": getter,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    with: fn
  },
  // The TypedArray Constructors
  BigInt64Array: TypedArray("%BigInt64ArrayPrototype%"),
  BigUint64Array: TypedArray("%BigUint64ArrayPrototype%"),
  // https://github.com/tc39/proposal-float16array
  Float16Array: TypedArray("%Float16ArrayPrototype%"),
  Float32Array: TypedArray("%Float32ArrayPrototype%"),
  Float64Array: TypedArray("%Float64ArrayPrototype%"),
  Int16Array: TypedArray("%Int16ArrayPrototype%"),
  Int32Array: TypedArray("%Int32ArrayPrototype%"),
  Int8Array: TypedArray("%Int8ArrayPrototype%"),
  Uint16Array: TypedArray("%Uint16ArrayPrototype%"),
  Uint32Array: TypedArray("%Uint32ArrayPrototype%"),
  Uint8ClampedArray: TypedArray("%Uint8ClampedArrayPrototype%"),
  Uint8Array: {
    ...TypedArray("%Uint8ArrayPrototype%"),
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromHex: fn
  },
  "%BigInt64ArrayPrototype%": TypedArrayPrototype("BigInt64Array"),
  "%BigUint64ArrayPrototype%": TypedArrayPrototype("BigUint64Array"),
  // https://github.com/tc39/proposal-float16array
  "%Float16ArrayPrototype%": TypedArrayPrototype("Float16Array"),
  "%Float32ArrayPrototype%": TypedArrayPrototype("Float32Array"),
  "%Float64ArrayPrototype%": TypedArrayPrototype("Float64Array"),
  "%Int16ArrayPrototype%": TypedArrayPrototype("Int16Array"),
  "%Int32ArrayPrototype%": TypedArrayPrototype("Int32Array"),
  "%Int8ArrayPrototype%": TypedArrayPrototype("Int8Array"),
  "%Uint16ArrayPrototype%": TypedArrayPrototype("Uint16Array"),
  "%Uint32ArrayPrototype%": TypedArrayPrototype("Uint32Array"),
  "%Uint8ClampedArrayPrototype%": TypedArrayPrototype("Uint8ClampedArray"),
  "%Uint8ArrayPrototype%": {
    ...TypedArrayPrototype("Uint8Array"),
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromHex: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toHex: fn
  },
  // *** Keyed Collections
  Map: {
    // Properties of the Map Constructor
    "[[Proto]]": "%FunctionPrototype%",
    "@@species": getter,
    prototype: "%MapPrototype%",
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn
  },
  "%MapPrototype%": {
    clear: fn,
    constructor: "Map",
    delete: fn,
    entries: fn,
    forEach: fn,
    get: fn,
    has: fn,
    keys: fn,
    set: fn,
    size: getter,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": "string"
  },
  "%MapIteratorPrototype%": {
    // The %MapIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  Set: {
    // Properties of the Set Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%SetPrototype%",
    "@@species": getter,
    // Seen on QuickJS
    groupBy: false
  },
  "%SetPrototype%": {
    add: fn,
    clear: fn,
    constructor: "Set",
    delete: fn,
    entries: fn,
    forEach: fn,
    has: fn,
    keys: fn,
    size: getter,
    values: fn,
    "@@iterator": fn,
    "@@toStringTag": "string",
    // See https://github.com/tc39/proposal-set-methods
    intersection: fn,
    // See https://github.com/tc39/proposal-set-methods
    union: fn,
    // See https://github.com/tc39/proposal-set-methods
    difference: fn,
    // See https://github.com/tc39/proposal-set-methods
    symmetricDifference: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSubsetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSupersetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isDisjointFrom: fn
  },
  "%SetIteratorPrototype%": {
    // The %SetIteratorPrototype% Object
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    "@@toStringTag": "string"
  },
  WeakMap: {
    // Properties of the WeakMap Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%WeakMapPrototype%"
  },
  "%WeakMapPrototype%": {
    constructor: "WeakMap",
    delete: fn,
    get: fn,
    has: fn,
    set: fn,
    "@@toStringTag": "string"
  },
  WeakSet: {
    // Properties of the WeakSet Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%WeakSetPrototype%"
  },
  "%WeakSetPrototype%": {
    add: fn,
    constructor: "WeakSet",
    delete: fn,
    has: fn,
    "@@toStringTag": "string"
  },
  // *** Structured Data
  ArrayBuffer: {
    // Properties of the ArrayBuffer Constructor
    "[[Proto]]": "%FunctionPrototype%",
    isView: fn,
    prototype: "%ArrayBufferPrototype%",
    "@@species": getter,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromString: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromBigInt: false
  },
  "%ArrayBufferPrototype%": {
    byteLength: getter,
    constructor: "ArrayBuffer",
    slice: fn,
    "@@toStringTag": "string",
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    concat: false,
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter
  },
  // If this exists, it is purely an artifact of how we currently shim
  // `transferToImmutable`. As natively implemented, there would be no
  // such extra prototype.
  "%ImmutableArrayBufferPrototype%": {
    "[[Proto]]": "%ArrayBufferPrototype%",
    byteLength: getter,
    slice: fn,
    // See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
    "@@toStringTag": "string",
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter
  },
  // SharedArrayBuffer Objects
  SharedArrayBuffer: false,
  "%SharedArrayBufferPrototype%": false,
  DataView: {
    // Properties of the DataView Constructor
    "[[Proto]]": "%FunctionPrototype%",
    BYTES_PER_ELEMENT: "number",
    prototype: "%DataViewPrototype%"
  },
  "%DataViewPrototype%": {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: "DataView",
    getBigInt64: fn,
    getBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    getFloat16: fn,
    getFloat32: fn,
    getFloat64: fn,
    getInt8: fn,
    getInt16: fn,
    getInt32: fn,
    getUint8: fn,
    getUint16: fn,
    getUint32: fn,
    setBigInt64: fn,
    setBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    setFloat16: fn,
    setFloat32: fn,
    setFloat64: fn,
    setInt8: fn,
    setInt16: fn,
    setInt32: fn,
    setUint8: fn,
    setUint16: fn,
    setUint32: fn,
    "@@toStringTag": "string"
  },
  // Atomics
  Atomics: false,
  JSON: {
    parse: fn,
    stringify: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-json-parse-with-source/
    rawJSON: fn,
    isRawJSON: fn
  },
  // *** Control Abstraction Objects
  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: {
    // Properties of the Iterator Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%IteratorPrototype%",
    from: fn,
    // https://github.com/tc39/proposal-joint-iteration
    zip: fn,
    zipKeyed: fn,
    // https://github.com/tc39/proposal-iterator-sequencing
    concat: fn
  },
  "%IteratorPrototype%": {
    // The %IteratorPrototype% Object
    "@@iterator": fn,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: "Iterator",
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-async-iterator-helpers
    toAsync: fn,
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    "@@dispose": false
  },
  // https://github.com/tc39/proposal-iterator-helpers
  "%WrapForValidIteratorPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    return: fn
  },
  // https://github.com/tc39/proposal-iterator-helpers
  "%IteratorHelperPrototype%": {
    "[[Proto]]": "%IteratorPrototype%",
    next: fn,
    return: fn,
    "@@toStringTag": "string"
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: {
    // Properties of the Iterator Constructor
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%AsyncIteratorPrototype%",
    from: fn
  },
  "%AsyncIteratorPrototype%": {
    // The %AsyncIteratorPrototype% Object
    "@@asyncIterator": fn,
    // https://github.com/tc39/proposal-async-iterator-helpers
    constructor: "AsyncIterator",
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    "@@asyncDispose": false
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  "%WrapForValidAsyncIteratorPrototype%": {
    "[[Proto]]": "%AsyncIteratorPrototype%",
    next: fn,
    return: fn
  },
  // https://github.com/tc39/proposal-async-iterator-helpers
  "%AsyncIteratorHelperPrototype%": {
    "[[Proto]]": "%AsyncIteratorPrototype%",
    next: fn,
    return: fn,
    "@@toStringTag": "string"
  },
  "%InertGeneratorFunction%": {
    // Properties of the GeneratorFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%Generator%"
  },
  "%Generator%": {
    // Properties of the GeneratorFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertGeneratorFunction%",
    prototype: "%GeneratorPrototype%",
    "@@toStringTag": "string"
  },
  "%InertAsyncGeneratorFunction%": {
    // Properties of the AsyncGeneratorFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%AsyncGenerator%"
  },
  "%AsyncGenerator%": {
    // Properties of the AsyncGeneratorFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertAsyncGeneratorFunction%",
    prototype: "%AsyncGeneratorPrototype%",
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: "number",
    "@@toStringTag": "string"
  },
  "%GeneratorPrototype%": {
    // Properties of the Generator Prototype Object
    "[[Proto]]": "%IteratorPrototype%",
    constructor: "%Generator%",
    next: fn,
    return: fn,
    throw: fn,
    "@@toStringTag": "string"
  },
  "%AsyncGeneratorPrototype%": {
    // Properties of the AsyncGenerator Prototype Object
    "[[Proto]]": "%AsyncIteratorPrototype%",
    constructor: "%AsyncGenerator%",
    next: fn,
    return: fn,
    throw: fn,
    "@@toStringTag": "string"
  },
  // TODO: To be replaced with Promise.delegate
  //
  // The HandledPromise global variable shimmed by `@agoric/eventual-send/shim`
  // implements an initial version of the eventual send specification at:
  // https://github.com/tc39/proposal-eventual-send
  //
  // We will likely change this to add a property to Promise called
  // Promise.delegate and put static methods on it, which will necessitate
  // another permits change to update to the current proposed standard.
  HandledPromise: {
    "[[Proto]]": "Promise",
    applyFunction: fn,
    applyFunctionSendOnly: fn,
    applyMethod: fn,
    applyMethodSendOnly: fn,
    get: fn,
    getSendOnly: fn,
    prototype: "%PromisePrototype%",
    resolve: fn
  },
  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source
  ModuleSource: {
    "[[Proto]]": "%AbstractModuleSource%",
    prototype: "%ModuleSourcePrototype%"
  },
  "%ModuleSourcePrototype%": {
    "[[Proto]]": "%AbstractModuleSourcePrototype%",
    constructor: "ModuleSource",
    "@@toStringTag": "string",
    // https://github.com/tc39/proposal-compartments
    bindings: getter,
    needsImport: getter,
    needsImportMeta: getter,
    // @endo/module-source provides a legacy interface
    imports: getter,
    exports: getter,
    reexports: getter
  },
  "%AbstractModuleSource%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%AbstractModuleSourcePrototype%"
  },
  "%AbstractModuleSourcePrototype%": {
    constructor: "%AbstractModuleSource%"
  },
  Promise: {
    // Properties of the Promise Constructor
    "[[Proto]]": "%FunctionPrototype%",
    all: fn,
    allSettled: fn,
    // https://github.com/Agoric/SES-shim/issues/550
    any: fn,
    prototype: "%PromisePrototype%",
    race: fn,
    reject: fn,
    resolve: fn,
    // https://github.com/tc39/proposal-promise-with-resolvers
    withResolvers: fn,
    "@@species": getter,
    // https://github.com/tc39/proposal-promise-try
    try: fn
  },
  "%PromisePrototype%": {
    // Properties of the Promise Prototype Object
    catch: fn,
    constructor: "Promise",
    finally: fn,
    then: fn,
    "@@toStringTag": "string",
    // Non-standard, used in node to prevent async_hooks from breaking
    "UniqueSymbol(async_id_symbol)": accessor,
    "UniqueSymbol(trigger_async_id_symbol)": accessor,
    "UniqueSymbol(destroyed)": accessor
  },
  "%InertAsyncFunction%": {
    // Properties of the AsyncFunction Constructor
    "[[Proto]]": "%InertFunction%",
    prototype: "%AsyncFunctionPrototype%"
  },
  "%AsyncFunctionPrototype%": {
    // Properties of the AsyncFunction Prototype Object
    "[[Proto]]": "%FunctionPrototype%",
    constructor: "%InertAsyncFunction%",
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: "number",
    "@@toStringTag": "string"
  },
  // Reflection
  Reflect: {
    // The Reflect Object
    // Not a function object.
    apply: fn,
    construct: fn,
    defineProperty: fn,
    deleteProperty: fn,
    get: fn,
    getOwnPropertyDescriptor: fn,
    getPrototypeOf: fn,
    has: fn,
    isExtensible: fn,
    ownKeys: fn,
    preventExtensions: fn,
    set: fn,
    setPrototypeOf: fn,
    "@@toStringTag": "string"
  },
  Proxy: {
    // Properties of the Proxy Constructor
    "[[Proto]]": "%FunctionPrototype%",
    revocable: fn
  },
  // Appendix B
  // Annex B: Additional Properties of the Global Object
  escape: fn,
  unescape: fn,
  // Proposed
  "%UniqueCompartment%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%CompartmentPrototype%",
    toString: fn
  },
  "%InertCompartment%": {
    "[[Proto]]": "%FunctionPrototype%",
    prototype: "%CompartmentPrototype%",
    toString: fn
  },
  "%CompartmentPrototype%": {
    constructor: "%InertCompartment%",
    evaluate: fn,
    globalThis: getter,
    name: getter,
    import: asyncFn,
    load: asyncFn,
    importNow: fn,
    module: fn,
    "@@toStringTag": "string"
  },
  lockdown: fn,
  harden: {
    ...fn,
    isFake: "boolean"
  },
  "%InitialGetStackString%": fn
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/intrinsics.js
var isFunction = (obj) => typeof obj === "function";
function initProperty(obj, name, desc) {
  if (hasOwn(obj, name)) {
    const preDesc = getOwnPropertyDescriptor(obj, name);
    if (!preDesc || !is(preDesc.value, desc.value) || preDesc.get !== desc.get || preDesc.set !== desc.set || preDesc.writable !== desc.writable || preDesc.enumerable !== desc.enumerable || preDesc.configurable !== desc.configurable) {
      throw TypeError2(`Conflicting definitions of ${name}`);
    }
  }
  defineProperty(obj, name, desc);
}
function initProperties(obj, descs) {
  for (const [name, desc] of entries(descs)) {
    initProperty(obj, name, desc);
  }
}
function sampleGlobals(globalObject, newPropertyNames) {
  const newIntrinsics = {
    __proto__: null
  };
  for (const [globalName, intrinsicName] of entries(newPropertyNames)) {
    if (hasOwn(globalObject, globalName)) {
      newIntrinsics[intrinsicName] = globalObject[globalName];
    }
  }
  return newIntrinsics;
}
var makeIntrinsicsCollector = (reporter) => {
  const intrinsics = create(null);
  let pseudoNatives;
  const addIntrinsics = (newIntrinsics) => {
    initProperties(intrinsics, getOwnPropertyDescriptors(newIntrinsics));
  };
  freeze(addIntrinsics);
  const completePrototypes = () => {
    for (const [name, intrinsic] of entries(intrinsics)) {
      if (isPrimitive(intrinsic)) {
        continue;
      }
      if (!hasOwn(intrinsic, "prototype")) {
        continue;
      }
      const permit = permitted[name];
      if (typeof permit !== "object") {
        throw TypeError2(`Expected permit object at permits.${name}`);
      }
      const namePrototype = permit.prototype;
      if (!namePrototype) {
        cauterizeProperty(intrinsic, "prototype", false, `${name}.prototype`, reporter);
        continue;
      }
      if (typeof namePrototype !== "string" || !hasOwn(permitted, namePrototype)) {
        throw TypeError2(`Unrecognized ${name}.prototype permits entry`);
      }
      const intrinsicPrototype = intrinsic.prototype;
      if (hasOwn(intrinsics, namePrototype)) {
        if (intrinsics[namePrototype] !== intrinsicPrototype) {
          throw TypeError2(`Conflicting bindings of ${namePrototype}`);
        }
        continue;
      }
      intrinsics[namePrototype] = intrinsicPrototype;
    }
  };
  freeze(completePrototypes);
  const finalIntrinsics = () => {
    freeze(intrinsics);
    pseudoNatives = new WeakSet2(arrayFilter(values(intrinsics), isFunction));
    return intrinsics;
  };
  freeze(finalIntrinsics);
  const isPseudoNative = (obj) => {
    if (!pseudoNatives) {
      throw TypeError2("isPseudoNative can only be called after finalIntrinsics");
    }
    return weaksetHas(pseudoNatives, obj);
  };
  freeze(isPseudoNative);
  const intrinsicsCollector = {
    addIntrinsics,
    completePrototypes,
    finalIntrinsics,
    isPseudoNative
  };
  freeze(intrinsicsCollector);
  addIntrinsics(constantProperties);
  addIntrinsics(sampleGlobals(universalThis, universalPropertyNames));
  return intrinsicsCollector;
};
var getGlobalIntrinsics = (globalObject, reporter) => {
  const { addIntrinsics, finalIntrinsics } = makeIntrinsicsCollector(reporter);
  addIntrinsics(sampleGlobals(globalObject, sharedGlobalPropertyNames));
  return finalIntrinsics();
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/permits-intrinsics.js
function removeUnpermittedIntrinsics(intrinsics, markVirtualizedNativeFunction3, reporter) {
  const primitives = [
    "undefined",
    "boolean",
    "number",
    "string",
    "symbol"
  ];
  const wellKnownSymbolNames = new Map2(Symbol2 ? arrayMap(arrayFilter(entries(permitted["%SharedSymbol%"]), ([name, permit]) => permit === "symbol" && typeof Symbol2[name] === "symbol"), ([name]) => [
    Symbol2[name],
    `@@${name}`
  ]) : []);
  function asStringPropertyName(path, prop) {
    if (typeof prop === "string") {
      return prop;
    }
    const wellKnownSymbol = mapGet(wellKnownSymbolNames, prop);
    if (typeof prop === "symbol") {
      if (wellKnownSymbol) {
        return wellKnownSymbol;
      } else {
        const registeredKey = symbolKeyFor(prop);
        if (registeredKey !== void 0) {
          return `RegisteredSymbol(${registeredKey})`;
        } else {
          return `Unique${String2(prop)}`;
        }
      }
    }
    throw TypeError2(`Unexpected property name type ${path} ${prop}`);
  }
  function visitPrototype(path, obj, protoName) {
    if (isPrimitive(obj)) {
      throw TypeError2(`Object expected: ${path}, ${String2(obj)}, ${protoName}`);
    }
    const proto = getPrototypeOf(obj);
    if (proto === null && protoName === null) {
      return;
    }
    if (protoName !== void 0 && typeof protoName !== "string") {
      throw TypeError2(`Malformed permit ${path}.__proto__`);
    }
    if (proto === intrinsics[protoName || "%ObjectPrototype%"]) {
      return;
    }
    throw TypeError2(`Unexpected [[Prototype]] at ${path}.__proto__ (expected ${protoName || "%ObjectPrototype%"})`);
  }
  function isAllowedPropertyValue(path, value, prop, permit) {
    if (typeof permit === "object") {
      visitProperties(path, value, permit);
      return true;
    }
    if (permit === false) {
      return false;
    }
    if (typeof permit === "string") {
      if (prop === "prototype" || prop === "constructor") {
        if (hasOwn(intrinsics, permit)) {
          if (value !== intrinsics[permit]) {
            throw TypeError2(`Does not match permit for ${path}`);
          }
          return true;
        }
      } else {
        if (arrayIncludes(primitives, permit)) {
          if (typeof value !== permit) {
            throw TypeError2(`At ${path} expected ${permit} not ${typeof value}`);
          }
          return true;
        }
      }
    }
    throw TypeError2(`Unexpected property ${prop} with permit ${permit} at ${path}`);
  }
  function isAllowedProperty(path, obj, prop, permit) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      throw TypeError2(`Property ${prop} not found at ${path}`);
    }
    if (hasOwn(desc, "value")) {
      if (isAccessorPermit(permit)) {
        throw TypeError2(`Accessor expected at ${path}`);
      }
      return isAllowedPropertyValue(path, desc.value, prop, permit);
    }
    if (!isAccessorPermit(permit)) {
      throw TypeError2(`Accessor not expected at ${path}`);
    }
    return isAllowedPropertyValue(`${path}<get>`, desc.get, prop, permit.get) && isAllowedPropertyValue(`${path}<set>`, desc.set, prop, permit.set);
  }
  function getSubPermit(obj, permit, prop) {
    const permitProp = prop === "__proto__" ? "--proto--" : prop;
    if (hasOwn(permit, permitProp)) {
      return permit[permitProp];
    }
    if (typeof obj === "function") {
      if (hasOwn(FunctionInstance, permitProp)) {
        return FunctionInstance[permitProp];
      }
    }
    return void 0;
  }
  function visitProperties(path, obj, permit) {
    if (obj === void 0 || obj === null) {
      return;
    }
    const protoName = permit["[[Proto]]"];
    visitPrototype(path, obj, protoName);
    if (typeof obj === "function") {
      markVirtualizedNativeFunction3(obj);
    }
    for (const prop of ownKeys(obj)) {
      const propString = asStringPropertyName(path, prop);
      const subPath = `${path}.${propString}`;
      const subPermit = getSubPermit(obj, permit, propString);
      if (!subPermit || !isAllowedProperty(subPath, obj, prop, subPermit)) {
        cauterizeProperty(obj, prop, subPermit === false, subPath, reporter);
      }
    }
  }
  visitProperties("intrinsics", intrinsics, permitted);
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-function-constructors.js
function tameFunctionConstructors() {
  try {
    FERAL_FUNCTION.prototype.constructor("return 1");
  } catch (ignore) {
    return freeze({});
  }
  const newIntrinsics = {};
  function repairFunction(name, intrinsicName, declaration) {
    let FunctionInstance2;
    try {
      FunctionInstance2 = (0, eval)(declaration);
    } catch (e) {
      if (e instanceof SyntaxError2) {
        return;
      }
      throw e;
    }
    const FunctionPrototype = getPrototypeOf(FunctionInstance2);
    const InertConstructor = function() {
      throw TypeError2("Function.prototype.constructor is not a valid constructor.");
    };
    defineProperties(InertConstructor, {
      prototype: {
        value: FunctionPrototype
      },
      name: {
        value: name,
        writable: false,
        enumerable: false,
        configurable: true
      }
    });
    defineProperties(FunctionPrototype, {
      constructor: {
        value: InertConstructor
      }
    });
    if (InertConstructor !== FERAL_FUNCTION.prototype.constructor) {
      setPrototypeOf(InertConstructor, FERAL_FUNCTION.prototype.constructor);
    }
    newIntrinsics[intrinsicName] = InertConstructor;
  }
  repairFunction("Function", "%InertFunction%", "(function(){})");
  repairFunction("GeneratorFunction", "%InertGeneratorFunction%", "(function*(){})");
  repairFunction("AsyncFunction", "%InertAsyncFunction%", "(async function(){})");
  if (AsyncGeneratorFunctionInstance !== void 0) {
    repairFunction("AsyncGeneratorFunction", "%InertAsyncGeneratorFunction%", "(async function*(){})");
  }
  return newIntrinsics;
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-date-constructor.js
function tameDateConstructor() {
  const OriginalDate = Date2;
  const DatePrototype = OriginalDate.prototype;
  const tamedMethods3 = {
    /**
     * `%SharedDate%.now()` throw a `TypeError` starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    now() {
      throw TypeError2("secure mode Calling %SharedDate%.now() throws");
    }
  };
  const makeDateConstructor = ({ powers: powers2 = "none" } = {}) => {
    let ResultDate;
    if (powers2 === "original") {
      ResultDate = function Date3(...rest) {
        if (new.target === void 0) {
          return apply(OriginalDate, void 0, rest);
        }
        return construct(OriginalDate, rest, new.target);
      };
    } else {
      ResultDate = function Date3(...rest) {
        if (new.target === void 0) {
          throw TypeError2("secure mode Calling %SharedDate% constructor as a function throws");
        }
        if (rest.length === 0) {
          throw TypeError2("secure mode Calling new %SharedDate%() with no arguments throws");
        }
        return construct(OriginalDate, rest, new.target);
      };
    }
    defineProperties(ResultDate, {
      length: {
        value: 7
      },
      prototype: {
        value: DatePrototype,
        writable: false,
        enumerable: false,
        configurable: false
      },
      parse: {
        value: OriginalDate.parse,
        writable: true,
        enumerable: false,
        configurable: true
      },
      UTC: {
        value: OriginalDate.UTC,
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    return ResultDate;
  };
  const InitialDate = makeDateConstructor({
    powers: "original"
  });
  const SharedDate = makeDateConstructor({
    powers: "none"
  });
  defineProperties(InitialDate, {
    now: {
      value: OriginalDate.now,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  defineProperties(SharedDate, {
    now: {
      value: tamedMethods3.now,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  defineProperties(DatePrototype, {
    constructor: {
      value: SharedDate
    }
  });
  return {
    "%InitialDate%": InitialDate,
    "%SharedDate%": SharedDate
  };
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-math-object.js
function tameMathObject() {
  const originalMath = Math2;
  const initialMath = originalMath;
  const { random: _, ...otherDescriptors } = getOwnPropertyDescriptors(originalMath);
  const tamedMethods3 = {
    /**
     * `%SharedMath%.random()` throws a TypeError starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    random() {
      throw TypeError2("secure mode %SharedMath%.random() throws");
    }
  };
  const sharedMath = create(objectPrototype, {
    ...otherDescriptors,
    random: {
      value: tamedMethods3.random,
      writable: true,
      enumerable: false,
      configurable: true
    }
  });
  return {
    "%InitialMath%": initialMath,
    "%SharedMath%": sharedMath
  };
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-regexp-constructor.js
function tameRegExpConstructor(regExpTaming = "safe") {
  const RegExpPrototype = FERAL_REG_EXP.prototype;
  const makeRegExpConstructor = (_ = {}) => {
    const ResultRegExp = function RegExp2(...rest) {
      if (new.target === void 0) {
        return FERAL_REG_EXP(...rest);
      }
      return construct(FERAL_REG_EXP, rest, new.target);
    };
    defineProperties(ResultRegExp, {
      length: {
        value: 2
      },
      prototype: {
        value: RegExpPrototype,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
    if (speciesSymbol) {
      const speciesDesc = getOwnPropertyDescriptor(FERAL_REG_EXP, speciesSymbol);
      if (!speciesDesc) {
        throw TypeError2("no RegExp[Symbol.species] descriptor");
      }
      defineProperties(ResultRegExp, {
        [speciesSymbol]: speciesDesc
      });
    }
    return ResultRegExp;
  };
  const InitialRegExp = makeRegExpConstructor();
  const SharedRegExp = makeRegExpConstructor();
  if (regExpTaming !== "unsafe") {
    delete RegExpPrototype.compile;
  }
  defineProperties(RegExpPrototype, {
    constructor: {
      value: SharedRegExp
    }
  });
  return {
    "%InitialRegExp%": InitialRegExp,
    "%SharedRegExp%": SharedRegExp
  };
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/enablements.js
var minEnablements = {
  "%ObjectPrototype%": {
    toString: true
  },
  "%FunctionPrototype%": {
    toString: true
  },
  "%ErrorPrototype%": {
    name: true
  },
  "%IteratorPrototype%": {
    toString: true,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: true,
    // https://github.com/tc39/proposal-iterator-helpers
    [toStringTagSymbol]: true
  }
};
var moderateEnablements = {
  ...minEnablements,
  "%ObjectPrototype%": {
    toString: true,
    valueOf: true
  },
  "%ArrayPrototype%": {
    toString: true,
    push: true,
    concat: true,
    [iteratorSymbol]: true
  },
  "%IteratorPrototype%": {
    [iteratorSymbol]: true
  },
  // Function.prototype has no 'prototype' property to enable.
  // Function instances have their own 'name' and 'length' properties
  // which are configurable and non-writable. Thus, they are already
  // non-assignable anyway.
  "%FunctionPrototype%": {
    constructor: true,
    bind: true,
    toString: true
  },
  "%ErrorPrototype%": {
    constructor: true,
    message: true,
    name: true,
    toString: true
  },
  "%TypeErrorPrototype%": {
    constructor: true,
    message: true,
    name: true
  },
  "%SyntaxErrorPrototype%": {
    message: true,
    name: true
  },
  "%RangeErrorPrototype%": {
    message: true,
    name: true
  },
  "%URIErrorPrototype%": {
    message: true,
    name: true
  },
  "%EvalErrorPrototype%": {
    message: true,
    name: true
  },
  "%ReferenceErrorPrototype%": {
    message: true,
    name: true
  },
  // https://github.com/endojs/endo/issues/550
  "%AggregateErrorPrototype%": {
    message: true,
    name: true
  },
  "%PromisePrototype%": {
    constructor: true
  },
  "%TypedArrayPrototype%": "*",
  "%Generator%": {
    constructor: true,
    name: true,
    toString: true
  }
};
var severeEnablements = {
  ...moderateEnablements,
  /**
   * Rollup (as used at least by vega) and webpack
   * (as used at least by regenerator) both turn exports into assignments
   * to a big `exports` object that inherits directly from
   * `Object.prototype`. Some of the exported names we've seen include
   * `hasOwnProperty`, `constructor`, and `toString`. But the strategy used
   * by rollup and webpack potentionally turns any exported name
   * into an assignment rejected by the override mistake. That's why
   * the `severe` enablements takes the extreme step of enabling
   * everything on `Object.prototype`.
   *
   * In addition, code doing inheritance manually will often override
   * the `constructor` property on the new prototype by assignment. We've
   * seen this several times.
   *
   * The cost of enabling all these is that they create a miserable debugging
   * experience specifically on Node.
   * https://github.com/Agoric/agoric-sdk/issues/2324
   * explains how it confused the Node console.
   *
   * (TODO Reexamine the vscode situation. I think it may have improved
   * since the following paragraph was written.)
   *
   * The vscode debugger's object inspector shows the own data properties of
   * an object, which is typically what you want, but also shows both getter
   * and setter for every accessor property whether inherited or own.
   * With the `'*'` setting here, all the properties inherited from
   * `Object.prototype` are accessors, creating an unusable display as seen
   * at As explained at
   * https://github.com/endojs/endo/blob/master/packages/ses/docs/lockdown.md#overridetaming-options
   * Open the triangles at the bottom of that section.
   */
  "%ObjectPrototype%": "*",
  /**
   * The widely used Buffer defined at https://github.com/feross/buffer
   * on initialization, manually creates the equivalent of a subclass of
   * `TypedArray`, which it then initializes by assignment. These assignments
   * include enough of the `TypeArray` methods that here, the `severe`
   * enablements just enable them all.
   */
  "%TypedArrayPrototype%": "*",
  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  "%MapPrototype%": "*",
  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  "%SetPrototype%": "*"
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/enable-property-overrides.js
function enablePropertyOverrides(intrinsics, overrideTaming, { warn }, overrideDebug = []) {
  const debugProperties = new Set2(overrideDebug);
  function enable(path, obj, prop, desc) {
    if ("value" in desc && desc.configurable) {
      const { value } = desc;
      const isDebug = setHas(debugProperties, prop);
      const { get: getter2, set: setter } = getOwnPropertyDescriptor({
        get [prop]() {
          return value;
        },
        set [prop](newValue) {
          if (obj === this) {
            throw TypeError2(`Cannot assign to read only property '${String2(prop)}' of '${path}'`);
          }
          if (hasOwn(this, prop)) {
            this[prop] = newValue;
          } else {
            if (isDebug) {
              warn(TypeError2(`Override property ${prop}`));
            }
            defineProperty(this, prop, {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      }, prop);
      defineProperty(getter2, "originalValue", {
        value,
        writable: false,
        enumerable: false,
        configurable: false
      });
      defineProperty(obj, prop, {
        get: getter2,
        set: setter,
        enumerable: desc.enumerable,
        configurable: desc.configurable
      });
    }
  }
  function enableProperty(path, obj, prop) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      return;
    }
    enable(path, obj, prop, desc);
  }
  function enableAllProperties(path, obj) {
    const descs = getOwnPropertyDescriptors(obj);
    if (!descs) {
      return;
    }
    arrayForEach(ownKeys(descs), (prop) => enable(path, obj, prop, descs[prop]));
  }
  function enableProperties(path, obj, plan2) {
    for (const prop of ownKeys(plan2)) {
      const desc = getOwnPropertyDescriptor(obj, prop);
      if (!desc || desc.get || desc.set) {
        continue;
      }
      const subPath = `${path}.${String2(prop)}`;
      const subPlan = plan2[prop];
      if (subPlan === true) {
        enableProperty(subPath, obj, prop);
      } else if (subPlan === "*") {
        enableAllProperties(subPath, desc.value);
      } else if (!isPrimitive(subPlan)) {
        enableProperties(subPath, desc.value, subPlan);
      } else {
        throw TypeError2(`Unexpected override enablement plan ${subPath}`);
      }
    }
  }
  let plan;
  switch (overrideTaming) {
    case "min": {
      plan = minEnablements;
      break;
    }
    case "moderate": {
      plan = moderateEnablements;
      break;
    }
    case "severe": {
      plan = severeEnablements;
      break;
    }
    default: {
      throw TypeError2(`unrecognized overrideTaming ${overrideTaming}`);
    }
  }
  enableProperties("root", intrinsics, plan);
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-locale-methods.js
var { Fail: Fail2, quote: q2 } = assert;
var localePattern = /^(\w*[a-z])Locale([A-Z]\w*)$/;
var tamedMethods = {
  // See https://tc39.es/ecma262/#sec-string.prototype.localecompare
  localeCompare(arg) {
    if (this === null || this === void 0) {
      throw TypeError2('Cannot localeCompare with null or undefined "this" value');
    }
    const s = `${this}`;
    const that = `${arg}`;
    if (s < that) {
      return -1;
    }
    if (s > that) {
      return 1;
    }
    s === that || Fail2`expected ${q2(s)} and ${q2(that)} to compare`;
    return 0;
  },
  toString() {
    return `${this}`;
  }
};
var nonLocaleCompare = tamedMethods.localeCompare;
var numberToString = tamedMethods.toString;
function tameLocaleMethods(intrinsics, localeTaming = "safe") {
  if (localeTaming === "unsafe") {
    return;
  }
  defineProperty(String2.prototype, "localeCompare", {
    value: nonLocaleCompare
  });
  for (const intrinsicName of getOwnPropertyNames(intrinsics)) {
    const intrinsic = intrinsics[intrinsicName];
    if (!isPrimitive(intrinsic)) {
      for (const methodName of getOwnPropertyNames(intrinsic)) {
        const match = regexpExec(localePattern, methodName);
        if (match) {
          typeof intrinsic[methodName] === "function" || Fail2`expected ${q2(methodName)} to be a function`;
          const nonLocaleMethodName = `${match[1]}${match[2]}`;
          const method = intrinsic[nonLocaleMethodName];
          typeof method === "function" || Fail2`function ${q2(nonLocaleMethodName)} not found`;
          defineProperty(intrinsic, methodName, {
            value: method
          });
        }
      }
    }
  }
  defineProperty(Number2.prototype, "toLocaleString", {
    value: numberToString
  });
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/make-eval-function.js
var makeEvalFunction = (evaluator) => {
  const newEval = {
    eval(source) {
      if (typeof source !== "string") {
        return source;
      }
      return evaluator(source);
    }
  }.eval;
  return newEval;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/make-function-constructor.js
var { Fail: Fail3 } = assert;
var makeFunctionConstructor = (evaluator) => {
  const newFunction = function Function2(_body) {
    const bodyText = `${arrayPop(arguments) || ""}`;
    const parameters = `${arrayJoin(arguments, ",")}`;
    new FERAL_FUNCTION(parameters, "");
    new FERAL_FUNCTION(bodyText);
    const src = `(function anonymous(${parameters}
) {
${bodyText}
})`;
    return evaluator(src);
  };
  defineProperties(newFunction, {
    // Ensure that any function created in any evaluator in a realm is an
    // instance of Function in any evaluator of the same realm.
    prototype: {
      value: FERAL_FUNCTION.prototype,
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
  getPrototypeOf(FERAL_FUNCTION) === FERAL_FUNCTION.prototype || Fail3`Function prototype is the same accross compartments`;
  getPrototypeOf(newFunction) === FERAL_FUNCTION.prototype || Fail3`Function constructor prototype is the same across compartments`;
  return newFunction;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/global-object.js
var setGlobalObjectSymbolUnscopables = (globalObject) => {
  defineProperty(globalObject, unscopablesSymbol, freeze(assign(create(null), {
    set: freeze(() => {
      throw TypeError2(`Cannot set Symbol.unscopables of a Compartment's globalThis`);
    }),
    enumerable: false,
    configurable: false
  })));
};
var setGlobalObjectConstantProperties = (globalObject) => {
  for (const [name, constant] of entries(constantProperties)) {
    defineProperty(globalObject, name, {
      value: constant,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
};
var setGlobalObjectMutableProperties = (globalObject, { intrinsics, newGlobalPropertyNames, makeCompartmentConstructor: makeCompartmentConstructor2, markVirtualizedNativeFunction: markVirtualizedNativeFunction3, parentCompartment }) => {
  for (const [name, intrinsicName] of entries(universalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  for (const [name, intrinsicName] of entries(newGlobalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }
  const perCompartmentGlobals = {
    globalThis: globalObject
  };
  perCompartmentGlobals.Compartment = freeze(makeCompartmentConstructor2(makeCompartmentConstructor2, intrinsics, markVirtualizedNativeFunction3, {
    parentCompartment,
    enforceNew: true
  }));
  for (const [name, value] of entries(perCompartmentGlobals)) {
    defineProperty(globalObject, name, {
      value,
      writable: true,
      enumerable: false,
      configurable: true
    });
    if (typeof value === "function") {
      markVirtualizedNativeFunction3(value);
    }
  }
};
var setGlobalObjectEvaluators = (globalObject, evaluator, markVirtualizedNativeFunction3) => {
  {
    const f = freeze(makeEvalFunction(evaluator));
    markVirtualizedNativeFunction3(f);
    defineProperty(globalObject, "eval", {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  {
    const f = freeze(makeFunctionConstructor(evaluator));
    markVirtualizedNativeFunction3(f);
    defineProperty(globalObject, "Function", {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/strict-scope-terminator.js
var { Fail: Fail4, quote: q3 } = assert;
var objTarget = freeze({
  __proto__: null
});
var alwaysThrowHandler = new Proxy2(objTarget, freeze({
  get(_shadow, prop) {
    Fail4`Please report unexpected scope handler trap: ${q3(String2(prop))}`;
  }
}));
var scopeProxyHandlerProperties = {
  get(_shadow, _prop) {
    return void 0;
  },
  set(_shadow, prop, _value) {
    throw ReferenceError2(`${String2(prop)} is not defined`);
  },
  has(_shadow, prop) {
    return true;
  },
  // note: this is likely a bug of safari
  // https://bugs.webkit.org/show_bug.cgi?id=195534
  getPrototypeOf(_shadow) {
    return null;
  },
  // See https://github.com/endojs/endo/issues/1510
  // TODO: report as bug to v8 or Chrome, and record issue link here.
  getOwnPropertyDescriptor(_shadow, prop) {
    const quotedProp = q3(String2(prop));
    console.warn(`getOwnPropertyDescriptor trap on scopeTerminatorHandler for ${quotedProp}`, TypeError2().stack);
    return void 0;
  },
  // See https://github.com/endojs/endo/issues/1490
  // TODO Report bug to JSC or Safari
  ownKeys(_shadow) {
    return [];
  }
};
var strictScopeTerminatorHandler = freeze(create(alwaysThrowHandler, getOwnPropertyDescriptors(scopeProxyHandlerProperties)));
var strictScopeTerminator = new Proxy2(objTarget, strictScopeTerminatorHandler);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/sloppy-globals-scope-terminator.js
var objTarget2 = freeze({
  __proto__: null
});
var createSloppyGlobalsScopeTerminator = (globalObject) => {
  const scopeProxyHandlerProperties2 = {
    // inherit scopeTerminator behavior
    ...strictScopeTerminatorHandler,
    // Redirect set properties to the globalObject.
    set(_shadow, prop, value) {
      return reflectSet(globalObject, prop, value);
    },
    // Always claim to have a potential property in order to be the recipient of a set
    has(_shadow, _prop) {
      return true;
    }
  };
  const sloppyGlobalsScopeTerminatorHandler = freeze(create(alwaysThrowHandler, getOwnPropertyDescriptors(scopeProxyHandlerProperties2)));
  const sloppyGlobalsScopeTerminator = new Proxy2(objTarget2, sloppyGlobalsScopeTerminatorHandler);
  return sloppyGlobalsScopeTerminator;
};
freeze(createSloppyGlobalsScopeTerminator);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/eval-scope.js
var { Fail: Fail5 } = assert;
var makeEvalScopeKit = () => {
  const evalScope = create(null);
  const oneTimeEvalProperties = freeze({
    eval: {
      get() {
        delete evalScope.eval;
        return FERAL_EVAL;
      },
      enumerable: false,
      configurable: true
    }
  });
  const evalScopeKit = {
    evalScope,
    allowNextEvalToBeUnsafe() {
      const { revoked } = evalScopeKit;
      if (revoked !== null) {
        Fail5`a handler did not reset allowNextEvalToBeUnsafe ${revoked.err}`;
      }
      defineProperties(evalScope, oneTimeEvalProperties);
    },
    /** @type {null | { err: any }} */
    revoked: null
  };
  return evalScopeKit;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/get-source-url.js
var sourceMetaEntryRegExp = "\\s*[@#]\\s*([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*([^\\s\\*]*)";
var sourceMetaEntriesRegExp = new FERAL_REG_EXP(`(?:\\s*//${sourceMetaEntryRegExp}|/\\*${sourceMetaEntryRegExp}\\s*\\*/)\\s*$`);
var getSourceURL = (src) => {
  let sourceURL = "<unknown>";
  while (src.length > 0) {
    const match = regexpExec(sourceMetaEntriesRegExp, src);
    if (match === null) {
      break;
    }
    src = stringSlice(src, 0, src.length - match[0].length);
    if (match[3] === "sourceURL") {
      sourceURL = match[4];
    } else if (match[1] === "sourceURL") {
      sourceURL = match[2];
    }
  }
  return sourceURL;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/transforms.js
function getLineNumber(src, pattern) {
  const index = stringSearch(src, pattern);
  if (index < 0) {
    return -1;
  }
  const adjustment = src[index] === "\n" ? 1 : 0;
  return stringSplit(stringSlice(src, 0, index), "\n").length + adjustment;
}
var htmlCommentPattern = sealRegexp(new FERAL_REG_EXP(`(?:${"<"}!--|--${">"})`, "g"));
var rejectHtmlComments = (src) => {
  const lineNumber = getLineNumber(src, htmlCommentPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(`Possible HTML comment rejected at ${name}:${lineNumber}. (SES_HTML_COMMENT_REJECTED)`);
};
var evadeHtmlCommentTest = (src) => {
  const replaceFn = (match) => match[0] === "<" ? "< ! --" : "-- >";
  return regexpReplace(htmlCommentPattern, src, replaceFn);
};
var importPattern = sealRegexp(new FERAL_REG_EXP("(^|[^.]|\\.\\.\\.)\\bimport(\\s*(?:\\(|/[/*]))", "g"));
var rejectImportExpressions = (src) => {
  const lineNumber = getLineNumber(src, importPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(`Possible import expression rejected at ${name}:${lineNumber}. (SES_IMPORT_REJECTED)`);
};
var evadeImportExpressionTest = (src) => {
  const replaceFn = (_, p1, p2) => `${p1}__import__${p2}`;
  return regexpReplace(importPattern, src, replaceFn);
};
var someDirectEvalPattern = new FERAL_REG_EXP("(^|[^.])\\beval(\\s*\\()", "g");
var rejectSomeDirectEvalExpressions = (src) => {
  const lineNumber = getLineNumber(src, someDirectEvalPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  throw SyntaxError2(`Possible direct eval expression rejected at ${name}:${lineNumber}. (SES_EVAL_REJECTED)`);
};
var mandatoryTransforms = (source) => {
  source = rejectHtmlComments(source);
  source = rejectImportExpressions(source);
  return source;
};
var applyTransforms = (source, transforms2) => {
  for (let i = 0, l = transforms2.length; i < l; i += 1) {
    const transform = transforms2[i];
    source = transform(source);
  }
  return source;
};
var transforms = freeze({
  rejectHtmlComments: freeze(rejectHtmlComments),
  evadeHtmlCommentTest: freeze(evadeHtmlCommentTest),
  rejectImportExpressions: freeze(rejectImportExpressions),
  evadeImportExpressionTest: freeze(evadeImportExpressionTest),
  rejectSomeDirectEvalExpressions: freeze(rejectSomeDirectEvalExpressions),
  mandatoryTransforms: freeze(mandatoryTransforms),
  applyTransforms: freeze(applyTransforms)
});

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/scope-constants.js
var reservedNames = new Set2([
  // 11.6.2.1 Keywords
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  // Also reserved when parsing strict mode code
  "let",
  "static",
  // 11.6.2.2 Future Reserved Words
  "enum",
  // Also reserved when parsing strict mode code
  "implements",
  "package",
  "protected",
  "interface",
  "private",
  "public",
  // Reserved but not mentioned in specs
  "await",
  "null",
  "true",
  "false",
  "this",
  "arguments",
  // Reserved by us
  "eval"
]);
var identifierPattern = /^[a-zA-Z_$][\w$]*$/;
var isValidIdentifierName = (name) => !setHas(reservedNames, name) && !!regexpExec(identifierPattern, name);
function isImmutableDataProperty(obj, name) {
  const desc = getOwnPropertyDescriptor(obj, name);
  return desc && //
  // The getters will not have .writable, don't let the falsyness of
  // 'undefined' trick us: test with === false, not ! . However descriptors
  // inherit from the (potentially poisoned) global object, so we might see
  // extra properties which weren't really there. Accessor properties have
  // 'get/set/enumerable/configurable', while data properties have
  // 'value/writable/enumerable/configurable'.
  desc.configurable === false && desc.writable === false && //
  // Checks for data properties because they're the only ones we can
  // optimize (accessors are most likely non-constant). Descriptors can't
  // can't have accessors and value properties at the same time, therefore
  // this check is sufficient. Using explicit own property deal with the
  // case where Object.prototype has been poisoned.
  hasOwn(desc, "value");
}
var getScopeConstants = (globalObject, moduleLexicals = {}) => {
  const globalObjectNames = getOwnPropertyNames(globalObject);
  const moduleLexicalNames = getOwnPropertyNames(moduleLexicals);
  const moduleLexicalConstants = arrayFilter(moduleLexicalNames, (name) => isValidIdentifierName(name) && isImmutableDataProperty(moduleLexicals, name));
  const globalObjectConstants = arrayFilter(globalObjectNames, (name) => (
    // Can't define a constant: it would prevent a
    // lookup on the endowments.
    !arrayIncludes(moduleLexicalNames, name) && isValidIdentifierName(name) && isImmutableDataProperty(globalObject, name)
  ));
  return {
    globalObjectConstants,
    moduleLexicalConstants
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/make-evaluate.js
function buildOptimizer(constants, name) {
  if (constants.length === 0) return "";
  return `const {${arrayJoin(constants, ",")}} = this.${name};`;
}
var makeEvaluate = (context) => {
  const { globalObjectConstants, moduleLexicalConstants } = getScopeConstants(context.globalObject, context.moduleLexicals);
  const globalObjectOptimizer = buildOptimizer(globalObjectConstants, "globalObject");
  const moduleLexicalOptimizer = buildOptimizer(moduleLexicalConstants, "moduleLexicals");
  const evaluateFactory = FERAL_FUNCTION(`
    with (this.scopeTerminator) {
      with (this.globalObject) {
        with (this.moduleLexicals) {
          with (this.evalScope) {
            ${globalObjectOptimizer}
            ${moduleLexicalOptimizer}
            return function() {
              'use strict';
              return eval(arguments[0]);
            };
          }
        }
      }
    }
  `);
  return apply(evaluateFactory, context, []);
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/make-safe-evaluator.js
var { Fail: Fail6 } = assert;
var makeSafeEvaluator = ({ globalObject, moduleLexicals = {}, globalTransforms = [], sloppyGlobalsMode = false }) => {
  const scopeTerminator = sloppyGlobalsMode ? createSloppyGlobalsScopeTerminator(globalObject) : strictScopeTerminator;
  const evalScopeKit = makeEvalScopeKit();
  const { evalScope } = evalScopeKit;
  const evaluateContext = freeze({
    evalScope,
    moduleLexicals,
    globalObject,
    scopeTerminator
  });
  let evaluate;
  const provideEvaluate = () => {
    if (!evaluate) {
      evaluate = makeEvaluate(evaluateContext);
    }
  };
  const safeEvaluate = (source, options) => {
    const { localTransforms = [] } = options || {};
    provideEvaluate();
    source = applyTransforms(source, arrayFlatMap([
      localTransforms,
      globalTransforms,
      [
        mandatoryTransforms
      ]
    ], identity));
    let err3;
    try {
      evalScopeKit.allowNextEvalToBeUnsafe();
      return apply(evaluate, globalObject, [
        source
      ]);
    } catch (e) {
      err3 = e;
      throw e;
    } finally {
      const unsafeEvalWasStillExposed = "eval" in evalScope;
      delete evalScope.eval;
      if (unsafeEvalWasStillExposed) {
        evalScopeKit.revoked = {
          err: err3
        };
        Fail6`handler did not reset allowNextEvalToBeUnsafe ${err3}`;
      }
    }
  };
  return {
    safeEvaluate
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-function-tostring.js
var nativeSuffix = ") { [native code] }";
var markVirtualizedNativeFunction;
var tameFunctionToString = () => {
  if (markVirtualizedNativeFunction === void 0) {
    const virtualizedNativeFunctions = new WeakSet2();
    const tamingMethods = {
      toString() {
        const str = functionToString(this);
        if (stringEndsWith(str, nativeSuffix) || !weaksetHas(virtualizedNativeFunctions, this)) {
          return str;
        }
        return `function ${this.name}() { [native code] }`;
      }
    };
    defineProperty(functionPrototype, "toString", {
      value: tamingMethods.toString
    });
    markVirtualizedNativeFunction = freeze((func) => weaksetAdd(virtualizedNativeFunctions, func));
  }
  return markVirtualizedNativeFunction;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-domains.js
function tameDomains(domainTaming = "safe") {
  if (domainTaming === "unsafe") {
    return;
  }
  const globalProcess = universalThis.process || void 0;
  if (typeof globalProcess === "object") {
    const domainDescriptor = getOwnPropertyDescriptor(globalProcess, "domain");
    if (domainDescriptor !== void 0 && domainDescriptor.get !== void 0) {
      throw TypeError2(`SES failed to lockdown, Node.js domains have been initialized (SES_NO_DOMAINS)`);
    }
    defineProperty(globalProcess, "domain", {
      value: null,
      configurable: false,
      writable: false,
      enumerable: false
    });
  }
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-module-source.js
var tameModuleSource = () => {
  const newIntrinsics = {};
  const ModuleSource = universalThis.ModuleSource;
  if (ModuleSource !== void 0) {
    let AbstractModuleSource = function() {
    };
    newIntrinsics.ModuleSource = ModuleSource;
    const ModuleSourceProto = getPrototypeOf(ModuleSource);
    if (ModuleSourceProto === functionPrototype) {
      setPrototypeOf(ModuleSource, AbstractModuleSource);
      newIntrinsics["%AbstractModuleSource%"] = AbstractModuleSource;
      newIntrinsics["%AbstractModuleSourcePrototype%"] = AbstractModuleSource.prototype;
    } else {
      newIntrinsics["%AbstractModuleSource%"] = ModuleSourceProto;
      newIntrinsics["%AbstractModuleSourcePrototype%"] = ModuleSourceProto.prototype;
    }
    const ModuleSourcePrototype = ModuleSource.prototype;
    if (ModuleSourcePrototype !== void 0) {
      newIntrinsics["%ModuleSourcePrototype%"] = ModuleSourcePrototype;
      const ModuleSourcePrototypeProto = getPrototypeOf(ModuleSourcePrototype);
      if (ModuleSourcePrototypeProto === objectPrototype) {
        setPrototypeOf(ModuleSource.prototype, AbstractModuleSource.prototype);
      }
    }
  }
  return newIntrinsics;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/console.js
var defineName = (name, fn2) => defineProperty(fn2, "name", {
  value: name
});
var consoleLevelMethods = freeze([
  [
    "debug",
    "debug"
  ],
  [
    "log",
    "log"
  ],
  [
    "info",
    "info"
  ],
  [
    "warn",
    "warn"
  ],
  [
    "error",
    "error"
  ],
  [
    "trace",
    "log"
  ],
  [
    "dirxml",
    "log"
  ],
  [
    "group",
    "log"
  ],
  [
    "groupCollapsed",
    "log"
  ]
]);
var consoleOtherMethods = freeze([
  [
    "assert",
    "error"
  ],
  [
    "timeLog",
    "log"
  ],
  // Insensitive to whether any argument is an error. All arguments can pass
  // thru to baseConsole as is.
  [
    "clear",
    void 0
  ],
  [
    "count",
    "info"
  ],
  [
    "countReset",
    void 0
  ],
  [
    "dir",
    "log"
  ],
  [
    "groupEnd",
    "log"
  ],
  // In theory tabular data may be or contain an error. However, we currently
  // do not detect these and may never.
  [
    "table",
    "log"
  ],
  [
    "time",
    "info"
  ],
  [
    "timeEnd",
    "info"
  ],
  // Node Inspector only, MDN, and TypeScript, but not whatwg
  [
    "profile",
    void 0
  ],
  [
    "profileEnd",
    void 0
  ],
  [
    "timeStamp",
    void 0
  ]
]);
var consoleMethodPermits = freeze([
  ...consoleLevelMethods,
  ...consoleOtherMethods
]);
var makeLoggingConsoleKit = (loggedErrorHandler2, { shouldResetForDebugging = false } = {}) => {
  if (shouldResetForDebugging) {
    loggedErrorHandler2.resetErrorTagNum();
  }
  let logArray = [];
  const loggingConsole = fromEntries(arrayMap(consoleMethodPermits, ([name, _]) => {
    const method = defineName(name, (...args) => {
      arrayPush(logArray, [
        name,
        ...args
      ]);
    });
    return [
      name,
      freeze(method)
    ];
  }));
  freeze(loggingConsole);
  const takeLog = () => {
    const result = freeze(logArray);
    logArray = [];
    return result;
  };
  freeze(takeLog);
  const typedLoggingConsole = (
    /** @type {VirtualConsole} */
    loggingConsole
  );
  return freeze({
    loggingConsole: typedLoggingConsole,
    takeLog
  });
};
freeze(makeLoggingConsoleKit);
var ErrorInfo = {
  NOTE: "ERROR_NOTE:",
  MESSAGE: "ERROR_MESSAGE:",
  CAUSE: "cause:",
  ERRORS: "errors:"
};
freeze(ErrorInfo);
var makeCausalConsole = (baseConsole, loggedErrorHandler2) => {
  if (!baseConsole) {
    return void 0;
  }
  const { getStackString, tagError: tagError2, takeMessageLogArgs, takeNoteLogArgsArray } = loggedErrorHandler2;
  const extractErrorArgs = (logArgs, subErrorsSink) => {
    const argTags = arrayMap(logArgs, (arg) => {
      if (isError(arg)) {
        arrayPush(subErrorsSink, arg);
        return `(${tagError2(arg)})`;
      }
      return arg;
    });
    return argTags;
  };
  const logErrorInfo = (severity, error, kind, logArgs, subErrorsSink) => {
    const errorTag = tagError2(error);
    const errorName = kind === ErrorInfo.MESSAGE ? `${errorTag}:` : `${errorTag} ${kind}`;
    const argTags = extractErrorArgs(logArgs, subErrorsSink);
    baseConsole[severity](errorName, ...argTags);
  };
  const logSubErrors = (severity, subErrors, optTag = void 0) => {
    if (subErrors.length === 0) {
      return;
    }
    if (subErrors.length === 1 && optTag === void 0) {
      logError(severity, subErrors[0]);
      return;
    }
    let label;
    if (subErrors.length === 1) {
      label = `Nested error`;
    } else {
      label = `Nested ${subErrors.length} errors`;
    }
    if (optTag !== void 0) {
      label = `${label} under ${optTag}`;
    }
    baseConsole.group(label);
    try {
      for (const subError of subErrors) {
        logError(severity, subError);
      }
    } finally {
      if (baseConsole.groupEnd) {
        baseConsole.groupEnd();
      }
    }
  };
  const errorsLogged = new WeakSet2();
  const makeNoteCallback = (severity) => (error, noteLogArgs) => {
    const subErrors = [];
    logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    logSubErrors(severity, subErrors, tagError2(error));
  };
  const logError = (severity, error) => {
    if (weaksetHas(errorsLogged, error)) {
      return;
    }
    const errorTag = tagError2(error);
    weaksetAdd(errorsLogged, error);
    const subErrors = [];
    const messageLogArgs = takeMessageLogArgs(error);
    const noteLogArgsArray = takeNoteLogArgsArray(error, makeNoteCallback(severity));
    if (messageLogArgs === void 0) {
      baseConsole[severity](`${errorTag}:`, error.message);
    } else {
      logErrorInfo(severity, error, ErrorInfo.MESSAGE, messageLogArgs, subErrors);
    }
    let stackString = getStackString(error);
    if (typeof stackString === "string" && stackString.length >= 1 && !stringEndsWith(stackString, "\n")) {
      stackString += "\n";
    }
    baseConsole[severity](stackString);
    if (error.cause) {
      logErrorInfo(severity, error, ErrorInfo.CAUSE, [
        error.cause
      ], subErrors);
    }
    if (error.errors) {
      logErrorInfo(severity, error, ErrorInfo.ERRORS, error.errors, subErrors);
    }
    for (const noteLogArgs of noteLogArgsArray) {
      logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    }
    logSubErrors(severity, subErrors, errorTag);
  };
  const levelMethods = arrayMap(consoleLevelMethods, ([level, _]) => {
    const levelMethod = defineName(level, (...logArgs) => {
      const subErrors = [];
      const argTags = extractErrorArgs(logArgs, subErrors);
      if (baseConsole[level]) {
        baseConsole[level](...argTags);
      }
      logSubErrors(level, subErrors);
    });
    return [
      level,
      freeze(levelMethod)
    ];
  });
  const otherMethodNames = arrayFilter(consoleOtherMethods, ([name, _]) => name in baseConsole);
  const otherMethods = arrayMap(otherMethodNames, ([name, _]) => {
    const otherMethod = defineName(name, (...args) => {
      baseConsole[name](...args);
      return void 0;
    });
    return [
      name,
      freeze(otherMethod)
    ];
  });
  const causalConsole = fromEntries([
    ...levelMethods,
    ...otherMethods
  ]);
  return (
    /** @type {VirtualConsole} */
    freeze(causalConsole)
  );
};
freeze(makeCausalConsole);
var indentAfterAllSeps = (str, sep, indents) => {
  const [firstLine, ...restLines] = stringSplit(str, sep);
  const indentedRest = arrayFlatMap(restLines, (line) => [
    sep,
    ...indents,
    line
  ]);
  return [
    "",
    firstLine,
    ...indentedRest
  ];
};
var defineCausalConsoleFromLogger = (loggedErrorHandler2) => {
  const makeCausalConsoleFromLogger = (tlogger) => {
    const indents = [];
    const logWithIndent = (...args) => {
      if (indents.length > 0) {
        args = arrayFlatMap(args, (arg) => typeof arg === "string" && stringIncludes(arg, "\n") ? indentAfterAllSeps(arg, "\n", indents) : [
          arg
        ]);
        args = [
          ...indents,
          ...args
        ];
      }
      return tlogger(...args);
    };
    const baseConsole = fromEntries([
      ...arrayMap(consoleLevelMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(...args))
      ]),
      ...arrayMap(consoleOtherMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(name, ...args))
      ])
    ]);
    for (const name of [
      "group",
      "groupCollapsed"
    ]) {
      if (baseConsole[name]) {
        baseConsole[name] = defineName(name, (...args) => {
          if (args.length >= 1) {
            logWithIndent(...args);
          }
          arrayPush(indents, " ");
        });
      } else {
        baseConsole[name] = defineName(name, () => {
        });
      }
    }
    baseConsole.groupEnd = defineName("groupEnd", baseConsole.groupEnd ? (...args) => {
      arrayPop(indents);
    } : () => {
    });
    harden(baseConsole);
    const causalConsole = makeCausalConsole(
      /** @type {VirtualConsole} */
      baseConsole,
      loggedErrorHandler2
    );
    return (
      /** @type {VirtualConsole} */
      causalConsole
    );
  };
  return freeze(makeCausalConsoleFromLogger);
};
freeze(defineCausalConsoleFromLogger);
var filterConsole = (baseConsole, filter, _topic = void 0) => {
  const methodPermits = arrayFilter(consoleMethodPermits, ([name, _]) => name in baseConsole);
  const methods = arrayMap(methodPermits, ([name, severity]) => {
    const method = defineName(name, (...args) => {
      if (severity === void 0 || filter.canLog(severity)) {
        baseConsole[name](...args);
      }
    });
    return [
      name,
      freeze(method)
    ];
  });
  const filteringConsole = fromEntries(methods);
  return (
    /** @type {VirtualConsole} */
    freeze(filteringConsole)
  );
};
freeze(filterConsole);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/unhandled-rejection.js
var makeRejectionHandlers = (reportReason) => {
  if (FinalizationRegistry === void 0) {
    return void 0;
  }
  let lastReasonId = 0;
  const idToReason = new Map2();
  let cancelChecking;
  const removeReasonId = (reasonId) => {
    mapDelete(idToReason, reasonId);
    if (cancelChecking && idToReason.size === 0) {
      cancelChecking();
      cancelChecking = void 0;
    }
  };
  const promiseToReasonId = new WeakMap2();
  const finalizeDroppedPromise = (heldReasonId) => {
    if (mapHas(idToReason, heldReasonId)) {
      const reason = mapGet(idToReason, heldReasonId);
      removeReasonId(heldReasonId);
      reportReason(reason);
    }
  };
  const promiseToReason = new FinalizationRegistry(finalizeDroppedPromise);
  const unhandledRejectionHandler = (reason, pr) => {
    lastReasonId += 1;
    const reasonId = lastReasonId;
    mapSet(idToReason, reasonId, reason);
    weakmapSet(promiseToReasonId, pr, reasonId);
    finalizationRegistryRegister(promiseToReason, pr, reasonId, pr);
  };
  const rejectionHandledHandler = (pr) => {
    const reasonId = weakmapGet(promiseToReasonId, pr);
    removeReasonId(reasonId);
  };
  const processTerminationHandler = () => {
    for (const [reasonId, reason] of mapEntries(idToReason)) {
      removeReasonId(reasonId);
      reportReason(reason);
    }
  };
  return {
    rejectionHandledHandler,
    unhandledRejectionHandler,
    processTerminationHandler
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/tame-console.js
var failFast = (message) => {
  throw TypeError2(message);
};
var wrapLogger = (logger, thisArg) => freeze((...args) => apply(logger, thisArg, args));
var tameConsole = (consoleTaming = "safe", errorTrapping = "platform", unhandledRejectionTrapping = "report", optGetStackString = void 0) => {
  let loggedErrorHandler2;
  if (optGetStackString === void 0) {
    loggedErrorHandler2 = loggedErrorHandler;
  } else {
    loggedErrorHandler2 = {
      ...loggedErrorHandler,
      getStackString: optGetStackString
    };
  }
  const originalConsole = (
    /** @type {VirtualConsole} */
    // eslint-disable-next-line no-nested-ternary
    typeof universalThis.console !== "undefined" ? universalThis.console : typeof universalThis.print === "function" ? (
      // log at a specific level with no special argument interpretation).
      // https://console.spec.whatwg.org/#logging
      ((p) => freeze({
        debug: p,
        log: p,
        info: p,
        warn: p,
        error: p
      }))(
        // eslint-disable-next-line no-undef
        wrapLogger(universalThis.print)
      )
    ) : void 0
  );
  if (originalConsole && originalConsole.log) {
    for (const methodName of [
      "warn",
      "error"
    ]) {
      if (!originalConsole[methodName]) {
        defineProperty(originalConsole, methodName, {
          value: wrapLogger(originalConsole.log, originalConsole)
        });
      }
    }
  }
  const ourConsole = (
    /** @type {VirtualConsole} */
    consoleTaming === "unsafe" ? originalConsole : makeCausalConsole(originalConsole, loggedErrorHandler2)
  );
  const globalProcess = universalThis.process || void 0;
  if (errorTrapping !== "none" && typeof globalProcess === "object" && typeof globalProcess.on === "function") {
    let terminate;
    if (errorTrapping === "platform" || errorTrapping === "exit") {
      const { exit } = globalProcess;
      typeof exit === "function" || failFast("missing process.exit");
      terminate = () => exit(globalProcess.exitCode || -1);
    } else if (errorTrapping === "abort") {
      terminate = globalProcess.abort;
      typeof terminate === "function" || failFast("missing process.abort");
    }
    globalProcess.on("uncaughtException", (error) => {
      ourConsole.error("SES_UNCAUGHT_EXCEPTION:", error);
      if (terminate) {
        terminate();
      }
    });
  }
  if (unhandledRejectionTrapping !== "none" && typeof globalProcess === "object" && typeof globalProcess.on === "function") {
    const handleRejection = (reason) => {
      ourConsole.error("SES_UNHANDLED_REJECTION:", reason);
    };
    const h2 = makeRejectionHandlers(handleRejection);
    if (h2) {
      globalProcess.on("unhandledRejection", h2.unhandledRejectionHandler);
      globalProcess.on("rejectionHandled", h2.rejectionHandledHandler);
      globalProcess.on("exit", h2.processTerminationHandler);
    }
  }
  const globalWindow = universalThis.window || void 0;
  if (errorTrapping !== "none" && typeof globalWindow === "object" && typeof globalWindow.addEventListener === "function") {
    globalWindow.addEventListener("error", (event) => {
      event.preventDefault();
      ourConsole.error("SES_UNCAUGHT_EXCEPTION:", event.error);
      if (errorTrapping === "exit" || errorTrapping === "abort") {
        globalWindow.location.href = `about:blank`;
      }
    });
  }
  if (unhandledRejectionTrapping !== "none" && typeof globalWindow === "object" && typeof globalWindow.addEventListener === "function") {
    const handleRejection = (reason) => {
      ourConsole.error("SES_UNHANDLED_REJECTION:", reason);
    };
    const h2 = makeRejectionHandlers(handleRejection);
    if (h2) {
      globalWindow.addEventListener("unhandledrejection", (event) => {
        event.preventDefault();
        h2.unhandledRejectionHandler(event.reason, event.promise);
      });
      globalWindow.addEventListener("rejectionhandled", (event) => {
        event.preventDefault();
        h2.rejectionHandledHandler(event.promise);
      });
      globalWindow.addEventListener("beforeunload", (_event) => {
        h2.processTerminationHandler();
      });
    }
  }
  return {
    console: ourConsole
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/tame-v8-error-constructor.js
var safeV8CallSiteMethodNames = [
  // suppress 'getThis' definitely
  "getTypeName",
  // suppress 'getFunction' definitely
  "getFunctionName",
  "getMethodName",
  "getFileName",
  "getLineNumber",
  "getColumnNumber",
  "getEvalOrigin",
  "isToplevel",
  "isEval",
  "isNative",
  "isConstructor",
  "isAsync",
  // suppress 'isPromiseAll' for now
  // suppress 'getPromiseIndex' for now
  // Additional names found by experiment, absent from
  // https://v8.dev/docs/stack-trace-api
  "getPosition",
  "getScriptNameOrSourceURL",
  "toString"
];
var safeV8CallSiteFacet = (callSite) => {
  const methodEntry = (name) => {
    const method = callSite[name];
    return [
      name,
      () => apply(method, callSite, [])
    ];
  };
  const o = fromEntries(arrayMap(safeV8CallSiteMethodNames, methodEntry));
  return create(o, {});
};
var safeV8SST = (sst) => arrayMap(sst, safeV8CallSiteFacet);
var FILENAME_NODE_DEPENDENTS_CENSOR = /\/node_modules\//;
var FILENAME_NODE_INTERNALS_CENSOR = /^(?:node:)?internal\//;
var FILENAME_ASSERT_CENSOR = /\/packages\/ses\/src\/error\/assert\.js$/;
var FILENAME_EVENTUAL_SEND_CENSOR = /\/packages\/eventual-send\/src\//;
var FILENAME_SES_AVA_CENSOR = /\/packages\/ses-ava\/src\/ses-ava-test\.js$/;
var FILENAME_CENSORS = [
  FILENAME_NODE_DEPENDENTS_CENSOR,
  FILENAME_NODE_INTERNALS_CENSOR,
  FILENAME_ASSERT_CENSOR,
  FILENAME_EVENTUAL_SEND_CENSOR,
  FILENAME_SES_AVA_CENSOR
];
var filterFileName = (fileName) => {
  if (fileName === null) {
    return false;
  }
  for (const filter of FILENAME_CENSORS) {
    if (regexpExec(filter, fileName)) {
      return false;
    }
  }
  return true;
};
var CALLSITE_ELLIPSIS_PATTERN1 = /^((?:.*[( ])?)[:/\w_-]*\/\.\.\.\/(.+)$/;
var CALLSITE_ELLIPSIS_PATTERN2 = /^((?:.*[( ])?)\.\.\.\/(.+)$/;
var CALLSITE_PACKAGES_PATTERN = /^((?:.*[( ])?)[:/\w_-]*\/(packages\/.+)$/;
var CALLSITE_FILE_2SLASH_PATTERN = /^((?:.*[( ])?)file:\/\/([^/].*)$/;
var CALLSITE_PATTERNS = [
  CALLSITE_ELLIPSIS_PATTERN1,
  CALLSITE_ELLIPSIS_PATTERN2,
  CALLSITE_PACKAGES_PATTERN,
  CALLSITE_FILE_2SLASH_PATTERN
];
var shortenCallSiteString = (callSiteString) => {
  for (const filter of CALLSITE_PATTERNS) {
    const match = regexpExec(filter, callSiteString);
    if (match) {
      return arrayJoin(arraySlice(match, 1), "");
    }
  }
  return callSiteString;
};
var tameV8ErrorConstructor = (OriginalError, InitialError, errorTaming, stackFiltering) => {
  if (errorTaming === "unsafe-debug") {
    throw TypeError2("internal: v8+unsafe-debug special case should already be done");
  }
  const originalCaptureStackTrace = OriginalError.captureStackTrace;
  const omitFrames = stackFiltering === "concise" || stackFiltering === "omit-frames";
  const shortenPaths = stackFiltering === "concise" || stackFiltering === "shorten-paths";
  const callSiteFilter = (callSite) => {
    if (omitFrames) {
      if (callSite.getFunctionName()?.startsWith("__HIDE_")) {
        return false;
      }
      return filterFileName(callSite.getFileName());
    }
    return true;
  };
  const callSiteStringifier = (callSite) => {
    let callSiteString = `${callSite}`;
    if (shortenPaths) {
      callSiteString = shortenCallSiteString(callSiteString);
    }
    return `
  at ${callSiteString}`;
  };
  const stackStringFromSST = (_error, sst) => arrayJoin(arrayMap(arrayFilter(sst, callSiteFilter), callSiteStringifier), "");
  const stackInfos = new WeakMap2();
  const tamedMethods3 = {
    // The optional `optFn` argument is for cutting off the bottom of
    // the stack --- for capturing the stack only above the topmost
    // call to that function. Since this isn't the "real" captureStackTrace
    // but instead calls the real one, if no other cutoff is provided,
    // we cut this one off.
    captureStackTrace(error, optFn = tamedMethods3.captureStackTrace) {
      if (typeof originalCaptureStackTrace === "function") {
        apply(originalCaptureStackTrace, OriginalError, [
          error,
          optFn
        ]);
        return;
      }
      reflectSet(error, "stack", "");
    },
    // Shim of proposed special power, to reside by default only
    // in the start compartment, for getting the stack traceback
    // string associated with an error.
    // See https://tc39.es/proposal-error-stacks/
    getStackString(error) {
      let stackInfo = weakmapGet(stackInfos, error);
      if (stackInfo === void 0) {
        void error.stack;
        stackInfo = weakmapGet(stackInfos, error);
        if (!stackInfo) {
          stackInfo = {
            stackString: ""
          };
          weakmapSet(stackInfos, error, stackInfo);
        }
      }
      if (stackInfo.stackString !== void 0) {
        return stackInfo.stackString;
      }
      const stackString = stackStringFromSST(error, stackInfo.callSites);
      weakmapSet(stackInfos, error, {
        stackString
      });
      return stackString;
    },
    prepareStackTrace(error, sst) {
      if (errorTaming === "unsafe") {
        const stackString = stackStringFromSST(error, sst);
        weakmapSet(stackInfos, error, {
          stackString
        });
        return `${error}${stackString}`;
      } else {
        weakmapSet(stackInfos, error, {
          callSites: sst
        });
        return "";
      }
    }
  };
  const defaultPrepareFn = tamedMethods3.prepareStackTrace;
  OriginalError.prepareStackTrace = defaultPrepareFn;
  const systemPrepareFnSet = new WeakSet2([
    defaultPrepareFn
  ]);
  const systemPrepareFnFor = (inputPrepareFn) => {
    if (weaksetHas(systemPrepareFnSet, inputPrepareFn)) {
      return inputPrepareFn;
    }
    const systemMethods = {
      prepareStackTrace(error, sst) {
        weakmapSet(stackInfos, error, {
          callSites: sst
        });
        return inputPrepareFn(error, safeV8SST(sst));
      }
    };
    weaksetAdd(systemPrepareFnSet, systemMethods.prepareStackTrace);
    return systemMethods.prepareStackTrace;
  };
  defineProperties(InitialError, {
    captureStackTrace: {
      value: tamedMethods3.captureStackTrace,
      writable: true,
      enumerable: false,
      configurable: true
    },
    prepareStackTrace: {
      get() {
        return OriginalError.prepareStackTrace;
      },
      set(inputPrepareStackTraceFn) {
        if (typeof inputPrepareStackTraceFn === "function") {
          const systemPrepareFn = systemPrepareFnFor(inputPrepareStackTraceFn);
          OriginalError.prepareStackTrace = systemPrepareFn;
        } else {
          OriginalError.prepareStackTrace = defaultPrepareFn;
        }
      },
      enumerable: false,
      configurable: true
    }
  });
  return tamedMethods3.getStackString;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/error/tame-error-constructor.js
var stackDesc = getOwnPropertyDescriptor(FERAL_ERROR.prototype, "stack");
var stackGetter = stackDesc && stackDesc.get;
var tamedMethods2 = {
  getStackString(error) {
    if (typeof stackGetter === "function") {
      return apply(stackGetter, error, []);
    } else if ("stack" in error) {
      return `${error.stack}`;
    }
    return "";
  }
};
var initialGetStackString = tamedMethods2.getStackString;
function tameErrorConstructor(errorTaming = "safe", stackFiltering = "concise") {
  const ErrorPrototype = FERAL_ERROR.prototype;
  const { captureStackTrace: originalCaptureStackTrace } = FERAL_ERROR;
  const platform = typeof originalCaptureStackTrace === "function" ? "v8" : "unknown";
  const makeErrorConstructor = (_ = {}) => {
    const ResultError = function Error4(...rest) {
      let error;
      if (new.target === void 0) {
        error = apply(FERAL_ERROR, this, rest);
      } else {
        error = construct(FERAL_ERROR, rest, new.target);
      }
      if (platform === "v8") {
        apply(originalCaptureStackTrace, FERAL_ERROR, [
          error,
          ResultError
        ]);
      }
      return error;
    };
    defineProperties(ResultError, {
      length: {
        value: 1
      },
      prototype: {
        value: ErrorPrototype,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
    return ResultError;
  };
  const InitialError = makeErrorConstructor({
    powers: "original"
  });
  const SharedError = makeErrorConstructor({
    powers: "none"
  });
  defineProperties(ErrorPrototype, {
    constructor: {
      value: SharedError
    }
  });
  for (const NativeError2 of NativeErrors) {
    setPrototypeOf(NativeError2, SharedError);
  }
  defineProperties(InitialError, {
    stackTraceLimit: {
      get() {
        if (typeof FERAL_ERROR.stackTraceLimit === "number") {
          return FERAL_ERROR.stackTraceLimit;
        }
        return void 0;
      },
      set(newLimit) {
        if (typeof newLimit !== "number") {
          return;
        }
        if (typeof FERAL_ERROR.stackTraceLimit === "number") {
          FERAL_ERROR.stackTraceLimit = newLimit;
          return;
        }
      },
      // WTF on v8 stackTraceLimit is enumerable
      enumerable: false,
      configurable: true
    }
  });
  if (errorTaming === "unsafe-debug" && platform === "v8") {
    defineProperties(InitialError, {
      prepareStackTrace: {
        get() {
          return FERAL_ERROR.prepareStackTrace;
        },
        set(newPrepareStackTrace) {
          FERAL_ERROR.prepareStackTrace = newPrepareStackTrace;
        },
        enumerable: false,
        configurable: true
      },
      captureStackTrace: {
        value: FERAL_ERROR.captureStackTrace,
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    const descs = getOwnPropertyDescriptors(InitialError);
    defineProperties(SharedError, {
      stackTraceLimit: descs.stackTraceLimit,
      prepareStackTrace: descs.prepareStackTrace,
      captureStackTrace: descs.captureStackTrace
    });
    return {
      "%InitialGetStackString%": initialGetStackString,
      "%InitialError%": InitialError,
      "%SharedError%": SharedError
    };
  }
  defineProperties(SharedError, {
    stackTraceLimit: {
      get() {
        return void 0;
      },
      set(_newLimit) {
      },
      enumerable: false,
      configurable: true
    }
  });
  if (platform === "v8") {
    defineProperties(SharedError, {
      prepareStackTrace: {
        get() {
          return () => "";
        },
        set(_prepareFn) {
        },
        enumerable: false,
        configurable: true
      },
      captureStackTrace: {
        value: (errorish, _constructorOpt) => {
          defineProperty(errorish, "stack", {
            value: ""
          });
        },
        writable: false,
        enumerable: false,
        configurable: true
      }
    });
  }
  if (platform === "v8") {
    initialGetStackString = tameV8ErrorConstructor(FERAL_ERROR, InitialError, errorTaming, stackFiltering);
  } else if (errorTaming === "unsafe" || errorTaming === "unsafe-debug") {
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          return initialGetStackString(this);
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            }
          });
        }
      }
    });
  } else {
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          return `${this}`;
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true
            }
          });
        }
      }
    });
  }
  return {
    "%InitialGetStackString%": initialGetStackString,
    "%InitialError%": InitialError,
    "%SharedError%": SharedError
  };
}

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/module-load.js
var noop = () => {
};
var asyncTrampoline = async (generatorFunc, args, errorWrapper) => {
  await null;
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      const val = await result.value;
      result = generatorNext(iterator, val);
    } catch (error) {
      result = generatorThrow(iterator, errorWrapper(error));
    }
  }
  return result.value;
};
var syncTrampoline = (generatorFunc, args) => {
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      result = generatorNext(iterator, result.value);
    } catch (error) {
      result = generatorThrow(iterator, error);
    }
  }
  return result.value;
};
var makeAlias = (compartment, specifier) => freeze({
  compartment,
  specifier
});
var resolveAll = (imports, resolveHook, fullReferrerSpecifier) => {
  const resolvedImports = create(null);
  for (const importSpecifier of imports) {
    const fullSpecifier = resolveHook(importSpecifier, fullReferrerSpecifier);
    resolvedImports[importSpecifier] = fullSpecifier;
  }
  return freeze(resolvedImports);
};
var loadModuleSource = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, moduleSource, enqueueJob, selectImplementation, moduleLoads, importMeta) => {
  const { resolveHook, name: compartmentName } = weakmapGet(compartmentPrivateFields, compartment);
  const { imports } = moduleSource;
  if (!isArray(imports) || arraySome(imports, (specifier) => typeof specifier !== "string")) {
    throw makeError(redactedDetails`Invalid module source: 'imports' must be an array of strings, got ${imports} for module ${quote(moduleSpecifier)} of compartment ${quote(compartmentName)}`);
  }
  const resolvedImports = resolveAll(imports, resolveHook, moduleSpecifier);
  const moduleRecord = freeze({
    compartment,
    moduleSource,
    moduleSpecifier,
    resolvedImports,
    importMeta
  });
  for (const fullSpecifier of values(resolvedImports)) {
    enqueueJob(memoizedLoadWithErrorAnnotation, [
      compartmentPrivateFields,
      moduleAliases2,
      compartment,
      fullSpecifier,
      enqueueJob,
      selectImplementation,
      moduleLoads
    ]);
  }
  return moduleRecord;
};
function* loadWithoutErrorAnnotation(compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, enqueueJob, selectImplementation, moduleLoads) {
  const { importHook, importNowHook, moduleMap, moduleMapHook, moduleRecords, parentCompartment } = weakmapGet(compartmentPrivateFields, compartment);
  if (mapHas(moduleRecords, moduleSpecifier)) {
    return mapGet(moduleRecords, moduleSpecifier);
  }
  let moduleDescriptor = moduleMap[moduleSpecifier];
  if (moduleDescriptor === void 0 && moduleMapHook !== void 0) {
    moduleDescriptor = moduleMapHook(moduleSpecifier);
  }
  if (moduleDescriptor === void 0) {
    const moduleHook = selectImplementation(importHook, importNowHook);
    if (moduleHook === void 0) {
      const moduleHookName = selectImplementation("importHook", "importNowHook");
      throw makeError(redactedDetails`${bare(moduleHookName)} needed to load module ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
    }
    moduleDescriptor = moduleHook(moduleSpecifier);
    if (!weakmapHas(moduleAliases2, moduleDescriptor)) {
      moduleDescriptor = yield moduleDescriptor;
    }
  }
  if (typeof moduleDescriptor === "string") {
    throw makeError(redactedDetails`Cannot map module ${quote(moduleSpecifier)} to ${quote(moduleDescriptor)} in parent compartment, use {source} module descriptor`, TypeError2);
  } else if (!isPrimitive(moduleDescriptor)) {
    let aliasDescriptor = weakmapGet(moduleAliases2, moduleDescriptor);
    if (aliasDescriptor !== void 0) {
      moduleDescriptor = aliasDescriptor;
    }
    if (moduleDescriptor.namespace !== void 0) {
      if (typeof moduleDescriptor.namespace === "string") {
        const { compartment: aliasCompartment = parentCompartment, namespace: aliasSpecifier } = moduleDescriptor;
        if (isPrimitive(aliasCompartment) || !weakmapHas(compartmentPrivateFields, aliasCompartment)) {
          throw makeError(redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
        }
        const aliasRecord = yield memoizedLoadWithErrorAnnotation(compartmentPrivateFields, moduleAliases2, aliasCompartment, aliasSpecifier, enqueueJob, selectImplementation, moduleLoads);
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }
      if (!isPrimitive(moduleDescriptor.namespace)) {
        const { namespace } = moduleDescriptor;
        aliasDescriptor = weakmapGet(moduleAliases2, namespace);
        if (aliasDescriptor !== void 0) {
          moduleDescriptor = aliasDescriptor;
        } else {
          const exports = getOwnPropertyNames(namespace);
          const moduleSource2 = {
            imports: [],
            exports,
            execute(env) {
              for (const name of exports) {
                env[name] = namespace[name];
              }
            }
          };
          const importMeta = void 0;
          const moduleRecord2 = loadModuleSource(compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, moduleSource2, enqueueJob, selectImplementation, moduleLoads, importMeta);
          mapSet(moduleRecords, moduleSpecifier, moduleRecord2);
          return moduleRecord2;
        }
      } else {
        throw makeError(redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
      }
    }
    if (moduleDescriptor.source !== void 0) {
      if (typeof moduleDescriptor.source === "string") {
        const { source: loaderSpecifier, specifier: instanceSpecifier = moduleSpecifier, compartment: loaderCompartment = parentCompartment, importMeta = void 0 } = moduleDescriptor;
        const loaderRecord = yield memoizedLoadWithErrorAnnotation(compartmentPrivateFields, moduleAliases2, loaderCompartment, loaderSpecifier, enqueueJob, selectImplementation, moduleLoads);
        const { moduleSource: moduleSource2 } = loaderRecord;
        const moduleRecord2 = loadModuleSource(compartmentPrivateFields, moduleAliases2, compartment, instanceSpecifier, moduleSource2, enqueueJob, selectImplementation, moduleLoads, importMeta);
        mapSet(moduleRecords, moduleSpecifier, moduleRecord2);
        return moduleRecord2;
      } else {
        const { source: moduleSource2, specifier: aliasSpecifier = moduleSpecifier, importMeta } = moduleDescriptor;
        const aliasRecord = loadModuleSource(compartmentPrivateFields, moduleAliases2, compartment, aliasSpecifier, moduleSource2, enqueueJob, selectImplementation, moduleLoads, importMeta);
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }
    }
    if (moduleDescriptor.archive !== void 0) {
      throw makeError(redactedDetails`Unsupported archive module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
    }
    if (moduleDescriptor.record !== void 0) {
      const { compartment: aliasCompartment = compartment, specifier: aliasSpecifier = moduleSpecifier, record: moduleSource2, importMeta } = moduleDescriptor;
      const aliasRecord = loadModuleSource(compartmentPrivateFields, moduleAliases2, aliasCompartment, aliasSpecifier, moduleSource2, enqueueJob, selectImplementation, moduleLoads, importMeta);
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      mapSet(moduleRecords, aliasSpecifier, aliasRecord);
      return aliasRecord;
    }
    if (moduleDescriptor.compartment !== void 0 && moduleDescriptor.specifier !== void 0) {
      if (isPrimitive(moduleDescriptor.compartment) || !weakmapHas(compartmentPrivateFields, moduleDescriptor.compartment) || typeof moduleDescriptor.specifier !== "string") {
        throw makeError(redactedDetails`Invalid compartment in module descriptor for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
      }
      const aliasRecord = yield memoizedLoadWithErrorAnnotation(compartmentPrivateFields, moduleAliases2, moduleDescriptor.compartment, moduleDescriptor.specifier, enqueueJob, selectImplementation, moduleLoads);
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      return aliasRecord;
    }
    const moduleSource = moduleDescriptor;
    const moduleRecord = loadModuleSource(compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, moduleSource, enqueueJob, selectImplementation, moduleLoads);
    mapSet(moduleRecords, moduleSpecifier, moduleRecord);
    return moduleRecord;
  } else {
    throw makeError(redactedDetails`module descriptor must be a string or object for specifier ${quote(moduleSpecifier)} in compartment ${quote(compartment.name)}`);
  }
}
var memoizedLoadWithErrorAnnotation = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, enqueueJob, selectImplementation, moduleLoads) => {
  const { name: compartmentName } = weakmapGet(compartmentPrivateFields, compartment);
  let compartmentLoading = mapGet(moduleLoads, compartment);
  if (compartmentLoading === void 0) {
    compartmentLoading = new Map2();
    mapSet(moduleLoads, compartment, compartmentLoading);
  }
  let moduleLoading = mapGet(compartmentLoading, moduleSpecifier);
  if (moduleLoading !== void 0) {
    return moduleLoading;
  }
  moduleLoading = selectImplementation(asyncTrampoline, syncTrampoline)(loadWithoutErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases2,
    compartment,
    moduleSpecifier,
    enqueueJob,
    selectImplementation,
    moduleLoads
  ], (error) => {
    note(error, redactedDetails`${error.message}, loading ${quote(moduleSpecifier)} in compartment ${quote(compartmentName)}`);
    throw error;
  });
  mapSet(compartmentLoading, moduleSpecifier, moduleLoading);
  return moduleLoading;
};
var asyncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  const pendingJobs = new Set2();
  const enqueueJob = (func, args) => {
    setAdd(pendingJobs, promiseThen(func(...args), noop, (error) => {
      if (noAggregateErrors) {
        throw error;
      } else {
        arrayPush(errors, error);
      }
    }));
  };
  const drainQueue = async () => {
    await null;
    for (const job of pendingJobs) {
      await job;
    }
  };
  return {
    enqueueJob,
    drainQueue,
    errors
  };
};
var syncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  let current = [];
  let next = [];
  const enqueueJob = (func, args) => {
    arrayPush(next, [
      func,
      args
    ]);
  };
  const drainQueue = () => {
    for (const [func, args] of current) {
      try {
        func(...args);
      } catch (error) {
        if (noAggregateErrors) {
          throw error;
        } else {
          arrayPush(errors, error);
        }
      }
    }
    current = next;
    next = [];
    if (current.length > 0) drainQueue();
  };
  return {
    enqueueJob,
    drainQueue,
    errors
  };
};
var throwAggregateError = ({ errors, errorPrefix }) => {
  if (errors.length > 0) {
    const verbose = (
      /** @type {'' | 'verbose'} */
      getEnvironmentOption("COMPARTMENT_LOAD_ERRORS", "", [
        "verbose"
      ]) === "verbose"
    );
    throw TypeError2(`${errorPrefix} (${errors.length} underlying failures: ${arrayJoin(arrayMap(errors, (error) => error.message + (verbose ? error.stack : "")), ", ")}`);
  }
};
var preferSync = (_asyncImpl, syncImpl) => syncImpl;
var preferAsync = (asyncImpl, _syncImpl) => asyncImpl;
var load = async (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, { noAggregateErrors = false } = {}) => {
  const { name: compartmentName } = weakmapGet(compartmentPrivateFields, compartment);
  const moduleLoads = new Map2();
  const { enqueueJob, drainQueue, errors } = asyncJobQueue({
    noAggregateErrors
  });
  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases2,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferAsync,
    moduleLoads
  ]);
  await drainQueue();
  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${quote(moduleSpecifier)} in package ${quote(compartmentName)}`
  });
};
var loadNow = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier, { noAggregateErrors = false } = {}) => {
  const { name: compartmentName } = weakmapGet(compartmentPrivateFields, compartment);
  const moduleLoads = new Map2();
  const { enqueueJob, drainQueue, errors } = syncJobQueue({
    noAggregateErrors
  });
  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases2,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferSync,
    moduleLoads
  ]);
  drainQueue();
  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${quote(moduleSpecifier)} in package ${quote(compartmentName)}`
  });
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/module-proxy.js
var { quote: q4 } = assert;
var deferExports = () => {
  let active = false;
  const exportsTarget = create(null, {
    // Make this appear like an ESM module namespace object.
    [toStringTagSymbol]: {
      value: "Module",
      writable: false,
      enumerable: false,
      configurable: false
    }
  });
  return freeze({
    activate() {
      active = true;
    },
    exportsTarget,
    exportsProxy: new Proxy2(exportsTarget, {
      get(_target, name, receiver) {
        if (!active) {
          throw TypeError2(`Cannot get property ${q4(name)} of module exports namespace, the module has not yet begun to execute`);
        }
        return reflectGet(exportsTarget, name, receiver);
      },
      set(_target, name, _value) {
        throw TypeError2(`Cannot set property ${q4(name)} of module exports namespace`);
      },
      has(_target, name) {
        if (!active) {
          throw TypeError2(`Cannot check property ${q4(name)}, the module has not yet begun to execute`);
        }
        return reflectHas(exportsTarget, name);
      },
      deleteProperty(_target, name) {
        throw TypeError2(`Cannot delete property ${q4(name)}s of module exports namespace`);
      },
      ownKeys(_target) {
        if (!active) {
          throw TypeError2("Cannot enumerate keys, the module has not yet begun to execute");
        }
        return ownKeys(exportsTarget);
      },
      getOwnPropertyDescriptor(_target, name) {
        if (!active) {
          throw TypeError2(`Cannot get own property descriptor ${q4(name)}, the module has not yet begun to execute`);
        }
        return reflectGetOwnPropertyDescriptor(exportsTarget, name);
      },
      preventExtensions(_target) {
        if (!active) {
          throw TypeError2("Cannot prevent extensions of module exports namespace, the module has not yet begun to execute");
        }
        return reflectPreventExtensions(exportsTarget);
      },
      isExtensible() {
        if (!active) {
          throw TypeError2("Cannot check extensibility of module exports namespace, the module has not yet begun to execute");
        }
        return reflectIsExtensible(exportsTarget);
      },
      getPrototypeOf(_target) {
        return null;
      },
      setPrototypeOf(_target, _proto) {
        throw TypeError2("Cannot set prototype of module exports namespace");
      },
      defineProperty(_target, name, _descriptor) {
        throw TypeError2(`Cannot define property ${q4(name)} of module exports namespace`);
      },
      apply(_target, _thisArg, _args) {
        throw TypeError2("Cannot call module exports namespace, it is not a function");
      },
      construct(_target, _args) {
        throw TypeError2("Cannot construct module exports namespace, it is not a constructor");
      }
    })
  });
};
var getDeferredExports = (compartment, compartmentPrivateFields, moduleAliases2, specifier) => {
  const { deferredExports } = compartmentPrivateFields;
  if (!mapHas(deferredExports, specifier)) {
    const deferred = deferExports();
    weakmapSet(moduleAliases2, deferred.exportsProxy, makeAlias(compartment, specifier));
    mapSet(deferredExports, specifier, deferred);
  }
  return mapGet(deferredExports, specifier);
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/compartment-evaluate.js
var provideCompartmentEvaluator = (compartmentFields, options) => {
  const { sloppyGlobalsMode = false, __moduleShimLexicals__ = void 0 } = options;
  let safeEvaluate;
  if (__moduleShimLexicals__ === void 0 && !sloppyGlobalsMode) {
    ({ safeEvaluate } = compartmentFields);
  } else {
    let { globalTransforms } = compartmentFields;
    const { globalObject } = compartmentFields;
    let moduleLexicals;
    if (__moduleShimLexicals__ !== void 0) {
      globalTransforms = void 0;
      moduleLexicals = create(null, getOwnPropertyDescriptors(__moduleShimLexicals__));
    }
    ({ safeEvaluate } = makeSafeEvaluator({
      globalObject,
      moduleLexicals,
      globalTransforms,
      sloppyGlobalsMode
    }));
  }
  return {
    safeEvaluate
  };
};
var compartmentEvaluate = (compartmentFields, source, options) => {
  if (typeof source !== "string") {
    throw TypeError2("first argument of evaluate() must be a string");
  }
  const { transforms: transforms2 = [], __evadeHtmlCommentTest__ = false, __evadeImportExpressionTest__ = false, __rejectSomeDirectEvalExpressions__ = true } = options;
  const localTransforms = [
    ...transforms2
  ];
  if (__evadeHtmlCommentTest__ === true) {
    arrayPush(localTransforms, evadeHtmlCommentTest);
  }
  if (__evadeImportExpressionTest__ === true) {
    arrayPush(localTransforms, evadeImportExpressionTest);
  }
  if (__rejectSomeDirectEvalExpressions__ === true) {
    arrayPush(localTransforms, rejectSomeDirectEvalExpressions);
  }
  const { safeEvaluate } = provideCompartmentEvaluator(compartmentFields, options);
  return safeEvaluate(source, {
    localTransforms
  });
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/module-instance.js
var { quote: q5 } = assert;
var makeVirtualModuleInstance = (compartmentPrivateFields, moduleSource, compartment, moduleAliases2, moduleSpecifier, resolvedImports) => {
  const { exportsProxy, exportsTarget, activate } = getDeferredExports(compartment, weakmapGet(compartmentPrivateFields, compartment), moduleAliases2, moduleSpecifier);
  const notifiers = create(null);
  if (moduleSource.exports) {
    if (!isArray(moduleSource.exports) || arraySome(moduleSource.exports, (name) => typeof name !== "string")) {
      throw TypeError2(`SES virtual module source "exports" property must be an array of strings for module ${moduleSpecifier}`);
    }
    arrayForEach(moduleSource.exports, (name) => {
      let value = exportsTarget[name];
      const updaters = [];
      const get = () => value;
      const set = (newValue) => {
        value = newValue;
        for (const updater of updaters) {
          updater(newValue);
        }
      };
      defineProperty(exportsTarget, name, {
        get,
        set,
        enumerable: true,
        configurable: false
      });
      notifiers[name] = (update) => {
        arrayPush(updaters, update);
        update(value);
      };
    });
    notifiers["*"] = (update) => {
      update(exportsTarget);
    };
  }
  const localState = {
    activated: false
  };
  return freeze({
    notifiers,
    exportsProxy,
    execute() {
      if (reflectHas(localState, "errorFromExecute")) {
        throw localState.errorFromExecute;
      }
      if (!localState.activated) {
        activate();
        localState.activated = true;
        try {
          moduleSource.execute(exportsTarget, compartment, resolvedImports);
        } catch (err3) {
          localState.errorFromExecute = err3;
          throw err3;
        }
      }
    }
  });
};
var makeModuleInstance = (privateFields2, moduleAliases2, moduleRecord, importedInstances) => {
  const { compartment, moduleSpecifier, moduleSource, importMeta: moduleRecordMeta } = moduleRecord;
  const { reexports: exportAlls = [], __syncModuleProgram__: functorSource, __fixedExportMap__: fixedExportMap = {}, __liveExportMap__: liveExportMap = {}, __reexportMap__: reexportMap = {}, __needsImport__: needsImport = false, __needsImportMeta__: needsImportMeta = false, __syncModuleFunctor__ } = moduleSource;
  const compartmentFields = weakmapGet(privateFields2, compartment);
  const { __shimTransforms__, resolveHook, importMetaHook, compartmentImport } = compartmentFields;
  const { exportsProxy, exportsTarget, activate } = getDeferredExports(compartment, compartmentFields, moduleAliases2, moduleSpecifier);
  const exportsProps = create(null);
  const moduleLexicals = create(null);
  const onceVar = create(null);
  const liveVar = create(null);
  const importMeta = create(null);
  if (moduleRecordMeta) {
    assign(importMeta, moduleRecordMeta);
  }
  if (needsImportMeta && importMetaHook) {
    importMetaHook(moduleSpecifier, importMeta);
  }
  let dynamicImport;
  if (needsImport) {
    dynamicImport = async (importSpecifier) => compartmentImport(resolveHook(importSpecifier, moduleSpecifier));
  }
  const localGetNotify = create(null);
  const notifiers = create(null);
  arrayForEach(entries(fixedExportMap), ([fixedExportName, [localName]]) => {
    let fixedGetNotify = localGetNotify[localName];
    if (!fixedGetNotify) {
      let value;
      let tdz = true;
      let optUpdaters = [];
      const get = () => {
        if (tdz) {
          throw ReferenceError2(`binding ${q5(localName)} not yet initialized`);
        }
        return value;
      };
      const init = freeze((initValue) => {
        if (!tdz) {
          throw TypeError2(`Internal: binding ${q5(localName)} already initialized`);
        }
        value = initValue;
        const updaters = optUpdaters;
        optUpdaters = null;
        tdz = false;
        for (const updater of updaters || []) {
          updater(initValue);
        }
        return initValue;
      });
      const notify = (updater) => {
        if (updater === init) {
          return;
        }
        if (tdz) {
          arrayPush(optUpdaters || [], updater);
        } else {
          updater(value);
        }
      };
      fixedGetNotify = {
        get,
        notify
      };
      localGetNotify[localName] = fixedGetNotify;
      onceVar[localName] = init;
    }
    exportsProps[fixedExportName] = {
      get: fixedGetNotify.get,
      set: void 0,
      enumerable: true,
      configurable: false
    };
    notifiers[fixedExportName] = fixedGetNotify.notify;
  });
  arrayForEach(entries(liveExportMap), ([liveExportName, [localName, setProxyTrap]]) => {
    let liveGetNotify = localGetNotify[localName];
    if (!liveGetNotify) {
      let value;
      let tdz = true;
      const updaters = [];
      const get = () => {
        if (tdz) {
          throw ReferenceError2(`binding ${q5(liveExportName)} not yet initialized`);
        }
        return value;
      };
      const update = freeze((newValue) => {
        value = newValue;
        tdz = false;
        for (const updater of updaters) {
          updater(newValue);
        }
      });
      const set = (newValue) => {
        if (tdz) {
          throw ReferenceError2(`binding ${q5(localName)} not yet initialized`);
        }
        value = newValue;
        for (const updater of updaters) {
          updater(newValue);
        }
      };
      const notify = (updater) => {
        if (updater === update) {
          return;
        }
        arrayPush(updaters, updater);
        if (!tdz) {
          updater(value);
        }
      };
      liveGetNotify = {
        get,
        notify
      };
      localGetNotify[localName] = liveGetNotify;
      if (setProxyTrap) {
        defineProperty(moduleLexicals, localName, {
          get,
          set,
          enumerable: true,
          configurable: false
        });
      }
      liveVar[localName] = update;
    }
    exportsProps[liveExportName] = {
      get: liveGetNotify.get,
      set: void 0,
      enumerable: true,
      configurable: false
    };
    notifiers[liveExportName] = liveGetNotify.notify;
  });
  const notifyStar = (update) => {
    update(exportsTarget);
  };
  notifiers["*"] = notifyStar;
  const wireUpExportNotifier = (exportName, notify) => {
    if (!notifiers[exportName] && notify !== false) {
      notifiers[exportName] = notify;
      let value;
      const update = (newValue) => value = newValue;
      notify(update);
      exportsProps[exportName] = {
        get() {
          return value;
        },
        set: void 0,
        enumerable: true,
        configurable: false
      };
    }
  };
  function imports(updateRecord) {
    const candidateAll = create(null);
    candidateAll.default = false;
    for (const [specifier, importUpdaters] of updateRecord) {
      const instance = mapGet(importedInstances, specifier);
      instance.execute();
      const { notifiers: importNotifiers } = instance;
      for (const [importName, updaters] of importUpdaters) {
        const importNotify = importNotifiers[importName];
        if (!importNotify) {
          throw SyntaxError2(`The requested module '${specifier}' does not provide an export named '${importName}'`);
        }
        for (const updater of updaters) {
          importNotify(updater);
        }
      }
      if (arrayIncludes(exportAlls, specifier)) {
        for (const [importAndExportName, importNotify] of entries(importNotifiers)) {
          if (candidateAll[importAndExportName] === void 0) {
            candidateAll[importAndExportName] = importNotify;
          } else {
            candidateAll[importAndExportName] = false;
          }
        }
      }
      if (reexportMap[specifier]) {
        for (const [localName, exportedName] of reexportMap[specifier]) {
          wireUpExportNotifier(exportedName, importNotifiers[localName]);
        }
      }
    }
    for (const [exportName, notify] of entries(candidateAll)) {
      wireUpExportNotifier(exportName, notify);
    }
    arrayForEach(arraySort(keys(exportsProps)), (k) => defineProperty(exportsTarget, k, exportsProps[k]));
    freeze(exportsTarget);
    activate();
  }
  let optFunctor;
  if (__syncModuleFunctor__ !== void 0) {
    optFunctor = __syncModuleFunctor__;
  } else {
    optFunctor = compartmentEvaluate(compartmentFields, functorSource, {
      globalObject: compartment.globalThis,
      transforms: __shimTransforms__,
      __moduleShimLexicals__: moduleLexicals
    });
  }
  let didThrow = false;
  let thrownError;
  function execute() {
    if (optFunctor) {
      const functor = optFunctor;
      optFunctor = null;
      try {
        functor(freeze({
          imports: freeze(imports),
          onceVar: freeze(onceVar),
          liveVar: freeze(liveVar),
          import: dynamicImport,
          importMeta
        }));
      } catch (e) {
        didThrow = true;
        thrownError = e;
      }
    }
    if (didThrow) {
      throw thrownError;
    }
  }
  return freeze({
    notifiers,
    exportsProxy,
    execute
  });
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/module-link.js
var { Fail: Fail7, quote: q6 } = assert;
var link = (compartmentPrivateFields, moduleAliases2, compartment, moduleSpecifier) => {
  const { name: compartmentName, moduleRecords } = weakmapGet(compartmentPrivateFields, compartment);
  const moduleRecord = mapGet(moduleRecords, moduleSpecifier);
  if (moduleRecord === void 0) {
    throw ReferenceError2(`Missing link to module ${q6(moduleSpecifier)} from compartment ${q6(compartmentName)}`);
  }
  return instantiate(compartmentPrivateFields, moduleAliases2, moduleRecord);
};
function mayBePrecompiledModuleSource(moduleSource) {
  return typeof moduleSource.__syncModuleProgram__ === "string";
}
function validatePrecompiledModuleSource(moduleSource, moduleSpecifier) {
  const { __fixedExportMap__, __liveExportMap__ } = moduleSource;
  !isPrimitive(__fixedExportMap__) || Fail7`Property '__fixedExportMap__' of a precompiled module source must be an object, got ${q6(__fixedExportMap__)}, for module ${q6(moduleSpecifier)}`;
  !isPrimitive(__liveExportMap__) || Fail7`Property '__liveExportMap__' of a precompiled module source must be an object, got ${q6(__liveExportMap__)}, for module ${q6(moduleSpecifier)}`;
}
function mayBeVirtualModuleSource(moduleSource) {
  return typeof moduleSource.execute === "function";
}
function validateVirtualModuleSource(moduleSource, moduleSpecifier) {
  const { exports } = moduleSource;
  isArray(exports) || Fail7`Invalid module source: 'exports' of a virtual module source must be an array, got ${q6(exports)}, for module ${q6(moduleSpecifier)}`;
}
function validateModuleSource(moduleSource, moduleSpecifier) {
  !isPrimitive(moduleSource) || Fail7`Invalid module source: must be of type object, got ${q6(moduleSource)}, for module ${q6(moduleSpecifier)}`;
  const { imports, exports, reexports = [] } = moduleSource;
  isArray(imports) || Fail7`Invalid module source: 'imports' must be an array, got ${q6(imports)}, for module ${q6(moduleSpecifier)}`;
  isArray(exports) || Fail7`Invalid module source: 'exports' must be an array, got ${q6(exports)}, for module ${q6(moduleSpecifier)}`;
  isArray(reexports) || Fail7`Invalid module source: 'reexports' must be an array if present, got ${q6(reexports)}, for module ${q6(moduleSpecifier)}`;
}
var instantiate = (compartmentPrivateFields, moduleAliases2, moduleRecord) => {
  const { compartment, moduleSpecifier, resolvedImports, moduleSource } = moduleRecord;
  const { instances } = weakmapGet(compartmentPrivateFields, compartment);
  if (mapHas(instances, moduleSpecifier)) {
    return mapGet(instances, moduleSpecifier);
  }
  validateModuleSource(moduleSource, moduleSpecifier);
  const importedInstances = new Map2();
  let moduleInstance;
  if (mayBePrecompiledModuleSource(moduleSource)) {
    validatePrecompiledModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeModuleInstance(compartmentPrivateFields, moduleAliases2, moduleRecord, importedInstances);
  } else if (mayBeVirtualModuleSource(moduleSource)) {
    validateVirtualModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeVirtualModuleInstance(compartmentPrivateFields, moduleSource, compartment, moduleAliases2, moduleSpecifier, resolvedImports);
  } else {
    throw TypeError2(`Invalid module source, got ${q6(moduleSource)}`);
  }
  mapSet(instances, moduleSpecifier, moduleInstance);
  for (const [importSpecifier, resolvedSpecifier] of entries(resolvedImports)) {
    const importedInstance = link(compartmentPrivateFields, moduleAliases2, compartment, resolvedSpecifier);
    mapSet(importedInstances, importSpecifier, importedInstance);
  }
  return moduleInstance;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/compartment.js
var moduleAliases = new WeakMap2();
var privateFields = new WeakMap2();
var InertCompartment = function Compartment2(_endowments = {}, _modules = {}, _options = {}) {
  throw TypeError2("Compartment.prototype.constructor is not a valid constructor.");
};
var compartmentImportNow = (compartment, specifier) => {
  const { execute, exportsProxy } = link(privateFields, moduleAliases, compartment, specifier);
  execute();
  return exportsProxy;
};
var CompartmentPrototype = {
  constructor: InertCompartment,
  get globalThis() {
    return (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this).globalObject
    );
  },
  get name() {
    return (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this).name
    );
  },
  evaluate(source, options = {}) {
    const compartmentFields = weakmapGet(privateFields, this);
    return compartmentEvaluate(compartmentFields, source, options);
  },
  module(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of module() must be a string");
    }
    const { exportsProxy } = getDeferredExports(this, weakmapGet(privateFields, this), moduleAliases, specifier);
    return exportsProxy;
  },
  async import(specifier) {
    const { noNamespaceBox, noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of import() must be a string");
    }
    return promiseThen(load(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors
    }), () => {
      const namespace = compartmentImportNow(
        /** @type {Compartment} */
        this,
        specifier
      );
      if (noNamespaceBox) {
        return namespace;
      }
      return {
        namespace
      };
    });
  },
  async load(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of load() must be a string");
    }
    const { noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    return load(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors
    });
  },
  importNow(specifier) {
    if (typeof specifier !== "string") {
      throw TypeError2("first argument of importNow() must be a string");
    }
    const { noAggregateLoadErrors } = (
      /** @type {CompartmentFields} */
      weakmapGet(privateFields, this)
    );
    loadNow(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors
    });
    return compartmentImportNow(
      /** @type {Compartment} */
      this,
      specifier
    );
  }
};
defineProperties(CompartmentPrototype, {
  [toStringTagSymbol]: {
    value: "Compartment",
    writable: false,
    enumerable: false,
    configurable: true
  }
});
defineProperties(InertCompartment, {
  prototype: {
    value: CompartmentPrototype
  }
});
var compartmentOptions = (...args) => {
  if (args.length === 0) {
    return {};
  }
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && "__options__" in args[0]) {
    const { __options__, ...options } = args[0];
    assert(__options__ === true, `Compartment constructor only supports true __options__ sigil, got ${__options__}`);
    return options;
  } else {
    const [globals = (
      /** @type {Map<string, any>} */
      {}
    ), modules = (
      /** @type {Map<string, ModuleDescriptor>} */
      {}
    ), options = {}] = (
      /** @type {LegacyCompartmentOptionsArgs} */
      args
    );
    assertEqual(options.modules, void 0, `Compartment constructor must receive either a module map argument or modules option, not both`);
    assertEqual(options.globals, void 0, `Compartment constructor must receive either globals argument or option, not both`);
    return {
      ...options,
      globals,
      modules
    };
  }
};
var makeCompartmentConstructor = (targetMakeCompartmentConstructor, intrinsics, markVirtualizedNativeFunction3, { parentCompartment = void 0, enforceNew = false } = {}) => {
  function Compartment3(...args) {
    if (enforceNew && new.target === void 0) {
      throw TypeError2("Class constructor Compartment cannot be invoked without 'new'");
    }
    const { name = "<unknown>", transforms: transforms2 = [], __shimTransforms__ = [], globals: endowmentsOption = {}, modules: moduleMapOption = {}, resolveHook, importHook, importNowHook, moduleMapHook, importMetaHook, __noNamespaceBox__: noNamespaceBox = false, noAggregateLoadErrors = false } = compartmentOptions(...args);
    const globalTransforms = arrayFlatMap([
      transforms2,
      __shimTransforms__
    ], identity);
    const endowments = {
      __proto__: null,
      ...endowmentsOption
    };
    const moduleMap = {
      __proto__: null,
      ...moduleMapOption
    };
    const moduleRecords = new Map2();
    const instances = new Map2();
    const deferredExports = new Map2();
    const globalObject = {};
    const compartment = this;
    setGlobalObjectSymbolUnscopables(globalObject);
    setGlobalObjectConstantProperties(globalObject);
    const { safeEvaluate } = makeSafeEvaluator({
      globalObject,
      globalTransforms,
      sloppyGlobalsMode: false
    });
    setGlobalObjectMutableProperties(globalObject, {
      intrinsics,
      newGlobalPropertyNames: sharedGlobalPropertyNames,
      makeCompartmentConstructor: targetMakeCompartmentConstructor,
      parentCompartment: this,
      markVirtualizedNativeFunction: markVirtualizedNativeFunction3
    });
    setGlobalObjectEvaluators(globalObject, safeEvaluate, markVirtualizedNativeFunction3);
    assign(globalObject, endowments);
    const compartmentImport = async (fullSpecifier) => {
      if (typeof resolveHook !== "function") {
        throw TypeError2(`Compartment does not support dynamic import: no configured resolveHook for compartment ${quote(name)}`);
      }
      await load(privateFields, moduleAliases, compartment, fullSpecifier, {
        noAggregateErrors: noAggregateLoadErrors
      });
      const { execute, exportsProxy } = link(privateFields, moduleAliases, compartment, fullSpecifier);
      execute();
      return exportsProxy;
    };
    weakmapSet(privateFields, this, {
      name: `${name}`,
      globalTransforms,
      globalObject,
      safeEvaluate,
      resolveHook,
      importHook,
      importNowHook,
      moduleMap,
      moduleMapHook,
      importMetaHook,
      moduleRecords,
      __shimTransforms__,
      deferredExports,
      instances,
      parentCompartment,
      noNamespaceBox,
      compartmentImport,
      noAggregateLoadErrors
    });
  }
  Compartment3.prototype = CompartmentPrototype;
  return Compartment3;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/get-anonymous-intrinsics.js
function getConstructorOf(obj) {
  return getPrototypeOf(obj).constructor;
}
function makeArguments() {
  return arguments;
}
var getAnonymousIntrinsics = () => {
  const InertFunction = FERAL_FUNCTION.prototype.constructor;
  const argsCalleeDesc = getOwnPropertyDescriptor(makeArguments(), "callee");
  const ThrowTypeError = argsCalleeDesc && argsCalleeDesc.get;
  const StringIteratorObject = iterateString(new String2());
  const StringIteratorPrototype = getPrototypeOf(StringIteratorObject);
  const RegExpStringIterator = regexpPrototype[matchAllSymbol] && matchAllRegExp(/./);
  const RegExpStringIteratorPrototype = RegExpStringIterator && getPrototypeOf(RegExpStringIterator);
  const ArrayIteratorObject = iterateArray([]);
  const ArrayIteratorPrototype = getPrototypeOf(ArrayIteratorObject);
  const TypedArray2 = getPrototypeOf(Float32Array);
  const MapIteratorObject = iterateMap(new Map2());
  const MapIteratorPrototype = getPrototypeOf(MapIteratorObject);
  const SetIteratorObject = iterateSet(new Set2());
  const SetIteratorPrototype = getPrototypeOf(SetIteratorObject);
  const IteratorPrototype = getPrototypeOf(ArrayIteratorPrototype);
  function* GeneratorFunctionInstance() {
  }
  const GeneratorFunction = getConstructorOf(GeneratorFunctionInstance);
  const Generator = GeneratorFunction.prototype;
  async function AsyncFunctionInstance2() {
  }
  const AsyncFunction = getConstructorOf(AsyncFunctionInstance2);
  const intrinsics = {
    "%InertFunction%": InertFunction,
    "%ArrayIteratorPrototype%": ArrayIteratorPrototype,
    "%InertAsyncFunction%": AsyncFunction,
    "%Generator%": Generator,
    "%InertGeneratorFunction%": GeneratorFunction,
    "%IteratorPrototype%": IteratorPrototype,
    "%MapIteratorPrototype%": MapIteratorPrototype,
    "%RegExpStringIteratorPrototype%": RegExpStringIteratorPrototype,
    "%SetIteratorPrototype%": SetIteratorPrototype,
    "%StringIteratorPrototype%": StringIteratorPrototype,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray2,
    "%InertCompartment%": InertCompartment
  };
  if (AsyncGeneratorFunctionInstance !== void 0) {
    const AsyncGeneratorFunction = getConstructorOf(AsyncGeneratorFunctionInstance);
    const AsyncGenerator = AsyncGeneratorFunction.prototype;
    const AsyncGeneratorPrototype = AsyncGenerator.prototype;
    const AsyncIteratorPrototype = getPrototypeOf(AsyncGeneratorPrototype);
    assign(intrinsics, {
      "%AsyncGenerator%": AsyncGenerator,
      "%InertAsyncGeneratorFunction%": AsyncGeneratorFunction,
      "%AsyncGeneratorPrototype%": AsyncGeneratorPrototype,
      "%AsyncIteratorPrototype%": AsyncIteratorPrototype
    });
  }
  if (universalThis.Iterator) {
    intrinsics["%IteratorHelperPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.Iterator.from([]).take(0)
    );
    intrinsics["%WrapForValidIteratorPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.Iterator.from({
        next() {
          return {
            value: void 0
          };
        }
      })
    );
  }
  if (universalThis.AsyncIterator) {
    intrinsics["%AsyncIteratorHelperPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.AsyncIterator.from([]).take(0)
    );
    intrinsics["%WrapForValidAsyncIteratorPrototype%"] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      universalThis.AsyncIterator.from({
        next() {
        }
      })
    );
  }
  const ab = new ArrayBuffer2(0);
  const iab = ab.sliceToImmutable();
  const iabProto = getPrototypeOf(iab);
  if (iabProto !== ArrayBuffer2.prototype) {
    intrinsics["%ImmutableArrayBufferPrototype%"] = iabProto;
  }
  return intrinsics;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-harden.js
var tameHarden = (safeHarden2, hardenTaming) => {
  if (hardenTaming === "safe") {
    return safeHarden2;
  }
  Object.isExtensible = () => false;
  Object.isFrozen = () => true;
  Object.isSealed = () => true;
  Reflect.isExtensible = () => false;
  if (safeHarden2.isFake) {
    return safeHarden2;
  }
  const fakeHarden = (arg) => arg;
  fakeHarden.isFake = true;
  return freeze(fakeHarden);
};
freeze(tameHarden);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-symbol-constructor.js
var tameSymbolConstructor = () => {
  const OriginalSymbol = Symbol2;
  const SymbolPrototype = OriginalSymbol.prototype;
  const SharedSymbol = functionBind(Symbol2, void 0);
  defineProperties(SymbolPrototype, {
    constructor: {
      value: SharedSymbol
    }
  });
  const originalDescsEntries = entries(getOwnPropertyDescriptors(OriginalSymbol));
  const descs = fromEntries(arrayMap(originalDescsEntries, ([name, desc]) => [
    name,
    {
      ...desc,
      configurable: true
    }
  ]));
  defineProperties(SharedSymbol, descs);
  return {
    "%SharedSymbol%": SharedSymbol
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-faux-data-properties.js
var throws = (thunk) => {
  try {
    thunk();
    return false;
  } catch (er) {
    return true;
  }
};
var tameFauxDataProperty = (obj, prop, expectedValue) => {
  if (obj === void 0) {
    return false;
  }
  const desc = getOwnPropertyDescriptor(obj, prop);
  if (!desc || "value" in desc) {
    return false;
  }
  const { get, set } = desc;
  if (typeof get !== "function" || typeof set !== "function") {
    return false;
  }
  if (get() !== expectedValue) {
    return false;
  }
  if (apply(get, obj, []) !== expectedValue) {
    return false;
  }
  const testValue = "Seems to be a setter";
  const subject1 = {
    __proto__: null
  };
  apply(set, subject1, [
    testValue
  ]);
  if (subject1[prop] !== testValue) {
    return false;
  }
  const subject2 = {
    __proto__: obj
  };
  apply(set, subject2, [
    testValue
  ]);
  if (subject2[prop] !== testValue) {
    return false;
  }
  if (!throws(() => apply(set, obj, [
    expectedValue
  ]))) {
    return false;
  }
  if ("originalValue" in get) {
    return false;
  }
  if (desc.configurable === false) {
    return false;
  }
  defineProperty(obj, prop, {
    value: expectedValue,
    writable: true,
    enumerable: desc.enumerable,
    configurable: true
  });
  return true;
};
var tameFauxDataProperties = (intrinsics) => {
  tameFauxDataProperty(intrinsics["%IteratorPrototype%"], "constructor", intrinsics.Iterator);
  tameFauxDataProperty(intrinsics["%IteratorPrototype%"], toStringTagSymbol, "Iterator");
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/tame-regenerator-runtime.js
var tameRegeneratorRuntime = () => {
  const iter = iteratorPrototype[iteratorSymbol];
  defineProperty(iteratorPrototype, iteratorSymbol, {
    configurable: true,
    get() {
      return iter;
    },
    set(value) {
      if (this === iteratorPrototype) return;
      if (hasOwn(this, iteratorSymbol)) {
        this[iteratorSymbol] = value;
      }
      defineProperty(this, iteratorSymbol, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  });
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/shim-arraybuffer-transfer.js
var shimArrayBufferTransfer = () => {
  if (typeof arrayBufferPrototype.transfer === "function") {
    return {};
  }
  const clone = universalThis.structuredClone;
  if (typeof clone !== "function") {
    return {};
  }
  const methods = {
    /**
     * @param {number} [newLength]
     */
    transfer(newLength = void 0) {
      const oldLength = arrayBufferGetByteLength(this);
      if (newLength === void 0 || newLength === oldLength) {
        return clone(this, {
          transfer: [
            this
          ]
        });
      }
      if (typeof newLength !== "number") {
        throw TypeError2(`transfer newLength if provided must be a number`);
      }
      if (newLength > oldLength) {
        const result = new ArrayBuffer2(newLength);
        const taOld = new Uint8Array2(this);
        const taNew = new Uint8Array2(result);
        typedArraySet(taNew, taOld);
        clone(this, {
          transfer: [
            this
          ]
        });
        return result;
      } else {
        const result = arrayBufferSlice(this, 0, newLength);
        clone(this, {
          transfer: [
            this
          ]
        });
        return result;
      }
    }
  };
  defineProperty(arrayBufferPrototype, "transfer", {
    // @ts-expect-error
    value: methods.transfer,
    writable: true,
    enumerable: false,
    configurable: true
  });
  return {};
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/reporting.js
var consoleReporter = {
  warn(...args) {
    universalThis.console.warn(...args);
  },
  error(...args) {
    universalThis.console.error(...args);
  },
  ...universalThis.console?.groupCollapsed ? {
    groupCollapsed(...args) {
      universalThis.console.groupCollapsed(...args);
    }
  } : void 0,
  ...universalThis.console?.groupEnd ? {
    groupEnd() {
      universalThis.console.groupEnd();
    }
  } : void 0
};
var makeReportPrinter = (print) => {
  let indent = false;
  const printIndent = (...args) => {
    if (indent) {
      print(" ", ...args);
    } else {
      print(...args);
    }
  };
  return (
    /** @type {GroupReporter} */
    {
      warn(...args) {
        printIndent(...args);
      },
      error(...args) {
        printIndent(...args);
      },
      groupCollapsed(...args) {
        assert(!indent);
        print(...args);
        indent = true;
      },
      groupEnd() {
        indent = false;
      }
    }
  );
};
var mute = () => {
};
var chooseReporter = (reporting) => {
  if (reporting === "none") {
    return makeReportPrinter(mute);
  }
  if (universalThis.console !== void 0) {
    if (reporting === "console" || // asks for console explicitly
    universalThis.window === universalThis || // likely on browser
    universalThis.importScripts !== void 0) {
      return consoleReporter;
    }
    assert(reporting === "platform");
    return makeReportPrinter(consoleReporter.error);
  }
  if (universalThis.print !== void 0) {
    return makeReportPrinter(universalThis.print);
  }
  return makeReportPrinter(mute);
};
var reportInGroup = (groupLabel, console2, callback) => {
  const { warn, error, groupCollapsed, groupEnd } = console2;
  const grouping = groupCollapsed && groupEnd;
  let groupStarted = false;
  try {
    return callback({
      warn(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        warn(...args);
      },
      error(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        error(...args);
      }
    });
  } finally {
    if (grouping && groupStarted) {
      groupEnd();
      groupStarted = false;
    }
  }
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/lockdown.js
var { Fail: Fail8, details: X, quote: q7 } = assert;
var priorRepairIntrinsics;
var priorHardenIntrinsics;
var safeHarden = makeHardener();
var probeHostEvaluators = () => {
  let functionAllowed;
  try {
    functionAllowed = FERAL_FUNCTION("return true")();
  } catch (_error) {
    functionAllowed = false;
  }
  let evalAllowed;
  try {
    evalAllowed = FERAL_EVAL("true");
  } catch (_error) {
    evalAllowed = false;
  }
  let directEvalAllowed;
  if (functionAllowed && evalAllowed) {
    directEvalAllowed = FERAL_FUNCTION("eval", "SES_changed", `        eval("SES_changed = true");
        return SES_changed;
      `)(FERAL_EVAL, false);
    if (!directEvalAllowed) {
      delete universalThis.SES_changed;
    }
  }
  return {
    functionAllowed,
    evalAllowed,
    directEvalAllowed
  };
};
var repairIntrinsics = (options = {}) => {
  const { errorTaming = (
    /** @type {'safe' | 'unsafe' | 'unsafe-debug'} */
    getEnvironmentOption("LOCKDOWN_ERROR_TAMING", "safe", [
      "unsafe",
      "unsafe-debug"
    ])
  ), errorTrapping = (
    /** @type {'platform' | 'none' | 'report' | 'abort' | 'exit'} */
    getEnvironmentOption("LOCKDOWN_ERROR_TRAPPING", "platform", [
      "none",
      "report",
      "abort",
      "exit"
    ])
  ), reporting = (
    /** @type {'platform' | 'console' | 'none'} */
    getEnvironmentOption("LOCKDOWN_REPORTING", "platform", [
      "console",
      "none"
    ])
  ), unhandledRejectionTrapping = (
    /** @type {'none' | 'report'} */
    getEnvironmentOption("LOCKDOWN_UNHANDLED_REJECTION_TRAPPING", "report", [
      "none"
    ])
  ), regExpTaming = (
    /** @type {'safe' | 'unsafe'} */
    getEnvironmentOption("LOCKDOWN_REGEXP_TAMING", "safe", [
      "unsafe"
    ])
  ), localeTaming = (
    /** @type {'safe' | 'unsafe'} */
    getEnvironmentOption("LOCKDOWN_LOCALE_TAMING", "safe", [
      "unsafe"
    ])
  ), consoleTaming = (
    /** @type {'unsafe' | 'safe'} */
    getEnvironmentOption("LOCKDOWN_CONSOLE_TAMING", "safe", [
      "unsafe"
    ])
  ), overrideTaming = (
    /** @type {'moderate' | 'min' | 'severe'} */
    getEnvironmentOption("LOCKDOWN_OVERRIDE_TAMING", "moderate", [
      "min",
      "severe"
    ])
  ), stackFiltering = (
    /** @type {'concise' | 'omit-frames' | 'shorten-paths' | 'verbose'} */
    getEnvironmentOption("LOCKDOWN_STACK_FILTERING", "concise", [
      "omit-frames",
      "shorten-paths",
      "verbose"
    ])
  ), domainTaming = (
    /** @type {'safe' | 'unsafe'} */
    getEnvironmentOption("LOCKDOWN_DOMAIN_TAMING", "safe", [
      "unsafe"
    ])
  ), evalTaming = (
    /** @type {'safe-eval' | 'unsafe-eval' | 'no-eval'} */
    getEnvironmentOption("LOCKDOWN_EVAL_TAMING", "safe-eval", [
      "unsafe-eval",
      "no-eval",
      // deprecated
      "safeEval",
      "unsafeEval",
      "noEval"
    ])
  ), overrideDebug = (
    /** @type {string[]} */
    arrayFilter(
      stringSplit(getEnvironmentOption("LOCKDOWN_OVERRIDE_DEBUG", ""), ","),
      /** @param {string} debugName */
      (debugName) => debugName !== ""
    )
  ), legacyRegeneratorRuntimeTaming = (
    /** @type {'safe' | 'unsafe-ignore'} */
    getEnvironmentOption("LOCKDOWN_LEGACY_REGENERATOR_RUNTIME_TAMING", "safe", [
      "unsafe-ignore"
    ])
  ), __hardenTaming__ = (
    /** @type {'safe' | 'unsafe'} */
    getEnvironmentOption("LOCKDOWN_HARDEN_TAMING", "safe", [
      "unsafe"
    ])
  ), dateTaming, mathTaming, ...extraOptions } = options;
  const extraOptionsNames = ownKeys(extraOptions);
  extraOptionsNames.length === 0 || Fail8`lockdown(): non supported option ${q7(extraOptionsNames)}`;
  const reporter = chooseReporter(reporting);
  const { warn } = reporter;
  if (dateTaming !== void 0) {
    warn(`SES The 'dateTaming' option is deprecated and does nothing. In the future specifying it will be an error.`);
  }
  if (mathTaming !== void 0) {
    warn(`SES The 'mathTaming' option is deprecated and does nothing. In the future specifying it will be an error.`);
  }
  priorRepairIntrinsics === void 0 || // eslint-disable-next-line @endo/no-polymorphic-call
  assert.fail(X`Already locked down at ${priorRepairIntrinsics} (SES_ALREADY_LOCKED_DOWN)`, TypeError2);
  priorRepairIntrinsics = TypeError2("Prior lockdown (SES_ALREADY_LOCKED_DOWN)");
  priorRepairIntrinsics.stack;
  const { functionAllowed, evalAllowed, directEvalAllowed } = probeHostEvaluators();
  if (directEvalAllowed === false && evalTaming === "safe-eval" && (functionAllowed || evalAllowed)) {
    throw TypeError2("SES cannot initialize unless 'eval' is the original intrinsic 'eval', suitable for direct eval (dynamically scoped eval) (SES_DIRECT_EVAL)");
  }
  const seemsToBeLockedDown = () => {
    return universalThis.Function.prototype.constructor !== universalThis.Function && // @ts-ignore harden is absent on globalThis type def.
    typeof universalThis.harden === "function" && // @ts-ignore lockdown is absent on globalThis type def.
    typeof universalThis.lockdown === "function" && universalThis.Date.prototype.constructor !== universalThis.Date && typeof universalThis.Date.now === "function" && // @ts-ignore does not recognize that Date constructor is a special
    // Function.
    // eslint-disable-next-line @endo/no-polymorphic-call
    is(universalThis.Date.prototype.constructor.now(), NaN);
  };
  if (seemsToBeLockedDown()) {
    throw TypeError2(`Already locked down but not by this SES instance (SES_MULTIPLE_INSTANCES)`);
  }
  tameDomains(domainTaming);
  const markVirtualizedNativeFunction3 = tameFunctionToString();
  const { addIntrinsics, completePrototypes, finalIntrinsics } = makeIntrinsicsCollector(reporter);
  const tamedHarden = tameHarden(safeHarden, __hardenTaming__);
  addIntrinsics({
    harden: tamedHarden
  });
  addIntrinsics(tameFunctionConstructors());
  addIntrinsics(tameDateConstructor());
  addIntrinsics(tameErrorConstructor(errorTaming, stackFiltering));
  addIntrinsics(tameMathObject());
  addIntrinsics(tameRegExpConstructor(regExpTaming));
  addIntrinsics(tameSymbolConstructor());
  addIntrinsics(shimArrayBufferTransfer());
  addIntrinsics(tameModuleSource());
  addIntrinsics(getAnonymousIntrinsics());
  completePrototypes();
  const intrinsics = finalIntrinsics();
  const symbolForHarden = symbolFor("harden");
  const priorHarden = intrinsics.Object[symbolForHarden];
  if (priorHarden) {
    if (priorHarden.lockdownError) {
      throw priorHarden.lockdownError;
    }
    throw new TypeError2("Cannot lockdown (repairIntrinsics) if a prior harden implementation has been used and installed. Check for libraries using @endo/harden before lockdown.");
  }
  intrinsics.Object[symbolForHarden] = tamedHarden;
  const hostIntrinsics = {
    __proto__: null
  };
  if (typeof universalThis.Buffer === "function") {
    hostIntrinsics.Buffer = universalThis.Buffer;
  }
  let optGetStackString;
  if (errorTaming === "safe") {
    optGetStackString = intrinsics["%InitialGetStackString%"];
  }
  const consoleRecord = tameConsole(consoleTaming, errorTrapping, unhandledRejectionTrapping, optGetStackString);
  universalThis.console = /** @type {Console} */
  consoleRecord.console;
  if (typeof /** @type {any} */
  consoleRecord.console._times === "object") {
    hostIntrinsics.SafeMap = getPrototypeOf(
      // eslint-disable-next-line no-underscore-dangle
      /** @type {any} */
      consoleRecord.console._times
    );
  }
  if (errorTaming !== "unsafe" && errorTaming !== "unsafe-debug") {
    universalThis.assert = makeAssert();
  }
  tameLocaleMethods(intrinsics, localeTaming);
  tameFauxDataProperties(intrinsics);
  reportInGroup("SES Removing unpermitted intrinsics", reporter, (groupReporter) => removeUnpermittedIntrinsics(intrinsics, markVirtualizedNativeFunction3, groupReporter));
  setGlobalObjectConstantProperties(universalThis);
  setGlobalObjectMutableProperties(universalThis, {
    intrinsics,
    newGlobalPropertyNames: initialGlobalPropertyNames,
    makeCompartmentConstructor,
    markVirtualizedNativeFunction: markVirtualizedNativeFunction3
  });
  if (evalTaming === "no-eval" || // deprecated
  evalTaming === "noEval") {
    setGlobalObjectEvaluators(universalThis, noEvalEvaluate, markVirtualizedNativeFunction3);
  } else if (evalTaming === "safe-eval" || // deprecated
  evalTaming === "safeEval") {
    const { safeEvaluate } = makeSafeEvaluator({
      globalObject: universalThis
    });
    setGlobalObjectEvaluators(universalThis, safeEvaluate, markVirtualizedNativeFunction3);
  } else if (evalTaming === "unsafe-eval" || // deprecated
  evalTaming === "unsafeEval") {
  }
  const hardenIntrinsics = () => {
    priorHardenIntrinsics === void 0 || // eslint-disable-next-line @endo/no-polymorphic-call
    assert.fail(X`Already locked down at ${priorHardenIntrinsics} (SES_ALREADY_LOCKED_DOWN)`, TypeError2);
    priorHardenIntrinsics = TypeError2("Prior lockdown (SES_ALREADY_LOCKED_DOWN)");
    priorHardenIntrinsics.stack;
    reportInGroup("SES Enabling property overrides", reporter, (groupReporter) => enablePropertyOverrides(intrinsics, overrideTaming, groupReporter, overrideDebug));
    if (legacyRegeneratorRuntimeTaming === "unsafe-ignore") {
      tameRegeneratorRuntime();
    }
    const toHarden = {
      intrinsics,
      hostIntrinsics,
      globals: {
        // Harden evaluators
        Function: universalThis.Function,
        eval: universalThis.eval,
        // @ts-ignore Compartment does exist on globalThis
        Compartment: universalThis.Compartment,
        // Harden Symbol
        Symbol: universalThis.Symbol
      }
    };
    for (const prop of getOwnPropertyNames(initialGlobalPropertyNames)) {
      toHarden.globals[prop] = universalThis[prop];
    }
    tamedHarden(toHarden);
    return tamedHarden;
  };
  return hardenIntrinsics;
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/lockdown-shim.js
universalThis.lockdown = (options) => {
  const hardenIntrinsics = repairIntrinsics(options);
  universalThis.harden = hardenIntrinsics();
};
universalThis.repairIntrinsics = (options) => {
  const hardenIntrinsics = repairIntrinsics(options);
  universalThis.hardenIntrinsics = () => {
    universalThis.harden = hardenIntrinsics();
  };
};

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/compartment-shim.js
var markVirtualizedNativeFunction2 = tameFunctionToString();
var muteReporter = chooseReporter("none");
universalThis.Compartment = makeCompartmentConstructor(
  makeCompartmentConstructor,
  // Any reporting that would need to be done should have already been done
  // during `lockdown()`.
  // See https://github.com/endojs/endo/pull/2624#discussion_r1840979770
  getGlobalIntrinsics(universalThis, muteReporter),
  markVirtualizedNativeFunction2,
  {
    enforceNew: true
  }
);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/assert-shim.js
universalThis.assert = makeAssert(void 0, true);

// ../../../Library/Caches/deno/npm/registry.npmjs.org/ses/1.15.0/src/console-shim.js
var makeCausalConsoleFromLoggerForSesAva = defineCausalConsoleFromLogger(loggedErrorHandler);
var MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA = symbolFor("MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA");
universalThis[MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA] = makeCausalConsoleFromLoggerForSesAva;

// deno:https://jsr.io/@vanice/types/0.2.44/lib/operations/lib/Ajv.ts
var import_npm_ajv_8_17 = __toESM(require_ajv());
lockdown();
var Ajv_default = new import_npm_ajv_8_17.default.default();

// deno:https://jsr.io/@vanice/types/0.2.44/lib/operations/lib/validate.ts
var languages = [
  {
    canonical: "JavaScript",
    aliases: [
      "js"
    ]
  },
  {
    canonical: "JSON",
    aliases: []
  }
];
var defaultLanguage = languages[0].canonical;

// deno:https://jsr.io/@vanice/types/0.2.44/lib/crypto/XPub.ts
var maxIndex = 2 ** 31 - 1;

// deno:https://jsr.io/@vanice/types/0.2.44/Crypto.ts
var displayPublicKey6 = (publicKey) => {
  for (const cryptoName of cryptoNames) {
    if (isPublicKeyByCryptoName(cryptoName, publicKey)) {
      return displayPublicKeyByCryptoName(cryptoName, publicKey);
    }
  }
  throw new Error("Invalid PublicKey");
};

// src/generateKeyPair.ts
var generateKeyPair6 = async (cryptoName, shouldGenerateMnemonic = false, mnemonicPassphrase, xPub, index) => {
  if (xPub !== void 0 && index !== void 0) {
    const publicKey = derivePublicKeyFromXPub5(cryptoName, xPub, index);
    const publicKeyDisplay = displayPublicKey6(publicKey);
    return {
      cryptoName,
      publicKey,
      publicKeyDisplay
    };
  } else {
    return await generateKeyPair5(cryptoName, shouldGenerateMnemonic ? 12 : void 0, mnemonicPassphrase);
  }
};

// src/lib/utils/equalArrays.ts
var equalArrays_default = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};

// src/worker.ts
var worker = self;
worker.onmessage = async (event) => {
  const { primaryName, fingerprint, cryptoName, shouldGenerateMnemonic, mnemonicPassphrase, xPub, offset = 0, maxAttempts } = event.data;
  const searchLength = primaryName.length;
  const fingerprintLength = fingerprint?.length;
  let match = false;
  let totalAttempts = 0;
  while (match === false) {
    const index = offset + totalAttempts;
    const keyPair = await generateKeyPair6(cryptoName, shouldGenerateMnemonic, mnemonicPassphrase, xPub, index);
    const { publicKey } = keyPair;
    const primaryKey = publicKeyToPrimaryKey5(cryptoName, publicKey);
    const value = primaryKey.substring(0, searchLength);
    const isNameMatch = value === primaryName;
    let isFingerprintMatch = true;
    if (fingerprint !== void 0) {
      const fullFingerprint = await publicKeyToFingerprint(publicKey);
      isFingerprintMatch = equalArrays_default(fullFingerprint.slice(0, fingerprintLength), fingerprint);
    }
    if (isNameMatch && isFingerprintMatch) {
      worker.postMessage({
        success: true,
        ...keyPair,
        xPub,
        index
      });
      match = true;
    } else {
      totalAttempts++;
      worker.postMessage({
        success: false,
        totalAttempts
      });
    }
    if (maxAttempts !== void 0 && totalAttempts >= maxAttempts) {
      worker.postMessage({
        success: false,
        totalAttempts,
        maxAttemptsReached: true
      });
      break;
    }
  }
  self.close();
};
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
