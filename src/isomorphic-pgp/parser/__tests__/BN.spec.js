const BN = require("bn.js");
const UrlSafeBase64 = require("../UrlSafeBase64.js");

describe("BN", () => {
  it("1 + 2", () => {
    let a = new BN(1);
    expect(a.toNumber()).toBe(1);
    let b = new BN(2);
    let c = a.add(b);
    expect(c.toNumber()).toBe(3);
  });
  it("large number - 1", () => {
    // prettier-ignore
    let n = UrlSafeBase64.serialize("t9CyovBE3Ec_firrtZazX1nmDRUMHax5OzxPKOpHyWL0OS8dnlZDL9xWo-nqL7lXeka-PkBfwOPp_m0qG31KByLoJ_DGwV0qwoo7s8j4fWp_PVFZcrsg0f0TVemRdnxhg3kol5T_dlkzWdCg1GCe5bNnRD7-hgAZdCTyN-ZgWaTiHzau70A6tUIqtNdO-90WehJSyjqYSvWqkvImCnuvW2zyoIbkO3uyZESw3I_3yx9ATGBZteGG-tsDrqF816BK7eh2bx6K4AXcqowedP7S73wqy6Dq_ifVHuS7hPumgGukUUmdngEapl8BAak2G6jRm_kYDFQ52KPonQclNwSEuJEnoaBgUKej9Z4PCkywDz1RdvhF-sbWckMet4gr_cnpyRHElyqriDQ3u_1QYaqe3iR1jQGsxBxjdBCWTCU40QJm8zvOq75Wbm1UzceZJf2zcci2vSB1VAAO5mTsYgBi7cHFRuLVzBiRYiwTEkiWkfsmc4TiCCIddmXLxWJjPF5uHTaqWTfLwdJhuMlUvFPPhUT6hSU0aL6AH6shKCUKoEMpK59aLCrRd3nER_IpoYRO97_MY3F4f71e65vAtQFxTespnru0giK-Tor7Rc_MDQ0enFOj4NBvtbbYWKeVHkoeEjPbH5hVM8z_tsCEX_pnYBnwh_VUzKg20qp0HNzGoVE")
    let N = new BN(n);
    // subtract 1
    n[n.length - 1] -= 1;
    N = N.subn(1);
    // compare
    let _n = N.toArrayLike(Uint8Array);
    expect(_n).toEqual(n);
  });
});
