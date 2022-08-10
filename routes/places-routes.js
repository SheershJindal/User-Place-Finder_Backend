const express = require('express')

const router = express.Router()

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Taj Mahal',
    description: 'One of 7 wonders of world',
    imageUrl: 'https://whc.unesco.org/uploads/thumbs/site_0252_0008-750-750-20151104113424.jpg',
    address: 'Agra',
    location: {
      lat: 40.45543,
      lang: 70.21345
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Taj Mahal',
    description: 'One of 7 wonders of world',
    imageUrl: 'https://whc.unesco.org/uploads/thumbs/site_0252_0008-750-750-20151104113424.jpg',
    address: 'Agra',
    location: {
      lat: 213.45543,
      lang: 134.21345
    },
    creator: 'u2'
  }
]

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid
  const places = DUMMY_PLACES.find(place => {
    return place.id === placeId
  })
  if (!places) {
    const err = new Error('Could not find place.')
    err.code = 404
    throw err
  }
  res.send({ places })
})

router.get('/user/:uid', (req, res, next) => {
  const userID = req.params.uid
  const places = DUMMY_PLACES.find(place => {
    return place.creator === userID
  })
  if (!places) {
    const err = new Error('Could not find place for the user.')
    err.code = 404
    return next(err)
  }
  res.send({ places })
})

module.exports = router