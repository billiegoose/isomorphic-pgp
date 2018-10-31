import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";

// prettier-ignore
let base64u = "iQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P_14lzvTTxRT4-mTvmXH0I5OlQZEZuki9vAcV5lcRuGNtJ_-dqFIb8nj3MKYy2E1bHUIQmb_Eqgw-fRASONtC4k3wXO98svGD4-HJvSkyvlBJA_p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG_2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk_WTzRjaLybd0kxcuemnuArPGkZPcf_VWrxtQhIl8GCACf-0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KAezUEpbss6GoRwA_Qj7uPFSPj__0-cS_MwLOa0qRKtS7LQPFh3CnT_BhropMAuMmG253XgcKGuONdKw_OWIA_uctQwrnncZsGmKkGRKflt-6TsimMABMk9RS4eOzFKpHZybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c-6RO4lvefqN8TD1TASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb_VtTszma2IX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5Y4yKEA486-ElQkPzi_SpsGe_gqaNp8A-50LwohZlA3LRc5W_D0pMIvIbCq_3a95AZ6e744fK9NMccQfO9b9z";

// prettier-ignore
let buffer = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]);

describe("UrlSafeBase64", () => {
  test("parse -> serialize", () => {
    let str = UrlSafeBase64.parse(buffer);
    expect(str).toEqual("SGVsbG8gV29ybGQh");
    let result = UrlSafeBase64.serialize(str);
    expect(result).toEqual(buffer);
  });
});
