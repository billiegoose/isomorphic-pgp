import * as AsciiArmor from "../pgp-signature/AsciiArmor.js";

// prettier-ignore
let ascii = "-----BEGIN PGP SIGNATURE-----\n\niQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5Ol\nQZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3w\nXO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/\n2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPG\nkZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KA\nezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG\n253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZ\nybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1\nTASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2I\nX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5\nY4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95A\nZ6e744fK9NMccQfO9b9z\n=4UMM\n-----END PGP SIGNATURE-----";

describe("AsciiArmor", () => {
  test("parse -> serialize", () => {
    let result = AsciiArmor.serialize(AsciiArmor.parse(ascii));
    expect(result).toEqual(ascii);
  });
});
