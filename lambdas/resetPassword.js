var AWS = require("aws-sdk");
var servmgr = new AWS.SSM();

exports.handler = (event, context, callback) => {
    console.log('Loading resetPassword function');

    var response;
    var responseBody;
    var host;
    var token;
    var expireDays;

    console.log("BEGIN: resetPassword");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    host = event.headers.host; // need to parse the event from gateway
    const queryStringParameters = event.queryStringParameters;

    console.log('Received queryStringParameters:', JSON.stringify(queryStringParameters, null, 2));

    token = queryStringParameters.token;
    expireDays= queryStringParameters.expireDays;

    console.log('host = ' + host);

    var ssm_params = {
        Name: "resetpassword"
    };

    servmgr.getParameter(ssm_params, function(err, data) {
        if (err) {
            console.log('Error loading paramter store', err);
        }

        const parameterStoreValue = JSON.parse(data.Parameter.Value);
        const locationUrl = parameterStoreValue[host] + "&token=" + token + "&expireDays="+ expireDays;


        const response = {
            statusCode: 302,
            headers: {
                Location: locationUrl
            }
        };

        callback(null, response);
    });

    console.log("END: resetPassword");
}
