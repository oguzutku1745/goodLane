import crypto from "crypto";
// @ts-ignore
import { groth16 } from "snarkjs";
// @ts-ignore
import circomlib from "circomlib";

/** Generate random buffer of specified byte length */
const rbuffer = (nbytes) => crypto.randomBytes(nbytes);

/** Compute pedersen hash */
function pedersenHash(data) {
  console.log(
    "pedersen",
    circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0]
  );
  return circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];
}

async function genProofArgs(proof, pub) {
  proof = unstringifyBigInts(proof);
  pub = unstringifyBigInts(pub);
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  console.log("🚀 ~ file: test.js:24 ~ genProofArgs ~ args:", args);
  return args;
}

// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
function unstringifyBigInts(o) {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

// source: https://github.com/no2chem/bigint-buffer/blob/c4d61b5c4fcaab36c55130840e906c162dfce646/src/index.ts#L25
function toBigIntLE(buf) {
  const reversed = Buffer.from(buf);
  reversed.reverse();
  const hex = reversed.toString("hex");
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
}

export {
  genProofArgs,
  unstringifyBigInts,
  toBigIntLE,
  rbuffer,
  pedersenHash,
  groth16,
};
