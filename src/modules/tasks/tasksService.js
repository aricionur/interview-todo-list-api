import { tasksCollection } from "./collections/tasksCollection.js"
import { ObjectId } from "mongodb"

export const TaskStatus = Object.freeze({
  TODO: "to-do",
  DONE: "done",
})

export class TasksService {
  constructor() {
    this.collection = tasksCollection
  }

  async getTasks(filterQuery, sortQuery) {
    if (filterQuery._id) {
      const objectId = ObjectId.createFromHexString(filterQuery._id)

      return this.collection.findOne({ _id: objectId })
    }

    if (filterQuery.name) filterQuery.name = new RegExp(filterQuery.name, "i")

    return this.collection.find(filterQuery).sort(sortQuery).toArray()
  }

  async saveTask(task) {
    if (task._id) {
      // Update the task
      // Todo: check here if id is valid if not throw an error
      const objectId = ObjectId.createFromHexString(task._id) // Use this for creating ObjectId from a valid hex string

      delete task._id

      const dbResult = await this.collection.updateOne({ _id: objectId }, { $set: task })

      //todo: handle this as not found error, and return a global API something went wrong error.
      if (!dbResult.matchedCount) throw new Error(`The given id:${objectId} does not exist! `)

      return this.collection.findOne({ _id: objectId })
    }

    // Insert a new task
    task.status = "to-do"
    task.startDate = new Date()
    task.dueDate = new Date(task.dueDate)
    task.projectId = ObjectId.createFromHexString(task.projectId)

    const dbResult = await this.collection.insertOne(task)
    return this.collection.findOne({ _id: dbResult.insertedId })
  }

  async deleteTask(_id) {
    const objectId = ObjectId.createFromHexString(_id) // Use this for creating ObjectId from a valid hex string

    const dbResult = await this.collection.deleteOne({ _id: objectId })
    console.log(dbResult)

    if (!dbResult.deletedCount) throw new Error(`The given id:${objectId} does not exist! `)
    else return { isSuccess: true }
  }

  markTaskDone(_id) {
    const task = { _id, status: TaskStatus.DONE, doneDate: new Date() }

    return this.saveTask(task)
  }

  markTaskUnDone(_id) {
    const task = { _id, status: TaskStatus.TODO, startDate: new Date(), doneDate: null }

    return this.saveTask(task)
  }
}

export default TasksService
