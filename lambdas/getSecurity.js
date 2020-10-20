var AWS = require("aws-sdk");
var servmgr = new AWS.SSM();

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log('Loading getSecurity function');
    console.log("process.env.ENVIRONMENT: " + process.env.ENVIRONMENT);
    var environment = process.env.ENVIRONMENT;

    var response;
    var brand;
    var queryStringParameters;
    var httpMethod;
    var responseBody;

    console.log("BEGIN: getSecurity");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        console.log('queryStringParameters: ' + queryStringParameters);
        brand = queryStringParameters.brand;
    }
    else {
        brand = event.brand;
    }

    console.log('brand = ' + brand);

    var parameterStoreKey = "/" + environment + "/" + brand + "/security";
    console.log('parameterStoreKey:', JSON.stringify(parameterStoreKey, null, 2));

    var ssm_params = {
        Name: parameterStoreKey
    };

    console.log("ssm_params: " + JSON.stringify(ssm_params));
    servmgr.getParameter(ssm_params, function(err, data) {
        console.log({
            err: err,
            data: data
        });
        var parameterStoreValue = data.Parameter.Value;
        if (httpMethod === "GET") {
            responseBody = parameterStoreValue;
        }
        else {
            responseBody = parameterStoreValue
        }
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

    console.log("END: seurityData");
}
