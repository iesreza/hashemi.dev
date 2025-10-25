import express from 'express'
import cors from 'cors'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Serve static files from dist directory (production)
app.use(express.static(join(__dirname, 'dist')))

// Serve SEO files
app.get('/sitemap.xml', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'seo', 'sitemap.xml'), 'utf-8')
    res.header('Content-Type', 'application/xml')
    res.send(content)
  } catch (error) {
    res.status(404).send('Not found')
  }
})

app.get('/robots.txt', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'seo', 'robots.txt'), 'utf-8')
    res.header('Content-Type', 'text/plain')
    res.send(content)
  } catch (error) {
    res.status(404).send('Not found')
  }
})

app.get('/humans.txt', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'seo', 'humans.txt'), 'utf-8')
    res.header('Content-Type', 'text/plain')
    res.send(content)
  } catch (error) {
    res.status(404).send('Not found')
  }
})

app.get('/llm.txt', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'seo', 'llm.txt'), 'utf-8')
    res.header('Content-Type', 'text/plain')
    res.send(content)
  } catch (error) {
    res.status(404).send('Not found')
  }
})

// IP Geolocation endpoint
app.get('/api/visitor', async (req, res) => {
  // Get real IP from request
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
             req.connection.remoteAddress ||
             '127.0.0.1'

  // For development, return mock data
  // In production, you could use a service like ipapi.co or ip-api.com
  try {
    // Mock data for development
    const visitorInfo = {
      ip: ip === '::1' || ip === '127.0.0.1' ? '192.168.1.3' : ip,
      city: 'Milan',
      country: 'Italy'
    }

    res.json(visitorInfo)
  } catch (error) {
    res.json({ ip: '192.168.1.3', city: 'Milan', country: 'Italy' })
  }
})

// Markdown content endpoints
app.get('/api/content/reza', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'data', 'reza.md'), 'utf-8')
    res.json({ content })
  } catch (error) {
    res.status(404).json({ error: 'Content not found' })
  }
})

app.get('/api/content/contact', async (req, res) => {
  try {
    const content = await readFile(join(__dirname, 'data', 'contact.md'), 'utf-8')
    res.json({ content })
  } catch (error) {
    res.status(404).json({ error: 'Content not found' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
