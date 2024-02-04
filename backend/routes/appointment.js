const express = require('express')
const appointmentController = require('../controller/appointment.js') 
const router = express.Router()

router.get('/appointment', appointmentController.fetch)
router.post('/appointment', appointmentController.add)
router.put('/appointment', appointmentController.update)
router.delete('/appointment',appointmentController.cancel)

module.exports = router
