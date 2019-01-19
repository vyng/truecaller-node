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

  let verifiedSignature = false;
  const date = Date.now();

  for (let i = 0; i < keys.length; i++) {
    const verifier = crypto.createVerify(algorithm);
    verifier.update(payloadBuffer);
    if (verifier.verify(keys[i], signatureBuffer)) {
      const time = date - (requestTime * 1000);
      verifiedSignature = requestTime > 0 && (ttl <= 0 || time <= ttl);
      break;
    }
  }

  return {
    profile,
    payload,
    signature,
    signatureAlgorithm,
    verifiedSignature,
  };
};

module.exports = {
  verifyProfile,
};
