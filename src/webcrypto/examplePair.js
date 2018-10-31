export async function examplePair() {
  let privateKey = {
    alg: "RS1",
    d:
      "NC2iX91bdrok3GA7q77dKR6ATstgNpYsjbOXdvJWMWUNFaR5wGYVSWM_FuWCLEzs95FYVJx6cetgk3ASiV4d4vu2MgxHp0EWr8WEoArW-ub9un66qPZUoTc5Q2R7fcpd9e-xJaJOiB5XFNJDrTXGNUchc758CrbBgvYv6c1UIW5MH_cqXlD5uVVQgSgzTAyc4kcMSEqsy26EHpVtVgF5LDc3gnj4FaiN4aecGuglO3wiCOw62wXrho8gMvS1VxIx4unfoLhnTKNtWd5PkP97Ci9RiJ8jxcSx20SrtFqpD4A-0zJV8zG2Cm8ifoG1kdFwutlRScKo7wXMNLMADeeS8sRVPxPy-J_zo3eq-YQdAimRgqnwu9vIgzMhgda6YZY4QZ7brPxU7tbdmum60oLPkQCBRH0qXkNhhMZf1sfD-KZQqU0aOcFg-AwDYxf6hqnVVGUAwoWEkjoPqcwmiMYrBMKXfdhMi9fNdhWE5BNXL39KhCsSC8CVHDMtaBnxVuVuqC9_eodOXlPXml1kbPPk5kH2cur4c8ZkYLKvBkTlDKmIFwKMssmSz4PSTDmeWz5BNqp3VDh4M7F32AsK3LZBxmVacONNsPsRYmE_v0RH-k3yzN30IqGa66aNovJVGdWmXNcQPLFERzNSWAZhJ_-1sl4r0z9MCjjsuEfgqFluS_8",
    dp:
      "q4dqftc7xWzizNnJdsyr9O6aMieZUy3ERijHvTKUOA9_1mrGXo4OIGbiRkEFRwSnGb8k79b05ba-2JVhHKGj-aJ41nMAVm9wOgg1jjBE3_SCY_143cyp7IUi7WbCZVjN__oLsEgVGIhHlEwwEbu9eGfhqbjFsIrJUxoSoLUa7Oba8lKAhWCR9GLVG95XruK6tbSLWqU06FlF05FmhEjj9glQFevvHNsAE6GYyIvmFR8204KYvzkbSi9H-7RqPngysU0BO4WH7sEM0YEuuDCJMxtIo2c6Mk01mOtFt2IEib2yEt8E5xGq-tPU5b0tdmdEPKzpDR-PDDqGh-kjgIlIiQ",
    dq:
      "sk2GW2dgspeC7Trab3FsTaimBa6pvo96v-e9tX9g58-aGy2a-o9GVhg7mduWwtJMi4-GDav-xKTrHSntv_Suq5Z9ZVDeEgS7_fQltm6sxeC7AJQrDJTMT-BZsppvVsyydqO57C1-S0gBY7ARxiT9Kt0PoCze-c4kWloz72ZG4xVoUklSlubW8sQjls_4L8gUSvziXNgiMvC3ljmrwvB3wloWuFCvolMl30Nfvl34FlP3HqwDY7fo3ix5Uyrd0G8e5ywDw_MCsw2vekkWylo_guzvOcqSCO1fxoA3mgor08EewV3xK99Hr4HIGkZaAdYxzCmK_ZyPltoNuanBUD7tvQ",
    e: "AQAB",
    ext: true,
    key_ops: ["sign"],
    kty: "RSA",
    n:
      "t9CyovBE3Ec_firrtZazX1nmDRUMHax5OzxPKOpHyWL0OS8dnlZDL9xWo-nqL7lXeka-PkBfwOPp_m0qG31KByLoJ_DGwV0qwoo7s8j4fWp_PVFZcrsg0f0TVemRdnxhg3kol5T_dlkzWdCg1GCe5bNnRD7-hgAZdCTyN-ZgWaTiHzau70A6tUIqtNdO-90WehJSyjqYSvWqkvImCnuvW2zyoIbkO3uyZESw3I_3yx9ATGBZteGG-tsDrqF816BK7eh2bx6K4AXcqowedP7S73wqy6Dq_ifVHuS7hPumgGukUUmdngEapl8BAak2G6jRm_kYDFQ52KPonQclNwSEuJEnoaBgUKej9Z4PCkywDz1RdvhF-sbWckMet4gr_cnpyRHElyqriDQ3u_1QYaqe3iR1jQGsxBxjdBCWTCU40QJm8zvOq75Wbm1UzceZJf2zcci2vSB1VAAO5mTsYgBi7cHFRuLVzBiRYiwTEkiWkfsmc4TiCCIddmXLxWJjPF5uHTaqWTfLwdJhuMlUvFPPhUT6hSU0aL6AH6shKCUKoEMpK59aLCrRd3nER_IpoYRO97_MY3F4f71e65vAtQFxTespnru0giK-Tor7Rc_MDQ0enFOj4NBvtbbYWKeVHkoeEjPbH5hVM8z_tsCEX_pnYBnwh_VUzKg20qp0HNzGoVE",
    p:
      "3gGG5bLsjI0yTYRPHUsZ336mmVaNAdXvErtK6kWx32EWx9BreHLt7uq4DZs6QxGGDHLHG7RkC6BUNEbo2ue3LJVWYEefdroK7X-VVkeQSmLmtC8kwuUATzAGug7XrSSuSKPxvAe2Ov8r4uX0dmdA4BhmLGvn3FRWn6fbkpfuiaUol9HTWPcoxiBdLhCPZ-WEKHEXUBCUlaOnU9HIAv1u1ecTeHzCbPiQD2C1FeJtaQsppwbq4FxZkCQB6oFVnhf9daJho1-cSHFjCzapzBrILvCCEPIs-7CGJfuVpESn6I2Jx9OhTq33csIYwrcc9PZJRExPKYU6e7C9nvgw6DjU1w",
    q:
      "0_YfHcE4KyFk8gM2OD4Ese1smvfoglwnMFnjcEI6fJR930oTMCCL2iOT3skRxwmguPtHxGxYhynf5Q22SZWB3QLuFY6CIFBOUlcmIrxW6V_NCctI0u3GA6TFPEPOHX8B61sGnwyAr6rqElbvNbhpWkWlgwjYwXTQeuF3GK-q5iL9vebawBVQM7AfeoEt8TwUL5e_tDD-l-U6RZqJtmjmx6nbg0CcQsTVIenDEN02ZWpyVkFC0dlUwTwFPHzvZo_t05C3cH1LukYhMS2TtZikjhOkm880Xis5wZJiZf_lsG6j2vKSw4iVeuwPBt_lSoL77xNlm06HQVL29lkm235OFw",
    qi:
      "v39TVUQzo7q2Mf-ww2VeS8UiMlWYrzBH49VqEriMuhkHyom-rZFKmuwiX_-P-aftLwmoma5XS061brvh4OWFvqU8w6xU01kRS0zcie_GySUpLzLQBQPj0xjTZU13FAONlR2Guf9h7GYkLzr0Lk3NNMRk9Lv9ZDxSTWOn8qbQuO5lIYiWPGFMUBvifeZJc-3-NsF1sJUdZj5vgQ5HMzRkLByh7C_aO8xVP5xXyrYQJzTmVHDCRTrZdCNfll1AOnEg1U4hgz9NNrbRuou8OtZ_qm1mNaSzmcdknS4K20ZIkRKKFOdX748TYD1PdVW1OGzzbJykSSQAlLDI8ZJcULyg2w"
  };
  let publicKey = {
    alg: "RS1",
    e: "AQAB",
    ext: true,
    key_ops: ["verify"],
    kty: "RSA",
    n:
      "t9CyovBE3Ec_firrtZazX1nmDRUMHax5OzxPKOpHyWL0OS8dnlZDL9xWo-nqL7lXeka-PkBfwOPp_m0qG31KByLoJ_DGwV0qwoo7s8j4fWp_PVFZcrsg0f0TVemRdnxhg3kol5T_dlkzWdCg1GCe5bNnRD7-hgAZdCTyN-ZgWaTiHzau70A6tUIqtNdO-90WehJSyjqYSvWqkvImCnuvW2zyoIbkO3uyZESw3I_3yx9ATGBZteGG-tsDrqF816BK7eh2bx6K4AXcqowedP7S73wqy6Dq_ifVHuS7hPumgGukUUmdngEapl8BAak2G6jRm_kYDFQ52KPonQclNwSEuJEnoaBgUKej9Z4PCkywDz1RdvhF-sbWckMet4gr_cnpyRHElyqriDQ3u_1QYaqe3iR1jQGsxBxjdBCWTCU40QJm8zvOq75Wbm1UzceZJf2zcci2vSB1VAAO5mTsYgBi7cHFRuLVzBiRYiwTEkiWkfsmc4TiCCIddmXLxWJjPF5uHTaqWTfLwdJhuMlUvFPPhUT6hSU0aL6AH6shKCUKoEMpK59aLCrRd3nER_IpoYRO97_MY3F4f71e65vAtQFxTespnru0giK-Tor7Rc_MDQ0enFOj4NBvtbbYWKeVHkoeEjPbH5hVM8z_tsCEX_pnYBnwh_VUzKg20qp0HNzGoVE"
  };
  const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-1" }
  };
  privateKey = await crypto.subtle.importKey("jwk", privateKey, alg, true, [
    "sign"
  ]);
  publicKey = await crypto.subtle.importKey("jwk", publicKey, alg, true, [
    "verify"
  ]);
  return { privateKey, publicKey };
}
