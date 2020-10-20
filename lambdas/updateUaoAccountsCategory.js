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
    var categoryName;
    var showCategory;

    console.log("BEGIN: getAccountCreateConfig");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        console.log('queryStringParameters: ' + queryStringParameters);
        brand = queryStringParameters.brand;
        categoryName = queryStringParameters.categoryName;
        showCategory = queryStringParameters.showCategory;
    }
    else {
        brand = event.brand;
        categoryName = event.categoryName;
        showCategory = event.showCategory;

    }

    console.log('brand = ' + brand);
    console.log('categoryName = ' + categoryName);

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
            if (data !== undefined) {
                accountCreateConfigData = data.Item;

                if (httpMethod === "GET") {
                    responseBody = accountCreateConfigData;
                } else {
                     responseBody = accountCreateConfigData;
                }
                console.log("responseBody: " + responseBody);

                for (var i=0; i<responseBody.createAccountPostLoginConfig.length; i++) {
                    for (var j=0; j<responseBody.createAccountPreLoginConfig.length; j++) {
                        if (responseBody.createAccountPreLoginConfig[i].categoryName === categoryName
                            && responseBody.createAccountPreLoginConfig[j].categoryName === categoryName) {
                                var params = {
                                    TableName:accountCreateConfigTableName,
                                    Key:{
                                        brand: brand
                                    },
                                    UpdateExpression: "set createAccountPostLoginConfig[" + i + "].#showCategory = :showCategory, createAccountPreLoginConfig[" + j + "].#showCategory = :showCategory",
                                    ExpressionAttributeNames:{
                                        "#showCategory": "showCategory"
                                    },
                                    ExpressionAttributeValues:{
                                        ":showCategory": showCategory
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
                                            responseBody = "Accounts category changed successfully";
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
    });
}
