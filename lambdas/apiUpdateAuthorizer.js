/*
 * API Lambda Authorizer to validate tokens originating from 3rd Party Identity Provider and generates an IAM Policy.
 * Here the JWT token is inspected, validated and claims anazized and used to determine whether user from Realm/ClientId (app) can access the update function.
 * https://aws.amazon.com/blogs/security/use-aws-lambda-authorizers-with-a-third-party-identity-provider-to-secure-amazon-api-gateway-rest-apis/
 */

const apiPermissions = [
    {
        "arn": "arn:aws:execute-api:us-east-1:772387772726:vsy62yzez7",
        "resource": "update-enable",
        "stage": "dap",
        "httpVerb": "POST",
        "scope": "email"
    }
];

var generatePolicyStatement = function (apiName, apiStage, apiVerb, apiResource, action) {
    'use strict';
    var statement = {};
    statement.Action = 'execute-api:Invoke';
    statement.Effect = action;
    var methodArn = apiName + "/" + apiStage + "/" + apiVerb + "/" + apiResource + "/";
    statement.Resource = methodArn;
    return statement;
};

var generatePolicy = function (principalId, policyStatements) {
    'use strict';
    // Generate a fully formed IAM policy
    var authResponse = {};
    authResponse.principalId = principalId;
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = policyStatements;
    authResponse.policyDocument = policyDocument;
    return authResponse;
};

var verifyAccessToken = function (accessToken) {
    'use strict';
    /*
    * Verify the access token with your Identity Provider here (check if your
    * Identity Provider provides an SDK).
    *
    * This example assumes this method returns a Promise that resolves to
    * the decoded token, you may need to modify your code according to how
    * your token is verified and what your Identity Provider returns.
    */
};

var generateIAMPolicy = function (scopeClaims) {
    'use strict';
    // Declare empty policy statements array
    var policyStatements = [];
    // Iterate over API Permissions
    for ( var i = 0; i < apiPermissions.length; i++ ) {
        // Check if token scopes exist in API Permission
        if ( scopeClaims.indexOf(apiPermissions[i].scope) > -1 ) {
            // User token has appropriate scope, add API permission to policy statements
            policyStatements.push(generatePolicyStatement(apiPermissions[i].arn, apiPermissions[i].stage, apiPermissions[i].httpVerb,
                apiPermissions[i].resource, "Allow"));
        }
    }
    // Check if no policy statements are generated, if so, create default deny all policy statement
    if (policyStatements.length === 0) {
        var policyStatement = generatePolicyStatement("*", "*", "*", "*", "Deny");
        policyStatements.push(policyStatement);
    }
    console.log('PolifyStatements: ' + policyStatements);
    return generatePolicy('user', policyStatements);
};
exports.handler = async function(event, context) {
    // Declare Policy
    var iamPolicy = null;
    // Capture raw token and trim 'Bearer ' string, if present
    var token = event.authorizationToken.replace("Bearer ", "");
    // Validate token
    await verifyAccessToken(token).then(data => {
        // Retrieve token scopes
        var scopeClaims = data.claims.scp;
        // Generate IAM Policy
        iamPolicy = generateIAMPolicy(scopeClaims);
    })
        .catch(err => {
            console.log(err);
            // Generate default deny all policy statement if there is an error
            var policyStatements = [];
            var policyStatement = generatePolicyStatement("*", "*", "*", "*", "Deny");
            policyStatements.push(policyStatement);
            iamPolicy = generatePolicy('user', policyStatements);
        });
    return iamPolicy;
};

// The following is an example of the identity management policy that is returned from your function.
// Example IAM Policy
/* {
    "principalId": "user",
    "policyDocument": {
    "Version": "2012-10-17",
        "Statement": [
        {
            "Action": "execute-api:Invoke",
            "Effect": "Allow",
            "Resource": "arn:aws:execute-api:us-east-1:219852565112:rz8w6b1ik2/get/DEV/my-resource/"
        }
    ]
} */

