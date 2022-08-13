const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Taj Mahal',
    description: 'One of 7 wonders of world',
    imageUrl: 'https://whc.unesco.org/uploads/thumbs/site_0252_0008-750-750-20151104113424.jpg',
    address: 'Agra',
    location: {
      lat: 40.45543,
      lng: 70.21345
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
      lng: 134.21345
    },
    creator: 'u2'
  }
]

const getPlaceByID = (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  if (!place) {
    throw new HttpError('Could not find place.', 404)
  }
  res.send({ place })
}

const getPlacesByUserID = (req, res, next) => {
  const userID = req.params.uid
  const places = DUMMY_PLACES.filter(place => place.creator === userID)
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find place for the user.', 404))
  }
  res.send({ places })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input', 422))
  }

  const { title, description, address, creator } = req.body

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (err) {
    return next(err)
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }
  DUMMY_PLACES.push(createdPlace)
  res.status(201).send({ place: createdPlace })
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input', 422)
  }

  const placeId = req.params.pid
  const { title, description } = req.body

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).send({ place: updatedPlace })

}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Place not found', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
  res.status(200).send({ message: 'Deleted' })
}

exports.getPlaceByID = getPlaceByID
exports.getPlacesByUserID = getPlacesByUserID
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace