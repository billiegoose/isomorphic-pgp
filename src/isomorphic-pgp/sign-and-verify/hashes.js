const { sha1, sha256, sha384, sha512 } = require("crypto-hash");

module.exports.hashes = {
    SHA1: sha1,
    SHA256: sha256,
    SHA384: sha384,
    SHA512: sha512
};
