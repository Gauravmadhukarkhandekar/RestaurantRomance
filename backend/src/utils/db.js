const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-2",
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = {
  docClient,
  TABLES: {
    USERS: process.env.DYNAMODB_TABLE_USERS,
    RESTAURANTS: process.env.DYNAMODB_TABLE_RESTAURANTS,
    MATCHES: process.env.DYNAMODB_TABLE_MATCHES,
    BOOKINGS: process.env.DYNAMODB_TABLE_BOOKINGS,
  },
};
