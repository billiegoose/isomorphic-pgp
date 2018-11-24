const { createPrivateJWK } = require('./createPrivateJWK.js')

describe('createPrivateJWK', () => {
  it('createPrivateJWK', async () => {
    const jwk = await createPrivateJWK()
    await expect(Object.keys(jwk)).toContain('kty')
  })
})
