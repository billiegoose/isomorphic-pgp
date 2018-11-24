# @isomorphic-pgp/sign-and-verify

Currently it has some significant limitations that may make it unsuitable for many projects!

1. **It does not check if a key has been revoked**. The `verify` function will still return true if using a revoked key.
2. It only uses the Primary Key (the very first key in an OpenPGP message) and ignores the rest. The `verify` function will return false if the signature was made by a subkey and not the primary key.
3. It can only deal with RSA key types.
4. It can only deal with detached binary signatures ([signature type 0x00](https://tools.ietf.org/html/rfc4880#section-5.2.1))
5. It can't create signatures using private keys that are passphrase protected.

I will happily accept PRs to address these limitations as long as they respect the "keep the bundle size small" project goal.

## API

### `verifySelfSignature(openpgpPublicKey)`

```js
const { verifySelfSignature } = require('@isomorphic-pgp/sign-and-verify/verifySelfSignature.js')

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

let valid = await verifySelfSignature(message)
// valid === true
```

### `sign(openpgpPrivateKey, payload, timestamp)`

```js
const { sign } = require('@isomorphic-pgp/sign-and-verify/sign.js')
let privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

lQHYBFvjn6cBBAC3u+yC1fc0S/daBgjnVDq3lSnxfK7ogultM8rbqA0wqKqYqhUc
Yd611c8LmOv+Ri7jtr31vA81kunJEQ0uQ3jkqXaNzdOULFG3XCLVpz92TSD9E8uv
seKXwhDhzlJUw+PihAQXLOiDbUKEmY/02aT/s4KqkUk3Zo7gpDkQWYwcmQARAQAB
AAP9E8FGbEjiNALI/Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9j
bGsSZpSC9zV5sypxLZfCQYuqp0hsCz//DZi08l7dQQZtYLxWkasRfSAqFXkQu3NB
C90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW/WOsCAMHCWLidns+D91cC
FsetSiKm7r8v1ERZHO4kKRV2esPyAYG6Airl+U2dF5fmDAZSYIvAkY3tcM5CVJBQ
3WScBusCAPLBK8NB2moQCBHI0AhfimX5cnzSDfnDec4fYiE8OyR5k9WIwyzXx6vU
RB6ne9sMt/CKXg2RPsi28ckqIm7sUYsB/3PMHzrbfsethRAlNCvJzE1efvrY2lsP
yPVPsdXerJGfW/v6APt1q7CJPq6RvFAK7cXHwYpHGQW88Z/6IRmtDhaawLQsTXIu
IEV4YW1wbGUgKFRlc3QgS2V5KSA8ZXhhbXBsZUBleGFtcGxlLmNvbT6IuAQTAQIA
IgUCW+OfpwIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ8vDO2KUmE8TX
DgQAlmTHwbTBjO+Rmn6TkYc7AFBF7/+pU/26OxbbzTUxEn3effdepFVOWrZbiT6n
J2/xZs4gh1lk1P12JpHfIOgBixP7sli9iDhMoecDYVFl9DtFyc9QBQM+aYKHrtyy
yiKMbozksZbZVv2Xd5RDS+nuy9Pm2mpjzpYaL4p/ulaFjnadAdgEW+OfpwEEAMC8
2ow4zQ5VZ3dSNZJHsBDOO+y5vCK4Y3i9rgeOKeQ2s9sgNXGSm/KchCaC1n6Tyeri
D85++vQT69QL2ZBi0pZEx7H8Ib0M81MDaczu1VtAeeqH3t8briKAnQ5DwlOW9b/o
lqkB3DS2ITZglpeIhLFSbPyHvK5LqKeItqETS09xABEBAAEAA/9a18ikpdMUqfFh
/qgMYeidCy+YdLS1orYTv0dq/TlGfPgJ1KUL+l+xms74vdtufqcBo/pySExtRYR2
hf1OPh3l70Xz6+P9ywLIciXDlEE4WTW4siGYKq3rZnP3pRkuLoI6CHSpylVyVLCh
QSrdB7d5IHRhK+DGJoTTEOKXzSBFjwIA1V5Y1oM13lXqIvu3BjwK16gUQ76L2TXc
cd9uHO7EUMg0mBL9gmeeaTgqI7CLAECQdhUQyVBRDje73REzATOD+wIA5z9A/WiU
D55c9J3shSdGmgXJ4rpZESZJsVg65bU+1DQP4rwuWdT1SrXW0mGWJbbK9uSKLyS6
5VPVo+qs7itygwH/ep46Q0pXzeOlc11hd3n/6gadlnecJdZYA2imyHgJN53UkrsM
ish6Tx2drnCFyvE9ljB0jPTa14ntF8Fsf5NHKKTjiJ8EGAECAAkFAlvjn6cCGwwA
CgkQ8vDO2KUmE8RHtAP/WimoqzpbIl9vBD9IBfO+q7I9ee/yGBRlFd54gytLM0Yv
RDt+Wr+6rXdXTXqrc+rgJnEL7ukkdl0pWnIRXxi2UVZtZ6PdiBZv7ziREUoYsNBN
HAxKBtRQhi5go6B/bAJevSwZLpHyMUyCPa81ggSEXlx+CfJWNzj81fLC4JIbrSo=
=DL8M
-----END PGP PRIVATE KEY BLOCK-----`

let payload = `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
author William Hilton <wmhilton@gmail.com> 1540511553 -0400
committer William Hilton <wmhilton@gmail.com> 1540511553 -0400

Initial commit
`;

let timestamp = 1542938295

let signature = await sign(privateKey, payload, timestamp);
// signature === `-----BEGIN PGP SIGNATURE-----
//
// iJwEAAEIAAYFAlv3XrcACgkQ8vDO2KUmE8Tb/gP/QyAl/whBNMyc3TkKFusa37Fi
// 8L2PTEn8XZuOh3x2fSIY+6EeBGBcnjNnxV9xI7NZNPROStfJNQQ1bmKCPDsASQus
// TTYJmhjebqAts5Ab2zKZmrkIPAjrKc+xQuFBEAV9Dc945Fg7pqSusHjd3TVRTAQJ
// h7ncAjCeDqe64l/SEuc=
// =lwSL
// -----END PGP SIGNATURE-----`
```

### `verify(openpgpPublicKey, openpgpSignature, payload)`

```js
const { verify } = require('@isomorphic-pgp/sign-and-verify/verify.js')

let publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
dGs=
=QSo+
-----END PGP PUBLIC KEY BLOCK-----`

let signature = `-----BEGIN PGP SIGNATURE-----

iQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5Ol
QZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3w
XO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/
2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPG
kZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KA
ezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG
253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZ
ybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1
TASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2I
X1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5
Y4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95A
Z6e744fK9NMccQfO9b9z
=4UMM
-----END PGP SIGNATURE-----`

let payload = `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
author William Hilton <wmhilton@gmail.com> 1540511553 -0400
committer William Hilton <wmhilton@gmail.com> 1540511553 -0400

Initial commit
`

let valid = await verify(publicKey, signature, payload);
// valid === true
```
