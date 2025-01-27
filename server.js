const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')
const cors = require('cors')


//Enabling this web-app's resources to be accessed by front-end scripts outside of this server. For example, being fetch-ed by other web-apps etc...
// app.use(cors())


//Files available to the visitor. Everything else is for developer's eyes only. FOR TESTING PURPOSES, ALL FILES ARE ACCESSIBLE!
app.use(express.static(__dirname))


//Serving the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))     //......send......//
})


//Serving the data from mojtermin to the frontend
app.get('/termini', (req, res) => {
  getTermini(req, res)
})


//Start the app
const port = process.env.PORT || 3000
app.listen(port, () => console.log('server is running...')
)





//Getting mojtermin slots
async function getTermini(req, res) {
  let data = await axios(`https://mojtermin.mk/api/pp/resources/${req.query.id}/slots_availability`)
    .then(res => {
      return res.data;
    })
    .catch(err => err)
  res.send(data)     //......send......//
}




