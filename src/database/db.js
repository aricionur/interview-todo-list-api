import { MongoClient } from "mongodb"

const uri = process.env.MONGO_URI || "mongodb://localhost:27017"
const dbName = "todoList"

let db // This will hold the database instance

export const connectToDatabase = async () => {
  if (!db) {
    const client = new MongoClient(uri)
    await client.connect()

    console.log("Connected to MongoDB")

    db = client.db(dbName) // Initialize the database instance
  }

  return db
}
