
var AWS = require("aws-sdk");
var googleAnalyticsTableName = 'GoogleAnalytics';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log('Loading getGoogleAnalytics function');
    console.log("Environment", process.env.ENVIRONMENT);

    if (process.env.ENVIRONMENT === "prod") {

        var googleAnalyticsData;
        var response;
        var brand;
        var body;
        var httpMethod;
        var responseBody;
        var trackingId;
        var folioTrackingId;
        var updatedGoogleAnalyticsData;

        console.log("BEGIN: getGoogleAnalytics");
        console.log('Received event:', JSON.stringify(event, null, 2));
        console.log('Received context:', JSON.stringify(context, null, 2));

        httpMethod = event.httpMethod;
        console.log('httpMethod: ', httpMethod);

        if (httpMethod === "POST") {
            body = JSON.parse(event.body);
            console.log('body: ', body);
            brand = body.brand;
            folioTrackingId = body.folioTrackingId.replace(/\s/g, '');
            trackingId = body.trackingId.replace(/\s/g, '');
        }
        else {
            brand = event.brand;
            folioTrackingId = event.folioTrackingId.replace(/\s/g, '');
            trackingId = event.trackingId.replace(/\s/g, '');
        }

        console.log('brand = ' + brand);
        console.log('folioTrackingId = ' + folioTrackingId);
        console.log('trackingId = ' + trackingId);


        var params = {
            TableName: googleAnalyticsTableName,
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
                    googleAnalyticsData = data.Item;

                    var googleAnalyticsDataParams = {
                        TableName:googleAnalyticsTableName,
                        Key:{
                            brand: brand
                        },
                        UpdateExpression: "set trackingId = :trackingId, folioTrackingId = :folioTrackingId",
                        ExpressionAttributeValues:{
                            ":trackingId": getTrackingId (trackingId, googleAnalyticsData) ? googleAnalyticsData.trackingId : trackingId,
                            ":folioTrackingId": getFolioTrackingId (folioTrackingId, googleAnalyticsData) ? googleAnalyticsData.folioTrackingId : folioTrackingId
                        },
                        ReturnValues:"UPDATED_NEW"
                    };

                    var dbResponse = docClient.update(googleAnalyticsDataParams, function (err, data) {
                        console.log("inside callback");
                        if (err) {
                            context.fail("Error: " + err);
                        }
                        else {
                            console.log("data after Update call: " + JSON.stringify(data));
                            if (data !== undefined) {
                                updatedGoogleAnalyticsData = data.Attributes;
                                responseBody = JSON.stringify(updatedGoogleAnalyticsData);
                            }

                            response =  {
                                statusCode: 201,
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token", "Content-Type": "application/json",
                                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                                },
                                body: responseBody
                            };
                            callback(null, response);
                            console.log("END: getGoogleAnalytics");
                        }
                    });
                }
            }

        });
    } else {
        response =  {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token;ao-token", "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            },
            body: "Updating GoogleAnalytics Table is only allowed in PROD Environment"
        };
        callback(null, response);
        console.log("END: getGoogleAnalytics");
    }

    function getTrackingId (trackingId, googleAnalyticsData) {
        return (trackingId === undefined || trackingId === "" || trackingId === googleAnalyticsData.trackingId) ? true : false
    }

    function getFolioTrackingId (folioTrackingId, googleAnalyticsData) {
        return (folioTrackingId === undefined || folioTrackingId === "" || folioTrackingId === googleAnalyticsData.folioTrackingId) ? true : false
    }
}
