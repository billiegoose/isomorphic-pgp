# @isomorphic-pgp/generate [WORK IN PROGRESS]

## Basic Usage

```js
const { generate } = require('@isomorphic-pgp/generate')

const openpgptext = await generate({
    userid: 'User Name <email@example.com>',
    timestamp: Math.floor(Date.now() / 1000)
})
```

## API

- `generate(options)`
