import { Router } from "express"

import tasksRoutes from "./tasksRoutes.js"
import projectsRoutes from "./projectsRoutes.js"
import aggregationRoutes from "./aggregationRoutes.js"

const router = Router()

export default (app) => {
  tasksRoutes(router)
  projectsRoutes(router)
  aggregationRoutes(router)

  app.use("/", router)
}
