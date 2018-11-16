import * as MPI from "../MPI.js";
import * as Uint16 from "../Uint16.js";
import * as Uint32 from "../Uint32.js";
import { SignatureType, HashAlgorithm, PublicKeyAlgorithm } from "../constants.js";
import * as SubpacketArray from "./SignatureSubpacket/SubpacketArray.js";
import concatenate from "concat-buffers";

export function parse(b) {
  let [version, type, alg, hash, hashed1, hashed2] = b;
  let packet = {
    version,
    type,
    type_s: SignatureType[type],
    alg,
    alg_s: PublicKeyAlgorithm[alg],
    hash,
    hash_s: HashAlgorithm[hash],
    hashed: {
      length: Uint16.parse([hashed1, hashed2])
    }
  };

  let i = 6;
  let _hashed = b.slice(i, (i += packet.hashed.length));
  packet.hashed.subpackets = SubpacketArray.parse(_hashed);
  packet.unhashed = {
    length: Uint16.parse([b[i++], b[i++]])
  };
  // packet.unhashed.subpackets = a.b.slice(a.i, (a.i += packet.unhashed.length));
  let _unhashed = b.slice(i, (i += packet.unhashed.length));
  packet.unhashed.subpackets = SubpacketArray.parse(_unhashed);
  packet.left16 = Uint16.parse([b[i++], b[i++]]);
  let _remainder = { b: b.slice(i), i: 0 };
  switch (packet.alg) {
    case 1: {
      packet.mpi = {
        signature: MPI.parse(_remainder)
      };
    }
  }
  return packet;
}

export function serialize(packet) {
  let {
    version,
    type,
    alg,
    hash,
    left16,
    hashed: { length: hashedLength },
    unhashed: { length: unhashedLength }
  } = packet;
  let part1 = new Uint8Array([version, type, alg, hash, ...Uint16.serialize(hashedLength)]);
  let part2 = SubpacketArray.serialize(packet.hashed.subpackets);
  let part3 = new Uint8Array(Uint16.serialize(unhashedLength));
  let part4 = SubpacketArray.serialize(packet.unhashed.subpackets);
  let part5 = new Uint8Array(Uint16.serialize(left16));
  let buffers = [part1, part2, part3, part4, part5];
  switch (packet.alg) {
    case 1: {
      buffers.push(MPI.serialize(packet.mpi.signature));
    }
  }
  return concatenate(buffers);
}

// 5.2.4.  Computing Signatures
export function serializeForHashTrailer(packet) {
  let {
    version,
    type,
    alg,
    hash,
    hashed: { length: hashedLength }
  } = packet;
  let part1 = new Uint8Array([version, type, alg, hash, ...Uint16.serialize(hashedLength)]);
  let part2 = SubpacketArray.serialize(packet.hashed.subpackets);
  let length = part1.length + hashedLength;
  let part3 = new Uint8Array([
    4, // version 4
    255, // fixed number
    ...Uint32.serialize(length)
  ]);
  return concatenate([part1, part2, part3]);
}
