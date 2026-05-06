const { docClient, TABLES } = require('../utils/db');
const { PutCommand, GetCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const createBooking = async (req, res) => {
  const { matchId, restaurantId, dateTime, userIds } = req.body;

  if (!matchId || !restaurantId || !dateTime || !userIds) {
    return res.status(400).json({ error: 'matchId, restaurantId, dateTime, and userIds are required' });
  }

  // Generate a unique discount code (e.g., PIKE-PAIR-XXXX)
  const discountCode = `PIKE-PAIR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const bookingId = crypto.randomUUID();

  const bookingItem = {
    bookingId,
    matchId,
    restaurantId,
    userIds,
    dateTime,
    discountCode,
    status: 'confirmed',
    discountAmount: '10%',
    createdAt: new Date().toISOString(),
  };

  try {
    // Save the booking
    await docClient.send(new PutCommand({
      TableName: TABLES.BOOKINGS,
      Item: bookingItem,
    }));

    // Update the match status to 'booked'
    await docClient.send(new UpdateCommand({
      TableName: TABLES.MATCHES,
      Key: { matchId },
      UpdateExpression: 'SET status = :booked, bookingId = :bid',
      ExpressionAttributeValues: {
        ':booked': 'booked',
        ':bid': bookingId,
      },
    }));

    res.status(201).json({
      message: 'Booking confirmed!',
      booking: bookingItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create booking' });
  }
};

const getBooking = async (req, res) => {
  const { bookingId } = req.params;

  const params = {
    TableName: TABLES.BOOKINGS,
    Key: { bookingId },
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (!Item) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch booking' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: TABLES.BOOKINGS }));
    res.json(Items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch bookings' });
  }
};

module.exports = {
  createBooking,
  getBooking,
  getAllBookings,
};
