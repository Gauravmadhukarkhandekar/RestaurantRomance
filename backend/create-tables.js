const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const dotenv = require('dotenv');

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-1",
});

const tables = [
  {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  },
  {
    TableName: process.env.DYNAMODB_TABLE_RESTAURANTS,
    KeySchema: [{ AttributeName: "restaurantId", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "restaurantId", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  },
  {
    TableName: process.env.DYNAMODB_TABLE_MATCHES,
    KeySchema: [{ AttributeName: "matchId", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "matchId", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  },
  {
    TableName: process.env.DYNAMODB_TABLE_BOOKINGS,
    KeySchema: [{ AttributeName: "bookingId", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "bookingId", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  }
];

async function create() {
  console.log("Creating DynamoDB tables in AWS...");
  for (const t of tables) {
    try {
      await client.send(new CreateTableCommand(t));
      console.log(`✅ Table Created: ${t.TableName}`);
    } catch (e) {
      if (e.name === 'ResourceInUseException') {
        console.log(`ℹ️ Table already exists: ${t.TableName}`);
      } else {
        console.error(`❌ Failed to create ${t.TableName}:`, e.message);
      }
    }
  }
  console.log("\nDone! Now run 'node seed.js' to add sample data.");
}

create();
