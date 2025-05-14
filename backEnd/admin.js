const express = require('express')
const router = express.Router()
const client = require("./dbconnect")

const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.get("/getsummaryexpenses/:year", async (req, res) => {
  try {
    const currentYear = req.params.year;
    console.log("Requested current year:", currentYear);

    if (!currentYear || typeof currentYear !== "string") {
      return res.status(400).json({ error: "Invalid year parameter" });
    }

    // Assuming year is a string like "2024-2025"
    const yearParts = currentYear.split("-");
    if (yearParts.length !== 2) {
      return res.status(400).json({ error: "Year format should be 'YYYY-YYYY'" });
    }

    // Derive the previous year in the same format
    const startPrev = parseInt(yearParts[0]) - 1;
    const endPrev = parseInt(yearParts[1]) - 1;
    const previousYear = `${startPrev}-${endPrev}`;

    const results = await db.collection("Expenses").aggregate([
      {
        $match: {
          year: { $in: [currentYear, previousYear] }
        }
      },
      {
        $addFields: {
          amount: { $toInt: "$amount" }
        }
      },
      {
        $group: {
          _id: { name: "$personOrAgencyName", year: "$year" },
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          personOrAgencyName: "$_id.name",
          year: "$_id.year",
          total: 1,
          _id: 0
        }
      }
    ]).toArray();

    // Transform the results into a comparison format
    const summary = {};
    results.forEach(item => {
      const name = item.personOrAgencyName;
      if (!summary[name]) {
        summary[name] = {
          personOrAgencyName: name,
          [currentYear]: 0,
          [previousYear]: 0
        };
      }
      summary[name][item.year] = item.total;
    });

    res.json(Object.values(summary));
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

router.post("/setfinancialyear", async (req, res) => {
  try {
    const { financialyear } = req.body;
    const result = await db.collection('counters').updateOne({}, { $set: { financialyear: financialyear } })
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
router.post("/setapartmentname", async (req, res) => {
  try {
    const { Apartmentname } = req.body;
    const result = await db.collection('Apartment').updateOne({}, { $set: { Apartmentname: Apartmentname } })
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})
router.post("/setblocksorwings", (req, res) => {
  try {
    const { Blocks } = req.body;
    console.log(Blocks)
    if (Blocks === "Blocks") {
      const result = db.collection('Apartment').updateOne({}, { $set: { Blocks: true } })
      res.send(result)
    }
    else {
      const result = db.collection('Apartment').updateOne({}, { $set: { Blocks: false } })
    }
  } catch (error) {
    console.log(error)
  }
})
router.get("/getblocksorwings", async (req, res) => {
  try {
    const result = await db.collection('Apartment').find({}).toArray()
    res.json(result);
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});
router.post("/setannualmaintainence", async (req, res) => {
  try {
    const { annualmaintainence } = req.body;
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
router.post("/getmonthlyexpenses", async (req, res) => {
  const { agency, year } = req.body;
  console.log(agency,year)

  if (!agency || !year) {
    return res.status(400).json({ message: "Agency and year are required." });
  }
  try {
    const expenses = await db.collection("Expenses").aggregate([
      {
        $match: {
          personOrAgencyName: agency,
          year: year,
          amount: { $exists: true, $ne: null }
        }
      },
      {
        $addFields: {
          amountNumeric: { $toDouble: "$amount" }
        }
      },
      {
        $group: {
          _id: "$monthOfPayment",
          totalAmount: { $sum: "$amountNumeric" }
        }
      },
      {
        $project: {
          _id: 0,
          monthOfPayment: "$_id",
          totalAmount: 1
        }
      }
    ]).toArray();
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const sorted = expenses.sort((a, b) => {
      return monthOrder.indexOf(a.monthOfPayment) - monthOrder.indexOf(b.monthOfPayment);
    });
    console.log(sorted)

    return res.json(expenses);
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return res.status(500).json({ message: "Failed to fetch data", error: error.message });
  }
});


module.exports = router;