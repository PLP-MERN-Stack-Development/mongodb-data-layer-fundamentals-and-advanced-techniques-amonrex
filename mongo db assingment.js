// mongo_assignment.js
// Make sure to run: npm install mongodb

const { MongoClient } = require("mongodb");

// Replace with your MongoDB URI
const uri = "mongodb://127.0.0.1:27017"; // For local MongoDB
// const uri = "<Your MongoDB Atlas URI>";

const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("bookstore"); // Database name
    const books = db.collection("books"); // Collection name

    // ----- CREATE -----
    console.log("\n--- Inserting Books ---");
    await books.insertOne({ title: "Book A", author: "Jane Doe", year: 2023 });
    await books.insertMany([
      { title: "Book B", author: "John Smith", year: 2022 },
      { title: "Book C", author: "Jane Doe", year: 2021 },
    ]);

    // ----- READ -----
    console.log("\n--- All Books ---");
    let allBooks = await books.find().toArray();
    console.log(allBooks);

    console.log("\n--- Books by Jane Doe ---");
    let janeBooks = await books.find({ author: "Jane Doe" }).toArray();
    console.log(janeBooks);

    // ----- UPDATE -----
    console.log("\n--- Updating Book A Year to 2024 ---");
    await books.updateOne(
      { title: "Book A" },
      { $set: { year: 2024 } }
    );
    console.log(await books.findOne({ title: "Book A" }));

    // ----- DELETE -----
    console.log("\n--- Deleting Book B ---");
    await books.deleteOne({ title: "Book B" });
    console.log(await books.find().toArray());

    // ----- QUERY WITH FILTERS -----
    console.log("\n--- Books from 2021 onwards ---");
    let recentBooks = await books.find({ year: { $gte: 2021 } }).toArray();
    console.log(recentBooks);

    // ----- AGGREGATION -----
    console.log("\n--- Aggregation: Count books per author ---");
    let aggResult = await books.aggregate([
      { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
      { $sort: { totalBooks: -1 } }
    ]).toArray();
    console.log(aggResult);

    // ----- INDEXING -----
    console.log("\n--- Creating Index on title ---");
    await books.createIndex({ title: 1 });
    console.log("Index created!");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("\nConnection closed.");
  }
}

main();
