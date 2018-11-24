module.exports = {
  moduleNameMapper: {
    "@isomorphic-pgp/(.*)$": "<rootDir>/src/$1"
  },
  testPathIgnorePatterns: [
    "generate"
  ]
};
