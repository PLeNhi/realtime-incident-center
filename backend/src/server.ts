import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { IncidentService } from './services/IncidentService.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Services
const incidentService = new IncidentService()

// Subscribe to incident updates and emit via Socket.IO
incidentService.onUpdate((incident) => {
  io.emit('incident:updated', incident)
})

// Routes
app.get('/api/incidents', (req, res) => {
  const incidents = incidentService.getAllIncidents()
  res.json(incidents)
})

app.post('/api/incidents/:id/acknowledge', (req, res) => {
  const { id } = req.params
  const incident = incidentService.acknowledgeIncident(id)

  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' })
  }

  res.json(incident)
})

app.post('/api/incidents/:id/resolve', (req, res) => {
  const { id } = req.params
  const incident = incidentService.resolveIncident(id)

  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' })
  }

  res.json(incident)
})

// Socket.IO events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Send all current incidents to newly connected client
  const incidents = incidentService.getAllIncidents()
  socket.emit('incidents:sync', incidents)

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`✨ Realtime Incident Center server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready at http://localhost:${PORT}`)
})
