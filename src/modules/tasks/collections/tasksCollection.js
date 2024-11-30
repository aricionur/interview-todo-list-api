import { connectToDatabase } from "../../../database/db.js"

export const tasksCollectionName = "tasks"

const db = await connectToDatabase()

export const tasksCollection = db.collection(tasksCollectionName)
