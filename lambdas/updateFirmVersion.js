
var AWS = require("aws-sdk");
var firmVersionTableName = 'FirmVersions';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log('Loading updateFirmVersion function...');

    var firmVersionData;
    var brand;
    var responseBody;

    console.log("BEGIN: updateFirmVersion");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    var httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    var parsedMBody = JSON.parse(event.body);
    brand = parsedMBody.brand;
    var validated = parsedMBody.validated;
    var release = parsedMBody.releaseNumber;

    console.log('brand:', brand);

    var params = {
        TableName: firmVersionTableName,
        Key: {
            brand: brand
        }
    };

    var params = {
        TableName:firmVersionTableName,
        Key:{
            brand: brand
        },

        UpdateExpression: "set validated = :validated, releaseNumber=:releaseNumber",
        ExpressionAttributeValues:{
            ":validated": validated,
            ":releaseNumber": release
        },
        ReturnValues:"UPDATED_NEW"
    };


    console.log("params: " + JSON.stringify(params));
    var dbResponse = docClient.update(params, function (err, data) {
        console.log("inside callback");
        if (err) {
            context.fail("Error in getItem " + err);
        }
        else {
            console.log("data: " + JSON.stringify(data));
            if (data !== undefined) {
                firmVersionData = data.Item;
                console.log("firmVersionData: " + JSON.stringify(firmVersionData));

                if (httpMethod === "GET") {
                    responseBody = JSON.stringify(firmVersionData);
                } else {
                    responseBody = firmVersionData;
                }

                const response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token", "Content-Type": "application/json",
                        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                    },
                    body: responseBody
                };
                callback(null, response);
                console.log("END: updateFirmVersion");
            }
        }

    });
}
