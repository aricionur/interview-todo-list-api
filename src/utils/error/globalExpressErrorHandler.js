export const errorHandler = (err, req, res, next) => {
  console.error(err.stack) // Log the error stack to the console and/or remote log server.

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Something went wrong on the server.",
  })
}
