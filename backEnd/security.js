const express = require('express')
const router = express.Router()
const client = require("./dbconnect")

const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.get('/getallvisitors', async (req, res) => {
  try {
    const visitors = await db.collection('visitors').find().toArray();  // Fetch all employees from MongoDB
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitors data', error });
  }
});

router.post('/visitor-count', async (req, res) => {
  try {
    const { year, month } = req.body;
    console.log(year)
    // Ensure the month is zero-padded
    const formattedMonth = month.padStart(2, '0');
    const visitors = await db.collection('visitors').aggregate([
      {
        $match: {
          vdate: { $regex: `^${year}-${formattedMonth}` }, // Match YYYY-MM
        },
      },
      {
        $group: {
          _id: { $substr: ['$vdate', 0, 10] }, // Extract the date (YYYY-MM-DD)
          visitorCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]).toArray();

    // Format the response
    const response = visitors.map(item => ({
      date: item._id,
      count: item.visitorCount,
    }));

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.post('/addvisitors', async (req, res) => {
  const payload = req.body
  console.log(payload)
  try {
    const result = await db.collection('visitors').insertOne(payload)
    res.send("added visitor!!!")
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;