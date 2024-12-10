import { tasksCollection } from "./collections/tasksCollection.js"
import { ObjectId } from "mongodb"
import { NotFoundError } from "../../utils/error/customErrors.js"
import { TaskStatus } from "./constantsEnums.js"

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
    if (task.dueDate) task.dueDate = new Date(task.dueDate)
    if (task.projectId) task.projectId = ObjectId.createFromHexString(task.projectId)

    // Update a task
    if (task._id) {
      const objectId = ObjectId.createFromHexString(task._id)

      delete task._id

      const dbResult = await this.collection.updateOne({ _id: objectId }, { $set: task })

      if (!dbResult.matchedCount) throw new NotFoundError(`No task found for given id:${objectId}`)

      return this.collection.findOne({ _id: objectId })
    }

    // Insert a new task
    task.status = "to-do"
    task.startDate = new Date()

    const dbResult = await this.collection.insertOne(task)

    return this.collection.findOne({ _id: dbResult.insertedId })
  }

  async deleteTask(_id) {
    const objectId = ObjectId.createFromHexString(_id)

    const dbResult = await this.collection.deleteOne({ _id: objectId })

    if (!dbResult.deletedCount) throw new NotFoundError(`No task found for given id:${objectId}`)
    else return { isSuccess: true }
  }

  async markTaskDone(_id) {
    const task = { _id, status: TaskStatus.DONE, doneDate: new Date() }

    return this.saveTask(task)
  }

  markTaskUnDone(_id) {
    const task = { _id, status: TaskStatus.TODO, startDate: new Date(), doneDate: null }

    return this.saveTask(task)
  }
}

export default TasksService
