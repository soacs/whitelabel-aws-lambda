// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secret,
    httpMethod,
    queryStringParameters,
    secretName,
    responseBody,
    date = new Date();

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

exports.handler = (event, context, callback) => {
    console.log("EVENT ::" + JSON.stringify(event));
    httpMethod = event.httpMethod;
    
    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        secretName = queryStringParameters.secretName;
    }
    else {
       secretName = event.secretName;
    }
    
    client.getSecretValue({SecretId: secretName}, function(err, data) {
        if (err) {
            if (err.code === 'DecryptionFailureException')
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InternalServiceErrorException')
                // An error occurred on the server side.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidParameterException')
                // You provided an invalid value for a parameter.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidRequestException')
                // You provided a parameter value that is not valid for the current state of the resource.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'ResourceNotFoundException')
                // We can't find the resource that you asked for.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
                console.log("The API Shared keys and Secrets for", secretName);
                console.log("timestamp::",date.toISOString());
            }
        }
        
        if (secret !== undefined) {
            responseBody = secret;
            const response = {
                statusCode: 200,
                 headers: {
                             "Access-Control-Allow-Origin" : "*",
                             "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token","Content-Type":"application/json",
                             "Access-Control-Allow-Methods" : "GET,POST,OPTIONS",
                    },
                body: responseBody
            };  
            callback(null, response);
        }
    });
};