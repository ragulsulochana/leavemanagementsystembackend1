import 'dotenv/config'
import app from './app'
import connectDB from './config/db'

const startServer = async (): Promise<void> => {
  await connectDB()

  const port = process.env.PORT ?? 5000

  app.listen(port, () => {
    console.log(`Leave Management API running on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('Server startup failed:', error)
  process.exit(1)
})
