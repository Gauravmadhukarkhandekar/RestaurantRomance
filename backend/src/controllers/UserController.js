const { docClient, TABLES } = require('../utils/db');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const createUser = async (req, res) => {
  const { userId, email, name, age, bio, interests, preferences } = req.body;
  
  if (!userId || !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }

  const params = {
    TableName: TABLES.USERS,
    Item: {
      userId,
      email,
      name,
      age,
      bio,
      interests: interests || [],
      preferences: preferences || { cuisine: [], proximity: 10 },
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json({ message: 'User created successfully', user: params.Item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create user' });
  }
};

const getProfile = async (req, res) => {
  const { userId } = req.params;

  const params = {
    TableName: TABLES.USERS,
    Key: { userId },
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (!Item) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
};

const getDiscoverUsers = async (req, res) => {
  const { userId } = req.query; // Current user to exclude

  try {
    // Fetch all users
    const { Items: users } = await docClient.send(new ScanCommand({ TableName: TABLES.USERS }));
    
    // Fetch all restaurants to randomly assign one as "preferred" for demo purposes
    // In a real app, this would be based on user's actual favorites/history
    const { Items: restaurants } = await docClient.send(new ScanCommand({ TableName: TABLES.RESTAURANTS }));

    const discoveryList = users
      .filter(u => u.userId !== userId && u.role !== 'admin')
      .map(u => {
        const randomRest = restaurants[Math.floor(Math.random() * restaurants.length)];
        return {
          ...u,
          preferredRestaurant: randomRest || null
        };
      });

    res.json(discoveryList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Discovery failed' });
  }
};

module.exports = {
  createUser,
  getProfile,
  getDiscoverUsers,
};
