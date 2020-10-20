var AWS = require("aws-sdk");
var securityTableName = 'Security'
var docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {

    var securityData;
    var response;
    var httpMethod;
    var responseBody;

    httpMethod = event.httpMethod;
    
    var params = {
        TableName: securityTableName
    };
    
    var dbResponse = docClient.scan(params, function(err, data) {
        if (err) {
            context.fail("Error in getItem " + err);
        }
        else {
            if (data !== undefined) {
                securityData = data;
                for (const value in securityData.Items) {
                    if (httpMethod === "GET") {
                            responseBody = JSON.stringify(securityData.Items[value].allowedOrigins);
                    } else {
                         responseBody = securityData.Items[value].allowedOrigins;
                    }
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
