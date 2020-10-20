var AWS = require("aws-sdk");
var appSettingsTableName = 'AppSettings';
var docClient = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {

    console.log('Loading getAppSettings function');

    var appSettingsData;
    var response;
    var firmOID;
    var queryStringParameters;
    var httpMethod;
    var responseBody;

    console.log("BEGIN: getAppSettings");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    httpMethod = event.httpMethod;
    console.log('httpMethod: ', httpMethod);

    if (httpMethod === "GET") {
        queryStringParameters = event.queryStringParameters;
        console.log('queryStringParameters: ' + queryStringParameters);
        firmOID = queryStringParameters.firmOID;
    }
    else {
        firmOID = event.firmOID;
    }

    
    var params = {
        TableName: appSettingsTableName
    };
    console.log("params: " + JSON.stringify(params));
    var dbResponse = docClient.scan(params, function(err, data) {
        if (err) {
            context.fail("Error in getItem " + err);
        }
        else {
            if (data !== undefined) {
                appSettingsData = getAppSettingsItemByFirmOID(data, firmOID);
                
                if (httpMethod === "GET") {
                    responseBody = JSON.stringify(appSettingsData);
                } else {
                     responseBody = appSettingsData;
                }
                console.log('www response:', responseBody);
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
                console.log("END: getAppSettings");
            }
        }

    });

    var getAppSettingsItemByFirmOID = function(dataItems, firmOID) {
    	var res = dataItems.Items.find( (curItem) => {
    		return curItem.firmOID === firmOID;
    	});
    	return {
    	    hostname: res.hostname
    	};
    }
};


