require('dotenv').config()
const http = require('http');
const mongoose = require(`mongoose`)
const app = require(`./app`);

const PORT = process.env.PORT || 8000
const server = http.createServer(app)

// connect to db
mongoose.connection.once(`open`, () => {
    console.log(`mongoose connnection is ready`)
})
mongoose.connection.on(`error`,(err) => {
    console.log(err)
})
mongoose.connect(process.env.MONGO_URI)

server.listen(PORT, () => {
    console.log('server listening on port', process.env.PORT)
        
})
