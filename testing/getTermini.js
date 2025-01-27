const axios = require('axios')
const url = 'https://mojtermin.mk/api/pp/resources/891281521/slots_availability'

axios(url).then(res => {
  const termini = res.data.timeslots["2025-02-01"]
  console.log(`Слободни термини кај ${res.data.name} има на: `)
  termini.forEach(el => el.isAvailable ? console.log(el.term) : 0)
  console.log('За закажување јавете се кај матичниот лекар')
}).catch(err => console.log(err))

