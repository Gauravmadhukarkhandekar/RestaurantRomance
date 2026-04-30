const { docClient, TABLES } = require('../utils/db');
const { PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const recordSwipe = async (req, res) => {
  const { userId, targetUserId, direction } = req.body;

  if (!userId || !targetUserId || !direction) {
    return res.status(400).json({ error: 'userId, targetUserId, and direction are required' });
  }

  // Generate a unique match ID by sorting the two user IDs
  const sortedIds = [userId, targetUserId].sort();
  const matchId = `${sortedIds[0]}_${sortedIds[1]}`;

  try {
    // Check if a match record already exists
    const getParams = {
      TableName: TABLES.MATCHES,
      Key: { matchId },
    };
    const { Item } = await docClient.send(new GetCommand(getParams));

    let isMatch = false;

    if (Item) {
      // Record already exists, update the current user's swipe
      const updateExpr = userId === sortedIds[0] ? 'SET user1Swiped = :dir' : 'SET user2Swiped = :dir';
      const updateParams = {
        TableName: TABLES.MATCHES,
        Key: { matchId },
        UpdateExpression: updateExpr,
        ExpressionAttributeValues: {
          ':dir': direction,
        },
        ReturnValues: 'ALL_NEW',
      };
      
      const result = await docClient.send(new UpdateCommand(updateParams));
      const updatedItem = result.Attributes;
      
      if (updatedItem.user1Swiped === 'right' && updatedItem.user2Swiped === 'right') {
        isMatch = true;
        // Update matched status
        await docClient.send(new UpdateCommand({
            TableName: TABLES.MATCHES,
            Key: { matchId },
            UpdateExpression: 'SET matched = :true, matchedAt = :now',
            ExpressionAttributeValues: { ':true': true, ':now': new Date().toISOString() }
        }));
      }
    } else {
      // Create new record
      const newItem = {
        matchId,
        user1: sortedIds[0],
        user2: sortedIds[1],
        user1Swiped: userId === sortedIds[0] ? direction : null,
        user2Swiped: userId === sortedIds[1] ? direction : null,
        matched: false,
        createdAt: new Date().toISOString(),
      };
      await docClient.send(new PutCommand({
        TableName: TABLES.MATCHES,
        Item: newItem,
      }));
    }

    res.json({ success: true, isMatch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not record swipe' });
  }
};

module.exports = {
  recordSwipe,
};
