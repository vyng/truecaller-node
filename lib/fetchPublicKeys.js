// lib/fetchPublicKey.js

const { promisify } = require('util');
const request = promisify(require('request'));
const pemtools = require('pemtools');
const moize = require('moize');

const publicKeyUrl = 'https://api4.truecaller.com/v1/key';

const internalFetchPublicKeys = async (url) => {
  const { body } = await request({
    url: url || publicKeyUrl,
    method: 'GET',
    json: true,
  });

  if (!Array.isArray(body) || body.length === 0) {
    throw Error(`Invalid public key received from ${url}`);
  }

  return body.map(({ key }) => (
    pemtools(Buffer.from(key, 'base64'), 'PUBLIC KEY').pem
  ));
};

const fetchPublicKeys = moize.default(
  internalFetchPublicKeys,
  {
    maxAge: 1000, // 1000 * 60 * 30, // 30 minutes,
    isPromise: true,
    // Due to a bug, make this work:
    onExpire: (params) => fetchPublicKeys(...params),
  },
);

module.exports = fetchPublicKeys;
