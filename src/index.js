import React from "react";
import ReactDOM from "react-dom";
import ObjectInspector from "react-object-inspector";

import { sign } from "@isomorphic-pgp/sign-and-verify/sign.js";
import { verify } from "@isomorphic-pgp/sign-and-verify/verify.js";
import { verifySelfSignature } from "@isomorphic-pgp/sign-and-verify/verifySelfSignature.js";

import { keyId } from "@isomorphic-pgp/util/keyId.js";

import { convertPrivateToPublic } from "@isomorphic-pgp/parser/convertPrivateToPublic.js";
import * as Message from "@isomorphic-pgp/parser/Message.js";

import { generate } from "@isomorphic-pgp/generate";
import { JWKtoPGP } from "@isomorphic-pgp/generate/browser/JWKtoPGP.js";

import "./styles.css";

let signature =
  "-----BEGIN PGP SIGNATURE-----\n\niQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5Ol\nQZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3w\nXO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/\n2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPG\nkZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KA\nezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG\n253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZ\nybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1\nTASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2I\nX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5\nY4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95A\nZ6e744fK9NMccQfO9b9z\n=4UMM\n-----END PGP SIGNATURE-----";
let payload =
  "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor William Hilton <wmhilton@gmail.com> 1540511553 -0400\ncommitter William Hilton <wmhilton@gmail.com> 1540511553 -0400\n\nInitial commit\n";
let publicKey =
  "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\ndGs=\n=QSo+\n-----END PGP PUBLIC KEY BLOCK-----";

// ATTN: THIS IS NOT THE SECRET KEY THAT CORRESPONSED TO publicKey
let secretKey =
  "-----BEGIN PGP PRIVATE KEY BLOCK-----\n\nlQHYBFvjn6cBBAC3u+yC1fc0S/daBgjnVDq3lSnxfK7ogultM8rbqA0wqKqYqhUc\nYd611c8LmOv+Ri7jtr31vA81kunJEQ0uQ3jkqXaNzdOULFG3XCLVpz92TSD9E8uv\nseKXwhDhzlJUw+PihAQXLOiDbUKEmY/02aT/s4KqkUk3Zo7gpDkQWYwcmQARAQAB\nAAP9E8FGbEjiNALI/Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9j\nbGsSZpSC9zV5sypxLZfCQYuqp0hsCz//DZi08l7dQQZtYLxWkasRfSAqFXkQu3NB\nC90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW/WOsCAMHCWLidns+D91cC\nFsetSiKm7r8v1ERZHO4kKRV2esPyAYG6Airl+U2dF5fmDAZSYIvAkY3tcM5CVJBQ\n3WScBusCAPLBK8NB2moQCBHI0AhfimX5cnzSDfnDec4fYiE8OyR5k9WIwyzXx6vU\nRB6ne9sMt/CKXg2RPsi28ckqIm7sUYsB/3PMHzrbfsethRAlNCvJzE1efvrY2lsP\nyPVPsdXerJGfW/v6APt1q7CJPq6RvFAK7cXHwYpHGQW88Z/6IRmtDhaawLQsTXIu\nIEV4YW1wbGUgKFRlc3QgS2V5KSA8ZXhhbXBsZUBleGFtcGxlLmNvbT6IuAQTAQIA\nIgUCW+OfpwIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ8vDO2KUmE8TX\nDgQAlmTHwbTBjO+Rmn6TkYc7AFBF7/+pU/26OxbbzTUxEn3effdepFVOWrZbiT6n\nJ2/xZs4gh1lk1P12JpHfIOgBixP7sli9iDhMoecDYVFl9DtFyc9QBQM+aYKHrtyy\nyiKMbozksZbZVv2Xd5RDS+nuy9Pm2mpjzpYaL4p/ulaFjnadAdgEW+OfpwEEAMC8\n2ow4zQ5VZ3dSNZJHsBDOO+y5vCK4Y3i9rgeOKeQ2s9sgNXGSm/KchCaC1n6Tyeri\nD85++vQT69QL2ZBi0pZEx7H8Ib0M81MDaczu1VtAeeqH3t8briKAnQ5DwlOW9b/o\nlqkB3DS2ITZglpeIhLFSbPyHvK5LqKeItqETS09xABEBAAEAA/9a18ikpdMUqfFh\n/qgMYeidCy+YdLS1orYTv0dq/TlGfPgJ1KUL+l+xms74vdtufqcBo/pySExtRYR2\nhf1OPh3l70Xz6+P9ywLIciXDlEE4WTW4siGYKq3rZnP3pRkuLoI6CHSpylVyVLCh\nQSrdB7d5IHRhK+DGJoTTEOKXzSBFjwIA1V5Y1oM13lXqIvu3BjwK16gUQ76L2TXc\ncd9uHO7EUMg0mBL9gmeeaTgqI7CLAECQdhUQyVBRDje73REzATOD+wIA5z9A/WiU\nD55c9J3shSdGmgXJ4rpZESZJsVg65bU+1DQP4rwuWdT1SrXW0mGWJbbK9uSKLyS6\n5VPVo+qs7itygwH/ep46Q0pXzeOlc11hd3n/6gadlnecJdZYA2imyHgJN53UkrsM\nish6Tx2drnCFyvE9ljB0jPTa14ntF8Fsf5NHKKTjiJ8EGAECAAkFAlvjn6cCGwwA\nCgkQ8vDO2KUmE8RHtAP/WimoqzpbIl9vBD9IBfO+q7I9ee/yGBRlFd54gytLM0Yv\nRDt+Wr+6rXdXTXqrc+rgJnEL7ukkdl0pWnIRXxi2UVZtZ6PdiBZv7ziREUoYsNBN\nHAxKBtRQhi5go6B/bAJevSwZLpHyMUyCPa81ggSEXlx+CfJWNzj81fLC4JIbrSo=\n=DL8M\n-----END PGP PRIVATE KEY BLOCK-----\n";

