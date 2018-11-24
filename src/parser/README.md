# @isomorphic-pgp/parser

This isn't a full-featured parser - it parses just what is needed for the other libraries (`generate`, `util`, and `sign-and-verify`).
Despite its name it is also a serializer.

To use one of the parsers, `require` the file directly. In order to prevent bundle bloat there is no `main` export that exports everything.

## API

There's more, but these are the ones most likely to be useful.

- `Message.parse|serialize`
- `PublicKey.parse|serialize|serializeForHash|fromJWK|toJWK`
- `SecretKey.parse|serialize|serializeForHash|fromJWK|toJWK`
- `UserId.parse|serialize|serializeForHash`
- `Signature.parse|serialize|serializeForHashTrailer`
- `UrlSafeBase64.parse|serialize`
- `Uint16.parse|serialize`
- `Uint32.parse|serialize`
- `emsa.encode(hashType, hash, length)`
- `convertPrivateToPublic(openpgpPrivateKey)`
- `certificationSignatureHashData(publicKeyPacket, userIdPacket, signaturePacket)`
- `payloadSignatureHashData(payload, signaturePacket)`

## Basic Usage

```js
const Message = require('@isomorphic-pgp/parser/Message')

// Can be a public key, private key, or signature.
let message = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EW+OfpwEEALe77ILV9zRL91oGCOdUOreVKfF8ruiC6W0zytuoDTCoqpiqFRxh
3rXVzwuY6/5GLuO2vfW8DzWS6ckRDS5DeOSpdo3N05QsUbdcItWnP3ZNIP0Ty6+x
4pfCEOHOUlTD4+KEBBcs6INtQoSZj/TZpP+zgqqRSTdmjuCkORBZjByZABEBAAG0
LE1yLiBFeGFtcGxlIChUZXN0IEtleSkgPGV4YW1wbGVAZXhhbXBsZS5jb20+iLgE
EwECACIFAlvjn6cCGwMGCwkIBwMCBhUIAgkKCwQWAgMBAh4BAheAAAoJEPLwztil
JhPE1w4EAJZkx8G0wYzvkZp+k5GHOwBQRe//qVP9ujsW2801MRJ93n33XqRVTlq2
W4k+pydv8WbOIIdZZNT9diaR3yDoAYsT+7JYvYg4TKHnA2FRZfQ7RcnPUAUDPmmC
h67cssoijG6M5LGW2Vb9l3eUQ0vp7svT5tpqY86WGi+Kf7pWhY52uI0EW+OfpwEE
AMC82ow4zQ5VZ3dSNZJHsBDOO+y5vCK4Y3i9rgeOKeQ2s9sgNXGSm/KchCaC1n6T
yeriD85++vQT69QL2ZBi0pZEx7H8Ib0M81MDaczu1VtAeeqH3t8briKAnQ5DwlOW
9b/olqkB3DS2ITZglpeIhLFSbPyHvK5LqKeItqETS09xABEBAAGInwQYAQIACQUC
W+OfpwIbDAAKCRDy8M7YpSYTxEe0A/9aKairOlsiX28EP0gF876rsj157/IYFGUV
3niDK0szRi9EO35av7qtd1dNeqtz6uAmcQvu6SR2XSlachFfGLZRVm1no92IFm/v
OJERShiw0E0cDEoG1FCGLmCjoH9sAl69LBkukfIxTII9rzWCBIReXH4J8lY3OPzV
8sLgkhutKg==
=SwUk
-----END PGP PUBLIC KEY BLOCK-----`

