var AWS = require("aws-sdk");
var allFirmsConfigTableName = 'AppSettings';
var docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {

    var allFirmsConfigData;
    var response;
    var httpMethod;
    var responseBody;

    httpMethod = event.httpMethod;
    
    var params = {
        TableName: allFirmsConfigTableName
    };
    
    var dbResponse = docClient.scan(params, function(err, data) {
        if (err) {
            context.fail("Error in getItem " + err);
        }
        else {
            if (data !== undefined) {
                allFirmsConfigData = data;
                
                if (httpMethod === "GET") {
                    responseBody = JSON.stringify(allFirmsConfigData);
                } else {
                     responseBody = allFirmsConfigData;
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
            }
        }

    });
};


