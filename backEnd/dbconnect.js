const { MongoClient } = require('mongodb');

const mongoURI = 'enter your mongo uri';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});


module.exports=client
