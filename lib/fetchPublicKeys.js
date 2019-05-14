// lib/fetchPublicKey.js

const { promisify } = require('util');
const request = promisify(require('request'));
const pemtools = require('pemtools');
const moize = require('moize');

const publicKeyUrl = 'https://api4.truecaller.com/v1/key';

const internalFetchPublicKeys = async (url = publicKeyUrl) => {
  const { body } = await request({
    url,
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

module.exports = moize.default(
  internalFetchPublicKeys,
  {
    maxAge: 1000 * 60 * 30, // 30 minutes,
    isPromise: true,
  },
);
