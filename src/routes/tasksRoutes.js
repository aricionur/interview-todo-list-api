import { ObjectId } from "mongodb"
import { TasksService } from "../modules/tasks/tasksService.js"
import { ProjectsService } from "../modules/projects/projectsService.js"
import { NotFoundError } from "../utils/error/customErrors.js"

export default (router) => {
  const tasksService = new TasksService()
  const projectsService = new ProjectsService()

  router.get("/tasks", async (req, res) => {
    const { status, name, sortBy, order } = req.query

    const filterQuery = {}
    if (status) filterQuery.status = status
    if (name) filterQuery.name = name

    const sortQuery = {}
    if (sortBy) sortQuery[sortBy] = order === "desc" ? -1 : 1

    res.json(await tasksService.getTasks(filterQuery, sortQuery))
  })

  router.get("/tasks/:id", async (req, res) => {
    res.json(await tasksService.getTasks({ _id: req.params.id }))
  })

  router.post("/tasks", async (req, res) => {
    const { projectId } = req.body

    if (!(await projectsService.getProjects({ _id: projectId }))) {
      res.status(404).send(`No project found for given projectId:${projectId}`)
      return
    }

    res.json(await tasksService.saveTask(req.body))
  })

  router.put("/tasks/:id", async (req, res) => {
    const { id } = req.params
    if (!(await tasksService.getTasks({ _id: id }))) {
      res.status(404).send(`No task found for given id:${id}`)
      return
    }

    const { projectId } = req.body
    if (!(await projectsService.getProjects({ _id: projectId }))) {
      res.status(404).send(`No project found for given projectId:${projectId}`)
      return
    }

    const task = req.body
    task._id = id

    res.json(await tasksService.saveTask(task))
  })

  // ***  we can also handle the not found items in with a try-catch block ***
  router.delete("/tasks/:id", async (req, res, next) => {
    try {
      const { id } = req.params

      res.json(await tasksService.deleteTask(id))
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      next(error)
    }
  })

  // ***  we can also handle the not found items in with a try-catch block ***
  router.put("/tasks/markDone/:id", async (req, res) => {
    try {
      const { id } = req.params

      res.json(await tasksService.markTaskDone(id))
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      next(error)
    }
  })

  // ***  we can also handle the not found items in with a try-catch block ***
  router.put("/tasks/markUnDone/:id", async (req, res, next) => {
    try {
      const { id } = req.params

      res.json(await tasksService.markTaskUnDone(id))
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      next(error)
    }
  })
}
