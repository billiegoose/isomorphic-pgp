/* global BigInt */
import * as BigBuf from "../webcrypto/BigBuf.js";
import * as UrlSafeBase64 from "../pgp-signature/UrlSafeBase64.js";

describe("BigBuf", () => {
  test("1 + 2", () => {
    let a = BigInt(1);
    let b = BigInt(2);
    let c = a + b;
    expect(c).toBe(BigInt(3));
  });
  test("buffers", () => {
    let a = BigBuf.toBigInt(new Uint8Array([0x20, 0x10]));
    expect(a.toString()).toBe("8208");
  });
  test("large number - 1", () => {
    // prettier-ignore
    let n = UrlSafeBase64.serialize("t9CyovBE3Ec_firrtZazX1nmDRUMHax5OzxPKOpHyWL0OS8dnlZDL9xWo-nqL7lXeka-PkBfwOPp_m0qG31KByLoJ_DGwV0qwoo7s8j4fWp_PVFZcrsg0f0TVemRdnxhg3kol5T_dlkzWdCg1GCe5bNnRD7-hgAZdCTyN-ZgWaTiHzau70A6tUIqtNdO-90WehJSyjqYSvWqkvImCnuvW2zyoIbkO3uyZESw3I_3yx9ATGBZteGG-tsDrqF816BK7eh2bx6K4AXcqowedP7S73wqy6Dq_ifVHuS7hPumgGukUUmdngEapl8BAak2G6jRm_kYDFQ52KPonQclNwSEuJEnoaBgUKej9Z4PCkywDz1RdvhF-sbWckMet4gr_cnpyRHElyqriDQ3u_1QYaqe3iR1jQGsxBxjdBCWTCU40QJm8zvOq75Wbm1UzceZJf2zcci2vSB1VAAO5mTsYgBi7cHFRuLVzBiRYiwTEkiWkfsmc4TiCCIddmXLxWJjPF5uHTaqWTfLwdJhuMlUvFPPhUT6hSU0aL6AH6shKCUKoEMpK59aLCrRd3nER_IpoYRO97_MY3F4f71e65vAtQFxTespnru0giK-Tor7Rc_MDQ0enFOj4NBvtbbYWKeVHkoeEjPbH5hVM8z_tsCEX_pnYBnwh_VUzKg20qp0HNzGoVE")
    let N = BigBuf.toBigInt(n);
    // subtract 1
    n[n.length - 1] -= 1;
    N -= BigInt(1);
    // compare
    let _n = BigBuf.toBuffer(N);
    expect(_n).toEqual(n);
  });
});
