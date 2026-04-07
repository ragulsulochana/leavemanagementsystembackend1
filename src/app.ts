import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes'
import leaveRoutes from './routes/leaveRoutes'
import userRoutes from './routes/userRoutes'
import { errorMiddleware, notFound } from './middleware/errorMiddleware'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL ?? '*', credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'leave-management-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/leaves', leaveRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorMiddleware)

export default app
