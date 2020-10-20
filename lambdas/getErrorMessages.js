
var AWS = require("aws-sdk");
var errorMessagesTableName = 'ErrorMessages';
var docClient = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
    console.log('Loading getEnabled function');

    var errorMessagesData;
    var response;
    var brand;
    var queryStringParameters;
    var httpMethod;
    var responseBody;


    console.log("BEGIN: getErrorMessages");
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

    var params = {
        TableName: errorMessagesTableName,
        Key: {
            brand: brand
        }
    };
    var defaultParams = {
        TableName: errorMessagesTableName,
        Key: {
            brand: 'default'
        }
    };
    console.log("params: " + JSON.stringify(params));
    console.log("default params: " + JSON.stringify(defaultParams));
    var mapDefaultErrorMessageData = function (brandData, defaultData) {
        console.log('input for mapDefaultErrorMessageData:', brandData, defaultData);
        if(!brandData) {
            return defaultData.messages;
        }
        var res = [];
        defaultData.messages.forEach((message) => {
            var brandMessageFound = brandData.messages.find(function(element) {
                return element.errorCode === message.errorCode;
            });
            res.push(brandMessageFound ? brandMessageFound : message);
        });
        return res;
    }
    var dbDefaultResponse = docClient.get(defaultParams, function(errDefault, dataDefaultCallbackReturn) {
        console.log("inside default callback");
        if (errDefault) {
            context.fail("Error in get default errorMessages: " + errDefault);
        }
        else {
            console.log("default data: " + JSON.stringify(dataDefaultCallbackReturn));
            var dbResponse = docClient.get(params, function(err, data) {
                console.log("inside brand callback");
                if (err) {
                    context.fail("Error in get brand errorMessages: " + err);
                }
                else {
                    console.log("brand data: " + JSON.stringify(data));
                    if (data !== undefined) {
                        errorMessagesData = mapDefaultErrorMessageData(data.Item, dataDefaultCallbackReturn.Item);
                        console.log("errorMessagesData: " + JSON.stringify(errorMessagesData));

                        if (httpMethod === "GET") {
                            responseBody = JSON.stringify(errorMessagesData);
                        } else {
                            responseBody = errorMessagesData;
                        }

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
                        console.log("END: getErrorMessages");
                    }
                }
            });
        }
    });
}
