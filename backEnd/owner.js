const express = require('express')
const router = express.Router()
const client = require("./dbconnect")
const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.post('/updatepaymentstatus', async (req, res) => {
  const payload = req.body
  try {
    const result = await db.collection('ownerandmaintainence').updateOne({ flatno: payload.username, "maintainence.estatus": "Pending", "maintainence.year": payload.year }, // Query to match flatno and pending status
      { $set: { "maintainence.$.estatus": "Paid" } })
    res.send("added message!!!")
  } catch (error) {
    console.log(error)
  }
})
router.post('/updatetenantstatus', async (req, res) => { 
  const { oid, tenant } = req.body;

  try {
    const result = await db.collection('ownerandmaintainence').updateOne(
      {
        oid: parseInt(oid),  // Parse if stored as integer
        "tenant.tname": tenant.tname,
        "tenant.tcell": tenant.tcell
      },
      {
        $set: { "tenant.$.tstatus": "Vacated" }
      }
    );

    if (result.modifiedCount > 0) {
      res.send("Tenant status updated to 'Vacated'.");
    } else {
      res.status(404).send("Tenant not found or already vacated.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating tenant status", error });
  }
});
router.get('/getallowners', async (req, res) => {
  try {
    const owners = await db.collection('ownerandmaintainence').find().toArray();
    // Fetch all employees from MongoDB
    res.json(owners);  // Send the employee data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data', error });
  }
});
router.get('/gettenants/:oid', async (req, res) => {
  const oid = parseInt(req.params.oid)
  try {
    // Find all documents where oid matches
    const owners = await db.collection('ownerandmaintainence')
      .find({ oid: oid }, { projection: { tenant: 1, _id: 0 } })
      .toArray();
    // Flatten all tenant arrays from each matching document
    const tenants = owners.flatMap(doc => doc.tenant || []);
    res.json(tenants);
  } catch (error) {
    console.error("Error while fetching tenants:", error);
    res.status(500).json({ message: 'Error fetching tenant data', error });
  }
});
router.get('/getOwnerServices', async (req, res) => {
  try {
    const owners = await db.collection('services').find().toArray();
    // Fetch all employees from MongoDB
    res.send(owners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service data', error });
  }
});
router.get('/getfinancedata', async (req, res) => {
  try {
    const owners = await db.collection('collectioncorpus').find().toArray();
    res.send(owners);  // Send the employee data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data', error });
  }
});
router.post('/generatemaintainencedetails', async (req, res) => {
  const { payload1, oid } = req.body
  try {
    const result = await db.collection('ownerandmaintainence').updateOne({ oid: oid }, { $push: { maintainence: payload1 } });
    //  res.send("Employee salary Added sucess") // Insert the new employee document
    res.status(201).json({ message: 'Maintainence added successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error saving maintainence data', error });
  }
});
router.post('/addamount', async (req, res) => {
  const payload1 = req.body;
  const amount = payload1.amount;
  try {
    // Step 1: Increment amountcollected
    const result = await db.collection('collectioncorpus').updateOne(
      {},
      { $inc: { amountcollected: amount } }
    );
    const result1 = await db.collection('collectioncorpus').updateOne(
      {},
      [
        {
          $set: {
            totalamount: {
              $add: ["$balancecarriedforward", "$amountcollected"]
            },
            balance: {
              $subtract: ["$amountcollected", "$expenses"]
            }
          }
        }
      ]
    );

    res.status(201).json({
      message: 'Maintenance incremented and balance updated successfully',
      updatedAmount: amount,
      result,
      result1
    });
  } catch (error) {
    console.error("Error in /addamount:", error);
    res.status(500).json({ message: 'Error updating collection corpus', error });
  }
});
router.get('/getmaintainence/:oid', async (req, res) => {
  let oid = parseInt(req.params.oid);
  try {
    const owners = await db.collection('ownerandmaintainence').find({ oid: oid }).toArray();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data', error });
  }
});
router.post('/lodgecomplaint', async (req, res) => {
  const payload = req.body
  try {
    const result = await db.collection('complaints').insertOne(payload)
    res.send("added complaint!!!")
  } catch (error) {
    console.log(error)
  }
})
router.post('/addtenant', async (req, res) => {
  const payload = req.body;
  try {
    // Ensure oid is present in the payload
    if (!payload.oid) {
      return res.status(400).send("Missing 'oid' in payload.");
    }

    const result = await db.collection('ownerandmaintainence').updateOne(
      { oid: payload.oid }, // Filter by oid
      { $push: { tenant: payload } } // Push the payload into tenant array
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("No document found with the given oid.");
    }

    res.send("Added tenant!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding tenant.");
  }
});

module.exports = router;