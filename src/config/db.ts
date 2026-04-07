import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured')
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

export default connectDB
