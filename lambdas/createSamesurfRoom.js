        const jwt = require('jsonwebtoken');
    var querystring = require('querystring');
    var https = require('https');

    var AWS = require('aws-sdk'),
        region = "us-east-1",
        secretName,
        secret,
        parsedSecret,
        queryStringParameters,
        responseBody,
        date = new Date(),
        decodedBinarySecret;

    var client = new AWS.SecretsManager({
        region: region
    });

    exports.handler = (event, context, callback) => {

        console.log('Loading getSamesurfKey function');
        console.log("BEGIN: getSamesurfKey");
        console.log('Received event:', JSON.stringify(event, null, 2));
        var mBody = event.body;
        var parsedMBody = JSON.parse(mBody);
        console.log('parsedMBody.brand:', parsedMBody.brand);
        var brand = parsedMBody.brand
        console.log('brand:', brand);

        var api_key;
        var api_secret;
        var hostname;
        var startUrl;
        secretName = 'samesurf/' + brand;
        console.log('secretName:', secretName);

        console.log('Call client.getSecretValue to get secret');
        // Create a Secrets Manager client
        var client = new AWS.SecretsManager({
            region: region
        });

        client.getSecretValue({ SecretId: secretName }, function(err, data) {
            console.log('data: ' + JSON.stringify(data));

            if (err) {
                console.log('err: ' + err);
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
                    parsedSecret = JSON.parse(secret);
                    api_key = parsedSecret.api_key;
                    api_secret = parsedSecret.api_secret;
                    hostname = parsedSecret.hostname;
                    startUrl = parsedSecret.startUrl;

                    console.log('api_key: ' + parsedSecret.api_key);
                    console.log('api_secret: ' + parsedSecret.api_secret);
                    console.log('hostname: ' + parsedSecret.hostname);
                    console.log('startUrl: ' + parsedSecret.startUrl);
                }
                else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    decodedBinarySecret = buff.toString('ascii');
                    console.log('decodedBinarySecret: ' + decodedBinarySecret);
                }

                if (secret !== undefined) {
                    var utcnow = Math.floor(new Date().getTime() / 1000);
                    var token = jwt.sign({ sub: api_key, iat: utcnow }, api_secret);

                    const postData = JSON.stringify({
                        starturl: startUrl
                    })

                    var options = {
                        hostname: hostname,
                        port: 443,
                        path: '/api/v3/create',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': postData.length,
                            'Authorization': "Bearer " + token
                        }
                    };

                    console.log('Calling https with options: ', JSON.stringify(options));
                    
                    // Set up the request
                    var postReq = https.request(options, function(res) {
                        console.log('res.statusCode: ' + res.statusCode);
                        res.setEncoding('utf8');
                        res.on('data', function(chunk) {
                            console.log('Response: ' + chunk);
                            responseBody = chunk;
                            const response = {
                                statusCode: 200,
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                                },
                                body: responseBody
                            };

                            callback(null, response);

                        });
                        res.on('error', (e) => {
                            console.error(e);

                        });
                    });

                    console.log('Calling https with postData: ', JSON.stringify(postData));
                    
                    // post the data
                    postReq.write(postData);
                    postReq.end();

                    console.log('After the Call to client.getSecretValue to get secret');
                }
            }
        });
    };
    
