
async function testRestructure() {
  /*what we get from fetch:
  allSlots =
    {
      "2025-02-01": [{ "term": "2025-02-04T08:20:00", "isAvailable": true, "timeslotType": 0 }],
      "2025-03-01": same
      "2025-04-01": same
    }
    */
  const url = './json/slots_availability.json'
  const allSlots = await fetch(url)
    .then(res => res.json())
    .then(data => data.timeslots)

  /*what we make it into:
  freeSlots =
    {
      "02": {
        "11": [
          "08:00:00",
          "08:20:00",
          "09:00:00",
        ],
        "12": [
          "10:40:00",
          "11:20:00",
        ]
      },
      "03": {
      },
    }
    */
  let freeSlots = {};
  for (property in allSlots) {
    let mesec = property.substr(0, 10).split('-')[1]
    freeSlots[mesec] = {}
    allSlots[property].forEach(el => {
      if (el.isAvailable) {
        let den = el.term.substr(8, 2)
        freeSlots[mesec][den] = []
      }
    })
    allSlots[property].forEach(el => {
      if (el.isAvailable) {
        let den = el.term.substr(8, 2)
        let termin = el.term.substr(11, 8)
        freeSlots[mesec][den].push(termin)
      }
    })
  }

  /*or into this:
  singlesFreeSlots = [
    {
      "mesec": "02",
      "datum": "11",
      "termin": "08:00:00"
    },
    {
      "mesec": "02",
      "datum": "11",
      "termin": "08:20:00"
    }
  ]
    */
  let singlesFreeSlots = []
  for (property in freeSlots) {
    let mesecKey = property
    let mesecValue = freeSlots[property]
    for (property in mesecValue) {
      let denKey = property
      let denValue = mesecValue[property]
      // let obj = {
      //   mesec, datum, termini: denValue
      // }
      denValue.forEach(termin => {
        let obj = {
          mesec: mesecKey, den: denKey, termin
        }
        singlesFreeSlots.push(obj)
      })
    }
  }
  console.log(singlesFreeSlots);
}

testRestructure()

