import { ProjectsService } from "../modules/projects/projectsService.js"
import { joiPostProjectSchema, joiPutProjectSchema } from "../modules/projects/collections/projectsCollection.js"

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
    // Validate values
    const { error } = joiPostProjectSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    res.json(await projectsService.saveProject(req.body))
  })

  router.put("/projects/:id", async (req, res) => {
    // Validate values
    const { error } = joiPutProjectSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

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
