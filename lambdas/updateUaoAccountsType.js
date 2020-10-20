var AWS = require("aws-sdk");
var accountCreateConfigTableName = 'AccountCreateConfig';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log('Loading getAccountCreateConfig function');

    var accountCreateConfigData;
    var response;
    var brand;
    var queryStringParameters;
    var httpMethod;
    var responseBody;
    var showAccountType;
    var accountType;

    console.log("BEGIN: getAccountCreateConfig");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        console.log('queryStringParameters: ' + queryStringParameters);
        brand = queryStringParameters.brand;
        showAccountType = queryStringParameters.showAccountType;
        accountType = queryStringParameters.accountType;
    }
    else {
        brand = event.brand;
        showAccountType = event.showAccountType;
        accountType = event.accountType;

    }

    console.log('brand = ' + brand);
    console.log('showAccountType = ' + showAccountType);

    var params = {
        TableName: accountCreateConfigTableName,
        Key: {
            brand: brand
        }
    };
    console.log("params: " + JSON.stringify(params));
    var dbResponse = docClient.get(params, function(err, data) {
        console.log("inside callback");
        if (err) {
            context.fail("Error in getItem " + err);
        }
        else {
            console.log("data: " + JSON.stringify(data));
            if (data !== undefined) {
                accountCreateConfigData = data.Item;

                if (httpMethod === "GET") {
                    responseBody = accountCreateConfigData;
                } else {
                     responseBody = accountCreateConfigData;
                }

                for (var i=0; i<responseBody.createAccountPostLoginConfig.length; i++) {
                    for (var j=0; j<responseBody.createAccountPreLoginConfig.length; j++) {
                        for (var m=0; m<responseBody.createAccountPostLoginConfig[i].accountTypes.length; m++) {
                            for (var n=0; n<responseBody.createAccountPreLoginConfig[j].accountTypes.length; n++) {
                                if (responseBody.createAccountPostLoginConfig[i].accountTypes[m].accountType === accountType
                                    && responseBody.createAccountPreLoginConfig[j].accountTypes[n].accountType === accountType) {
                                     console.log("createAccountPostLoginConfig - accountType", responseBody.createAccountPostLoginConfig[i].accountTypes[m].accountType);
                                     console.log("createAccountPreLoginConfig - accountType", responseBody.createAccountPreLoginConfig[j].accountTypes[n].accountType);
                                     var params = {
                                        TableName:accountCreateConfigTableName,
                                        Key:{
                                            brand: brand
                                        },
                                        UpdateExpression: "set createAccountPostLoginConfig[" + i + "].accountTypes[" + m + "].#showAccountType = :showAccountType, createAccountPreLoginConfig[" + i + "].accountTypes[" + n + "].#showAccountType = :showAccountType",
                                        ExpressionAttributeNames:{
                                            "#showAccountType": "showAccountType"
                                        },
                                        ExpressionAttributeValues:{
                                            ":showAccountType": showAccountType
                                        },
                                        ReturnValues:"UPDATED_NEW"
                                    };
                                    var dbResponse = docClient.update(params, function (err, data) {
                                        console.log("inside callback");
                                        if (err) {
                                            context.fail("Error: " + err);
                                        }
                                        else {
                                            console.log("data: " + JSON.stringify(data));
                                            if (data !== undefined) {
                                                accountCreateConfigData = data.Attributes;
                                                console.log("accountCreateConfigData: " + JSON.stringify(accountCreateConfigData));
                                                responseBody = "Accounts Type changed successfully";
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
                                            console.log("END: updateAccountCreateConfig");
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}
