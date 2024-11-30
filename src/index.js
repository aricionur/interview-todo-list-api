import express from "express"

import registerRoutes from "./routes/index.js"

// Initialize an Express app
const app = express()

// Middleware to parse JSON
app.use(express.json())

// Register all router into app
registerRoutes(app)

// Error handling middleware (must be placed after all routes)
// app.use((err, req, res, next) => {
//   console.error(err.stack) // Log the error stack to the console

//   res.status(500).json({
//     message: "Internal Server Error",
//     error: err.message || "Something went wrong on the server.",
//   })
// })

// Define a port
const PORT = 3000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
