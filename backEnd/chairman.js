const express=require('express')
const router=express.Router()
const client=require("./dbconnect")
const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.post('/postmessage', async (req, res) => {
    const { msg, flatno } = req.body;

    try {
        // Insert into the 'ownerandmaintainence' collection
        const result = await db.collection('ownerandmaintainence').updateOne(
            { flatno: flatno },
            { $push: { Messages: { postedtext: msg } } }
        );

        // Insert into the 'messages' collection
        const result1 = await db.collection('messages').insertOne({
            message: msg,
        });

        res.send("Message added to both collections!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error occurred while adding the message.");
    }
});
router.post('/postnotice',async(req,res)=>{
    const payload1=req.body
    try {
      const result=await db.collection('notices').insertOne(payload1)
    res.send("Posted notice!!!")
    } catch (error) {
      console.log(error)
    }
})
router.get('/getNotices', async (req, res) => {
  try {
    const notice = await db.collection('notices').find().toArray(); 
    res.json(notice);  // Send the employee data as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});
router.get('/getMessages', async (req, res) => {
  try {
    const notice = await db.collection('messages').find().toArray(); 
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

module.exports = router;