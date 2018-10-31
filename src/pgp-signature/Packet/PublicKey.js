import defineLazyProp from "define-lazy-prop";
import concatenate from "concat-buffers";
import * as MPI from "../MPI.js";
import { PublicKeyAlgorithm } from "../constants.js";

export function parse(b) {
  let i = 0;
  let packet = {};
  packet.version = b[i++];
  packet.creation = (b[i++] << 24) + (b[i++] << 16) + (b[i++] << 8) + b[i++];
  packet.alg = b[i++];
  packet.alg_s = PublicKeyAlgorithm[packet.alg];
  let _remainder = { b: b.slice(i), i: 0 };
  defineLazyProp(packet, "mpi", () => {
    let mpi = {};
    switch (packet.alg) {
      case 1: {
        return {
          n: MPI.parse(_remainder),
          e: MPI.parse(_remainder)
        };
      }
    }
  });
  return packet;
}

export function serialize(packet) {
  let i = 0;
  let b = new Uint8Array(6);
  b[i++] = packet.version;
  b[i++] = (packet.creation >> 24) & 255;
  b[i++] = (packet.creation >> 16) & 255;
  b[i++] = (packet.creation >> 8) & 255;
  b[i++] = packet.creation & 255;
  b[i++] = packet.alg;

  let buffers = [b];
  switch (packet.alg) {
    case 1: {
      buffers.push(MPI.serialize(packet.mpi.n));
      buffers.push(MPI.serialize(packet.mpi.e));
      break;
    }
  }
  return concatenate(buffers);
}
