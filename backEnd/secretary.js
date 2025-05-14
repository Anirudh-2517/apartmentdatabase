const express = require('express')
const router = express.Router()
const client = require("./dbconnect")
const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.post('/addExpense', async (req, res) => {
  const expense = req.body
  if (!expense.date || !expense.amount || !expense.year || isNaN(parseFloat(expense.amount))) {
    return res.status(400).json({ message: "Invalid expense data." });
  }

  const amount = parseFloat(expense.amount);
  const year = expense.year; // Use year from expense body
  try {
    const result = await db.collection('Expenses').insertOne(expense)
    const result1 = await db.collection('collectioncorpus').updateOne({ financialyear: year }, { $inc: { expenses: amount } })
    const result2 = await db.collection('collectioncorpus').updateOne({ financialyear: year }, { $inc: { balance: -amount } })
    res.send("added expense!!!")
  } catch (error) {
    console.log(error)
  }
})
router.get('/getfinancialyear', async (req, res) => {
  try {
    const financialyear = await db.collection('counters').find().toArray();
    res.send(financialyear[0].financialyear)
  } catch (error) {
    console.log(error)
  }
})
router.get('/getallemployees/:year', async (req, res) => {
  const year = req.params.year;
  // Extract year parameter from the request
  try {
    // Query to match `year` inside any object in `empsalarydet` array
    const employees = await db.collection('employee').find({
      empsalarydet: {
        $elemMatch: { year }
      }
    }).toArray();

    // Filter output to only show documents strictly matching the year
    const filteredEmployees = employees.map(employee => ({
      ...employee,
      empsalarydet: employee.empsalarydet.filter(salary => salary.year === year)
    }));

    res.status(200).send(filteredEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employee data', error });
  }
})
router.get('/paymentdues', async (req, res) => {
  try {
    const collection = db.collection('ownerandmaintainence');

    const projection = {
      oid: 1,
      ofname: 1,
      olname: 1,
      Adesignation: 1,
      maintainence: 1,
      _id: 0
    };

    const result = await collection.find(
      {
        Adesignation: { $ne: "Security" },
        maintainence: {
          $elemMatch: { estatus: "Pending" }
        }
      },
      { projection }
    ).toArray();

    const filteredResult = result.map(doc => ({
      ...doc,
      maintainence: doc.maintainence.filter(entry => entry.estatus === "Pending")
    }));

    res.send(filteredResult);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching payment dues', error });
  }
})
router.post('/recievepayment', async (req, res) => {
  const {
    oid,
    year,
    paymentdescription,
    modeofpayment,
    estatus
  } = req.body;

  if (!oid) {
    return res.status(400).json({ message: 'oid is required to update maintenance entry.' });
  }

  try {
    const OwnerAndMaintenance = db.collection('ownerandmaintainence');

    // Update maintenance entry where estatus is 'Pending'
    const result = await OwnerAndMaintenance.updateOne(
      { oid: parseInt(oid) },
      {
        $set: {
          'maintainence.$[elem].paymentdescription': paymentdescription,
          'maintainence.$[elem].modeofpayment': modeofpayment,
          'maintainence.$[elem].estatus': estatus
        }
      },
      {
        arrayFilters: [
          { 'elem.estatus': 'Pending', 'elem.year': year }
        ]
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching pending maintenance entry found to update.' });
    }

    res.status(200).json({ message: 'Maintenance entry updated successfully.' });

  } catch (error) {
    console.error('Error updating maintenance entry:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
router.get('/getlodgedcomplaints', async (req, res) => {
  try {
    const complaints = await db.collection('complaints').find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();  // Fetch all employees from MongoDB
    res.send(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});
router.post('/generatesalarydetails', async (req, res) => {
  const { payload, empid } = req.body
  try {
    const result = await db.collection('employee').updateOne({ empid: empid }, { $push: { empsalarydet: payload } });
    //  res.send("Employee salary Added sucess") // Insert the new employee document
    res.status(201).json({ message: 'Employee added successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error saving employee data', error });
  }
});
router.post("/raisedemand", async (req, res) => {
  const { paymentdescription, modeofpayment, year, paymentdate, amount, estatus } = req.body;
  const Owner = db.collection("ownerandmaintainence");

  try {
    // Check for duplicate year in any document
    const duplicateCheck = await Owner.findOne({
      "maintainence.year": year,
    });

    if (duplicateCheck) {
      return res.status(400).json({
        message: "Duplicate year detected in Maintenance field.",
      });
    }

    // Fetch all owners to apply amount * flatcount
    const owners = await Owner.find({}).toArray();
    let updatedCount = 0;

    for (const owner of owners) {
      const calculatedAmount = amount * (owner.flatcount || 0); // default to 0 if flatcount missing

      const newMaintenance = {
        paymentdescription,
        modeofpayment,
        year,
        paymentdate,
        amount: calculatedAmount,
        estatus,
      };

      const result = await Owner.updateOne(
        { _id: owner._id },
        { $push: { maintainence: newMaintenance } }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    res.status(200).json({
      message: "Demands submitted successfully.",
      updatedCount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An unexpected error occurred.",
    });
  }
});
router.get('/expense-heads', async (req, res) => {
  try {
    const result = await db.collection('Expensehead').findOne();// Adjust model accordingly
    res.json({ expenseheads: result.expenseheads });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense heads" });
  }
});
router.post('/add-expense-head', async (req, res) => {
  const { newExpenseHead } = req.body;

  if (!newExpenseHead || typeof newExpenseHead !== 'string') {
    return res.status(400).json({ error: "Invalid expense head" });
  }

  try {
    const collection = db.collection('Expensehead');

    // Update or insert the document
    const updateResult = await collection.updateOne(
      {},
      {
        $addToSet: { expenseheads: newExpenseHead.trim() } // ensures no duplicates
      },
      { upsert: true } // creates the doc if it doesn't exist
    );

    res.status(200).json({ message: "Expense head added successfully" });
  } catch (error) {
    console.error("Error adding expense head:", error);
    res.status(500).json({ error: "Failed to add expense head" });
  }
});



module.exports = router;