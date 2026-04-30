const { docClient, TABLES } = require('../utils/db');
const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const getPendingRestaurants = async (req, res) => {
  const params = {
    TableName: TABLES.RESTAURANTS,
    FilterExpression: 'verificationStatus = :pending',
    ExpressionAttributeValues: {
      ':pending': 'pending',
    },
  };

  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch pending restaurants' });
  }
};

const verifyRestaurant = async (req, res) => {
  const { restaurantId, action } = req.body; // action: 'verify' or 'reject'

  const status = action === 'verify' ? 'verified' : 'rejected';

  const params = {
    TableName: TABLES.RESTAURANTS,
    Key: { restaurantId },
    UpdateExpression: 'SET verificationStatus = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
  };

  try {
    await docClient.send(new UpdateCommand(params));
    res.json({ message: `Restaurant ${status} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update restaurant status' });
  }
};

module.exports = {
  getPendingRestaurants,
  verifyRestaurant,
};
