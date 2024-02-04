const express = require('express');
const app = express();
const cors = require('cors')
const sequelize = require('./utils/database-config.js')

const port = process.env.PORT || 4000;
const appointmentRouter = require('./routes/appointment.js')
// Middleware to parse JSON bodies
app.use(express.json())
app.use(cors())

app.use('/', appointmentRouter)

sequelize
.sync()
.then((result) => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`)
    })
}).catch((err) => {
    console.log(err)
})