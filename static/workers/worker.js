var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto_Ed25519.ts
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

// deno:https://jsr.io/@noble/ed25519/3.0.1/index.ts
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
var P_MASK = (1n << 255n) - 1n;
var modP = (num) => {
  if (num < 0n) err("negative coordinate");
  let r = (num >> 255n) * 19n + (num & P_MASK);
  r = (r >> 255n) * 19n + (r & P_MASK);
  return r % P;
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
    return new _Point(p.x, p.y, 1n, modP(p.x * p.y));
  }
  /** RFC8032 5.1.3: Uint8Array to Point. */
  static fromBytes(hex, zip215 = false) {
    const d = _d;
    const normed = u8fr(abytes(hex, L));
    const lastByte = hex[31];
    normed[31] = lastByte & ~128;
    const y = bytesToNumberLE(normed);
    const max = zip215 ? B256 : P;
    assertRange(y, 0n, max);
    const y2 = modP(y * y);
    const u = M(y2 - 1n);
    const v = modP(d * y2 + 1n);
    let { isValid, value: x } = uvRatio(u, v);
    if (!isValid) err("bad point: y not sqrt");
    const isXOdd = (x & 1n) === 1n;
    const isLastByteOdd = (lastByte & 128) !== 0;
    if (!zip215 && x === 0n && isLastByteOdd) err("bad point: x==0, isLastByteOdd");
    if (isLastByteOdd !== isXOdd) x = M(-x);
    return new _Point(x, y, 1n, modP(x * y));
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
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * (aX2 + Y2));
    const right = M(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right) return err("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT) return err("bad point: equation left != right (2)");
    return this;
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
    const X1Z2 = modP(X1 * Z2);
    const X2Z1 = modP(X2 * Z1);
    const Y1Z2 = modP(Y1 * Z2);
    const Y2Z1 = modP(Y2 * Z1);
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
    const A = modP(X1 * X1);
    const B = modP(Y1 * Y1);
    const C3 = modP(2n * Z1 * Z1);
    const D = modP(a * A);
    const x1y1 = M(X1 + Y1);
    const E = M(modP(x1y1 * x1y1) - A - B);
    const G3 = M(D + B);
    const F = M(G3 - C3);
    const H = M(D - B);
    const X3 = modP(E * F);
    const Y3 = modP(G3 * H);
    const T3 = modP(E * H);
    const Z3 = modP(F * G3);
    return new _Point(X3, Y3, Z3, T3);
  }
  /** Point addition. Complete formula. Cost: `8M + 1*k + 8add + 1*2`. */
  add(other) {
    const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
    const { X: X2, Y: Y2, Z: Z2, T: T2 } = apoint(other);
    const a = _a;
    const d = _d;
    const A = modP(X1 * X2);
    const B = modP(Y1 * Y2);
    const C3 = modP(modP(T1 * d) * T2);
    const D = modP(Z1 * Z2);
    const E = M(modP(M(X1 + Y1) * M(X2 + Y2)) - A - B);
    const F = M(D - C3);
    const G3 = M(D + C3);
    const H = M(B - modP(a * A));
    const X3 = modP(E * F);
    const Y3 = modP(G3 * H);
    const T3 = modP(E * H);
    const Z3 = modP(F * G3);
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
    if (modP(Z * iz) !== 1n) err("invalid inverse");
    const x = modP(X * iz);
    const y = modP(Y * iz);
    return {
      x,
      y
    };
  }
  toBytes() {
    const { x, y } = this.toAffine();
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
var numTo32bLE = (num) => hexToBytes(padh(assertRange(num, 0n, B256), 64)).reverse();
var bytesToNumberLE = (b) => big("0x" + bytesToHex(u8fr(abytes(b)).reverse()));
var pow2 = (x, power) => {
  let r = x;
  while (power-- > 0n) {
    r = modP(r * r);
  }
  return r;
};
var pow_2_252_3 = (x) => {
  const x2 = modP(x * x);
  const b2 = modP(x2 * x);
  const b4 = modP(pow2(b2, 2n) * b2);
  const b5 = modP(pow2(b4, 1n) * x);
  const b10 = modP(pow2(b5, 5n) * b5);
  const b20 = modP(pow2(b10, 10n) * b10);
  const b40 = modP(pow2(b20, 20n) * b20);
  const b80 = modP(pow2(b40, 40n) * b40);
  const b160 = modP(pow2(b80, 80n) * b80);
  const b240 = modP(pow2(b160, 80n) * b80);
  const b250 = modP(pow2(b240, 10n) * b10);
  const pow_p_5_8 = modP(pow2(b250, 2n) * x);
  return {
    pow_p_5_8,
    b2
  };
};
var RM1 = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n;
var uvRatio = (u, v) => {
  const v3 = modP(v * modP(v * v));
  const v7 = modP(modP(v3 * v3) * v);
  const pow = pow_2_252_3(modP(u * v7)).pow_p_5_8;
  let x = modP(u * modP(v3 * pow));
  const vx2 = modP(v * modP(x * x));
  const root1 = x;
  const root2 = modP(x * RM1);
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
var modL_LE = (hash) => modN(bytesToNumberLE(hash));
var sha512s = (...m) => callHash("sha512")(concatBytes(...m));
var hash2extK = (hashed) => {
  const head = hashed.slice(0, 32);
  head[0] &= 248;
  head[31] &= 127;
  head[31] |= 64;
  const prefix = hashed.slice(32, 64);
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/isNumber.ts
var isNumber_default = (value) => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/isString.ts
var isString = (value) => {
  return typeof value === "string";
};
var isString_default = isString;

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/CryptoNames.ts
var cryptoNames = [
  "Ed25519",
  "ECDSA",
  "Schnorr"
];
var indexOfCrypto = (name) => {
  return cryptoNames.indexOf(name);
};
var isCryptoIndex = (value) => {
  return isNumber_default(value) && Number.isInteger(value) && value >= 0 && value < cryptoNames.length;
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
function checksum(len, fn) {
  anumber2(len);
  afn(fn);
  return {
    encode(data) {
      if (!isBytes4(data)) throw new Error("checksum.encode: input should be Uint8Array");
      const sum = fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes4(data)) throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = fn(payload).slice(0, len);
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
function bytesToNumberLE2(bytes) {
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
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0) return val;
    const computed = fn(arg, ...args);
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
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
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
    let scalar = isLE ? bytesToNumberLE2(bytes) : bytesToNumberBE(bytes);
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
  const num = isLE ? bytesToNumberLE2(key) : bytesToNumberBE(key);
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
      const L3 = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L3));
      const y = Fp.fromBytes(tail.subarray(L3, L3 * 2));
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
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE)) return {
      x: X,
      y: Y
    };
    const is0 = p.is0();
    if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
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
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
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
      const L3 = lengths2.signature / 2;
      const r = bytes.subarray(0, L3);
      const s = bytes.subarray(L3, L3 * 2);
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
      const q = Point4.BASE.multiply(k).toAffine();
      const r = Fn2.create(q.x);
      if (r === _0n4) return;
      const s = Fn2.create(ik * Fn2.create(m + r * d));
      if (s === _0n4) return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
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
  function sign5(message, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    const drbg = createHmacDrbg(hash.outputLen, Fn2.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts.format);
  }
  function verify6(signature, message, publicKey, opts = {}) {
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
      const is = Fn2.inv(s);
      const u1 = Fn2.create(h2 * is);
      const u2 = Fn2.create(r * is);
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
    sign: sign5,
    verify: verify6,
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
  const L3 = [
    Id160
  ];
  const R = [
    Pi160
  ];
  const res = [
    L3,
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/isArray.ts
var isArray_default = (value) => Array.isArray(value);

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Mnemonic.ts
var displayMnemonic = (mnemonic) => {
  return mnemonic.join(" ");
};
var displayMnemonicDisplayWithPassphrase = (mnemonicDisplay, passphrase) => {
  return `${mnemonicDisplay}${passphrase ? ` ${passphrase}` : ""}`;
};
var displayMnemonicWithPassphrase = (mnemonic, passphrase) => {
  return displayMnemonicDisplayWithPassphrase(displayMnemonic(mnemonic), passphrase);
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/Hex.ts
var isHexString = (value) => {
  return isString_default(value) && value.length % 2 === 0 && /^[0-9a-f]*$/.test(value);
};
var toHex = (arr) => {
  return Array.from(arr).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
var fromHex = (hex) => {
  if (isHexString(hex) === false) {
    throw new Error(`Invalid HexString: ${hex}`);
  }
  const s = hex.length % 2 === 0 ? hex : "0" + hex;
  const bytes = [];
  for (let i = 0; i < s.length; i += 2) {
    bytes.push(parseInt(s.slice(i, i + 2), 16));
  }
  return new Uint8Array(bytes);
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/KeyPair.ts
var displayPublicKey = (publicKey) => {
  return toHex(publicKey);
};
var displayPrivateKey = (privateKey) => {
  return toHex(privateKey);
};
var displayKeyPair = (keyPair) => {
  const { publicKey, privateKey, mnemonic, mnemonicPassphrase } = keyPair;
  const publicKeyDisplay = displayPublicKey(publicKey);
  const privateKeyDisplay = displayPrivateKey(privateKey);
  const mnemonicDisplay = mnemonic !== void 0 ? displayMnemonic(mnemonic) : void 0;
  const mnemonicDisplayWithPassphrase = mnemonic !== void 0 ? displayMnemonicWithPassphrase(mnemonic, mnemonicPassphrase) : void 0;
  return {
    ...keyPair,
    publicKeyDisplay,
    privateKeyDisplay,
    mnemonicDisplay,
    mnemonicDisplayWithPassphrase
  };
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/characters.json
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/characters.ts
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/getUTF8StringLength.ts
var getUTF8StringLength_default = (str) => {
  const segmenter = new Intl.Segmenter("en", {
    granularity: "grapheme"
  });
  return [
    ...segmenter.segment(str)
  ].length;
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/Base32.ts
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/codec.ts
var hashToFingerprint = (hash) => {
  return uint8ArrayToBase32Array(hash);
};
var publicKeyToPrimaryChars = (publicKey) => {
  return encode(uint8ArrayToBase32Array(publicKey), primaryAlphabet);
};
var primaryCharsToUint8Array = (chars) => {
  return base32ToUint8Array(decode(chars, primaryAlphabet));
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/isUint8Array.ts
var isUint8Array = (value) => {
  return value instanceof Uint8Array;
};
var isUint8ArrayOfLength = (value, length) => {
  return isUint8Array(value) && value.length === length;
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/last.ts
var last_default = (s, n = 0) => {
  if (n > s.length) throw new Error("Index out of range");
  const i = Math.abs(n);
  if (i === 0) {
    return s.slice(-1);
  } else {
    return s.slice(-i - 1, -i);
  }
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/digest.ts
var digest_default = async (arr) => {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(arr)));
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/Hash.ts
var isHash = (value) => {
  return isHexString(value) && value.length === 64;
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto.ts
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
var sign = (length, sign5) => async (hash, privateKey) => {
  if (!isHash(hash)) throw new Error("Invalid Hash");
  if (!isPrivateKey(length)(privateKey)) throw new Error("Invalid PrivateKey");
  return await sign5(fromHex(hash), privateKey);
};
var verify = (signatureLength, publicKeyLength, verify6) => (hash, signature, publicKey) => {
  if (isHash(hash) === false) throw new Error("Invalid Hash");
  if (isSignature(signatureLength)(signature) === false) throw new Error("Invalid Signature");
  if (isPublicKey(publicKeyLength)(publicKey) === false) throw new Error("Invalid PublicKey");
  return verify6(signature, fromHex(hash), publicKey);
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
var keyPairFromMnemonic = (cryptoName, keyPairFromPrivateKey5) => (mnemonic, mnemonicPassphrase) => {
  if (cryptoName === "Ed25519") throw new Error("keyPairFromMnemonic is not supported for Ed25519");
  const privateKey = mnemonicToPrivateKey(mnemonic, mnemonicPassphrase);
  const keyPair = keyPairFromPrivateKey5(privateKey);
  return displayKeyPair({
    ...keyPair,
    mnemonic,
    mnemonicPassphrase
  });
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/toPrimaryKeyLength.ts
var toPrimaryKeyLength = (bytesLength) => {
  return toBase32Length(bytesLength) + 1;
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/utils/toBuffer.ts
var toBuffer_default = (arr) => {
  return new Uint8Array(arr).buffer;
};

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto_Ed25519.ts
var NAME = "Ed25519";
var INDEX = indexOfCrypto(NAME);
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
  let privateKey;
  if (isHexString(privateKeyDisplay)) {
    privateKey = fromHex(privateKeyDisplay);
  } else {
    privateKey = privateKeyDisplay;
  }
  const keyPair = keyPairFromPrivateKey_(privateKey.slice(-32));
  return {
    ...keyPair,
    privateKey,
    privateKeyDisplay: displayPrivateKey3(privateKey)
  };
};
var keyPairFromMnemonic2 = keyPairFromMnemonic(NAME, keyPairFromPrivateKey2);

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto_ECDSA.ts
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
var L2 = 32;
var L22 = 64;
var lengths = {
  publicKey: L2 + 1,
  publicKeyUncompressed: L22 + 1,
  signature: L22,
  seed: L2 + L2 / 2
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
var randomBytes2 = (len = L2) => {
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
  constructor(X, Y, Z) {
    this.X = FpIsValid(X);
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
    const x = sliceBytesNumBE(tail, 0, L2);
    if (length === comp && (head === 2 || head === 3)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big2(head));
      if (evenH !== evenY) y = M2(-y);
      p = new _Point(x, y, 1n);
    }
    if (length === uncomp && head === 4) p = new _Point(x, sliceBytesNumBE(tail, L2, L22), 1n);
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
  const num = bytesToNumBE(abytes4(secretKey, L2, "secret key"));
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
    const r = sliceBytesNumBE(b, 0, L2);
    const s = sliceBytesNumBE(b, L2, L22);
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
  let v = u8n2(L2);
  let k = u8n2(L2);
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
    const e = extraEntropy === true ? randomBytes2(L2) : extraEntropy;
    seedArgs.push(abytes4(e, void 0, "extraEntropy"));
  }
  const seed = concatBytes3(...seedArgs);
  const m = h1i;
  const k2sig = (kBytes) => {
    const k = bits2int(kBytes);
    if (!(1n <= k && k < N2)) return;
    const ik = invert3(k, N2);
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
  abytes4(publicKey, void 0, "publicKey");
  try {
    const { r, s } = Signature.fromBytes(sig, format);
    const h2 = bits2int_modN(messageHash);
    const P3 = Point3.fromBytes(publicKey);
    if (lowS && highS(s)) return false;
    const is = invert3(s, N2);
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
  const fn = callHash2("sha256");
  const tagH = fn(getTag(tag));
  return fn(concatBytes3(tagH, tagH, ...messages));
};
var taggedHashAsync = async (tag, ...messages) => {
  const fn = hashes2.sha256Async;
  const tagH = await fn(getTag(tag));
  return await fn(concatBytes3(tagH, tagH, ...messages));
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
    a: abytes4(auxRand, L2)
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
var signSchnorr = (message, secretKey, auxRand = randomBytes2(L2)) => {
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
var signSchnorrAsync = async (message, secretKey, auxRand = randomBytes2(L2)) => {
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
  const pub = abytes4(publicKey, L2, "publicKey");
  try {
    const x = bytesToNumBE(pub);
    const y = lift_x(x);
    const y_ = isEven(y) ? y : M2(-y);
    const P_ = new Point3(x, y_, 1n).assertValidity();
    const px = numTo32b(P_.toAffine().x);
    const r = sliceBytesNumBE(sig, 0, L2);
    arange(r, 1n, P2);
    const s = sliceBytesNumBE(sig, L2, L22);
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto_ECDSA.ts
var NAME2 = "ECDSA";
var INDEX2 = indexOfCrypto(NAME2);
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Crypto_Schnorr.ts
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
var INDEX3 = indexOfCrypto(NAME3);
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/Cryptos.ts
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

// deno:https://jsr.io/@onamea/types/0.3.7/lib/crypto/XPub.ts
var maxIndex = 2 ** 31 - 1;

// deno:https://jsr.io/@onamea/types/0.3.7/Crypto.ts
var displayPublicKey6 = (publicKey) => {
  for (const cryptoName of cryptoNames) {
    if (isPublicKeyByCryptoName(cryptoName, publicKey)) {
      return displayPublicKeyByCryptoName(cryptoName, publicKey);
    }
  }
  throw new Error("Invalid PublicKey");
};

// deno:https://jsr.io/@onamea/types/0.3.7/Fingerprint.ts
var uint8ArrayToFingerprint = async (uint8Array) => {
  const hash = await digest_default(uint8Array);
  return hashToFingerprint(hash);
};
var publicKeyToFingerprint = async (publicKey) => {
  return await uint8ArrayToFingerprint(publicKey);
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
  const { primaryName, fingerprint, cryptoName, shouldGenerateMnemonic, mnemonicPassphrase, xPub, offset = 0, maxAttempts, progressIntervalMs = 100 } = event.data;
  const searchLength = primaryName.length;
  const fingerprintLength = fingerprint?.length;
  let match = false;
  let totalAttempts = 0;
  let lastProgressSent = 0;
  const postProgress = () => {
    const now = Date.now();
    if (now - lastProgressSent < progressIntervalMs) {
      return;
    }
    lastProgressSent = now;
    worker.postMessage({
      success: false,
      totalAttempts
    });
  };
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
      if (maxAttempts !== void 0 && totalAttempts >= maxAttempts) {
        worker.postMessage({
          success: false,
          totalAttempts,
          maxAttemptsReached: true
        });
        break;
      }
      postProgress();
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
