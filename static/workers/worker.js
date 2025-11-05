// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/utils/isNumber.ts
var isNumber_default = (value) => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/CryptoNames.ts
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
    const q = b / a, r = b % a;
    const m = x - u * q, n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var callHash = (name) => {
  const fn = hashes[name];
  if (typeof fn !== "function") err("hashes." + name + " not set");
  return fn;
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
  constructor(X, Y, Z, T) {
    const max = B256;
    this.X = assertRange(X, 0n, max);
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
    const { X, Y, Z, T } = p;
    const X2 = M(X * X);
    const Y2 = M(Y * Y);
    const Z2 = M(Z * Z);
    const Z4 = M(Z2 * Z2);
    const aX2 = M(X2 * a);
    const left = M(Z2 * M(aX2 + Y2));
    const right = M(Z4 + M(d * M(X2 * Y2)));
    if (left !== right) return err("bad point: equation left != right (1)");
    const XY = M(X * Y);
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
    const { X, Y, Z } = this;
    if (this.equals(I)) return {
      x: 0n,
      y: 1n
    };
    const iz = invert(Z, P);
    if (M(Z * iz) !== 1n) err("invalid inverse");
    const x = M(X * iz);
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
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
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

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/utils/isString.ts
var isString_default = (value) => {
  return typeof value === "string";
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/Hex.ts
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

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/Hash.ts
var isHash = (value) => {
  return isHexString(value) && value.length === 64;
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Signature_Ed25519.ts
var NAME = "Ed25519";
var PUBLIC_KEY_LENGTH = 32;
var PRIVATE_KEY_LENGTH = 48;
if (hashes.sha512 === void 0) {
  hashes.sha512 = sha5122;
}
var toBuffer = (arr) => {
  return new Uint8Array(arr).buffer;
};
var isSignature = (value) => {
  return isHexString(value) && value.length === 128;
};
var sign = async (hash, privateKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", toBuffer(privateKey), "Ed25519", false, [
    "sign"
  ]);
  const signatureBuffer = await crypto.subtle.sign("Ed25519", cryptoKey, toBuffer(fromHex(hash)));
  const signatureArray = new Uint8Array(signatureBuffer);
  return toHex(signatureArray);
};
var verify = async (hash, signature, publicKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  const cryptoKey = await crypto.subtle.importKey("raw", toBuffer(publicKey), "Ed25519", false, [
    "verify"
  ]);
  const isValid = await crypto.subtle.verify("Ed25519", cryptoKey, toBuffer(fromHex(signature)), toBuffer(fromHex(hash)));
  return isValid;
};
var generateKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey("Ed25519", true, [
    "sign",
    "verify"
  ]);
  const publicKeyRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const publicKey = new Uint8Array(publicKeyRaw);
  const privateKeyRaw = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKey = new Uint8Array(privateKeyRaw);
  return {
    cryptoName: NAME,
    publicKey,
    privateKey
  };
};
var keyPairFromPrivateKey = (privateKey) => {
  const publicKey = getPublicKey(privateKey.slice(-32));
  return {
    cryptoName: NAME,
    publicKey,
    privateKey
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/utils/getUTF8StringLength.ts
var getUTF8StringLength_default = (str) => {
  const segmenter = new Intl.Segmenter("en", {
    granularity: "grapheme"
  });
  return [
    ...segmenter.segment(str)
  ].length;
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/Base32.ts
var isBase32 = (value) => {
  return isNumber_default(value) && Number.isInteger(value) && value >= 0 && value < 32;
};
var isBase32Array = (value) => {
  return Array.isArray(value) && value.every(isBase32);
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
var encode = (arr, alphabet) => {
  if (!isBase32Array(arr)) {
    throw new Error("Input is not a valid Base32 array");
  }
  if (!isBase32Alphabet(alphabet)) {
    throw new Error("Alphabet must be a string of exactly 32 characters");
  }
  const chars = Array.from(alphabet);
  return arr.map((v) => chars[v]).join("");
};
var decode = (str, alphabet) => {
  if (!isBase32Alphabet(alphabet)) {
    throw new Error("Alphabet must be a string of exactly 32 characters");
  }
  const chars = Array.from(alphabet);
  return Array.from(str).map((char) => {
    const index = chars.indexOf(char);
    if (index === -1) {
      throw new Error(`Character not in alphabet: ${char}`);
    }
    return index;
  });
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/characters.json
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

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/characters.ts
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

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/codec.ts
var publicKeyToPrimaryChars = (publicKey) => {
  return encode(uint8ArrayToBase32Array(publicKey), primaryAlphabet);
};
var primaryCharsToUint8Array = (chars) => {
  return base32ToUint8Array(decode(chars, primaryAlphabet));
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/utils/last.ts
var last_default = (s, n = 0) => {
  if (n > s.length) throw new Error("Index out of range");
  const i = Math.abs(n);
  if (i === 0) {
    return s.slice(-1);
  } else {
    return s.slice(-i - 1, -i);
  }
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/PrimaryKey.ts
var isPrimaryChars = (value) => {
  return isString_default(value) && primaryCharsRegex.test(value);
};
var readCryptoIndexFromPrimaryKey = (primaryKey) => {
  return parseCryptoIndex(last_default(primaryKey));
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/PrimaryKey.ts
var isPrimaryKey2 = (length, index) => (value) => {
  return isPrimaryChars(value) && value.length === length && parseCryptoIndex(last_default(value)) === index;
};
var appendCryptoIndexToPrimaryChars = (index) => (primaryChars2) => {
  return primaryChars2 + index.toString();
};
var removeCryptoIndexFromPrimaryKey = (length, index) => (primaryKey) => {
  if (isPrimaryKey2(length, index)(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const cryptoIndex = readCryptoIndexFromPrimaryKey(primaryKey);
  if (cryptoIndex !== index) {
    throw new Error("Invalid Crypto index in PrimaryKey");
  }
  return primaryKey.slice(0, -1);
};
var splitPrimaryKeyAndCryptoIndex = (length, index) => (primaryKey) => {
  if (isPrimaryKey2(length, index)(primaryKey) === false) {
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
var primaryKeyToPublicKey2 = (length, index) => (primaryKey) => {
  if (isPrimaryKey2(length, index)(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const primaryChars2 = removeCryptoIndexFromPrimaryKey(length, index)(primaryKey);
  return primaryCharsToUint8Array(primaryChars2);
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/utils/isUint8Array.ts
var isUint8Array = (value) => {
  return value instanceof Uint8Array;
};
var isUint8ArrayOfLength = (value, length) => {
  return isUint8Array(value) && value.length === length;
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Crypto.ts
var isPublicKey = (length) => (value) => {
  return isUint8ArrayOfLength(value, length);
};
var isPrivateKey = (length) => (value) => {
  return isUint8ArrayOfLength(value, length);
};
var publicKeyToPrimaryKey2 = (length, index) => (publicKey) => {
  if (isPublicKey(length)(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  return appendCryptoIndexToPrimaryChars(index)(publicKeyToPrimaryChars(publicKey));
};
var displayPublicKey = (publicKey) => {
  return toHex(publicKey);
};
var displayPrivateKey = (privateKey) => {
  return toHex(privateKey);
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/toPrimaryKeyLength.ts
var toPrimaryKeyLength = (bytesLength) => {
  return toBase32Length(bytesLength) + 1;
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/createCrypto.ts
var createCrypto = (options) => {
  const { name, publicKeyLength, privateKeyLength } = options;
  const index = cryptoNames.indexOf(name);
  const primaryKeyLength = toPrimaryKeyLength(publicKeyLength);
  const isPublicKey4 = isPublicKey(publicKeyLength);
  const isPrivateKey3 = isPrivateKey(privateKeyLength);
  const publicKeyToPrimaryKey4 = publicKeyToPrimaryKey2(publicKeyLength, index);
  const displayPublicKey3 = displayPublicKey;
  const displayPrivateKey3 = displayPrivateKey;
  const isPrimaryKey5 = isPrimaryKey2(primaryKeyLength, index);
  const appendCryptoIndexToPrimaryChars2 = appendCryptoIndexToPrimaryChars(index);
  const removeCryptoIndexFromPrimaryKey2 = removeCryptoIndexFromPrimaryKey(primaryKeyLength, index);
  const splitPrimaryKeyAndCryptoIndex2 = splitPrimaryKeyAndCryptoIndex(primaryKeyLength, index);
  const primaryKeyToPublicKey5 = primaryKeyToPublicKey2(primaryKeyLength, index);
  return {
    isPublicKey: isPublicKey4,
    isPrivateKey: isPrivateKey3,
    displayPublicKey: displayPublicKey3,
    displayPrivateKey: displayPrivateKey3,
    isPrimaryKey: isPrimaryKey5,
    appendCryptoIndexToPrimaryChars: appendCryptoIndexToPrimaryChars2,
    removeCryptoIndexFromPrimaryKey: removeCryptoIndexFromPrimaryKey2,
    splitPrimaryKeyAndCryptoIndex: splitPrimaryKeyAndCryptoIndex2,
    publicKeyToPrimaryKey: publicKeyToPrimaryKey4,
    primaryKeyToPublicKey: primaryKeyToPublicKey5
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Crypto_Ed25519.ts
var crypto3 = createCrypto({
  name: NAME,
  publicKeyLength: PUBLIC_KEY_LENGTH,
  privateKeyLength: PRIVATE_KEY_LENGTH
});
var create = () => {
  return {
    ...crypto3,
    isSignature,
    sign,
    verify,
    generateKeyPair,
    keyPairFromPrivateKey
  };
};

// deno:https://jsr.io/@noble/secp256k1/3.0.0/index.ts
var secp256k1_CURVE = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  h: 1n,
  a: 0n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P2, n: N2, Gx: Gx2, Gy: Gy2, b: _b } = secp256k1_CURVE;
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
var isBytes3 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes3 = (value, length, title = "") => {
  const bytes = isBytes3(value);
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
var bytesToHex2 = (b) => Array.from(abytes3(b)).map((e) => padh2(e, 2)).join("");
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
var hexToBytes2 = (hex) => {
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
var concatBytes2 = (...arrs) => {
  const r = u8n2(arrs.reduce((sum, a) => sum + abytes3(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes = (len = L3) => {
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
var invert2 = (num, md) => {
  if (num === 0n || md <= 0n) err2("no inverse n=" + num + " mod=" + md);
  let a = M2(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q = b / a, r = b % a;
    const m = x - u * q, n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M2(x, md) : err2("no inverse");
};
var callHash2 = (name) => {
  const fn = hashes2[name];
  if (typeof fn !== "function") err2("hashes." + name + " not set");
  return fn;
};
var apoint2 = (p) => p instanceof Point2 ? p : err2("Point expected");
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
var Point2 = class _Point {
  static BASE;
  static ZERO;
  X;
  Y;
  Z;
  constructor(X, Y, Z) {
    this.X = FpIsValid(X);
    this.Y = FpIsValidNot0(Y);
    this.Z = FpIsValid(Z);
    Object.freeze(this);
  }
  static CURVE() {
    return secp256k1_CURVE;
  }
  /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I2 : new _Point(x, y, 1n);
  }
  /** Convert Uint8Array or hex string to Point. */
  static fromBytes(bytes) {
    abytes3(bytes);
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
    return _Point.fromBytes(hexToBytes2(hex));
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
    if (this.equals(G2)) return wNAF2(n).p;
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
    const iz = invert2(z, P2);
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
    if (isCompressed) return concatBytes2(getPrefix(y), x32b);
    return concatBytes2(u8of(4), x32b, numTo32b(y));
  }
  toHex(isCompressed) {
    return bytesToHex2(this.toBytes(isCompressed));
  }
};
var G2 = new Point2(Gx2, Gy2, 1n);
var I2 = new Point2(0n, 1n, 0n);
Point2.BASE = G2;
Point2.ZERO = I2;
var doubleScalarMulUns = (R, u1, u2) => {
  return G2.multiply(u1, false).add(R.multiply(u2, false)).assertValidity();
};
var bytesToNumBE = (b) => big2("0x" + (bytesToHex2(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B2562 = 2n ** 256n;
var numTo32b = (num) => hexToBytes2(padh2(arange(num, 0n, B2562), L22));
var secretKeyToScalar = (secretKey) => {
  const num = bytesToNumBE(abytes3(secretKey, L3, "secret key"));
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
    const res = concatBytes2(numTo32b(r), numTo32b(s));
    if (format === SIG_RECOVERED) {
      assertRecoveryBit(recovery);
      return concatBytes2(Uint8Array.of(recovery), res);
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
var bits2int_modN = (bytes) => modN2(bits2int(abytes3(bytes)));
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
  abytes3(msg, void 0, "message");
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
  const h2 = (...b) => hashes2.hmacSha256Async(k, concatBytes2(v, ...b));
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
    const e = extraEntropy === true ? randomBytes(L3) : extraEntropy;
    seedArgs.push(abytes3(e, void 0, "extraEntropy"));
  }
  const seed = concatBytes2(...seedArgs);
  const m = h1i;
  const k2sig = (kBytes) => {
    const k = bits2int(kBytes);
    if (!(1n <= k && k < N2)) return;
    const ik = invert2(k, N2);
    const q = G2.multiply(k).toAffine();
    const r = modN2(q.x);
    if (r === 0n) return;
    const s = modN2(ik * modN2(m + r * d));
    if (s === 0n) return;
    let recovery = (q.x === r ? 0 : 2) | Number(q.y & 1n);
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
  abytes3(publicKey, void 0, "publicKey");
  try {
    const { r, s } = Signature.fromBytes(sig, format);
    const h2 = bits2int_modN(messageHash);
    const P3 = Point2.fromBytes(publicKey);
    if (lowS && highS(s)) return false;
    const is = invert2(s, N2);
    const u1 = modN2(h2 * is);
    const u2 = modN2(r * is);
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
var verify2 = (signature, message, publicKey, opts = {}) => {
  opts = setDefaults(opts);
  message = prepMsg(message, opts, false);
  return _verify(signature, message, publicKey, opts);
};
var randomSecretKey = (seed = randomBytes(lengths.seed)) => {
  abytes3(seed);
  if (seed.length < lengths.seed || seed.length > 1024) err2("expected 40-1024b");
  const num = M2(bytesToNumBE(seed), N2 - 1n);
  return numTo32b(num + 1n);
};
var createKeygen = (getPublicKey4) => (seed) => {
  const secretKey = randomSecretKey(seed);
  return {
    secretKey,
    publicKey: getPublicKey4(secretKey)
  };
};
var keygen = createKeygen(getPublicKey2);
var getTag = (tag) => Uint8Array.from("BIP0340/" + tag, (c) => c.charCodeAt(0));
var T_AUX = "aux";
var T_NONCE = "nonce";
var T_CHALLENGE = "challenge";
var taggedHash = (tag, ...messages) => {
  const fn = callHash2("sha256");
  const tagH = fn(getTag(tag));
  return fn(concatBytes2(tagH, tagH, ...messages));
};
var taggedHashAsync = async (tag, ...messages) => {
  const fn = hashes2.sha256Async;
  const tagH = await fn(getTag(tag));
  return await fn(concatBytes2(tagH, tagH, ...messages));
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
var keygenSchnorr = createKeygen(pubSchnorr);
var prepSigSchnorr = (message, secretKey, auxRand) => {
  const { px, d } = extpubSchnorr(secretKey);
  return {
    m: abytes3(message),
    px,
    d,
    a: abytes3(auxRand, L3)
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
  return concatBytes2(px, numTo32b(modN2(k + e * d)));
};
var E_INVSIG = "invalid signature produced";
var signSchnorr = (message, secretKey, auxRand = randomBytes(L3)) => {
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
var signSchnorrAsync = async (message, secretKey, auxRand = randomBytes(L3)) => {
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
  const sig = abytes3(signature, L22, "signature");
  const msg = abytes3(message, void 0, "message");
  const pub = abytes3(publicKey, L3, "publicKey");
  try {
    const x = bytesToNumBE(pub);
    const y = lift_x(x);
    const y_ = isEven(y) ? y : M2(-y);
    const P_ = new Point2(x, y_, 1n).assertValidity();
    const px = numTo32b(P_.toAffine().x);
    const r = sliceBytesNumBE(sig, 0, L3);
    arange(r, 1n, P2);
    const s = sliceBytesNumBE(sig, L3, L22);
    arange(s, 1n, N2);
    const i = concatBytes2(numTo32b(r), px, msg);
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
var wNAF2 = (n) => {
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

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Signature_ECDSA.ts
var NAME2 = "ECDSA";
var PRIVATE_KEY_LENGTH2 = 32;
var PUBLIC_KEY_X_LENGTH = 32;
var PUBLIC_KEY_LENGTH2 = 1 + PUBLIC_KEY_X_LENGTH;
if (hashes2.sha256 === void 0) {
  hashes2.sha256 = sha256;
}
var isSignature2 = (value) => {
  return isHexString(value) && value.length === 128;
};
var sign2 = async (hash, privateKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  return toHex(await signAsync(fromHex(hash), privateKey));
};
var verify3 = (hash, signature, publicKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  return verify2(fromHex(signature), fromHex(hash), publicKey);
};
var generateKeyPair2 = () => {
  const { secretKey: privateKey, publicKey } = keygen();
  return {
    cryptoName: NAME2,
    publicKey,
    privateKey
  };
};
var keyPairFromPrivateKey2 = (privateKey) => {
  const publicKey = getPublicKey2(privateKey);
  return {
    cryptoName: NAME2,
    publicKey,
    privateKey
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Crypto_ECDSA.ts
var flags = [
  2,
  3
];
var crypto4 = createCrypto({
  name: NAME2,
  publicKeyLength: PUBLIC_KEY_LENGTH2,
  privateKeyLength: PRIVATE_KEY_LENGTH2
});
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
var isPublicKey2 = (value) => {
  return crypto4.isPublicKey(value) && isFlag(value[0]);
};
var isPublicKeyX = (value) => {
  return isUint8ArrayOfLength(value, PUBLIC_KEY_X_LENGTH);
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
  return crypto4.isPrimaryKey(value) && isFlag(parseFlag(last_default(value, 1)));
};
var splitPublicKey = (publicKey) => {
  if (isPublicKey2(publicKey) === false) {
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
  const [primaryCharsAndFlag, index] = crypto4.splitPrimaryKeyAndCryptoIndex(primaryKey);
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
  if (isPublicKey2(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const [flag, publicKeyX] = splitPublicKey(publicKey);
  return crypto4.appendCryptoIndexToPrimaryChars(appendFlagToPrimaryChars(publicKeyToPrimaryChars(publicKeyX), flag));
};
var primaryKeyToPublicKey3 = (primaryKey) => {
  if (isPrimaryKey3(primaryKey) === false) {
    throw new Error("Invalid PrimaryKey");
  }
  const [primaryChars2, flag] = splitPrimaryKey(primaryKey);
  return prependFlagToPublicKeyX(primaryCharsToUint8Array(primaryChars2), flag);
};
var create2 = () => {
  return {
    ...crypto4,
    isPrimaryKey: isPrimaryKey3,
    isPublicKey: isPublicKey2,
    publicKeyToPrimaryKey: publicKeyToPrimaryKey3,
    primaryKeyToPublicKey: primaryKeyToPublicKey3,
    isSignature: isSignature2,
    sign: sign2,
    verify: verify3,
    generateKeyPair: generateKeyPair2,
    keyPairFromPrivateKey: keyPairFromPrivateKey2
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Signature_Schnorr.ts
var { getPublicKey: getPublicKey3, signAsync: signAsync2, verify: secpVerify, keygen: keygen2 } = schnorr;
var NAME3 = "Schnorr";
var PUBLIC_KEY_LENGTH3 = 32;
var PRIVATE_KEY_LENGTH3 = 32;
var isSignature3 = (value) => {
  return isHexString(value) && value.length === 128;
};
var sign3 = async (hash, privateKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  return toHex(await signAsync2(fromHex(hash), privateKey));
};
var verify4 = (hash, signature, publicKey) => {
  if (!isHash(hash)) throw new Error("Invalid hash");
  return secpVerify(fromHex(signature), fromHex(hash), publicKey);
};
var generateKeyPair3 = () => {
  const { secretKey: privateKey, publicKey } = keygen2();
  return {
    cryptoName: NAME3,
    publicKey,
    privateKey
  };
};
var keyPairFromPrivateKey3 = (privateKey) => {
  const publicKey = getPublicKey3(privateKey);
  return {
    cryptoName: NAME3,
    publicKey,
    privateKey
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Crypto_Schnorr.ts
var crypto5 = createCrypto({
  name: NAME3,
  publicKeyLength: PUBLIC_KEY_LENGTH3,
  privateKeyLength: PRIVATE_KEY_LENGTH3
});
var create3 = () => {
  return {
    ...crypto5,
    isSignature: isSignature3,
    sign: sign3,
    verify: verify4,
    generateKeyPair: generateKeyPair3,
    keyPairFromPrivateKey: keyPairFromPrivateKey3
  };
};

// deno:https://jsr.io/@vanice/types/0.2.0-alpha.2/lib/crypto/Cryptos.ts
var cryptos = {
  Ed25519: create(),
  ECDSA: create2(),
  Schnorr: create3()
};
var publicKeyToPrimaryKey = (name, publicKey) => {
  return cryptos[name].publicKeyToPrimaryKey(publicKey);
};
var generateKeyPair4 = async (name) => {
  return await cryptos[name].generateKeyPair();
};

// src/worker.ts
var worker = self;
worker.onmessage = async (event) => {
  const { search, cryptoName } = event.data;
  const searchLength = search.length;
  let match = false;
  let totalSearches = 0;
  while (match === false) {
    const { publicKey, privateKey } = await generateKeyPair4(cryptoName);
    const primaryKey = publicKeyToPrimaryKey(cryptoName, publicKey);
    const value = primaryKey.substring(0, searchLength);
    if (value === search) {
      worker.postMessage({
        success: true,
        privateKey,
        publicKey
      });
      match = true;
    } else {
      totalSearches++;
      worker.postMessage({
        success: false,
        totalSearches
      });
    }
  }
  self.close();
};
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
