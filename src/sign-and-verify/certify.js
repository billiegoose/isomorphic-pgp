const { BigInteger } = require("jsbn");
const { hashes } = require("./hashes.js");
const arrayBufferToHex = require("array-buffer-to-hex");

const Message = require("@isomorphic-pgp/parser/Message.js");
const SecretKey = require("@isomorphic-pgp/parser/Packet/SecretKey.js");
const UrlSafeBase64 = require("@isomorphic-pgp/parser/UrlSafeBase64.js");
const Uint16 = require("@isomorphic-pgp/parser/Uint16.js");
const EMSA = require("@isomorphic-pgp/parser/emsa.js");
const { HashAlgorithm } = require("@isomorphic-pgp/parser/constants.js");
const { certificationSignatureHashData } = require("@isomorphic-pgp/parser/certificationSignatureHashData.js");

const { fingerprint } = require("@isomorphic-pgp/util/fingerprint.js");
const { trimZeros } = require("@isomorphic-pgp/util/trimZeros.js");
const { roundPowerOfTwo } = require("@isomorphic-pgp/util/roundPowerOfTwo.js");

module.exports.certify = async function certify(privateKeyPacket, userIdPacket, timestamp) {
  let e = UrlSafeBase64.serialize(privateKeyPacket.mpi.e);
  let n = UrlSafeBase64.serialize(privateKeyPacket.mpi.n);
  let d = UrlSafeBase64.serialize(privateKeyPacket.mpi.d);
  let p = UrlSafeBase64.serialize(privateKeyPacket.mpi.p);
  let q = UrlSafeBase64.serialize(privateKeyPacket.mpi.q);
  let u = UrlSafeBase64.serialize(privateKeyPacket.mpi.u);

  // SIGN
  let N = new BigInteger(arrayBufferToHex(n), 16);
  let D = new BigInteger(arrayBufferToHex(d), 16);
  let P = new BigInteger(arrayBufferToHex(p), 16);
  let Q = new BigInteger(arrayBufferToHex(q), 16);
  let U = new BigInteger(arrayBufferToHex(u), 16);

  let partialSignaturePacket = {
    version: 4,
    type: 19,
    alg: 1,
    hash: 8,
    hashed: {
      subpackets: [
        {
          type: 2,
          subpacket: {
            creation: timestamp
          }
        },
        {
          type: 27,
          subpacket: {
            flags: 3
          }
        }
      ]
    }
  };

  const hashType = HashAlgorithm[partialSignaturePacket.hash]
  let buffer = await certificationSignatureHashData(privateKeyPacket, userIdPacket, partialSignaturePacket);
  let hash = await hashes[hashType](buffer, { outputFormat: "buffer" });
  hash = new Uint8Array(hash);
  let left16 = Uint16.parse([hash[0], hash[1]]);
  // We need the modulus length in bytes
  let modulusLength = roundPowerOfTwo(n.byteLength);
  // TODO: Wrap `hash` in the dumbass EMSA-PKCS1-v1_5 padded message format:
  // https://github.com/openpgpjs/openpgpjs/blob/a35b4d28e0215c3a6654a4401c4e7e085b55e220/src/crypto/pkcs1.js
  hash = EMSA.encode(hashType, hash, modulusLength);
  let M = new BigInteger(arrayBufferToHex(hash), 16);

  // // Straightforward solution: ~ 679ms
  // console.time("standard");
  // let S = M.modPow(D, N);
  // console.timeEnd("standard");

  // Fast solution using Chinese Remainder Theorem: ~184ms
  // from libgcryp docs:
  /*
   *      m1 = c ^ (d mod (p-1)) mod p
   *      m2 = c ^ (d mod (q-1)) mod q
   *      h = u * (m2 - m1) mod q
   *      m = m1 + h * p
   */
  let ONE = new BigInteger("01", 16);
  let DP = D.mod(P.subtract(ONE));
  let DQ = D.mod(Q.subtract(ONE));
  let M1 = M.modPow(DP, P);
  let M2 = M.modPow(DQ, Q);
  let H = U.multiply(M2.subtract(M1)).mod(Q);
  let S = M1.add(H.multiply(P));

  let signature = new Uint8Array(S.toByteArray());
  signature = trimZeros(signature);
  signature = UrlSafeBase64.parse(new Uint8Array(signature));

  let keyidBuffer = (await fingerprint(privateKeyPacket)).slice(12);

  let completeSignaturePacket = Object.assign({}, partialSignaturePacket, {
    unhashed: {
      subpackets: [
        {
          type: 16,
          subpacket: {
            issuer: UrlSafeBase64.parse(keyidBuffer)
          }
        }
      ]
    },
    left16,
    mpi: {
      signature
    }
  });

  let message = {
    type: "PGP PRIVATE KEY BLOCK",
    packets: [
      {
        type: 0,
        tag: 5,
        packet: privateKeyPacket
      },
      {
        type: 0,
        tag: 13,
        packet: userIdPacket
      },
      {
        type: 0,
        tag: 2,
        packet: completeSignaturePacket
      }
    ]
  };
  let text = Message.serialize(message);
  return text;
}
