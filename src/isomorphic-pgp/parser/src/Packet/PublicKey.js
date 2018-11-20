import concatenate from "concat-buffers";
import { select } from "select-case";

import * as MPI from "../MPI.js";
import * as Uint32 from "../Uint32.js";
import * as Uint16 from "../Uint16.js";
import { PublicKeyAlgorithm } from "../constants.js";

export function parse(b) {
  let [version, c1, c2, c3, c4, alg] = b;
  let creation = Uint32.parse([c1, c2, c3, c4]);
  let packet = {
    version,
    creation,
    alg,
    alg_s: PublicKeyAlgorithm[alg]
  };
  let _remainder = { b: b.slice(6), i: 0 };
  packet.mpi = select(packet.alg, {
    1: () => ({
      n: MPI.parse(_remainder),
      e: MPI.parse(_remainder)
    })
  });
  return packet;
}

export function serialize(packet) {
  let { version, creation, alg, mpi } = packet;
  let b = new Uint8Array([version, ...Uint32.serialize(creation), alg]);

  let buffers;
  switch (alg) {
    case 1: {
      buffers = [b, MPI.serialize(mpi.n), MPI.serialize(mpi.e)];
      break;
    }
  }
  return concatenate(buffers);
}

export function serializeForHash(packet) {
  let buffer = serialize(packet);
  let buffers = [new Uint8Array([0x99, ...Uint16.serialize(buffer.length)]), buffer];
  return concatenate(buffers);
}

export function fromJWK(jwk, { creation }) {
  return {
    version: 4,
    creation,
    ...select(jwk.kty, {
      RSA: () => ({
        alg: 1,
        alg_s: PublicKeyAlgorithm[1],
        mpi: {
          n: jwk.n,
          e: jwk.e
        }
      }),
      default: () => ({})
    })
  };
}

export function toJWK(packet) {
  let {
    alg,
    mpi: { e, n }
  } = packet;
  return {
    key_ops: ["verify"],
    ext: true,
    ...select(alg, {
      1: () => ({
        kty: "RSA",
        alg: "RS1",
        e,
        n
      }),
      default: () => ({})
    })
  };
}
