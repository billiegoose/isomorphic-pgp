const { generate } = require('./browser.js')

describe('generate', () => {
  it('should generate a keypair', async () => {
    const openpgptext = await generate({
      userid: 'User Name <email@example.com>',
      timestamp: Math.floor(Date.now() / 1000)
    })
    await expect(openpgptext).toContain('BEGIN PGP PRIVATE KEY')
  })
})
