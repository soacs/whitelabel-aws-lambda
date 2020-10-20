const jwt = require('jsonwebtoken');

var querystring = require('querystring');
var https = require('https');

var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName,
    secret,
    parsedSecret,
    httpMethod,
    queryStringParameters,
    responseBody,
    date = new Date(),
    decodedBinarySecret;

var client = new AWS.SecretsManager({
    region: region
});

exports.handler = (event, context, callback) => {

    console.log('Loading getSamesurfRoomStatus function');
    console.log("BEGIN: getSamesurfRoomStatus");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('event.body:', JSON.stringify(event.body, null, 2));
    var mBody = event.body;
    console.log('mbody:', JSON.stringify(mBody, null, 2));
    var roomNumber = mBody.roomNumber;

    var parsedBody = JSON.parse(mBody);
    console.log('Parsed event.body:', JSON.stringify(parsedBody, null, 2));
    console.log('NEW - parsedBody.roomNumber:', parsedBody.roomNumber);
    var api_key;
    var api_secret;
    var hostname;
    var brand;

    brand = parsedBody.brand;
    roomNumber = parsedBody.roomNumber;
    secretName = 'samesurf/'+ brand;
    console.log('--secretName:', secretName);
    console.log('--roomNumber:', roomNumber);
    console.log('--brand:', brand);

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


                const post_data = JSON.stringify({
                    "skip": 0,
                    "limit": 0
                });

                var options = {
                    hostname: hostname,
                    port: 443,
                    path: '/api/v3/runningrooms',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length,
                        'Authorization': "Bearer " + token
                    }
                };

                // Set up the request
                var postReq = https.request(options, function(res) {
                    console.log('res.statusCode: ' + res.statusCode);
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        console.log('Response: ' + chunk);
                        var myString = chunk;
                        console.log('typeof: ' + typeof myString);
                        var parsedString = JSON.parse(chunk);
                        console.log('typeof: ' + parsedString.success);

                        var rooms = parsedString.rooms;
                        var totalrooms = parsedString.totalrooms;
                        var success = parsedString.success;
                        console.log('totalrooms: ' + totalrooms);
                        console.log('success: ' + success);
                        console.log('rooms.length: ' + rooms.length);
                        console.log('rooms: ' + JSON.stringify(rooms));

                        var roomResult = rooms.filter(x => x.room == roomNumber);
                        var roomResult2;
                        var isRoomNumberRunning;
                        console.log('roomResult: ' + JSON.stringify(roomResult));
                        if(roomResult.length > 0) {
                            roomResult2 = roomResult[0];
                            isRoomNumberRunning = true;
                        } else {
                            roomResult2 = 'Room not found';
                            isRoomNumberRunning = false;
                        }
                        console.log('roomResult2: ' + JSON.stringify(roomResult2));
                        console.log('isRoomNumberRunning: ' + isRoomNumberRunning);
                        responseBody = roomResult2;
                        const response = {
                            statusCode: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                            },
                            body: isRoomNumberRunning
                        };

                        callback(null, response);

                    });
                    res.on('error', (e) => {
                        console.error(e);

                    });
                });

                // post the data
                postReq.write(post_data);
                postReq.end();

                console.log('After the Call to client.getSecretValue to get secret');
            }
        }
    });
};
