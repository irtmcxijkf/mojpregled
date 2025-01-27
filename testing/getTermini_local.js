const data = require('../json/slots_availability.json')
const termini = data.timeslots["2025-02-01"]

console.log(`Слободни термини кај ${data.name} има на: `)
termini.forEach(el => el.isAvailable ? console.log(el.term) : 0)
console.log('За закажување јавете се кај матичниот лекар')