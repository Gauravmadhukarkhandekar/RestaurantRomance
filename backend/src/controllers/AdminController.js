const { docClient, TABLES } = require('../utils/db');
const { ScanCommand, UpdateCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { uploadToS3 } = require('../utils/s3Upload');

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

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const location = await uploadToS3(req.file);
    res.json({ url: location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'S3 Upload failed' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLES.USERS }));
    res.json(Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};

const syncUser = async (req, res) => {
  const { userId, name, email, profileImage, work, bio } = req.body;
  try {
    const existing = await docClient.send(new GetCommand({ TableName: TABLES.USERS, Key: { userId } }));
    
    if (!existing.Item) {
      const newUser = {
        userId,
        name,
        email,
        profileImage: profileImage || 'https://via.placeholder.com/150',
        work: work || '',
        bio: bio || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await docClient.send(new PutCommand({ TableName: TABLES.USERS, Item: newUser }));
      res.json(newUser);
    } else {
      const updateParams = {
        TableName: TABLES.USERS,
        Key: { userId },
        UpdateExpression: 'SET lastLogin = :now, #w = :work, #b = :bio, #p = :img, #n = :name',
        ExpressionAttributeNames: { 
          '#n': 'name',
          '#w': 'work',
          '#b': 'bio',
          '#p': 'profileImage'
        },
        ExpressionAttributeValues: { 
          ':now': new Date().toISOString(),
          ':work': work || existing.Item.work || '',
          ':bio': bio || existing.Item.bio || '',
          ':img': profileImage || existing.Item.profileImage,
          ':name': name || existing.Item.name
        },
        ReturnValues: 'ALL_NEW'
      };
      const { Attributes } = await docClient.send(new UpdateCommand(updateParams));
      res.json(Attributes);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
};

const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    await docClient.send(new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'SET #r = :role',
      ExpressionAttributeNames: { '#r': 'role' },
      ExpressionAttributeValues: { ':role': role }
    }));
    res.json({ message: 'Role updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Role update failed' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.USERS,
      Key: { userId }
    }));
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User deletion failed' });
  }
};

module.exports = {
  getPendingRestaurants,
  verifyRestaurant,
  uploadMedia,
  getAllUsers,
  syncUser,
  updateUserRole,
  deleteUser,
};
