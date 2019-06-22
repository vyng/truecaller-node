// lib/fetchPublicKey.js

const { promisify } = require('util');
const request = promisify(require('request'));
const pemtools = require('pemtools');
const moize = require('moize');

const publicKeyUrl = 'https://api4.truecaller.com/v1/key';
const defaultExpire = 1000 * 60 * 60 * 24; // 24 hours

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

const fetchPublicKeys = moize.default(
  internalFetchPublicKeys,
  {
    maxAge: defaultExpire,
    isPromise: true,
    updateExpire: true,
  },
);

module.exports = fetchPublicKeys;
