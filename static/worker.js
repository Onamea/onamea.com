// deno:https://jsr.io/@vanice/types/0.1.3/lib/characters.json
var characters_default = [
  { index: 0, primary: "0", secondary: "Oo_", fingerprint: "\u{1F60A}" },
  { index: 1, primary: "1", secondary: "IiLl", fingerprint: "\u{1F58B}" },
  { index: 2, primary: "2", secondary: "Zz", fingerprint: "\u{1F374}" },
  { index: 3, primary: "3", secondary: "", fingerprint: "\u2764\uFE0F" },
  { index: 4, primary: "4", secondary: "", fingerprint: "\u{1F4AA}" },
  { index: 5, primary: "5", secondary: "", fingerprint: "\u2B50" },
  { index: 6, primary: "6", secondary: "", fingerprint: "\u{1F44D}" },
  { index: 7, primary: "7", secondary: "", fingerprint: "\u{1F64F}" },
  { index: 8, primary: "8", secondary: "", fingerprint: "\u2603\uFE0F" },
  { index: 9, primary: "9", secondary: "", fingerprint: "\u{1F3C1}" },
  { index: 10, primary: "A", secondary: "a", fingerprint: "\u2708\uFE0F" },
  { index: 11, primary: "B", secondary: "b", fingerprint: "\u26BD" },
  { index: 12, primary: "C", secondary: "c", fingerprint: "\u{1F697}" },
  { index: 13, primary: "D", secondary: "d", fingerprint: "\u{1F319}" },
  { index: 14, primary: "E", secondary: "e", fingerprint: "\u26A1" },
  { index: 15, primary: "F", secondary: "f", fingerprint: "\u{1F525}" },
  { index: 16, primary: "G", secondary: "g", fingerprint: "\u{1F381}" },
  { index: 17, primary: "H", secondary: "h", fingerprint: "\u{1F3E0}" },
  { index: 18, primary: "J", secondary: "j", fingerprint: "\u{1F511}" },
  { index: 19, primary: "K", secondary: "k", fingerprint: "\u{1F451}" },
  { index: 20, primary: "M", secondary: "m", fingerprint: "\u{1F3B5}" },
  { index: 21, primary: "N", secondary: "n", fingerprint: "\u{1F4A1}" },
  { index: 22, primary: "P", secondary: "p", fingerprint: "\u{1F389}" },
  { index: 23, primary: "Q", secondary: "q", fingerprint: "\u2615" },
  { index: 24, primary: "R", secondary: "r", fingerprint: "\u{1F680}" },
  { index: 25, primary: "S", secondary: "s", fingerprint: "\u2600\uFE0F" },
  { index: 26, primary: "T", secondary: "t", fingerprint: "\u{1F332}" },
  { index: 27, primary: "U", secondary: "u", fingerprint: "\u2602" },
  { index: 28, primary: "V", secondary: "v", fingerprint: "\u{1F338}" },
  { index: 29, primary: "W", secondary: "w", fingerprint: "\u{1F98B}" },
  { index: 30, primary: "X", secondary: "x", fingerprint: "\u2601\uFE0F" },
  { index: 31, primary: "Y", secondary: "y", fingerprint: "\u23F0" }
];

// deno:https://jsr.io/@vanice/types/0.1.3/lib/encoding.ts
var CHARS = characters_default.reduce((acc, { primary }) => {
  acc[acc.length] = primary;
  return acc;
}, []);
var VALUES = characters_default.reduce((acc, { primary }, index) => {
  acc[primary] = index;
  return acc;
}, {});
var encode = (publicKey) => {
  const result = [];
  let buffer = 0;
  let bitsInBuffer = 0;
  for (const byte of publicKey) {
    buffer = buffer << 8 | byte;
    bitsInBuffer += 8;
    while (bitsInBuffer >= 5) {
      bitsInBuffer -= 5;
      const index = buffer >> bitsInBuffer & 31;
      result.push(CHARS[index]);
    }
  }
  if (bitsInBuffer > 0) {
    const index = buffer << 5 - bitsInBuffer & 31;
    result.push(CHARS[index]);
  }
  return result.join("");
};

// deno:https://jsr.io/@vanice/types/0.1.3/lib/utils/isUint8Array.ts
var isUint8Array_default = (value) => {
  return value instanceof Uint8Array;
};

// deno:https://jsr.io/@vanice/types/0.1.3/lib/utils/isNumber.ts
var isNumber_default = (value) => {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
};

// deno:https://jsr.io/@noble/secp256k1/2.3.0/index.ts
var secp256k1_CURVE = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  h: 1n,
  a: 0n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P, n: N, Gx, Gy, b: _b } = secp256k1_CURVE;
