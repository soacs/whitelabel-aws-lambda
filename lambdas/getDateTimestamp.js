var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    
    var brand, 
        hostname, 
        tableName, 
        params;

    console.log("BEGIN: getDateTimestamp");
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));

    tableName = getTableName(event, context);
    console.log('tableName = ' , tableName);
    
    if(tableName === 'AppSettings') {
        console.log('hostname = ' , event.Records[0].dynamodb.Keys.hostname.S);
        hostname = event.Records[0].dynamodb.Keys.hostname.S;
        params = {
            TableName: tableName,
            Key: {
                hostname: hostname
            },
            UpdateExpression: "set DateTimeStamp = :t",
            ExpressionAttributeValues:{
                ":t":getNewTimestamp(),
        }
    };
    } else {
        console.log('brand = ' , event.Records[0].dynamodb.Keys.brand.S);
        brand = event.Records[0].dynamodb.Keys.brand.S;
        params = {
            TableName: tableName,
            Key: {
                brand: brand
            },
            UpdateExpression: "set DateTimeStamp = :t",
            ExpressionAttributeValues:{
                ":t":getNewTimestamp(),
        }
    };
    }
    
    console.log("params: " + JSON.stringify(params));
    
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}
;

function getNewTimestamp() {
    return new Date().toUTCString();
}

function getTableName(event, context) {
   var ddbARN = event.Records[0].eventSourceARN;
   var ddbTable = ddbARN.split(':')[5].split('/')[1];
   console.log("ddbARN", ddbARN);
   console.log("ddbTable", ddbTable);
   return ddbTable;
}