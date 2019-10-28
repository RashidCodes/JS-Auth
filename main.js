const express = require('express')
const app = express()
const mongoose = require('mongoose')


// Import routes
const authRoute = require('./routes/auth') 
const postRoute = require('./routes/posts')

require('dotenv/config')



// connect to the database
mongoose.connect(process.env.db_connection, { userNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(err){
        console.log('There was an error', err)
        return;
    }
    console.log('Connected to db')
})

// middleware
app.use(express.json())

// route middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);




app.listen(3000, () => {
    console.log('Server Up and running at port 3000')
})