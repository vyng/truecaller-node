// lib/index.js

const crypto = require('crypto');

const fetchPublicKeys = require('./fetchPublicKeys');

const algorithmMap = {
  SHA512withRSA: 'RSA-SHA512',
};

const defaultTtl = 1000 * 60 * 10; // 10 minutes

const verifyProfile = async (
  {
    payload = '',
    signature = '',
    signatureAlgorithm = '',
    ...others
  },
  {
    url,
    ttl = defaultTtl,
    publicKeys,
  } = { ttl: defaultTtl },
) => {
  const profile = JSON.parse(Buffer.from(payload, 'base64').toString());
  const { requestTime = 0 } = profile;

  const keys = publicKeys || await fetchPublicKeys(url);
  const payloadBuffer = Buffer.from(payload);
  const signatureBuffer = Buffer.from(signature, 'base64');
  const algorithm = algorithmMap[signatureAlgorithm];

  const date = Date.now();

  const verifiedSignature = keys.some((key) => {
    const verifier = crypto.createVerify(algorithm);
    verifier.update(payloadBuffer);
    return verifier.verify(key, signatureBuffer) &&
      requestTime > 0 && (ttl <= 0 || (date - (requestTime * 1000)) <= ttl);
  });

  return {
    ...others,
    ...profile,
    payload,
    signature,
    signatureAlgorithm,
    verifiedSignature,
  };
};

module.exports = {
  verifyProfile,
};
