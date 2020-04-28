// lib/fetchPublicKey.js

const { get } = require('simple-get-promise');
const moize = require('moize');

const publicKeyUrl = 'https://api4.truecaller.com/v1/key';
const defaultExpire = 1000 * 60 * 60 * 24; // 24 hours

const internalFetchPublicKeys = async (url = publicKeyUrl) => {
  const res = await get({
    method: 'GET',
    url,
    json: true,
  });

  const body = JSON.parse(res.responseText);

  if (!Array.isArray(body) || body.length === 0) {
    throw Error(`Invalid public key received from ${url}`);
  }

  return body.map(({ key }) => (
    `-----BEGIN PUBLIC KEY-----
${key.match(/.{1,64}/g).join('\n')}
-----END PUBLIC KEY-----`
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
