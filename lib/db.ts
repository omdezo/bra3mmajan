/**
 * Database Connection - Singleton Pattern
 * Manages a single MongoDB connection across the application lifecycle
 */
import mongoose from 'mongoose'

interface ConnectionState {
  isConnected: boolean
  connection: typeof mongoose | null
}

class DatabaseConnection {
  private static instance: DatabaseConnection
  private state: ConnectionState = {
    isConnected: false,
    connection: null,
  }

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  async connect(): Promise<void> {
    if (this.state.isConnected) return

    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI environment variable is not set')

    try {
      await mongoose.connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })

      this.state.isConnected = true
      this.state.connection = mongoose
      console.log('✅ MongoDB connected successfully')
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error)
      throw error
    }
  }

  isConnected(): boolean {
    return this.state.isConnected
  }
}

const dbInstance = DatabaseConnection.getInstance()

export async function connectDB(): Promise<void> {
  await dbInstance.connect()
}

export default connectDB
