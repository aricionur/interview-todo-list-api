import { ProjectsService } from "../modules/projects/projectsService.js"

export default (router) => {
  const projectsService = new ProjectsService()

  router.get("/projects", async (req, res) => {
    const { name, sortBy, order } = req.query

    const filterQuery = {}
    if (name) filterQuery.name = name

    const sortQuery = {}
    if (sortBy) sortQuery[sortBy] = order === "desc" ? -1 : 1

    res.json(await projectsService.getProjects(filterQuery, sortQuery))
  })

  router.get("/projects/:id", async (req, res) => {
    res.json(await projectsService.getProjects({ _id: req.params.id }))
  })

  router.post("/projects", async (req, res) => {
    res.json(await projectsService.saveProject(req.body))

    // if (user) res.json(noteService.tasksService(req.body))
    // else res.status(403).json("Invalid or Expired Token")
  })

  router.put("/projects/:id", async (req, res) => {
    const { id } = req.params

    if (!(await projectsService.getProjects({ _id: id }))) {
      res.status(404).send(`No project found for given id:${id}`)
      return
    }

    req.body._id = id
    if (req.body.dueDate) req.body.dueDate = new Date(req.body.dueDate)

    res.json(await projectsService.saveProject(req.body))
  })

  router.delete("/projects/:id", async (req, res) => {
    const { id } = req.params

    if (!(await projectsService.getProjects({ _id: id }))) {
      res.status(404).send(`No project found for given id:${id}`)
      return
    }

    res.json(await projectsService.deleteProject(id))
  })
}
