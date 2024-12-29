const express = require('express')
const app = express()
const cors = require('cors')
const rootRouter = require('./routes/')
const PORT = 3000;

app.use(cors())
app.use(express.json())

app.use('/api/v1', rootRouter)


app.listen(PORT, () => {
    console.log('Server is running at port', PORT)
})