# Truecaller for Node
`truecaller-node` is an npm module to verify Truecaller user profiles from the server.

### Requirements
* NodeJS >= 8

### Installation
`npm install @vyng/truecaller-node`

### Usage
```javascript
const truecaller = require('@vyng/truecaller-node');

// Truecaller profile object from the mobile SDK
var profile = {
  payload: <base64 encoded string>,
  signature: <string>,
  signatureAlgorithm: <string>, // SHA512withRSA
};

// Options (defaults shown)
var options = {
  url: <url to fetch public keys>, // https://api4.truecaller.com/v1/key
  ttl: 1000 * 60 * 10, // Allow request time to be maximum of 10 minutes in the past. If ttl is 0, no check is done.
  publicKeys: undefined, // Explicitly specifies public keys. Useful in case truecaller changes their fetch.
};
...
const profile = await truecaller.verifyProfile(profile, options);
if (profile.verifiedSignature) {
  // Server side verification of profile succeeded!
}
...
```

### Notes
If publicKeys are not explicitly specified, then truecaller-node will fetch and cache public keys for 24 hours.
