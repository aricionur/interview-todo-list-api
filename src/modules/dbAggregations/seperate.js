import { tasksCollection } from "../tasks/collections/tasksCollection.js"
import { projectsCollection } from "../projects/collections/projectsCollection.js"

export const getTaskDueDateTodayProjects = async () => {
  return tasksCollection
    .aggregate([
      {
        $match: {
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
            $lt: new Date(new Date().setHours(24, 0, 0, 0)), // Start of tomorrow
          },
        },
      },

      {
        $group: {
          _id: "$projectId",
        },
      },

      {
        $addFields: {
          _id: { $toObjectId: "$_id" },
        },
      },

      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "projectData",
        },
      },
      {
        $unwind: "$projectData",
      },
      {
        $replaceRoot: {
          newRoot: "$projectData",
        },
      },
    ])
    .toArray()
}

export const getProjectDueDateTodayTasks = async () => {
  return projectsCollection
    .aggregate([
      {
        $match: {
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(24, 0, 0, 0)),
          },
        },
      },

      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "projectId",
          as: "tasks",
        },
      },

      {
        $unwind: "$tasks",
      },

      {
        $replaceRoot: {
          newRoot: "$tasks",
        },
      },
    ])
    .toArray()
}
