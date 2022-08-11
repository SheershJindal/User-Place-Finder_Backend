const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Dummy',
    email: 'dummy@dummy.com',
    password: 'dummyPass'
  }
]

const getUsers = (req, res, next) => {
  res.status(200).send({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid input', 422)
  }

  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find(u => u.email === email)
  if (hasUser) {
    throw new HttpError('Email already exist.', 422)
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  }
  DUMMY_USERS.push(createdUser)
  res.status(201).send({ user: createdUser })
}
const loginUser = (req, res, next) => {
  const { email, password } = req.body

  const identefiedUser = DUMMY_USERS.find(u => u.email === email)
  if (!identefiedUser || identefiedUser.password !== password) {
    throw new HttpError('Incorrect email or password', 401)
  }
  res.status(200).send({ message: 'Logged in' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.loginUser = loginUser