const keyCreationTimestamp = 1540996719;
// const signingTimestamp = 1541017302;
const signingTimestamp = 1541644199;

let privateJWK = {
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
let publicJWK = {
  alg: "RS1",
  e: "AQAB",
  ext: true,
  key_ops: ["verify"],
  kty: "RSA",
  n:
    "t9CyovBE3Ec_firrtZazX1nmDRUMHax5OzxPKOpHyWL0OS8dnlZDL9xWo-nqL7lXeka-PkBfwOPp_m0qG31KByLoJ_DGwV0qwoo7s8j4fWp_PVFZcrsg0f0TVemRdnxhg3kol5T_dlkzWdCg1GCe5bNnRD7-hgAZdCTyN-ZgWaTiHzau70A6tUIqtNdO-90WehJSyjqYSvWqkvImCnuvW2zyoIbkO3uyZESw3I_3yx9ATGBZteGG-tsDrqF816BK7eh2bx6K4AXcqowedP7S73wqy6Dq_ifVHuS7hPumgGukUUmdngEapl8BAak2G6jRm_kYDFQ52KPonQclNwSEuJEnoaBgUKej9Z4PCkywDz1RdvhF-sbWckMet4gr_cnpyRHElyqriDQ3u_1QYaqe3iR1jQGsxBxjdBCWTCU40QJm8zvOq75Wbm1UzceZJf2zcci2vSB1VAAO5mTsYgBi7cHFRuLVzBiRYiwTEkiWkfsmc4TiCCIddmXLxWJjPF5uHTaqWTfLwdJhuMlUvFPPhUT6hSU0aL6AH6shKCUKoEMpK59aLCrRd3nER_IpoYRO97_MY3F4f71e65vAtQFxTespnru0giK-Tor7Rc_MDQ0enFOj4NBvtbbYWKeVHkoeEjPbH5hVM8z_tsCEX_pnYBnwh_VUzKg20qp0HNzGoVE"
};

const printKey = txt => {
  try {
    let json = JSON.parse(txt);
    try {
      let msg = Message.serialize(json);
      return msg;
    } catch (err) {
      return err.message;
    }
  } catch (err) {
    return "Invalid JSON";
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: secretKey,
      output: JSON.stringify(Message.parse(secretKey), null, 2),
      publicKey,
      secretKey,
      publicJWK,
      privateJWK
    };
  }
  render() {
    return (
      <div className="App">
        <pre>
          {`Next steps:
- [ ] test test and validate
- [ ] finish cleaning up code and put on npm

Status:

- Detached Signature message
  - [x] parse
  - [x] serialize
- Public Key message
  - [x] parse
  - [x] serialize
  - [x] export JWK as PGP Public Key Message (that can be imported by GPG)
- Private Key message
  - [x] parse
  - [x] serialize
  - [x] export JWK as PGP Private Key Message (that can be imported by GPG)
  - [x] Convert PGP Private Key to a Public Public Key
- Can verify the self-signatures of
  - [x] externally created PGP Public Key Messages
  - [x] externally created PGP Private Key Messages
  - [x] internally created JWK that was exported as a PGP Public Key Messages
  - [x] internally created JWK that was exported as a PGP Private Key Messages
- Type 0 (sig of binary document) Signature Packets
  - [x] signed with (externally created PGP Private Key Message) and then verified with GPG
  - [x] signed with (internally created JWK that was exported as a PGP Private Key Message) and then verified with GPG
  - [ ] verify signatures created with (externally created PGP Private Key Message) and then verified with GPG
  - [x] verify signatures created with (internally created JWK that was exported as a PGP Private Key Message)
- Make isomorphic
  - [x] replace TextEncoder in UserId
  - [x] use sha.js or sindresorhus/crypto-hash instead of crypto.subtle.digest`}
        </pre>
        <h1>PGP Key Generation and Signing (wip)</h1>
        <div>
          Load example:
          <button
            onClick={async () => {
              this.setState({
                ...this.state,
                input: publicKey,
                publicKey: publicKey,
                output: JSON.stringify(Message.parse(publicKey), null, 2)
              });
            }}
          >
            PGP Public Key
          </button>
          <button
            onClick={async () => {
              this.setState({
                ...this.state,
                input: secretKey,
                secretKey: secretKey,
                output: JSON.stringify(Message.parse(secretKey), null, 2)
              });
            }}
          >
            PGP Secret Key
          </button>
          <button
            onClick={async () => {
              let secretKey = await generate({
                userid: "CodeSandbox Random <random@example.com>",
                timestamp: keyCreationTimestamp
              });
              let publicKey = await convertPrivateToPublic(secretKey);
              this.setState({ ...this.state, publicKey, secretKey, input: secretKey });
              console.log(secretKey);
            }}
          >
            generate
          </button>
        </div>
        <div>
          Do action:
          <button
            onClick={async () => {
              let validity = await verifySelfSignature(this.state.input);
              console.log("validity", validity);
            }}
          >
            verify selfsig
          </button>
          <button
            onClick={async () => {
              let id = await keyId(this.state.input);
              console.log(id);
            }}
          >
            keyid
          </button>
          <button
            onClick={async () => {
              let text = await convertPrivateToPublic(this.state.input);
              this.setState({ ...this.state, input: text, publicKey: text });
              console.log(text);
            }}
          >
            toPublic
          </button>
          <button
            onClick={async () => {
              let text = await JWKtoPGP(this.state.privateJWK, "CodeSandbox <test@example.com>", keyCreationTimestamp);
              this.setState({ ...this.state, input: text, secretKey: text });
              console.log(text);
            }}
          >
            JWKtoPGP
          </button>
          <button
            onClick={async () => {
              let text = await sign(this.state.input, payload, signingTimestamp);
              this.setState({ ...this.state, input: text });
              console.log(text);
            }}
          >
            Sign
          </button>
          <button
            onClick={async () => {
              let valid = await verify(this.state.secretKey, this.state.input, payload);
              console.log("valid", valid);
            }}
          >
            Verify
          </button>
          <button
            onClick={async () => {
              let valid = await verify(publicKey, signature, payload);
              console.log("valid", valid);
            }}
          >
            Verify Commit
          </button>
        </div>
        <h1>PGP Key Parser</h1>
        <textarea
          style={{ fontFamily: "monospace" }}
          cols="60"
          rows="20"
          value={this.state.input}
          onChange={e => this.setState({ input: e.target.value })}
        />
        <ObjectInspector
          data={Message.parse(this.state.input)}
          name="input"
          initialExpandedPaths={["root", "root.*", "root.*.*", "root.*.*.*"]}
        />
        <h1>PGP Key Serializer</h1>
        <textarea
          style={{ fontFamily: "monospace" }}
          cols="60"
          rows="20"
          value={this.state.output}
          onChange={e => this.setState({ output: e.target.value })}
        />
        <pre>{printKey(this.state.output)}</pre>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
