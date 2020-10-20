var AWS = require("aws-sdk");
var contentTableName = 'ContentManagement';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    // TODO implement

    console.log('Loading getContentManagement function');

    var contentData;
    var response;
    var brand;
    var contentId;
    var queryStringParameters;
    var httpMethod;
    var responseBody;

    console.log("BEGIN: getContentManagement");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        console.log('queryStringParameters: ' + queryStringParameters);
        brand = queryStringParameters.brand;
        contentId = queryStringParameters.contentId;
    }
    else {
        brand = event.brand;
        contentId = event.contentId;
    }

    console.log('brand = ' + brand);
    console.log('contentId = ' + contentId);

    var params = {
        TableName: contentTableName,
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
                contentData = data.Item;
                console.log("contentData: " + JSON.stringify(contentData));
                
                if (httpMethod === "GET") {
                    responseBody = JSON.stringify(contentData);
                } else {
                     responseBody = contentData;
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
                console.log("END: getContentManagement");
            }
        }

    });
};



