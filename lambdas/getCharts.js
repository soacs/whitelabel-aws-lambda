
var AWS = require("aws-sdk");
var chartsTableName = 'Charts';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    // TODO implement

    console.log('Loading getCharts function');

    var chartsData;
    var response;
    var brand;
    var queryStringParameters;
    var httpMethod;
    var responseBody;

    console.log("BEGIN: getCharts");
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
        TableName: chartsTableName,
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
                chartsData = data.Item;
                console.log("chartsData: " + JSON.stringify(chartsData));
                
                if (httpMethod === "GET") {
                    responseBody = JSON.stringify(chartsData);
                } else {
                     responseBody = chartsData;
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
                console.log("END: getCharts");
            }
        }

    });
}
