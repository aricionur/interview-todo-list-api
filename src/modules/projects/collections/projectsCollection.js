import joi from "joi"
import { connectToDatabase } from "../../../database/db.js"

const collectionName = "projects"

export const db = await connectToDatabase()

export const projectsCollection = db.collection(collectionName)

// Joi validation schema
const baseSchema = {
  name: joi.string(),
  dueDate: joi.date(),
  startDate: joi.date(),
}

export const joiPostProjectSchema = joi.object({
  name: baseSchema.name.required(),
  dueDate: baseSchema.dueDate.required(),
})

export const joiPutProjectSchema = joi.object({ ...baseSchema })
