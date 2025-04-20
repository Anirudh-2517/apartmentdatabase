const express = require('express')
const router = express.Router()
const client = require("./dbconnect")

const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.get("/getsummaryexpenses", async (req, res) => {
  try {
    const results = await db.collection("Expenses").aggregate([
      {
        $addFields: {
          amount: { $toInt: "$amount" }, // Ensure 'amount' is cast to integer
        },
      },
      {
        $group: {
          _id: "$description",
          total: { $sum: "$amount" }, // Sum the integer values
        },
      },
    ]).toArray();
    res.json(results);
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});
router.post("/setfinancialyear", async (req, res) => {
  try {
    const {financialyear} = req.body;
    const result = await db.collection('counters').updateOne({}, { $set: { financialyear: financialyear } })
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
router.post("/setannualmaintainence", async (req, res) => {
  try {
    const {annualmaintainence} = req.body;
    const result = await db.collection('counters').updateOne({}, { $set: { annualmaintainence: annualmaintainence } })
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
router.post('/addowner', async (req, res) => {
  const formData = req.body
  let oid = formData.oid
  try {
    const result1 = await db.collection('counters').updateOne({}, { $set: { "oidcounter": oid } })
    const result = await db.collection('ownerandmaintainence').insertOne(formData)
    res.send("Added owner!!!")
  } catch (error) {
    console.log(error)
  }
})
router.get('/getoidcount', async (req, res) => {
  try {
    const oidcount = await db.collection('counters').find().toArray();
    res.json(oidcount);  // Send the employee data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});
router.post('/addemployee', async (req, res) => {
  const payload = req.body
  try {
    const result = await db.collection('employee').insertOne(payload)
    res.send("added employee!!!")
  } catch (error) {
    console.log(error)
  }
})
router.post('/insertapartmentdetails', async (req, res) => {
  const payload = req.body
  try {
    const result = await db.collection('Apartment').insertOne(payload)
    res.send("Added apartment details!!!")
  } catch (error) {
    console.log(error)
  }
})
router.post("/getmonthwiseexpenses", async (req, res) => {
  let {description,year}=req.body
  try {
    const result = await db.collection("Expenses").aggregate([
      {
        $match: {
          description:description,
          year:year,
          date: { $exists: true, $ne: null }, // Ensure only documents with valid dates are processed
          amount: { $exists: true, $ne: null } // Ensure only valid amounts are processed
        }
      },
      {
        $addFields: {
          month: { $month: { $toDate: "$date" } },
          year: { $year: { $toDate: "$date" } }
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalAmount: { $sum: { $toDouble: "$amount" } }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]).toArray();
    const transformedData = result.map(item => ({
      month: item._id.month,
      year: item._id.year,
      totalAmount: item.totalAmount
    }));
    //const chartData = result.map(({ _id, totalAmount }) => ({
     // month: `${_id.month}-${_id.year}`,
      //totalAmount,
    //}));
    return res.send(transformedData);
  } catch (error) {
    console.error("Error fetching month-wise expenses:", error);
    return res.status(500).json({ message: "Failed to fetch month-wise expenses" });
  }
}); 

module.exports = router;