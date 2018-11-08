import defineLazyProp from "define-lazy-prop";
import concatenate from "concat-buffers";
import * as MPI from "../MPI.js";
import { PublicKeyAlgorithm } from "../constants.js";

function checksum16(buffers) {
  let i = 0;
  for (let buffer of buffers) {
    for (let byte of buffer) {
      i = (i + byte) & 0xffff;
    }
  }
  return new Uint8Array([i >> 8, i & 0xff]);
}

export function parse(b) {
  let i = 0;
  let packet = {};
  packet.version = b[i++];
  packet.creation = (b[i++] << 24) + (b[i++] << 16) + (b[i++] << 8) + b[i++];
  packet.alg = b[i++];
  packet.alg_s = PublicKeyAlgorithm[packet.alg];
  let _remainder = { b: b.slice(i), i: 0 };
  packet.mpi = {};
  switch (packet.alg) {
    case 1: {
      packet.mpi.n = MPI.parse(_remainder);
      packet.mpi.e = MPI.parse(_remainder);
      break;
    }
  }
  let symEncType = _remainder.b[_remainder.i++];
  if (symEncType !== 0) {
    throw new Error("Does not support password-encrypted Private Keys at this time.");
  }
  let checksum = checksum16([_remainder.b.slice(_remainder.i, -2)]);
  switch (packet.alg) {
    case 1: {
      packet.mpi.d = MPI.parse(_remainder);
      packet.mpi.p = MPI.parse(_remainder);
      packet.mpi.q = MPI.parse(_remainder);
      packet.mpi.u = MPI.parse(_remainder);
      break;
    }
  }
  let _checksum = _remainder.b.slice(_remainder.i);
  console.log("expected checksum", _checksum);
  console.log("computed checksum", checksum);
  if (_checksum.length !== 2) throw new Error("Checksum length error");
  if (checksum[0] !== _checksum[0] || checksum[1] !== _checksum[1]) {
    throw new Error("Checksum value error");
  }
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
      buffers.push(new Uint8Array([0]));
      buffers.push(MPI.serialize(packet.mpi.d));
      buffers.push(MPI.serialize(packet.mpi.p));
      buffers.push(MPI.serialize(packet.mpi.q));
      buffers.push(MPI.serialize(packet.mpi.u));
      let checksum = checksum16(buffers.slice(-4));
      buffers.push(checksum);
      break;
    }
  }
  return concatenate(buffers);
}

export function serializeForHash(packet) {
  let buffer = serialize(packet);
  let buffers = [new Uint8Array([0x99, (buffer.length >> 8) & 255, buffer.length & 255]), buffer];
  return concatenate(buffers);
}

export function fromJWK(jwk, { creation }) {
  let packet = {};
  packet.version = 4;
  packet.creation = creation;
  if (jwk.kty === "RSA") {
    packet.alg = 1;
    packet.alg_s = PublicKeyAlgorithm[packet.alg];
    packet.mpi = {};
    packet.mpi.n = jwk.n;
    packet.mpi.e = jwk.e;
    packet.mpi.d = jwk.d;
    packet.mpi.p = jwk.p;
    packet.mpi.q = jwk.q;
    packet.mpi.u = null; // TODO: Figure out how to compute u
  }
  return packet;
}

export function toJWK(packet) {
  const jwk = {};
  if (packet.alg === 1) {
    jwk.kty = "RSA";
    jwk.alg = "RS1";
    jwk.e = packet.mpi.e;
    jwk.n = packet.mpi.n;
    jwk.d = packet.mpi.d;
    jwk.p = packet.mpi.p;
    jwk.q = packet.mpi.q;
    let u = packet.mpi.u;
  }
  jwk.key_ops = ["sign"];
  jwk.ext = true;
  return jwk;
}
