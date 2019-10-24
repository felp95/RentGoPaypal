const express = require('express')
const Routes = express.Router()

const PaymentController = require('./app/controllers/PaymentController')

Routes.post('/api/pay', PaymentController.store)
Routes.get('/success', PaymentController.index)

module.exports = Routes