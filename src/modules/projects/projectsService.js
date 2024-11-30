import { projectsCollection } from "./collections/projectsCollection.js"
import { ObjectId } from "mongodb"

export class ProjectsService {
  constructor() {
    this.collection = projectsCollection
  }

  async getProjects(filterQuery, sortQuery) {
    if (filterQuery._id) {
      const objectId = ObjectId.createFromHexString(filterQuery._id)

      return this.collection.findOne({ _id: objectId })
    }

    if (filterQuery.name) filterQuery.name = new RegExp(filterQuery.name, "i")

    return this.collection.find(filterQuery).sort(sortQuery).toArray()
  }

  async saveProject(project) {
    if (project._id) {
      const objectId = ObjectId.createFromHexString(project._id) // Use this for creating ObjectId from a valid hex string

      delete project._id

      const dbResult = await this.collection.updateOne({ _id: objectId }, { $set: project })

      if (!dbResult.matchedCount) throw new Error(`The given id:${objectId} does not exist! `)

      return this.collection.findOne({ _id: objectId })
    }

    // Insert a new project
    project.startDate = new Date()
    project.dueDate = new Date(project.dueDate)

    const dbResult = await this.collection.insertOne(project)

    return this.collection.findOne({ _id: dbResult.insertedId })
  }

  async deleteProject(_id) {
    const objectId = ObjectId.createFromHexString(_id)

    const dbResult = await this.collection.deleteOne({ _id: objectId })

    if (!dbResult.deletedCount) throw new Error(`The given id:${objectId} does not exist! `)
    else return { isSuccess: true }
  }
}

export default ProjectsService
