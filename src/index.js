import React from "react";
import ReactDOM from "react-dom";
import ObjectInspector from "react-object-inspector";
import { createPair } from "./webcrypto/createPair.js";
import { exportPublicKey } from "./webcrypto/exportPublicKey.js";
import { sign } from "./webcrypto/sign.js";
import { examplePair } from "./webcrypto/examplePair.js";
import { calcKeyId } from "./webcrypto/calcKeyId.js";
import { verifySelfSignature } from "./webcrypto/verifySelfSignature.js";

import "./styles.css";

import * as Message from "./pgp-signature/Message.js";

let signature =
  "-----BEGIN PGP SIGNATURE-----\n\niQIcBAABAgAGBQJb0ldBAAoJEJYJuKWSi6a56N8P/14lzvTTxRT4+mTvmXH0I5Ol\nQZEZuki9vAcV5lcRuGNtJ/+dqFIb8nj3MKYy2E1bHUIQmb/Eqgw+fRASONtC4k3w\nXO98svGD4+HJvSkyvlBJA/p7MF0xad509MBHrzTEp5TsHciF74JC8tqzbeKyFrG/\n2vStQKoRceEhk2d4EKt0B7Q58pUSzdJvpivRyNwk/WTzRjaLybd0kxcuemnuArPG\nkZPcf/VWrxtQhIl8GCACf+0X9jcoB43h0VLsBMTea4sXRf3HkKzlMO1lOoFgf4KA\nezUEpbss6GoRwA/Qj7uPFSPj//0+cS/MwLOa0qRKtS7LQPFh3CnT/BhropMAuMmG\n253XgcKGuONdKw/OWIA/uctQwrnncZsGmKkGRKflt+6TsimMABMk9RS4eOzFKpHZ\nybU8oIINB9PmaI4Box1syxPUEsjC85w8c88pnvX7JlA6RJJ3c+6RO4lvefqN8TD1\nTASJK6C07gN5ZDBMBjlUud7be05lYrASu0jXy538C7bEhHFBPUqdKb/VtTszma2I\nX1Hx4uyh6C1EuSeGBQUUsQoXfPhxqjgsgrHSQ3sfabEJhlTBqKqmoWEhYotqmXC5\nY4yKEA486+ElQkPzi/SpsGe/gqaNp8A+50LwohZlA3LRc5W/D0pMIvIbCq/3a95A\nZ6e744fK9NMccQfO9b9z\n=4UMM\n-----END PGP SIGNATURE-----";
let payload =
  "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor William Hilton <wmhilton@gmail.com> 1540511553 -0400\ncommitter William Hilton <wmhilton@gmail.com> 1540511553 -0400\n\nInitial commit\n";
let publicKey =
  "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\ndGs=\n=QSo+\n-----END PGP PUBLIC KEY BLOCK-----";

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
  state = {
    input: publicKey,
    output: JSON.stringify(Message.parse(publicKey), null, 2),
    keys: {}
  };
  render() {
    return (
      <div className="App">
        <pre>
          {`Next steps:
- [ ] See if we can verify the self-signatures of externally created PGP messages

Status:

- Detached Signature message
  - [x] parse
  - [x] serialize
- Public Key message
  - [x] parse
  - [x] serialize
- Make isomorphic
  - [ ] replace TextEncoder in UserId`}
        </pre>
        <h1>PGP Key Generation and Signing (wip)</h1>
        <button
          onClick={async () => {
            let keys = await createPair();
            this.setState({ ...this.state, keys });
            console.log(keys);
          }}
        >
          createPair
        </button>
        <button
          onClick={async () => {
            let keys = await examplePair();
            this.setState({ ...this.state, keys });
            console.log(keys);
          }}
        >
          load example keys
        </button>
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
            let keyjson = JSON.parse(this.state.output);
            let ids = await calcKeyId(keyjson.packets[0].packet);
            console.log(ids);
          }}
        >
          keyid
        </button>
        <button
          onClick={async () => {
            let text = await exportPublicKey(
              this.state.keys.publicKey,
              this.state.keys.privateKey,
              "CodeSandbox <test@example.com>",
              1540996719
            );
            this.setState({ ...this.state, input: text });
            console.log(text);
          }}
        >
          exportPublicKey
        </button>
        <button
          onClick={async () => {
            let text = await sign(
              this.state.keys.privateKey,
              new TextEncoder().encode("Hello World!"),
              1541017302
            );
            this.setState({ ...this.state, input: text });
            console.log(text);
          }}
        >
          Sign
        </button>
        <h1>PGP Key Parser</h1>
        <textarea
          cols="70"
          rows="20"
          value={this.state.input}
          onChange={e => this.setState({ input: e.target.value })}
        />
        <ObjectInspector
          data={Message.parse(this.state.input)}
          name="input"
          initialExpandedPaths={["root", "root.*", "root.*.*", "root.*.*.*"]}
        />
        {JSON.stringify(Message.parse(this.state.input))}
        <h1>PGP Key Serializer</h1>
        <textarea
          cols="70"
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
