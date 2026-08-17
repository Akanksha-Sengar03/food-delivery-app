require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

async function testMongoDB() {
    try {
        await client.connect();

        console.log("MongoDB Atlas connected successfully!");

        const database = client.db("foodDelivery");

        console.log("Database selected:", database.databaseName);

    } catch (error) {
        console.log("MongoDB connection error:");
        console.log(error.message);
    } finally {
        await client.close();
    }
}

testMongoDB();