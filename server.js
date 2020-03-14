const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const downloadRouter = require('./Routes/download')
const libraryRouter = require('./Routes/library')

app.use(express.json())

app.use(express.static('public'))

app.use(morgan(':user-agent'))

app.get('/test',(req,res)=>res.json({date:"Are you feeling it now, Mr.Krabs?"}))

app.use('/download', downloadRouter)

app.use('/api', libraryRouter)

app.listen(port, () => console.log(`App listening on port ${port}!`))



