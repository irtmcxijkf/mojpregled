const axios = require('axios')


//Number of minutes (random between 1 and argument max, return is milliseconds)
function randomMinutes(max) {
  let minutes = Math.floor(Math.random() * max + 1)
  let toMillis = 1000 * 60 * minutes
  return toMillis;
}

//Number of seconds (random between 1 and argument max, return is milliseconds)
function randomSeconds(max) {
  let seconds = Math.floor(Math.random() * max + 1)
  let toMillis = 1000 * seconds
  return toMillis;
}


//Ping random app on random intervals (seconds) and log status
function pingRenderSecs(name, max) {
  async function doPing() {
    let seconds = randomSeconds(max)
    await axios('https://mojpregled.onrender.com')
      .then(res => console.log(`status ${name} is`, res.status, `, next call in`, seconds / 1000, 'seconds'))
      .catch(err => err)
    setTimeout(doPing, seconds)
  }
  doPing()
}


//Ping random app on random intervals (minutes) and log status
function pingRenderMins(name, max) {
  async function doPing() {
    let minutes = randomMinutes(max)
    await axios('https://mojpregled.onrender.com')
      .then(res => console.log(`status ${name} is`, res.status, `, next call in`, minutes / 60000, 'minutes'))
      .catch(err => err)
    setTimeout(doPing, minutes)
  }
  doPing()
}


// pingRenderSecs('A', 5)
// pingRenderSecs('B', 5)
pingRenderMins('A', 7)
pingRenderMins('B', 12)