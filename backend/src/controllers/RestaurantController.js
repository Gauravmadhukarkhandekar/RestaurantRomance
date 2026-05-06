const { docClient, TABLES } = require('../utils/db');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const getRestaurants = async (req, res) => {
  const { cuisine, status } = req.query;

  const params = {
    TableName: TABLES.RESTAURANTS,
  };

  if (status) {
    params.FilterExpression = 'verificationStatus = :status';
    params.ExpressionAttributeValues = { ':status': status };
  }

  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    
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

const createRestaurant = async (req, res) => {
  const { name, cuisine, neighborhood, description, image, discount, menu } = req.body;
  const restaurantId = crypto.randomUUID();

  const item = {
    restaurantId,
    name,
    cuisine,
    neighborhood,
    description,
    image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    discount: discount || '10%',
    menu: menu || [],
    verificationStatus: 'verified', // Auto-verify for admin creation
    rating: 4.5,
    createdAt: new Date().toISOString()
  };

  try {
    await docClient.send(new PutCommand({
      TableName: TABLES.RESTAURANTS,
      Item: item
    }));
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const updates = req.body;

  let updateExpression = 'SET';
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    updateExpression += ` #field${index} = :val${index},`;
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:val${index}`] = updates[key];
  });

  updateExpression = updateExpression.slice(0, -1);

  try {
    const { Attributes } = await docClient.send(new UpdateCommand({
      TableName: TABLES.RESTAURANTS,
      Key: { restaurantId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));
    res.json(Attributes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

const deleteRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.RESTAURANTS,
      Key: { restaurantId }
    }));
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantDetails,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
