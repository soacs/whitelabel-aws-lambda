var AWS = require("aws-sdk");
var accountCreateConfigTableName = 'AccountCreateConfig';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log('Loading getAccountCreateConfig function');

    var accountCreateConfigData;
    var response;
    var brandToBeCloned;
    var brand;
    var queryStringParameters;
    var body;
    var httpMethod;
    var responseBody;
    var newAccountCreateConfigData;
    var documentAPIPartnerCode;
    var penColor;

    console.log("BEGIN: getAccountCreateConfig");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "POST") {
        body = JSON.parse(event.body);
        console.log('body: ', body);
        brand = body.brand;
        brandToBeCloned = body.brandToBeCloned;
        documentAPIPartnerCode = body.documentAPIPartnerCode;
        penColor = body.penColor;
    }
    else {
        brand = event.brand;
        brandToBeCloned = event.brandToBeCloned;
        documentAPIPartnerCode = event.documentAPIPartnerCode;
        penColor = event.penColor;
    }

    console.log('brand = ' + brand);
    console.log('brandToBeCloned = ' + brandToBeCloned);
    console.log('documentAPIPartnerCode = ' + documentAPIPartnerCode);
    console.log('penColor = ' + penColor);

    var params = {
        TableName: accountCreateConfigTableName,
        Key: {
            brand: brandToBeCloned
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
                newAccountCreateConfigData = data.Item;

                if (newAccountCreateConfigData.brand === brandToBeCloned) {
                    newAccountCreateConfigData.brand = brand;
                    newAccountCreateConfigData.documentAPIPartnerCode = documentAPIPartnerCode;
                    newAccountCreateConfigData.penColor = penColor;
                }

                var params1 = {
                    Item: newAccountCreateConfigData,
                    TableName: accountCreateConfigTableName
                };

                var dbResponse = docClient.put(params1, function(err, data) {
                  if (err) {
                    console.log("Error", err);
                    callback(err, null);
                  } else {
                    const response = {
                        statusCode: 201,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token", "Content-Type": "application/json",
                            "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS",
                        },
                        body: "The new record inserted successfully"
                    };
                    callback(null, response);
                    console.log("END: createAccountCreateConfig");
                  }
                });
            }
        }
    });
}
