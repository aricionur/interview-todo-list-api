import express from "express"

import registerRoutes from "./routes/index.js"
import { errorHandler } from "./utils/error/globalExpressErrorHandler.js"

// Initialize an Express app
const app = express()

// Middleware to parse JSON
app.use(express.json())

// Register all routes
registerRoutes(app)

// Register the error handler middleware
app.use(errorHandler)

// Define a port
const PORT = 3000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
