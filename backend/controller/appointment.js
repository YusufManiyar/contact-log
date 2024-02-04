const appointmentModel = require('../model/appointment.js')

module.exports = {
    fetch : async (req, res, next) => {
        try {
            const appointments = await appointmentModel.findAll()
            return res.status(200).json(appointments)
        }
        catch(error) {
            console.log(error)
            res.status(400).json({msg: error.toString()})
        }
    },

    add : async (req, res, next) => {
        try {
            const {name, mobile, email, date, time} = req.body
            const scheduledAt = new Date(`${date}T${time}`)
            const newAppointment = await appointmentModel.create({ name, mobile, email, scheduledAt });
            return res.status(200).json(newAppointment)
        }
        catch(error) {
            console.log(error)
            res.status(400).json({msg: error.toString()})
        }
    },

    update : async (req, res, next) => {
        try {
            const data = req.body
            if(!data.id) {
                throw 'appointment id is required'
            }

            if(data.date !== undefined && data.time !== undefined) {
                data.scheduledAt = new Date(`${data.date}T${data.time}`)
                delete data.date
                delete data.time
            }

            await appointmentModel.update(data, {
                where: { id: data.id }
            });

            const appointment = await appointmentModel.findByPk(data.id)
            return res.status(200).json(appointment.dataValues)

        }
        catch(error) {
            console.log(error)
            res.status(400).json({msg: error.toString()})   
        }
    },

    cancel : async (req, res, next) => {
        try {
            const { id } = req.body
            if(!id) {
                throw 'appointment id is required'
            }

           const user = await appointmentModel.findByPk(id)

           if(!user.dataValues.isCancelled){
            const data = await appointmentModel.update({ isCancelled:true }, {
                where: { id: id},
            });

            return res.status(200).json(data)
           }else{
            const data = await appointmentModel.update({ isCancelled:false }, {
                where: { id: id},
            });

            return res.status(200).json(data)
           }
            

        }
        catch(error) {
            console.log(error)
            res.status(400).json({msg: error.toString()})   
        }
    },
}