const crypto = require('crypto')
const { pem2jwk } = require('pem-jwk')

module.exports.createPrivateJWK = async function createPrivateJWK() {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) return reject(err)
      let jwk = pem2jwk(privateKey)
      resolve(jwk)
    })
  })
}
