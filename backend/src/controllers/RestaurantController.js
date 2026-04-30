const { docClient, TABLES } = require('../utils/db');
const { ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const getRestaurants = async (req, res) => {
  const { cuisine, proximity } = req.query;

  // In a real app, we'd use a Geo-spatial index or filter by coordinates
  // For now, we scan verified restaurants
  const params = {
    TableName: TABLES.RESTAURANTS,
    FilterExpression: 'verificationStatus = :verified',
    ExpressionAttributeValues: {
      ':verified': 'verified',
    },
  };

  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    
    // Simple filter by cuisine if provided
    let filtered = Items;
    if (cuisine) {
      filtered = Items.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch restaurants' });
  }
};

const getRestaurantDetails = async (req, res) => {
  const { restaurantId } = req.params;

  const params = {
    TableName: TABLES.RESTAURANTS,
    Key: { restaurantId },
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (!Item) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch restaurant details' });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantDetails,
};
