const { createServer } = require('http')
const app = require('./backend/app')
const PORT = process.env.PORT || 3001

const server = createServer(app)

server.listen(PORT)
