import { connectToDatabase } from "../../../database/db.js"

const collectionName = "projects"

export const db = await connectToDatabase()

export const projectsCollection = db.collection(collectionName)
