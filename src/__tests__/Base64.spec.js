import * as Base64 from "../pgp-signature/Base64.js";

// prettier-ignore
let b64 = "iQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5OlQZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3wXO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPGkZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KAezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1TASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2IX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5Y4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95AZ6e744fK9NMccQfO9b9z";

// prettier-ignore
let helloworld = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]);

describe("Base64", () => {
  test("parse -> serialize", () => {
    let result = Base64.serialize(Base64.parse(b64));
    expect(result).toEqual(b64);
  });
  test("serialize-> parse", () => {
    let result = Base64.parse(Base64.serialize(helloworld));
    expect(result).toEqual(helloworld);
  });
});
