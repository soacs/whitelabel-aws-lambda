var AWS = require("aws-sdk");
var questionnaireContentConfigTableName = 'QuestionnaireContentConfig';
var exclusionsInclusionsTableName = 'ExclusionsInclusions';
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log('Loading getRiskLevels function');

    var questionnaireContentConfigData;
    var response;
    var brand;
    var queryStringParameters;
    var httpMethod;
    var responseBody;

    console.log("BEGIN: getQuestionnaireContentConfig");
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
        TableName: questionnaireContentConfigTableName,
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
                questionnaireContentConfigData = data.Item;
                
                var params = {
                    TableName: exclusionsInclusionsTableName,
                    Key: {
                        brand: brand
                    }
                };
                
                var dbResponse = docClient.get(params, function(err, exData) {
                    console.log("inside callback");
                    if (err) {
                        context.fail("Error in getItem " + err);
                    }
                    else {
                        if (exData !== undefined) {
                            questionnaireContentConfigData.QuestionnaireConfigurations.forEach(dataItem => {
                                Object.keys(dataItem.questionnaireContent).forEach((keyItem) => {
                                    dataItem.questionnaireContent[keyItem].pageQuestions.forEach(pageQuestion => {
                                       if( pageQuestion.answers === "inclusion-exclusions") {
                                           pageQuestion.answers = exData.Item.exclusionInclusionConfig;
                                       }
                                    })
                                });
                            });
                            
                            if (httpMethod === "GET") {
                                responseBody = JSON.stringify(questionnaireContentConfigData);
                            } else {
                                 responseBody = questionnaireContentConfigData;
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
                console.log("END: getQuestionnaireConfig");
            }
        }

    });
};
