const fallback = require('express-history-api-fallback')
const express = require('express')
const path = require('path')

const app = express()
const root = path.join(__dirname, 'dist')
app.use(express.static(root))
app.use(fallback('index.html', { root }))
app.listen(process.env.PORT || 8080)
