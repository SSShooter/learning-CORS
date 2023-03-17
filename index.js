import Fastify from 'fastify'
import fStatic from '@fastify/static'
import cors from '@fastify/cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { argv } from 'node:process'

const port = argv[2] || 3000
console.log(`Port ${port}`)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fastify = Fastify({
  logger: false,
})

fastify.register(fStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
})

// handmade CORS
fastify.addHook('preHandler', (req, res, done) => {
  const allowedPaths = ['/cors-simple', '/cors']
  console.log('---------------------------')
  console.log(`${req.method}: ${req.url}`)
  if (allowedPaths.includes(req.url)) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'content-type,custom-header')
    res.header('Access-Control-Allow-credentials', 'true')
  }

  const isPreflight = /options/i.test(req.method)
  if (isPreflight) {
    return res.send()
  }

  done()
})

// fastify.register(cors, {
//   origin: ['http://127.0.0.1:3000'],
//   credentials: true,
// })

fastify.post('/', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: '/' }
})

fastify.get('/cors-simple', async (request, reply) => {
  reply.type('application/json').code(200)
  console.log('cors-simple handler is running!')
  return { hello: 'cors-simple' }
})
fastify.post('/cors', async (request, reply) => {
  reply.type('application/json').code(200)
  console.log('cors handler is running!')
  return { hello: 'cors' }
})

fastify.get('/cross-origin-simple', async (request, reply) => {
  reply.type('application/json').code(200)
  console.log('cross-origin-simple handler is running!')
  return { hello: 'cross-origin-simple' }
})
fastify.post('/cross-origin', async (request, reply) => {
  reply.type('application/json').code(200)
  console.log('cross-origin handler is running!')
  return { hello: 'cross-origin' }
})

fastify.listen({ port }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
