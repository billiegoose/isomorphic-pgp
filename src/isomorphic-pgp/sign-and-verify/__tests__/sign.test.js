const { sign } = require("../sign.js");

let privateKey =
  "-----BEGIN PGP PRIVATE KEY BLOCK-----\n\nlQHYBFvjn6cBBAC3u+yC1fc0S/daBgjnVDq3lSnxfK7ogultM8rbqA0wqKqYqhUc\nYd611c8LmOv+Ri7jtr31vA81kunJEQ0uQ3jkqXaNzdOULFG3XCLVpz92TSD9E8uv\nseKXwhDhzlJUw+PihAQXLOiDbUKEmY/02aT/s4KqkUk3Zo7gpDkQWYwcmQARAQAB\nAAP9E8FGbEjiNALI/Spx8aF6ULvejyL3UXOl8oJjmNuIU4eHFDQRYgRZ5FYxVU9j\nbGsSZpSC9zV5sypxLZfCQYuqp0hsCz//DZi08l7dQQZtYLxWkasRfSAqFXkQu3NB\nC90QIcginxBa8R5vykQiQiItre8fdGAyHwkgTj8kEXW/WOsCAMHCWLidns+D91cC\nFsetSiKm7r8v1ERZHO4kKRV2esPyAYG6Airl+U2dF5fmDAZSYIvAkY3tcM5CVJBQ\n3WScBusCAPLBK8NB2moQCBHI0AhfimX5cnzSDfnDec4fYiE8OyR5k9WIwyzXx6vU\nRB6ne9sMt/CKXg2RPsi28ckqIm7sUYsB/3PMHzrbfsethRAlNCvJzE1efvrY2lsP\nyPVPsdXerJGfW/v6APt1q7CJPq6RvFAK7cXHwYpHGQW88Z/6IRmtDhaawLQsTXIu\nIEV4YW1wbGUgKFRlc3QgS2V5KSA8ZXhhbXBsZUBleGFtcGxlLmNvbT6IuAQTAQIA\nIgUCW+OfpwIbAwYLCQgHAwIGFQgCCQoLBBYCAwECHgECF4AACgkQ8vDO2KUmE8TX\nDgQAlmTHwbTBjO+Rmn6TkYc7AFBF7/+pU/26OxbbzTUxEn3effdepFVOWrZbiT6n\nJ2/xZs4gh1lk1P12JpHfIOgBixP7sli9iDhMoecDYVFl9DtFyc9QBQM+aYKHrtyy\nyiKMbozksZbZVv2Xd5RDS+nuy9Pm2mpjzpYaL4p/ulaFjnadAdgEW+OfpwEEAMC8\n2ow4zQ5VZ3dSNZJHsBDOO+y5vCK4Y3i9rgeOKeQ2s9sgNXGSm/KchCaC1n6Tyeri\nD85++vQT69QL2ZBi0pZEx7H8Ib0M81MDaczu1VtAeeqH3t8briKAnQ5DwlOW9b/o\nlqkB3DS2ITZglpeIhLFSbPyHvK5LqKeItqETS09xABEBAAEAA/9a18ikpdMUqfFh\n/qgMYeidCy+YdLS1orYTv0dq/TlGfPgJ1KUL+l+xms74vdtufqcBo/pySExtRYR2\nhf1OPh3l70Xz6+P9ywLIciXDlEE4WTW4siGYKq3rZnP3pRkuLoI6CHSpylVyVLCh\nQSrdB7d5IHRhK+DGJoTTEOKXzSBFjwIA1V5Y1oM13lXqIvu3BjwK16gUQ76L2TXc\ncd9uHO7EUMg0mBL9gmeeaTgqI7CLAECQdhUQyVBRDje73REzATOD+wIA5z9A/WiU\nD55c9J3shSdGmgXJ4rpZESZJsVg65bU+1DQP4rwuWdT1SrXW0mGWJbbK9uSKLyS6\n5VPVo+qs7itygwH/ep46Q0pXzeOlc11hd3n/6gadlnecJdZYA2imyHgJN53UkrsM\nish6Tx2drnCFyvE9ljB0jPTa14ntF8Fsf5NHKKTjiJ8EGAECAAkFAlvjn6cCGwwA\nCgkQ8vDO2KUmE8RHtAP/WimoqzpbIl9vBD9IBfO+q7I9ee/yGBRlFd54gytLM0Yv\nRDt+Wr+6rXdXTXqrc+rgJnEL7ukkdl0pWnIRXxi2UVZtZ6PdiBZv7ziREUoYsNBN\nHAxKBtRQhi5go6B/bAJevSwZLpHyMUyCPa81ggSEXlx+CfJWNzj81fLC4JIbrSo=\n=DL8M\n-----END PGP PRIVATE KEY BLOCK-----\n";
let expectedSignature =
  "-----BEGIN PGP SIGNATURE-----\n\niJwEAAEIAAYFAlv3XrcACgkQ8vDO2KUmE8Tb/gP/QyAl/whBNMyc3TkKFusa37Fi\n8L2PTEn8XZuOh3x2fSIY+6EeBGBcnjNnxV9xI7NZNPROStfJNQQ1bmKCPDsASQus\nTTYJmhjebqAts5Ab2zKZmrkIPAjrKc+xQuFBEAV9Dc945Fg7pqSusHjd3TVRTAQJ\nh7ncAjCeDqe64l/SEuc=\n=lwSL\n-----END PGP SIGNATURE-----";
let payload =
  "tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor William Hilton <wmhilton@gmail.com> 1540511553 -0400\ncommitter William Hilton <wmhilton@gmail.com> 1540511553 -0400\n\nInitial commit\n";

describe("sign", () => {
  it("sign git commit", async () => {
    let timestamp = 1542938295
    let signature = await sign(privateKey, payload, timestamp);
    expect(signature).toBe(expectedSignature);
  });
});