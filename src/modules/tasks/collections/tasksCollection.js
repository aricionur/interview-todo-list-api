import joi from "joi"

import { connectToDatabase } from "../../../database/db.js"
import { TaskStatus } from "../constantsEnums.js"

const db = await connectToDatabase()

export const tasksCollectionName = "tasks"

export const tasksCollection = db.collection(tasksCollectionName)

// Joi validation schema
const baseSchema = {
  name: joi.string(),
  dueDate: joi.date(),
  projectId: joi.string().length(24),
  status: joi.string().valid(TaskStatus.TODO, TaskStatus.DONE),
  startDate: joi.date(),
}

export const joiPostTaskSchema = joi.object({
  name: baseSchema.name.required(),
  dueDate: baseSchema.dueDate.required(),
  projectId: baseSchema.projectId.required(),
})

export const joiPutTaskSchema = joi.object({ ...baseSchema })
