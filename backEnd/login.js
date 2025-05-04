const express=require('express')
const router=express.Router()
const client=require("./dbconnect")

const dbName = 'apartmentdatabase';
db = client.db(dbName);

router.post("/authenticate", async (req, res) => {
    const { username, password, userType } = req.body;  
    try {
      if (!username || !password || !userType) {
        return res.status(400).json({ message: "All fields are required" });
      }
  var user;
      const collection = db.collection("ownerandmaintainence"); // Collection name
      if (userType==="Owner")
         user = await collection.find({ flatno: username, Password: password, Adesignation: userType }).toArray();
        else
       user = await collection.find({ Login: username, Password: password, Adesignation: userType }).toArray();
      if (user.length > 0) {
        return res.status(200).json({ message: "Login successful", userType,ofname:user[0].ofname,olname:user[0].olname,oid:user[0].oid,Login:user[0].Login ,imageURL:user[0].imageURL});
      } else {
        return res.status(401).json({ message: "Invalid credentials or role mismatch" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
});

module.exports = router;