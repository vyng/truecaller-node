# truecaller
An npm module which provides an easy way to verify Truecaller user profiles on the server side.

# Usage
```npm install truecaller```

# API
    var truecaller = require('truecaller');
    var profile = ... // Truecaller profile object from the mobile SDK
    
    truecaller.verifyProfile(profile, function(err, verificationResult) {
        if(err) {
            console.log(err);
        }
        
        if(verificationResult === true) {
            // Server side verification of profile object succeeded, yay
        } else { // Verification failed
            ...
        }
    });
    
# Coming soon
    - Examples
    - Test cases
    
