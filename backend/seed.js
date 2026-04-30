const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-west-1",
});

const docClient = DynamoDBDocumentClient.from(client);

const restaurants = [
  {
    restaurantId: 'r1',
    name: 'The Pink Door',
    cuisine: 'Italian',
    neighborhood: 'Pike Place',
    verificationStatus: 'verified',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    discount: '10%'
  },
  {
    restaurantId: 'r2',
    name: 'Canlis',
    cuisine: 'Modern American',
    neighborhood: 'Queen Anne',
    verificationStatus: 'verified',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    discount: '10%'
  }
];

async function seed() {
  console.log("Seeding Seattle restaurants with env:", process.env.DYNAMODB_TABLE_RESTAURANTS);
  for (const r of restaurants) {
    try {
      await docClient.send(new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_RESTAURANTS,
        Item: r
      }));
      console.log(`✅ Added ${r.name}`);
    } catch (e) {
      console.error(`❌ Failed to add ${r.name}:`, e.message);
    }
  }
}

seed();
