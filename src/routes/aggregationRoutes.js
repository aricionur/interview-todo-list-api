import { getTaskDueDateTodayProjects, getProjectDueDateTodayTasks } from "../modules/dbAggregations/seperate.js"

export default (router) => {
  router.get("/getTaskDueDateTodayProjects", async (req, res) => {
    res.json(await getTaskDueDateTodayProjects())
  })

  router.get("/getProjectDueDateTodayTasks", async (req, res) => {
    res.json(await getProjectDueDateTodayTasks())
  })
}