// Parse into a JSON representation
let parsed = Message.parse(message)
/*
parsed === {
  "type": "PGP PUBLIC KEY BLOCK",
  "packets": [
    {
      "type": 0,
      "type_s": "old",
      "tag": 6,
      "tag_s": "Public-Key Packet",
      "length": {
        "type": 0,
        "type_s": "one-octet length",
        "value": 141
      },
      "packet": {
        "version": 4,
        "creation": 1541644199,
        "alg": 1,
        "alg_s": "RSA (Encrypt or Sign)",
        "mpi": {
          "n": "t7vsgtX3NEv3WgYI51Q6t5Up8Xyu6ILpbTPK26gNMKiqmKoVHGHetdXPC5jr_kYu47a99bwPNZLpyRENLkN45Kl2jc3TlCxRt1wi1ac_dk0g_RPLr7Hil8IQ4c5SVMPj4oQEFyzog21ChJmP9Nmk_7OCqpFJN2aO4KQ5EFmMHJk",
          "e": "AQAB"
        }
      }
    },
    {
      "type": 0,
      "type_s": "old",
      "tag": 13,
      "tag_s": "User ID Packet",
      "length": {
        "type": 0,
        "type_s": "one-octet length",
        "value": 44
      },
      "packet": {
        "userid": "Mr. Example (Test Key) <example@example.com>"
      }
    },
    {
      "type": 0,
      "type_s": "old",
      "tag": 2,
      "tag_s": "Signature Packet",
      "length": {
        "type": 0,
        "type_s": "one-octet length",
        "value": 184
      },
      "packet": {
        "version": 4,
        "type": 19,
        "type_s": "Positive certification of a User ID and Public-Key packet",
        "alg": 1,
        "alg_s": "RSA (Encrypt or Sign)",
        "hash": 2,
        "hash_s": "SHA1",
        "hashed": {
          "length": 34,
          "subpackets": [
            {
              "length": 5,
              "type": 2,
              "subpacket": {
                "creation": 1541644199
              }
            },
            {
              "length": 2,
              "type": 27,
              "subpacket": {
                "flags": 3
              }
            },
            {
              "length": 6,
              "type": 11,
              "subpacket": {
                "data": "CQgHAwI"
              }
            },
            {
              "length": 6,
              "type": 21,
              "subpacket": {
                "data": "CAIJCgs"
              }
            },
            {
              "length": 4,
              "type": 22,
              "subpacket": {
                "data": "AgMB"
              }
            },
            {
              "length": 2,
              "type": 30,
              "subpacket": {
                "data": "AQ"
              }
            },
            {
              "length": 2,
              "type": 23,
              "subpacket": {
                "data": "gA"
              }
            }
          ]
        },
        "unhashed": {
          "length": 10,
          "subpackets": [
            {
              "length": 9,
              "type": 16,
              "subpacket": {
                "issuer": "8vDO2KUmE8Q",
                "issuer_s": "f2f0ced8a52613c4"
              }
            }
          ]
        },
        "left16": 55054,
        "mpi": {
          "signature": "lmTHwbTBjO-Rmn6TkYc7AFBF7_-pU_26OxbbzTUxEn3effdepFVOWrZbiT6nJ2_xZs4gh1lk1P12JpHfIOgBixP7sli9iDhMoecDYVFl9DtFyc9QBQM-aYKHrtyyyiKMbozksZbZVv2Xd5RDS-nuy9Pm2mpjzpYaL4p_ulaFjnY"
        }
      }
    },
    {
      "type": 0,
      "type_s": "old",
      "tag": 14,
      "tag_s": "Public-Subkey Packet",
      "length": {
        "type": 0,
        "type_s": "one-octet length",
        "value": 141
      },
      "packet": {
        "version": 4,
        "creation": 1541644199,
        "alg": 1,
        "alg_s": "RSA (Encrypt or Sign)",
        "mpi": {
          "n": "wLzajDjNDlVnd1I1kkewEM477Lm8IrhjeL2uB44p5Daz2yA1cZKb8pyEJoLWfpPJ6uIPzn769BPr1AvZkGLSlkTHsfwhvQzzUwNpzO7VW0B56ofe3xuuIoCdDkPCU5b1v-iWqQHcNLYhNmCWl4iEsVJs_Ie8rkuop4i2oRNLT3E",
          "e": "AQAB"
        }
      }
    },
    {
      "type": 0,
      "type_s": "old",
      "tag": 2,
      "tag_s": "Signature Packet",
      "length": {
        "type": 0,
        "type_s": "one-octet length",
        "value": 159
      },
      "packet": {
        "version": 4,
        "type": 24,
        "type_s": "Subkey Binding Signature",
        "alg": 1,
        "alg_s": "RSA (Encrypt or Sign)",
        "hash": 2,
        "hash_s": "SHA1",
        "hashed": {
          "length": 9,
          "subpackets": [
            {
              "length": 5,
              "type": 2,
              "subpacket": {
                "creation": 1541644199
              }
            },
            {
              "length": 2,
              "type": 27,
              "subpacket": {
                "flags": 12
              }
            }
          ]
        },
        "unhashed": {
          "length": 10,
          "subpackets": [
            {
              "length": 9,
              "type": 16,
              "subpacket": {
                "issuer": "8vDO2KUmE8Q",
                "issuer_s": "f2f0ced8a52613c4"
              }
            }
          ]
        },
        "left16": 18356,
        "mpi": {
          "signature": "WimoqzpbIl9vBD9IBfO-q7I9ee_yGBRlFd54gytLM0YvRDt-Wr-6rXdXTXqrc-rgJnEL7ukkdl0pWnIRXxi2UVZtZ6PdiBZv7ziREUoYsNBNHAxKBtRQhi5go6B_bAJevSwZLpHyMUyCPa81ggSEXlx-CfJWNzj81fLC4JIbrSo"
        }
      }
    }
  ]
}
*/

// Serialize back into text
let text = Message.serialize(parsed)
// mesage === text

```