var L = 32;
var L2 = 64;
var err = (m = "") => {
  throw new Error(m);
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes = (a, l) => !isBytes(a) || typeof l === "number" && l > 0 && a.length !== l ? err("Uint8Array expected") : a;
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
var toU8 = (a, len) => abytes(isStr(a) ? hexToBytes(a) : u8fr(abytes(a)), len);
var cr = () => globalThis?.crypto;
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + abytes(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes = (len = L) => {
  const c = cr();
  return c.getRandomValues(u8n(len));
};
var big = BigInt;
var arange = (n, min, max, msg = "bad number: out of range") => isBig(n) && min <= n && n < max ? n : err(msg);
var M = (a, b = P) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
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
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var koblitz = (x) => M(M(x * x) * x + _b);
var afield0 = (n) => arange(n, 0n, P);
var afield = (n) => arange(n, 1n, P);
var agroup = (n) => arange(n, 1n, N);
var isEven = (y) => (y & 1n) === 0n;
var u8of = (n) => Uint8Array.of(n);
var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
var lift_x = (x) => {
  const c = koblitz(afield(x));
  let r = 1n;
  for (let num = c, e = (P + 1n) / 4n; e > 0n; e >>= 1n) {
    if (e & 1n) r = r * num % P;
    num = num * num % P;
  }
  return M(r * r) === c ? r : err("sqrt invalid");
};
var Point = class _Point {
  static BASE;
  static ZERO;
  px;
  py;
  pz;
  constructor(px, py, pz) {
    this.px = afield0(px);
    this.py = afield(py);
    this.pz = afield0(pz);
    Object.freeze(this);
  }
  /** Convert Uint8Array or hex string to Point. */
  static fromBytes(bytes) {
    abytes(bytes);
    let p = void 0;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    const x = sliceBytesNumBE(tail, 0, L);
    const len = bytes.length;
    if (len === L + 1 && [
      2,
      3
    ].includes(head)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big(head));
      if (evenH !== evenY) y = M(-y);
      p = new _Point(x, y, 1n);
    }
    if (len === L2 + 1 && head === 4) p = new _Point(x, sliceBytesNumBE(tail, L, L2), 1n);
    return p ? p.assertValidity() : err("bad point: not on curve");
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
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
    return new _Point(this.px, M(-this.py), this.pz);
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
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
    const a = 0n;
    const b = _b;
    let X3 = 0n, Y3 = 0n, Z3 = 0n;
    const b3 = M(b * 3n);
    let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1);
    let t4 = M(X2 + Y2);
    t3 = M(t3 * t4);
    t4 = M(t0 + t1);
    t3 = M(t3 - t4);
    t4 = M(X1 + Z1);
    let t5 = M(X2 + Z2);
    t4 = M(t4 * t5);
    t5 = M(t0 + t2);
    t4 = M(t4 - t5);
    t5 = M(Y1 + Z1);
    X3 = M(Y2 + Z2);
    t5 = M(t5 * X3);
    X3 = M(t1 + t2);
    t5 = M(t5 - X3);
    Z3 = M(a * t4);
    X3 = M(b3 * t2);
    Z3 = M(X3 + Z3);
    X3 = M(t1 - Z3);
    Z3 = M(t1 + Z3);
    Y3 = M(X3 * Z3);
    t1 = M(t0 + t0);
    t1 = M(t1 + t0);
    t2 = M(a * t2);
    t4 = M(b3 * t4);
    t1 = M(t1 + t2);
    t2 = M(t0 - t2);
    t2 = M(a * t2);
    t4 = M(t4 + t2);
    t0 = M(t1 * t4);
    Y3 = M(Y3 + t0);
    t0 = M(t5 * t4);
    X3 = M(t3 * X3);
    X3 = M(X3 - t0);
    t0 = M(t3 * t1);
    Z3 = M(t5 * Z3);
    Z3 = M(Z3 + t0);
    return new _Point(X3, Y3, Z3);
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n, safe = true) {
    if (!safe && n === 0n) return I;
    agroup(n);
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
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { px: x, py: y, pz: z } = this;
    if (this.equals(I)) return {
      x: 0n,
      y: 0n
    };
    if (z === 1n) return {
      x,
      y
    };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n) err("inverse invalid");
    return {
      x: M(x * iz),
      y: M(y * iz)
    };
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const { x, y } = this.toAffine();
    afield(x);
    afield(y);
    return M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
  }
  /** Converts point to 33/65-byte Uint8Array. */
  toBytes(isCompressed = true) {
    const { x, y } = this.assertValidity().toAffine();
    const x32b = numTo32b(x);
    if (isCompressed) return concatBytes(getPrefix(y), x32b);
    return concatBytes(u8of(4), x32b, numTo32b(y));
  }
  /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I : new _Point(x, y, 1n);
  }
  toHex(isCompressed) {
    return bytesToHex(this.toBytes(isCompressed));
  }
  static fromPrivateKey(k) {
    return G.multiply(toPrivScalar(k));
  }
  static fromHex(hex) {
    return _Point.fromBytes(toU8(hex));
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  toRawBytes(isCompressed) {
    return this.toBytes(isCompressed);
  }
};
var G = new Point(Gx, Gy, 1n);
var I = new Point(0n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var bytesToNumBE = (b) => big("0x" + (bytesToHex(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B256 = 2n ** 256n;
var numTo32b = (num) => hexToBytes(padh(arange(num, 0n, B256), L2));
var toPrivScalar = (pr) => {
  const num = isBig(pr) ? pr : bytesToNumBE(toU8(pr, L));
  return arange(num, 1n, N, "private key invalid 3");
};
var getPublicKey = (privKey, isCompressed = true) => {
  return G.multiply(toPrivScalar(privKey)).toBytes(isCompressed);
};
var hashToPrivateKey = (hash) => {
  hash = toU8(hash);
  if (hash.length < L + 8 || hash.length > 1024) err("expected 40-1024b");
  const num = M(bytesToNumBE(hash), N - 1n);
  return numTo32b(num + 1n);
};
var randomPrivateKey = () => hashToPrivateKey(randomBytes(L + 16));
var utils = {
  normPrivateKeyToScalar: toPrivScalar,
  isValidPrivateKey: (key) => {
    try {
      return !!toPrivScalar(key);
    } catch (e) {
      return false;
    }
  },
  randomPrivateKey,
  precompute: (w = 8, p = G) => {
    p.multiply(3n);
    w;
    return p;
  }
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
  return {
    p,
    f
  };
};

// deno:https://jsr.io/@noble/hashes/1.8.0/src/crypto.ts
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// deno:https://jsr.io/@noble/hashes/1.8.0/src/_u64.ts
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);

// deno:https://jsr.io/@vanice/types/0.1.3/lib/signing.ts
var generateKeyPair = () => {
  const privKey = utils.randomPrivateKey();
  const pubKey = getPublicKey(privKey);
  return [
    pubKey,
    privKey
  ];
};

// deno:https://jsr.io/@vanice/types/0.1.3/PublicKey.ts
var isFlag = (value) => {
  return isNumber_default(value) && (value === 2 || value === 3);
};
var isPublicKey = (value) => {
  return isUint8Array_default(value) && value.length === 33 && isFlag(value[0]);
};
var splitPublicKey = (publicKey) => {
  if (isPublicKey(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const flag = publicKey[0];
  if (isFlag(flag) === false) {
    throw new Error("Invalid PublicKey flag");
  }
  const data = publicKey.subarray(1);
  return [
    flag,
    data
  ];
};
var appendFlagToPrimaryKey = (s, flag) => {
  return `${s}${flag}`;
};
var publicKeyToPrimaryKey = (publicKey) => {
  if (isPublicKey(publicKey) === false) {
    throw new Error("Invalid PublicKey");
  }
  const [flag, data] = splitPublicKey(publicKey);
  return appendFlagToPrimaryKey(encode(data), flag);
};

// deno:https://jsr.io/@vanice/types/0.1.3/lib/characterRegexes.ts
var createCharsString = (key) => {
  return characters_default.reduce((acc, cur) => `${acc}${cur[key]}`, "");
};
var primaryChars = createCharsString("primary");
var secondaryChars = createCharsString("secondary");
var fingerprintChars = createCharsString("fingerprint");
var primaryCharsRegex = new RegExp(`^[${primaryChars}]+$`);
var nameRegex = new RegExp(`^[${primaryChars}${secondaryChars}]+$`);
var nameStartRegex = new RegExp(`^[${primaryChars}${secondaryChars}]+`);
var fingerprintCharsRegex = new RegExp(`^[${fingerprintChars}]+$`);

// src/worker.ts
var worker = self;
worker.onmessage = (event) => {
  const { search } = event.data;
  const searchLength = search.length;
  let match = false;
  let totalSearches = 0;
  while (match === false) {
    const [publicKey, privateKey] = generateKeyPair();
    const primaryKey = publicKeyToPrimaryKey(publicKey);
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
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
