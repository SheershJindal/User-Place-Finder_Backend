const express = require('express')

const placesRoutes = require('./routes/places-routes')

const app = express()

app.use('/api/places', placesRoutes)

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500).send({ message: error.message || 'Unknown error' })
})

app.listen(5000)