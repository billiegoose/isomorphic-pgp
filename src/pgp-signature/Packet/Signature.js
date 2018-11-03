import defineLazyProp from "define-lazy-prop";
import * as MPI from "../MPI.js";
import {
  SignatureType,
  HashAlgorithm,
  PublicKeyAlgorithm
} from "../constants.js";
import * as SubpacketArray from "./SignatureSubpacket/SubpacketArray.js";
import concatenate from "concat-buffers";

export function parse(b) {
  let packet = {};
  let i = 0;
  packet.version = b[i++];
  packet.type = b[i++];
  packet.type_s = SignatureType[packet.type];
  packet.alg = b[i++];
  packet.alg_s = PublicKeyAlgorithm[packet.alg];
  packet.hash = b[i++];
  packet.hash_s = HashAlgorithm[packet.hash];
  packet.hashed = {};
  packet.hashed.length = (b[i++] << 8) + b[i++];
  // packet.hashed.subpackets = a.b.slice(a.i, (a.i += packet.hashed.length));
  let _hashed = b.slice(i, (i += packet.hashed.length));
  defineLazyProp(packet.hashed, "subpackets", () => {
    return SubpacketArray.parse(_hashed);
  });
  packet.unhashed = {};
  packet.unhashed.length = (b[i++] << 8) + b[i++];
  // packet.unhashed.subpackets = a.b.slice(a.i, (a.i += packet.unhashed.length));
  let _unhashed = b.slice(i, (i += packet.unhashed.length));
  defineLazyProp(packet.unhashed, "subpackets", () => {
    return SubpacketArray.parse(_unhashed);
  });
  packet.left16 = (b[i++] << 8) + b[i++];
  let _remainder = { b: b.slice(i), i: 0 };
  defineLazyProp(packet, "mpi", () => {
    let mpi = {};
    switch (packet.alg) {
      case 1: {
        return {
          signature: MPI.parse(_remainder)
        };
      }
    }
  });
  return packet;
}

export function serialize(packet) {
  let i = 0;
  let b = new Uint8Array(10 + packet.hashed.length + packet.unhashed.length);
  b[i++] = packet.version;
  b[i++] = packet.type;
  b[i++] = packet.alg;
  b[i++] = packet.hash;
  b[i++] = (packet.hashed.length >> 8) & 255;
  b[i++] = packet.hashed.length & 255;
  let hashed = SubpacketArray.serialize(packet.hashed.subpackets);
  b.set(hashed, i);
  i += packet.hashed.length;
  b[i++] = (packet.unhashed.length >> 8) & 255;
  b[i++] = packet.unhashed.length & 255;
  let unhashed = SubpacketArray.serialize(packet.unhashed.subpackets);
  b.set(unhashed, i);
  i += packet.unhashed.length;
  b[i++] = (packet.left16 >> 8) & 255;
  b[i++] = packet.left16 & 255;
  let buffers = [b];
  switch (packet.alg) {
    case 1: {
      buffers.push(MPI.serialize(packet.mpi.signature));
    }
  }
  return concatenate(buffers);
}

// 5.2.4.  Computing Signatures
export function serializeForHashTrailer(packet) {
  let i = 0;
  let b = new Uint8Array(6 + packet.hashed.length + 6);
  b[i++] = packet.version;
  b[i++] = packet.type;
  b[i++] = packet.alg;
  b[i++] = packet.hash;
  b[i++] = (packet.hashed.length >> 8) & 255;
  b[i++] = packet.hashed.length & 255;
  let hashed = SubpacketArray.serialize(packet.hashed.subpackets);
  b.set(hashed, i);
  i += packet.hashed.length;
  b[i++] = 4; // version 4
  b[i++] = 255; // fixed number
  let length = 6 + packet.hashed.length;
  b[i++] = (length >> 24) & 255;
  b[i++] = (length >> 16) & 255;
  b[i++] = (length >> 8) & 255;
  b[i++] = length & 255;
  return b;
}
