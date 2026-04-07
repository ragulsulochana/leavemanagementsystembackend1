import { ErrorRequestHandler, RequestHandler } from 'express'

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const errorMessage = err.message || 'Internal server error'
  const isDatabaseConnectionError =
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoServerSelectionError' ||
    /getaddrinfo|ENOTFOUND|ETIMEDOUT|ECONNREFUSED|ReplicaSetNoPrimary/i.test(errorMessage)

  if (isDatabaseConnectionError) {
    res.status(503).json({
      message:
        'Database connection unavailable. Add your current IP address to MongoDB Atlas Network Access and make sure port 27017 is not blocked.',
      detail: process.env.NODE_ENV === 'production' ? undefined : errorMessage,
    })
    return
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    message: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
